// Observation → tsm-scene coordinator.
//
// This module orchestrates the pure engine primitives (visibility / VFI-VFO /
// cyclic-groups / ordering) into a tsm-scene with provenance, and attaches
// presentation hints + the default narrative from the synthesis layer.
//
// Phase 2: architecture-type dispatch is routed through core/concept/.
// Each architectureType is a plugin object; this file picks the plugin,
// runs its partition strategy, and lets the plugin synthesize regions /
// overlays / narrative. The behavior matches the pre-Phase-2 inline logic
// bit-for-bit — the relocation is structural, not semantic.

import "../concept/index.js"; // side-effect: registers all 9 plugins + four-square strategy
import { computeVisibilityMatrix } from "../engine/visibility.js";
import { computeVFIVFO } from "../engine/vfi-vfo.js";
import { findCyclicGroups } from "../engine/cyclic-groups.js";
import { sortIdsByMetrics } from "../engine/ordering.js";
import { getArchitectureType, getStrategy } from "../concept/registry.js";
import { shortLabelFromEntityType, categoryLetter } from "./present.js";
import { buildMultiMatrixNarrative } from "./narrative.js";
import { CANONICAL_LENS_IDS } from "../lenses.js";

// Canonical lens display order — SPEC-LENSES §2 vocabulary. Used to
// canonical-sort emitted multi-lens arrays so tests + downstream
// consumers see deterministic, rule-order-independent output.
const CANONICAL_LENS_RANK = new Map(CANONICAL_LENS_IDS.map((id, i) => [id, i]));

/**
 * Defense-in-depth merge of same-direction observation edges.
 *
 * The validator (core/validate.js#checkDependencyObservationStructure) is the
 * primary gate — well-formed inputs that go through `bun run validate` never
 * reach derive with duplicates. This helper is belt-and-suspenders for
 * programmatic callers that bypass validate (e.g., synthesized observations
 * in tests, ad-hoc tooling that calls deriveSceneFromObservation directly).
 *
 * Behavior: edges sharing `(from, to)` collapse into a single edge with
 *   - `relation`: alphabetically sorted, joined by " + "
 *   - `evidence`: concatenated in the same order as the sorted relations
 *     (so an evidence chunk lines up with the relation it documents)
 * Opposite-direction pairs (a→b AND b→a) are kept distinct. A `console.warn`
 * fires when a merge happens so the bypass path isn't silent.
 *
 * @param {Array<{from: string, to: string, relation?: string, evidence?: string}>} edges
 * @returns {Array<{from: string, to: string, relation?: string, evidence?: string}>}
 */
export function mergeDuplicateEdges(edges) {
  const groups = new Map(); // "from→to" → array of edges (preserving input order)
  const order = []; // insertion order of keys, for stable output
  for (const e of edges) {
    const key = `${e.from}→${e.to}`;
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key).push(e);
  }

  const merged = [];
  for (const key of order) {
    const group = groups.get(key);
    if (group.length === 1) {
      merged.push(group[0]);
      continue;
    }
    // Sort by relation (alphabetical) for stable output; keep relation +
    // evidence aligned so a reader can pair them back up.
    const sorted = [...group].sort((a, b) => {
      const ra = a.relation ?? "";
      const rb = b.relation ?? "";
      return ra.localeCompare(rb);
    });
    const relations = sorted.map((e) => e.relation).filter(Boolean);
    const evidences = sorted.map((e) => e.evidence).filter(Boolean);
    const mergedEdge = { from: group[0].from, to: group[0].to };
    if (relations.length > 0) mergedEdge.relation = relations.join(" + ");
    if (evidences.length > 0) mergedEdge.evidence = evidences.join(" | ");
    // Preserve any extra fields from the first edge (weight etc.) — best-effort.
    for (const k of Object.keys(group[0])) {
      if (k === "from" || k === "to" || k === "relation" || k === "evidence") continue;
      if (!(k in mergedEdge)) mergedEdge[k] = group[0][k];
    }
    merged.push(mergedEdge);
    console.warn(
      `[derive] merged ${group.length} same-direction edges ${group[0].from} → ${group[0].to} (validator should have caught this; merge is defense-in-depth)`,
    );
  }
  return merged;
}

/**
 * Four-square partition relative to the largest cyclic group.
 *
 * Thin pass-through to the registered "four-square" strategy. Retained on
 * this module so the core/algorithm.js barrel keeps its existing surface.
 *
 * @returns {{ core, control, shared, peripheral } | null}
 */
export function partitionFourSquare(V, idx, nodes, cyclicGroups) {
  return getStrategy("four-square").run({ V, idx, nodes, cyclicGroups });
}

/**
 * Pick the architecture-type plugin for a derived scene.
 *
 * If `declared` is set and registered, returns that plugin (authoring an
 * architectureType wins over derivation). Otherwise iterates the derived
 * plugins in priority order: core-periphery (most specific), multi-core
 * (placeholder — never fires today), hierarchical (last-resort fallback).
 */
function pickArchitectureType({ partition, totalNodes, declared, cyclicGroups = [] }) {
  if (declared) {
    const plugin = getArchitectureType(declared);
    if (plugin) return plugin;
  }
  for (const id of ["core-periphery", "multi-core", "hierarchical"]) {
    const plugin = getArchitectureType(id);
    const verdict = plugin?.classify?.({ partition, totalNodes, cyclicGroups });
    if (verdict) return plugin;
  }
  return getArchitectureType("hierarchical");
}

/**
 * Pick the plugin that actually drives scene synthesis (block ordering,
 * regions, overlays, narrative). Authored-only plugins lack those hooks;
 * a caller can still ask for `architectureType: "modular"` on the output,
 * but the synthesis machinery falls back to the heuristic-picked derived
 * plugin (preserving pre-Phase-2 behavior).
 */
function pickSynthesisPlugin({ partition, totalNodes, cyclicGroups = [] }) {
  for (const id of ["core-periphery", "multi-core", "hierarchical"]) {
    const plugin = getArchitectureType(id);
    const verdict = plugin?.classify?.({ partition, totalNodes, cyclicGroups });
    if (verdict) return plugin;
  }
  return getArchitectureType("hierarchical");
}

/**
 * Architecture-type heuristic from the partition.
 *
 * Retained as a thin wrapper for the algorithm.js barrel. Delegates to
 * pickArchitectureType and returns the plugin id ("core-periphery",
 * "multi-core", or "hierarchical"). `cyclicGroups` is required to distinguish
 * multi-core (≥2 cores ≥6%) from core-periphery — omitting it can only
 * under-report multi-core as core-periphery, so callers that may see multiple
 * cores must pass it. Defaults to [] for legacy single-core callers.
 */
export function classifyArchitecture(partition, totalNodes, cyclicGroups = []) {
  return pickArchitectureType({ partition, totalNodes, cyclicGroups }).id;
}

/**
 * Classify rendered transfers by direction relative to the diagonal order.
 * A transfer is forward when `from` precedes `to` in orderedTasks (rendered
 * below the diagonal), backward otherwise (above) — mirroring the live
 * direction logic in scene-adapter. Throws on an unknown endpoint: ids must
 * already share orderedTasks' id space (loud, like the adapter), so a silent
 * miscount can't slip through.
 *
 * @param {{ from: string, to: string }[]} transfers
 * @param {{ id: string }[]} orderedTasks
 * @returns {{ hasForwardTransfers: boolean, hasBackwardTransfers: boolean }}
 */
function countTransfersByDirection(transfers, orderedTasks) {
  const idx = Object.fromEntries(orderedTasks.map((t, i) => [t.id, i]));
  let forward = 0;
  let backward = 0;
  for (const tr of transfers) {
    const f = idx[tr.from];
    const t = idx[tr.to];
    if (f === undefined || t === undefined) {
      throw new Error(
        `countTransfersByDirection: unknown transfer endpoint ${tr.from}->${tr.to}`,
      );
    }
    if (f < t) forward += 1;
    else if (f > t) backward += 1;
  }
  return { hasForwardTransfers: forward > 0, hasBackwardTransfers: backward > 0 };
}

function synthesizeMatrix(edges, nodeIds, hint, context = {}) {
  const { allNodes, matrixId, sceneArrows = [] } = context;
  const nodeIdSet = new Set(nodeIds);
  const nodes = allNodes.filter((node) => nodeIdSet.has(node.id));
  const inducedEdges = edges.filter((edge) => nodeIdSet.has(edge.from) && nodeIdSet.has(edge.to));

  const { V, idx } = computeVisibilityMatrix(nodes, inducedEdges);
  const vfivfo = computeVFIVFO(V, nodes);
  const cyclicGroups = findCyclicGroups(V, vfivfo, nodes);
  let partition = partitionFourSquare(V, idx, nodes, cyclicGroups);

  const labelPlugin = pickArchitectureType({
    partition,
    totalNodes: nodes.length,
    declared: hint,
    cyclicGroups,
  });
  const architectureType = labelPlugin.id;
  // If the declared plugin can synthesize (regions hook present), use it
  // for synthesis too. Otherwise fall back to the heuristic-picked plugin
  // so authored types ("modular", "integral", …) declared on a derived
  // scene preserve the pre-Phase-2 behavior: label honors the declaration,
  // four-square regions/overlays/narrative come from the heuristic.
  const plugin = labelPlugin.regions
    ? labelPlugin
    : pickSynthesisPlugin({ partition, totalNodes: nodes.length, cyclicGroups });

  // The four-square partition above (single core = cyclicGroups[0]) is what
  // core-periphery / hierarchical classify read. A plugin that declares a
  // different partition strategy (multi-core) needs its own partition shape —
  // recompute with that strategy now that the plugin is chosen.
  if (plugin.partitionStrategy && plugin.partitionStrategy !== "four-square") {
    const restrategized = getStrategy(plugin.partitionStrategy).run({
      V,
      idx,
      nodes,
      cyclicGroups,
      totalNodes: nodes.length,
    });
    if (restrategized) partition = restrategized;
  }

  // Task ordering — plugin.blockOrder dictates the diagonal sequence (a function
  // for plugins whose block set is data-driven, e.g. multi-core's N core
  // regions). Within each block, sort by VFI desc, then VFO asc.
  const blockOrder = typeof plugin.blockOrder === "function"
    ? plugin.blockOrder(partition)
    : plugin.blockOrder;
  const orderedTasks = [];
  if (partition && blockOrder.some((r) => Array.isArray(partition[r]))) {
    for (const region of blockOrder) {
      const ids = sortIdsByMetrics(partition[region] ?? [], vfivfo);
      for (const id of ids) orderedTasks.push({ id, region });
    }
  } else {
    // Hierarchical fallback: sort all by VFI desc.
    const sorted = [...nodes]
      .slice()
      .sort((a, b) => vfivfo[b.id].vfi - vfivfo[a.id].vfi);
    for (const n of sorted) orderedTasks.push({ id: n.id, region: "task" });
  }

  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const presentRegions = new Set(orderedTasks.map((t) => t.region));
  const regions = plugin.regions({
    partition,
    regionsPresent: [...presentRegions],
  });

  const catSeq = {}; // category-letter → running count, for compact "C1"/"R8" codes
  const tasks = orderedTasks.map(({ id, region }) => {
    const node = nodeById[id];
    const t = {
      id,
      label: node.label || id,
      region,
    };
    // Propagate observation hints onto the derived task so derive() can be
    // re-run safely without losing display hints.
    //   - category: free-form grouping label, copied through unchanged so the
    //     legend/palette tracks can bucket tasks by category.
    //   - shortLabel: a compact diagonal code = 1-letter category prefix +
    //     per-category sequence number ("C1", "R8"). The viewport-capped matrix
    //     shrinks dense cells to ~2 chars, where the prior multi-letter codes
    //     (COD2/RT8) ellipsized; this stays legible and the decode key (grouped
    //     by category) decodes it. No category → fall back to the node's
    //     authored shortLabel, then the entityType hint.
    // The cell's title/aria always carries the full label; shortLabel + category
    // are presentation-only and the engine ignores them.
    // Compute shortLabel from node.category, then copy category through — set in
    // this order so the emitted key order (shortLabel before category) matches
    // the prior output and the regen diff stays shortLabel-values-only.
    const letter = categoryLetter(node.category);
    if (letter) {
      catSeq[letter] = (catSeq[letter] || 0) + 1;
      t.shortLabel = `${letter}${catSeq[letter]}`;
    } else {
      const short = node.shortLabel || shortLabelFromEntityType(node.entityType);
      if (short) t.shortLabel = short;
    }
    if (node.category) t.category = node.category;
    return t;
  });

  // Convert observation edges (from depends on to) → tsm transfers (from supplies to).
  // edges: { from: X, to: Y, ... } means X depends on Y, i.e., Y supplies X.
  const taskIdSet = new Set(orderedTasks.map((t) => t.id));
  const transfers = inducedEdges
    .filter((e) => taskIdSet.has(e.from) && taskIdSet.has(e.to) && e.from !== e.to)
    .map((e) => ({
      from: e.to,
      to: e.from,
      mark: "x",
    }));

  // Direction of the rendered transfers — drives the data-aware Step-2/Step-3
  // captions (forward = below the diagonal, backward = above).
  const { hasForwardTransfers, hasBackwardTransfers } = countTransfersByDirection(
    transfers,
    orderedTasks,
  );

  const overlays = plugin.overlays({ regionsPresent: [...presentRegions] });

  // SPEC-LENSES v0.2 §6 — Path B emphasis pass.
  //
  // Tag transfers, overlays, and (future) cross-matrix arrows with
  // rendering.emphasis + rendering.lens based on what the algorithm has
  // discovered. Mutates `transfers` and `overlays` in place.
  emitEmphasisAndLenses({
    transfers,
    overlays,
    tasks: orderedTasks,
    cyclicGroups,
    partition,
    totalNodes: nodes.length,
    vfivfo,
  });

  // Build a default walkthrough narrative so the derived scene renders
  // through the standard walkthrough view without extra wiring.
  const narrative = plugin.buildNarrative({
    partition,
    stats: vfivfo,
    totalNodes: nodes.length,
    overlays,
    cyclicGroups,
    hasForwardTransfers,
    hasBackwardTransfers,
  });

  // Derive scene.lenses — the optional declaration (§3.3) listing every
  // canonical lens referenced by ≥1 item, in a stable order. Reads the
  // freshly-tagged transfers + overlays (and any future cross-matrix arrows
  // tagged via the same path).
  const lenses = collectSceneLenses({ transfers, overlays, sceneArrows });

  return {
    matrix: {
      id: matrixId,
      architectureType,
      regions,
      tasks,
      transfers,
      overlays,
      annotations: [],
    },
    narrative,
    lenses,
    vfivfo,
    cyclicGroups,
    hasForwardTransfers,
    hasBackwardTransfers,
  };
}

function deriveMultiMatrixScene(observation, edges, options) {
  const { nodes } = observation;
  const matrixByNodeId = new Map();
  for (let matrixIndex = 0; matrixIndex < observation.matrices.length; matrixIndex += 1) {
    const matrix = observation.matrices[matrixIndex];
    for (const nodeId of matrix.nodeIds) {
      matrixByNodeId.set(nodeId, {
        matrixId: matrix.id,
        matrixIndex,
      });
    }
  }

  const { sceneArrows, provenanceCrossMatrixArrows } = emitCrossMatrixArrows({
    crossMatrixArrows: observation.crossMatrixArrows ?? [],
    matrixByNodeId,
  });
  const synthesized = observation.matrices.map((matrix) =>
    synthesizeMatrix(
      edges,
      matrix.nodeIds,
      matrix.architectureType || options.outputArchitectureType,
      {
        allNodes: nodes,
        matrixId: matrix.id,
        sceneArrows,
      },
    ),
  );

  const transfers = synthesized.flatMap((entry) => entry.matrix.transfers);
  const overlays = synthesized.flatMap((entry) => entry.matrix.overlays);
  const lenses = collectSceneLenses({ transfers, overlays, sceneArrows });
  const provenanceByMatrix = {};
  for (let i = 0; i < observation.matrices.length; i += 1) {
    provenanceByMatrix[observation.matrices[i].id] = {
      vfivfo: synthesized[i].vfivfo,
      cyclicGroups: synthesized[i].cyclicGroups,
    };
  }
  const crossBoundaryEdges = edges
    .filter((edge) => {
      const fromMatrix = matrixByNodeId.get(edge.from);
      const toMatrix = matrixByNodeId.get(edge.to);
      return (
        fromMatrix !== undefined &&
        toMatrix !== undefined &&
        fromMatrix.matrixIndex !== toMatrix.matrixIndex
      );
    })
    .map((edge) => {
      const out = { from: edge.from, to: edge.to };
      if (edge.relation) out.relation = edge.relation;
      return out;
    });

  // Scene-level walkthrough. mountAllMatrices drives every matrix from the
  // SCENE narrative (per-matrix narratives are dormant in multi-mount), so a
  // multi-matrix derived scene MUST carry one or the walkthrough has zero
  // steps — caption strands on "Loading…", Next dead. The single-matrix path
  // attaches synthesized.narrative; the multi-matrix path builds a scene-level
  // narrative that fans out across all matrices.
  const narrative = buildMultiMatrixNarrative(
    observation.matrices.map((matrix, i) => ({
      id: matrix.id,
      label: matrix.label ?? matrix.id,
      architectureType: synthesized[i].matrix.architectureType,
      // Gate the scene-level Step-4 caption/overlay on whether this matrix
      // ACTUALLY emits module-border overlays — not on its architectureType
      // label (which can be an authored "modular"/"job-shop" id whose synthesis
      // fell back to hierarchical and drew no borders).
      hasModuleBorder: synthesized[i].matrix.overlays.some((o) => o.kind === "module-border"),
      // Per-matrix data-awareness signals for the scene-level Step-2/Step-3/Step-4
      // captions (rendered transfer directions + detected core size).
      hasForwardTransfers: synthesized[i].hasForwardTransfers,
      hasBackwardTransfers: synthesized[i].hasBackwardTransfers,
      coreCount: synthesized[i].cyclicGroups?.[0]?.length ?? 0,
    })),
    sceneArrows.length,
  );

  return {
    specVersion: "0.4.0",
    kind: "tsm-scene",
    id: `${observation.id}-derived`,
    title: observation.title ? `${observation.title} (Hidden Structure)` : "Derived TSM",
    source: observation.source
      ? `Derived via Hidden Structure from ${observation.id}. Source observation: ${observation.source}`
      : `Derived via Hidden Structure from ${observation.id}`,
    narrative,
    matrices: synthesized.map((entry) => entry.matrix),
    arrows: sceneArrows,
    ...(lenses.length > 0 ? { lenses } : {}),
    provenance: {
      inputObservationId: observation.id,
      algorithm: "hidden-structure",
      algorithmVersion: "0.1.0",
      splitModel: "observation-seeded",
      matrices: provenanceByMatrix,
      crossBoundaryEdges,
      crossMatrixArrows: provenanceCrossMatrixArrows,
    },
  };
}

function emitCrossMatrixArrows({ crossMatrixArrows, matrixByNodeId }) {
  const sceneArrows = [];
  const provenanceCrossMatrixArrows = [];
  const emittedIds = new Set();

  for (const arrow of crossMatrixArrows) {
    const from = resolveCrossMatrixNodeEndpoint(arrow.from, "from", matrixByNodeId);
    const to = resolveCrossMatrixNodeEndpoint(arrow.to, "to", matrixByNodeId);
    if (from.matrixIndex === to.matrixIndex) {
      throw new Error(
        `deriveSceneFromObservation: crossMatrixArrows[] endpoints "${arrow.from}" and "${arrow.to}" both resolve to matrix "${from.matrixId}"`,
      );
    }
    const kind = arrow.kind ?? (arrow.label ? "transaction" : "forward");
    const id = composeCrossMatrixArrowId({ from, to, kind });

    if (emittedIds.has(id)) {
      throw new Error(`deriveSceneFromObservation: duplicate emitted cross-matrix arrow id "${id}"`);
    }
    emittedIds.add(id);

    const rendering = { emphasis: "primary" };
    if (kind === "transaction") {
      rendering.labelStyle = "load-bearing";
    }

    const sceneArrow = {
      id,
      from: { matrix: from.matrixIndex, taskId: arrow.from },
      to: { matrix: to.matrixIndex, taskId: arrow.to },
      kind,
      ...(arrow.label ? { label: arrow.label } : {}),
      rendering,
    };
    sceneArrows.push(sceneArrow);

    provenanceCrossMatrixArrows.push({
      fromNodeId: arrow.from,
      toNodeId: arrow.to,
      fromMatrixId: from.matrixId,
      toMatrixId: to.matrixId,
      fromMatrixIdx: from.matrixIndex,
      toMatrixIdx: to.matrixIndex,
      kind,
      label: arrow.label ?? null,
      emittedArrowId: id,
    });
  }

  return { sceneArrows, provenanceCrossMatrixArrows };
}

function resolveCrossMatrixNodeEndpoint(nodeId, side, matrixByNodeId) {
  const endpoint = matrixByNodeId.get(nodeId);
  if (!endpoint) {
    throw new Error(
      `deriveSceneFromObservation: crossMatrixArrows[] ${side} endpoint "${nodeId}" does not appear in any matrices[].nodeIds partition`,
    );
  }
  return { ...endpoint, nodeId };
}

function composeCrossMatrixArrowId({ from, to, kind }) {
  return `cross-${from.matrixId}-${from.nodeId}-${to.matrixId}-${to.nodeId}-${kind}`;
}

/**
 * Full pipeline: dependency-observation → tsm-scene.
 *
 * @param {object} observation — parsed dependency-observation document
 * @param {object} [options]
 * @returns {object} — parsed tsm-scene document (v0.3 shape)
 */
export function deriveSceneFromObservation(observation, options = {}) {
  if (observation.kind !== "dependency-observation") {
    throw new Error(
      `deriveSceneFromObservation expects kind="dependency-observation", got "${observation.kind}"`
    );
  }

  const { nodes } = observation;
  if (nodes.length === 0) {
    throw new Error("deriveSceneFromObservation: empty nodes");
  }
  // Defense-in-depth: collapse any same-direction duplicates before the
  // engine sees them. The validator is the primary gate; this catches
  // programmatic callers that bypass it.
  const edges = mergeDuplicateEdges(observation.edges);

  if (Array.isArray(observation.matrices) && observation.matrices.length > 0) {
    return deriveMultiMatrixScene(observation, edges, options);
  }

  const declared =
    options.outputArchitectureType || observation.derive?.outputArchitectureType;
  const synthesized = synthesizeMatrix(edges, nodes.map((node) => node.id), declared, {
    allNodes: nodes,
    matrixId: observation.id,
    sceneArrows: [],
  });

  const scene = {
    specVersion: "0.4.0",
    kind: "tsm-scene",
    id: `${observation.id}-derived`,
    title: observation.title ? `${observation.title} (Hidden Structure)` : "Derived TSM",
    source: observation.source
      ? `Derived via Hidden Structure from ${observation.id}. Source observation: ${observation.source}`
      : `Derived via Hidden Structure from ${observation.id}`,
    narrative: synthesized.narrative,
    matrices: [synthesized.matrix],
    ...(synthesized.lenses.length > 0 ? { lenses: synthesized.lenses } : {}),
    provenance: {
      inputObservationId: observation.id,
      algorithm: "hidden-structure",
      algorithmVersion: "0.1.0",
      vfivfo: synthesized.vfivfo,
      cyclicGroups: synthesized.cyclicGroups,
    },
  };

  return scene;
}

/**
 * SPEC-LENSES v0.2 §6 — emit rendering.emphasis + rendering.lens onto
 * algorithm-derived transfers and overlays. Mutates the inputs in place.
 *
 * Rules:
 *   - within-cyclic-group transfer → emphasis: primary, lens: cyclic-flow,
 *     rendering.arrow: true (so it renders as arrow overlay, not just cell).
 *   - cross-region transfer → emphasis: secondary, lens: cross-region-edge.
 *   - incoming edge into a top-quartile VFI node → emphasis: secondary
 *     (no lens).
 *   - Core overlay (when partition.core ≥6% of nodes) → emphasis: primary,
 *     lens: core-periphery-boundary. Augments the existing module-border
 *     overlay around the core region.
 *
 * Transfer rules compose. A transfer can carry multiple lenses (for example,
 * cyclic-flow + cross-region-edge). Primary wins if any matching rule is
 * primary; otherwise the first matching rule's emphasis is retained.
 *
 * Lens output order is canonical (SPEC §2 vocabulary order), not rule-append
 * order. Tests + downstream consumers can compare arrays by exact equality
 * without coupling to internal rule ordering. Adding or reordering rules
 * here is therefore safe.
 *
 * Multi-matrix derived scenes don't exist today, but cross-matrix arrows
 * are addressed at the call site (none of the current 6 fixtures emit
 * any) — when a future pipeline synthesizes arrows, the rule is
 * `emphasis: "primary"` + `rendering.labelStyle: "load-bearing"` (no
 * lens; v1.6.4 D5.3 moved the historical `lens: "label-only"` out of
 * the canonical vocabulary into the orthogonal labelStyle field). We
 * expose the helper for that.
 */
export function emitEmphasisAndLenses({
  transfers,
  overlays,
  tasks,
  cyclicGroups,
  partition,
  totalNodes,
  vfivfo,
}) {
  const taskRegion = Object.fromEntries(tasks.map((t) => [t.id, t.region]));

  // Cyclic-group membership lookup. Same-group only — different cyclic
  // groups don't share lens semantics.
  const cyclicGroupByMember = new Map();
  for (let gi = 0; gi < cyclicGroups.length; gi += 1) {
    for (const id of cyclicGroups[gi]) {
      cyclicGroupByMember.set(id, gi);
    }
  }

  // Top-quartile VFI threshold. "Top quartile" = nodes whose VFI is at or
  // above the 75th percentile of VFI across all nodes. Ties at the cutoff
  // are included (intentional — keeps the rule simple, treats equal-VFI
  // nodes as equally "fan-in-heavy").
  const vfiValues = Object.values(vfivfo).map((s) => s.vfi);
  const topQuartileVFINodes = computeTopQuartileVFINodes(vfivfo, vfiValues);

  for (const tr of transfers) {
    const sameCycle =
      cyclicGroupByMember.has(tr.from) &&
      cyclicGroupByMember.has(tr.to) &&
      cyclicGroupByMember.get(tr.from) === cyclicGroupByMember.get(tr.to);
    const crossRegion =
      taskRegion[tr.from] !== undefined &&
      taskRegion[tr.to] !== undefined &&
      taskRegion[tr.from] !== taskRegion[tr.to];

    const matches = [];
    if (sameCycle) {
      matches.push({ emphasis: "primary", lens: "cyclic-flow", arrow: true });
    }
    if (crossRegion) {
      matches.push({ emphasis: "secondary", lens: "cross-region-edge" });
    }
    if (topQuartileVFINodes.has(tr.to)) {
      matches.push({ emphasis: "secondary" });
    }

    if (matches.length > 0) {
      ensureRendering(tr);
      if (matches.some((m) => m.arrow === true)) {
        tr.rendering.arrow = true;
      }
      const primaryMatch = matches.find((m) => m.emphasis === "primary");
      tr.rendering.emphasis = primaryMatch?.emphasis ?? matches[0].emphasis;
      const lenses = [];
      for (const match of matches) {
        if (match.lens && !lenses.includes(match.lens)) {
          lenses.push(match.lens);
        }
      }
      if (lenses.length > 0) {
        // Canonical-sort by SPEC §2 vocabulary order so the output is
        // rule-order-independent. Unknown lenses (shouldn't happen — every
        // rule emits a canonical id) sort to the end stably.
        lenses.sort((a, b) => {
          const ra = CANONICAL_LENS_RANK.has(a) ? CANONICAL_LENS_RANK.get(a) : Number.POSITIVE_INFINITY;
          const rb = CANONICAL_LENS_RANK.has(b) ? CANONICAL_LENS_RANK.get(b) : Number.POSITIVE_INFINITY;
          return ra - rb;
        });
        tr.rendering.lens = lenses;
      }
    }
  }

  // Four-square partition boxes: Step 4 of the derived narrative ("the
  // four-square partition") names Core / Shared / Control, so ALL of those
  // module-border overlays must be visible by default at that step. Promote
  // every module-border overlay to primary with the core-periphery-boundary
  // lens (the Explore "Core/periphery" chip then highlights the whole
  // partition as one group). Pre-2026-05-29 only the `core` overlay was
  // promoted, so Shared + Control rendered at opacity 0 (secondary) while the
  // caption named them — a caption↔visibility mismatch (post-layout audit
  // H1/M2). Peripheral nodes intentionally carry no box (the core-periphery
  // plugin's overlays() omits them). The 6% threshold matches the
  // core-periphery plugin's classify() rule. Count core nodes across both the
  // single-core partition (`core`) and the multi-core partition (`core-1`,
  // `core-2`, …) — multi-core has no `core` key, so a bare `partition.core`
  // read would throw.
  const coreNodeCount = partition
    ? Object.entries(partition)
        .filter(([k]) => k === "core" || /^core-\d+$/.test(k))
        .reduce((sum, [, v]) => sum + (Array.isArray(v) ? v.length : 0), 0)
    : 0;
  if (coreNodeCount / totalNodes >= 0.06) {
    for (const ov of overlays) {
      if (ov.kind === "module-border") {
        ensureRendering(ov);
        ov.rendering.emphasis = "primary";
        ov.rendering.lens = ["core-periphery-boundary"];
      }
    }
  }
}

/**
 * Top-quartile VFI nodes — return a Set of ids whose VFI is at or above
 * the 75th percentile across all observed VFI values. Ties at the cutoff
 * are included so equal-VFI nodes are treated equally.
 */
function computeTopQuartileVFINodes(vfivfo, vfiValues) {
  const ids = new Set();
  if (vfiValues.length === 0) return ids;
  const sorted = [...vfiValues].sort((a, b) => a - b);
  // 75th percentile index (nearest-rank). Single-element edge case maps
  // index 0; multi-element uses ceil(p × N) − 1.
  const idx = Math.max(0, Math.ceil(0.75 * sorted.length) - 1);
  const cutoff = sorted[idx];
  for (const [id, s] of Object.entries(vfivfo)) {
    if (s.vfi >= cutoff) ids.add(id);
  }
  return ids;
}

function ensureRendering(item) {
  if (!item.rendering || typeof item.rendering !== "object") {
    item.rendering = {};
  }
}

/**
 * Collect the set of canonical lens ids referenced anywhere in the
 * scene, returning them in a stable canonical order (matches §2 ordering).
 */
function collectSceneLenses({ transfers, overlays, sceneArrows }) {
  const seen = new Set();
  const visit = (rendering) => {
    if (!rendering || typeof rendering !== "object") return;
    const lens = rendering.lens;
    if (lens === undefined) return;
    const list = Array.isArray(lens) ? lens : [lens];
    for (const entry of list) {
      if (typeof entry === "string") seen.add(entry);
    }
  };
  for (const tr of transfers) visit(tr.rendering);
  for (const ov of overlays) visit(ov.rendering);
  for (const ar of sceneArrows) visit(ar.rendering);
  return CANONICAL_LENS_IDS.filter((id) => seen.has(id));
}
