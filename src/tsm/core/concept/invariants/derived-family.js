// Derived-family invariants — algorithm-output checks for derived scenes
// (core-periphery / multi-core / hierarchical). Per CORPUS.md §I14-I16.
//
// I14 — Visibility closure cross-check. Recomputes V (and the (VFI, VFO)
//       fingerprint it implies) from `matrix.transfers`. When the scene
//       carries engine-emitted `provenance.vfivfo`, the recomputed values
//       are compared against it — divergence means either the engine
//       miscomputed or the matrix was mutated after derive. Without
//       provenance (e.g., hand-authored scenes), I14 only verifies that
//       every direct transfer survives the local closure pass; that part
//       is tautological by construction but still guards against future
//       regressions in the local closure helper.
// I15 — Cyclic-group equivalence (Proposition 1, Hidden Structure §314).
//       The declared Core region must share a single (VFI, VFO) across all
//       members. When the scene carries `provenance.cyclicGroups`, the
//       declared Core region is also compared against the engine's largest
//       cyclic group (core-periphery / multi-core); membership drift fires
//       a second issue. Path (b) — bucketing the matrix's own (VFI, VFO)
//       and re-confirming equivalence within each bucket — was removed in
//       R3 cleanup: buckets pre-filter into equality, so the assertion was
//       tautological.
// I16 — Four-square partition consistency. When architectureType is
//       core-periphery (largest cyclic group > 6% of n per CORPUS §171),
//       Periphery tasks have no reach to/from any Core task in V.
//       Control/Shared definitions are also asserted: Control reaches Core,
//       Core reaches Shared. Applies to core-periphery + multi-core; the
//       hierarchical plugin opts out (no Core region by definition).
//
// I14-I16 are advisory (severity = "warning"). They surface algorithm
// internals — a violation means either the engine miscomputed or a hand-
// authored scene declared a derived architectureType without honoring the
// partition's semantics. Neither is a hard error; both are signals.
//
// All three checks recompute V / VFI-VFO from `matrix.transfers` because
// the matrix is the canonical surface a downstream consumer reads. The
// scene root's `provenance` (when present) is an *independent* engine
// emission used as a cross-check oracle. Recomputation is O(n^3) per
// matrix but n ≤ 64 by engine cap, so each pass is <50µs.
//
// Edge convention reminder (from synthesis/derive.js): observation edges
// {from: X, to: Y} (X depends on Y) become matrix transfers {from: Y, to:
// X} (Y supplies X). For I14-I16 we work in dependency-direction (closure
// of "X depends on Y"), which is the reverse of transfer direction. I.e.,
// for each transfer A→B, we treat it as direct edge B→A in the dependency
// graph. The closure V[i][j]=1 means "task i depends on task j (possibly
// transitively)". This matches the engine's convention in
// computeVisibilityMatrix (V[i][j]=1 ⇔ node i has edge to node j; the
// engine is called with edges in dependency direction).

function indexById(items) {
  return Object.fromEntries(items.map((x, i) => [x.id, i]));
}

// Build the visibility (transitive-closure) matrix in dependency-direction
// from matrix.transfers. Returns { V, idx } where V[i][j]=1 ⇔ task i
// (transitively) depends on task j; idx maps task.id → row/col index.
//
// This mirrors core/engine/visibility.js but operates on tsm-scene matrix
// shape (tasks + transfers) instead of observation shape (nodes + edges).
// We don't import the engine helper because it expects {from, to} in
// dependency direction; transfers are in supply direction. Local inversion
// keeps the helper colocated with its single consumer.
function computeVisibility(matrix) {
  const n = matrix.tasks.length;
  const idx = indexById(matrix.tasks);
  const V = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i += 1) V[i][i] = 1;
  for (const tr of matrix.transfers) {
    // Transfer from→to means `from` supplies `to`, i.e., `to` depends on
    // `from`. Direct dependency edge in V is (to → from): V[to][from] = 1.
    const i = idx[tr.to];
    const j = idx[tr.from];
    if (i === undefined || j === undefined) continue;
    V[i][j] = 1;
  }
  // Warshall closure.
  for (let k = 0; k < n; k += 1) {
    for (let i = 0; i < n; i += 1) {
      if (V[i][k] === 0) continue;
      for (let j = 0; j < n; j += 1) {
        if (V[k][j]) V[i][j] = 1;
      }
    }
  }
  return { V, idx };
}

function computeVFIVFOLocal(V, n) {
  const out = new Array(n);
  for (let i = 0; i < n; i += 1) {
    let vfi = 0;
    let vfo = 0;
    for (let j = 0; j < n; j += 1) {
      if (i === j) continue;
      if (V[j][i]) vfi += 1; // j depends on i ⇒ i is upstream of j
      if (V[i][j]) vfo += 1; // i depends on j ⇒ j is upstream of i
    }
    out[i] = { vfi, vfo };
  }
  return out;
}

// Identify regions by semantic kind. Returns { core, control, shared,
// peripheral } each as the set of task ids in that region (may be empty).
function partitionByRegion(matrix) {
  const result = { core: [], control: [], shared: [], peripheral: [] };
  if (!matrix.regions) return result;
  const regionKind = Object.fromEntries(
    matrix.regions.map((r) => [r.id, r.semanticKind]),
  );
  for (const task of matrix.tasks) {
    const kind = regionKind[task.region];
    if (kind === "core") result.core.push(task.id);
    else if (kind === "control") result.control.push(task.id);
    else if (kind === "shared") result.shared.push(task.id);
    else if (kind === "peripheral") result.peripheral.push(task.id);
  }
  return result;
}

function provenanceForMatrix(scene, matrix) {
  const provenance = scene?.provenance;
  if (!provenance || typeof provenance !== "object") return null;
  // Wave 2 r-2 fold-in (Codex r-1 P3-1): use the explicit splitModel
  // discriminator rather than presence-of-`matrices` to decide nested vs
  // flat shape. tsm-scene.schema.json leaves `provenance.additionalProperties`
  // open, so a flat-provenance scene can legally carry an unrelated
  // `provenance.matrices` field. Only treat the value as our nested
  // per-matrix provenance when the writer explicitly tagged it with the
  // observation-seeded splitModel — that's the canonical marker derive
  // emits for multi-matrix scenes (core/synthesis/derive.js).
  const splitModel = provenance.splitModel;
  if (splitModel === "observation-seeded") {
    const nested = provenance.matrices;
    if (nested && typeof nested === "object") {
      if (Array.isArray(nested)) {
        return nested.find((entry) => entry?.id === matrix.id) ?? null;
      }
      return nested[matrix.id] ?? null;
    }
  }
  return provenance;
}

// I14 — Visibility closure cross-check.
//
// (1) Tautological self-consistency: recompute V; for every direct transfer
//     A→B (i.e., B depends on A), the closure must contain V[B][A]. True by
//     construction inside `computeVisibility`, but guards future regressions
//     in the local helper.
//
// (2) Falsifiable engine cross-check: if `scene.provenance.vfivfo` exists,
//     compute (VFI, VFO) locally from the recomputed V and compare against
//     the engine's emission. Divergence means either the engine miscomputed
//     V or the matrix's transfers were mutated post-derive. Either way:
//     fire `visibility_closure_mismatch` per drifted task.
//
// Without `scene` (e.g., synthetic unit tests passing matrices directly),
// only path (1) runs. The third argument is optional and gracefully missing.
export function I14(matrix, severity, scene) {
  const issues = [];
  if (!matrix.tasks || matrix.tasks.length === 0) return issues;
  const { V, idx } = computeVisibility(matrix);
  for (const tr of matrix.transfers ?? []) {
    const i = idx[tr.to];
    const j = idx[tr.from];
    if (i === undefined || j === undefined) continue; // I1 will flag
    if (V[i][j] !== 1) {
      issues.push({
        code: "visibility_closure_missing_direct_edge",
        severity,
        message: `Direct transfer ${tr.from} → ${tr.to} is not present in the visibility closure. The closure must be non-decreasing over direct edges (I14).`,
        locator: { from: tr.from, to: tr.to },
      });
    }
  }
  // Falsifiable cross-check: engine-emitted vfivfo vs matrix-recomputed.
  // vfivfo is a faithful fingerprint of V (one (VFI, VFO) pair per task) —
  // if it diverges from the local recomputation, the matrix's transfers no
  // longer agree with the closure the engine computed at derive time.
  const matrixProvenance = provenanceForMatrix(scene, matrix);
  const engineVfivfo = matrixProvenance?.vfivfo;
  if (engineVfivfo && typeof engineVfivfo === "object") {
    const n = matrix.tasks.length;
    const local = computeVFIVFOLocal(V, n);
    for (const task of matrix.tasks) {
      const expected = engineVfivfo[task.id];
      if (!expected || typeof expected.vfi !== "number" || typeof expected.vfo !== "number") {
        continue; // provenance is partial; skip silently
      }
      const got = local[idx[task.id]];
      if (!got) continue;
      if (got.vfi !== expected.vfi || got.vfo !== expected.vfo) {
        issues.push({
          code: "visibility_closure_mismatch",
          severity,
          message: `Task "${task.id}" (VFI, VFO) recomputed from matrix transfers = (${got.vfi}, ${got.vfo}), but engine provenance emitted (${expected.vfi}, ${expected.vfo}). The visibility closure no longer agrees with the engine — either the matrix's transfers were mutated post-derive or the engine miscomputed (I14).`,
          locator: { taskId: task.id, recomputed: got, provenance: expected },
        });
      }
    }
  }
  return issues;
}

// I15 — Cyclic-group equivalence.
//
// (a) Declared-Core oracle: the Core region (semanticKind === "core") must
//     be a cyclic group by construction in core-periphery / multi-core.
//     Verify all members share a single (VFI, VFO) recomputed from the
//     matrix's transfers. Fires `cyclic_group_vfi_vfo_mismatch` per
//     diverging member.
//
// (b) Engine-cyclic-group drift oracle: when `scene.provenance.cyclicGroups`
//     exists, compare the largest engine group against the declared Core
//     region members. Drift (membership disagreement) means either the
//     engine recomputed a different cycle or the Core region was hand-
//     edited to disagree with the engine's emission. Fires
//     `cyclic_group_drift` (a separate code so the two oracles don't
//     mask each other).
//
// R3 cleanup: the prior "auto" bucketing path (group nodes by their
// recomputed (VFI, VFO), then assert equivalence within each bucket) was
// removed — it pre-filtered into equality and could not detect divergence.
// The two oracles above are independent: (a) is matrix-only and falsifies
// when the declared Core isn't actually a cycle; (b) is provenance-vs-
// declaration and falsifies when the engine's groups don't match what
// the scene declares as Core.
export function I15(matrix, severity, scene) {
  const issues = [];
  if (!matrix.tasks || matrix.tasks.length === 0) return issues;
  const { V, idx } = computeVisibility(matrix);
  const n = matrix.tasks.length;
  const vfivfo = computeVFIVFOLocal(V, n);

  function checkGroup(memberIds, label) {
    if (memberIds.length <= 1) return;
    const first = vfivfo[idx[memberIds[0]]];
    if (!first) return;
    const mismatches = [];
    for (let k = 1; k < memberIds.length; k += 1) {
      const stat = vfivfo[idx[memberIds[k]]];
      if (!stat) continue;
      if (stat.vfi !== first.vfi || stat.vfo !== first.vfo) {
        mismatches.push({
          id: memberIds[k],
          vfi: stat.vfi,
          vfo: stat.vfo,
        });
      }
    }
    if (mismatches.length > 0) {
      const detail = mismatches
        .map((m) => `${m.id}=(${m.vfi},${m.vfo})`)
        .join(", ");
      issues.push({
        code: "cyclic_group_vfi_vfo_mismatch",
        severity,
        message: `Cyclic group "${label}" members do not share (VFI, VFO). Expected (${first.vfi}, ${first.vfo}) from "${memberIds[0]}", saw: ${detail}. Proposition 1 requires equivalence (I15).`,
        locator: { group: label, members: memberIds },
      });
    }
  }

  // (a) Declared-Core oracle.
  const partition = partitionByRegion(matrix);
  if (partition.core.length > 1) {
    checkGroup(partition.core, "core");
  }

  // (b) Engine-cyclic-group drift oracle. Only meaningful for architectures
  // that declare a Core region (core-periphery / multi-core). Compare the
  // engine's largest cyclic group against declared Core membership.
  const matrixProvenance = provenanceForMatrix(scene, matrix);
  const engineGroups = matrixProvenance?.cyclicGroups;
  if (
    Array.isArray(engineGroups) &&
    engineGroups.length > 0 &&
    partition.core.length > 0 &&
    (matrix.architectureType === "core-periphery" ||
      matrix.architectureType === "multi-core")
  ) {
    // The engine emits cyclicGroups sorted by size descending (see
    // core/engine/cyclic-groups.js). The largest group is the canonical
    // Core for core-periphery. Symmetric difference reveals drift.
    const engineCore = engineGroups[0];
    if (Array.isArray(engineCore)) {
      const declared = new Set(partition.core);
      const engine = new Set(engineCore);
      const inDeclaredOnly = [...declared].filter((id) => !engine.has(id));
      const inEngineOnly = [...engine].filter((id) => !declared.has(id));
      if (inDeclaredOnly.length > 0 || inEngineOnly.length > 0) {
        issues.push({
          code: "cyclic_group_drift",
          severity,
          message: `Declared Core region disagrees with the engine's largest cyclic group. Declared-only: [${inDeclaredOnly.join(", ") || "—"}]. Engine-only: [${inEngineOnly.join(", ") || "—"}]. Either the matrix was re-partitioned by hand or the engine recomputed a different cycle since provenance was written (I15).`,
          locator: {
            declaredCore: [...declared],
            engineCore: [...engine],
            inDeclaredOnly,
            inEngineOnly,
          },
        });
      }
    }
  }

  return issues;
}

// I16 — Four-square partition consistency. When architectureType is
// core-periphery: verify periphery has no reach to/from core, and that
// Control reaches Core, Core reaches Shared. Only fires for matrices that
// declare a Core region (multi-core / core-periphery). Hierarchical opts
// out via its plugin (no I16 declared).
export function I16(matrix, severity, _scene) {
  const issues = [];
  if (matrix.architectureType !== "core-periphery" &&
      matrix.architectureType !== "multi-core") {
    return issues;
  }
  const { V, idx } = computeVisibility(matrix);
  const partition = partitionByRegion(matrix);
  if (partition.core.length === 0) return issues; // nothing to check

  const coreIdx = partition.core.map((id) => idx[id]);

  // Periphery ↔ Core: no path either way.
  for (const pid of partition.peripheral) {
    const pi = idx[pid];
    if (pi === undefined) continue;
    for (const ci of coreIdx) {
      if (V[pi][ci] === 1 || V[ci][pi] === 1) {
        issues.push({
          code: "periphery_touches_core",
          severity,
          message: `Periphery task "${pid}" has a path to/from Core task "${matrix.tasks[ci].id}". Periphery is defined as tasks with no relation to Core (I16).`,
          locator: { peripheryTask: pid, coreTask: matrix.tasks[ci].id },
        });
        break; // one report per periphery task is enough
      }
    }
  }

  // Control → Core: every Control task must depend (transitively) on at
  // least one Core task. Definition (CORPUS §171): "Control (depend on Core)".
  for (const ctrlId of partition.control) {
    const ci = idx[ctrlId];
    if (ci === undefined) continue;
    const reachesCore = coreIdx.some((k) => V[ci][k] === 1);
    if (!reachesCore) {
      issues.push({
        code: "control_does_not_reach_core",
        severity,
        message: `Control task "${ctrlId}" does not depend on any Core task. Control is defined as tasks that depend on Core (I16).`,
        locator: { controlTask: ctrlId },
      });
    }
  }

  // Core → Shared: every Shared task must be (transitively) depended on by
  // at least one Core task. Definition (CORPUS §171): "Shared (Core depends
  // on them)".
  for (const sId of partition.shared) {
    const si = idx[sId];
    if (si === undefined) continue;
    const coreDepends = coreIdx.some((k) => V[k][si] === 1);
    if (!coreDepends) {
      issues.push({
        code: "shared_not_reached_by_core",
        severity,
        message: `Shared task "${sId}" is not depended on by any Core task. Shared is defined as tasks that Core depends on (I16).`,
        locator: { sharedTask: sId },
      });
    }
  }

  return issues;
}
