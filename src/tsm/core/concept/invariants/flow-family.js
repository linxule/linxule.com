// Flow-family invariants — apply to flow / job-shop.
//
// I7 — Forward dominance (flow only; opt-out for job-shop = I9).
//      In `flow` systems, the vast majority of transfers are forward
//      (below-diagonal). Backward transfers exist only as signals or
//      rework. Warns if backward / forward > 0.2.
// I8 — Central-coordinator role (flow and job-shop). A coordinator
//      region (semanticKind === "coordinator") should connect to most
//      other tasks. Warns if any coordinator task connects to fewer
//      than half of non-coordinator tasks (either direction).
// I9 — Cyclicality expected in job-shop. Implemented as an opt-out:
//      the job-shop plugin simply does NOT declare I7 in its invariant
//      list, so backward transfers in job-shop never trigger the flow
//      warning. No check function is needed; documented here for
//      reference.
//
// Helpers (taskPositionMap, indexById) are duplicated from
// shared.js / modular-family.js — see shared.js for the
// don't-lift-trivial-helpers rationale.

function taskPositionMap(matrix) {
  return Object.fromEntries(matrix.tasks.map((t, i) => [t.id, i]));
}

function indexById(items) {
  return Object.fromEntries(items.map((x) => [x.id, x]));
}

// I7 — Forward dominance. In flow systems, backward transfers should be
// rare (signals or rework). Warns if backward-rework / forward > 20%.
//
// Per CORPUS §I7: "Backward transfers exist only as signals or rework."
// The threshold applies to rework (`x` mark, backward) — not to kanban-
// style signals (`s` mark), which are infrastructure and expected to be
// backward. We split the count: signals are forgiven, rework is counted.
//
// Edge cases:
//   - 0 transfers: nothing to warn about.
//   - 0 forward, any backward-rework: warn — this isn't shaped like flow.
//   - Forward exists, rework ratio over threshold: warn.
export function I7(matrix, severity) {
  const issues = [];
  const pos = taskPositionMap(matrix);
  let forward = 0;
  let backwardRework = 0;
  for (const tr of matrix.transfers) {
    const fromIdx = pos[tr.from];
    const toIdx = pos[tr.to];
    if (fromIdx === undefined || toIdx === undefined) continue;
    if (fromIdx < toIdx) forward += 1;
    else if (fromIdx > toIdx && tr.mark !== "s") backwardRework += 1;
  }
  if (forward === 0 && backwardRework === 0) return issues;
  const ratio = forward === 0 ? Infinity : backwardRework / forward;
  if (ratio > 0.2) {
    issues.push({
      code: "unusual_backward_density_for_flow",
      severity,
      message: `Flow architecture has ${backwardRework} backward rework and ${forward} forward transfers (ratio ${ratio === Infinity ? "∞" : ratio.toFixed(2)}). Backward rework should typically stay under 20% of forward in flow systems; consider job-shop architecture if cycles are intended (I7). Signal marks (\`s\`) are exempt.`,
    });
  }
  return issues;
}

// I8 — Central-coordinator role. Any coordinator task should connect to
// most other tasks (>=50% of non-coordinator tasks, either direction).
// Warns per coordinator task that falls below the threshold.
//
// Placeholder tasks (`placeholder: true` — e.g., the `…` row in
// flow-central) are excluded from the denominator. They represent
// "operators that would slot in here," not actual coordinated work, so
// reaching them is neither possible nor expected. Counting them would
// distort the ratio against any flow-with-placeholder figure.
export function I8(matrix, severity) {
  const issues = [];
  if (!matrix.regions) return issues;
  const regionById = indexById(matrix.regions);
  const coordinatorRegions = matrix.regions.filter(
    (r) => r.semanticKind === "coordinator",
  );
  if (coordinatorRegions.length === 0) return issues;
  const coordinatorRegionIds = new Set(coordinatorRegions.map((r) => r.id));
  const coordinatorTaskIds = new Set(
    matrix.tasks
      .filter((t) => coordinatorRegionIds.has(t.region))
      .map((t) => t.id),
  );
  const nonCoordinatorTasks = matrix.tasks.filter(
    (t) => !coordinatorTaskIds.has(t.id) && !t.placeholder,
  );
  if (nonCoordinatorTasks.length === 0) return issues;
  const eligibleTaskIds = new Set(nonCoordinatorTasks.map((t) => t.id));

  // For each coordinator task, find the set of non-coordinator tasks it
  // touches (either direction). Use a Set to dedupe — a coordinator that
  // both dispatches to and receives from the same station counts once.
  // Placeholders are not in `eligibleTaskIds`, so an edge to a placeholder
  // doesn't give the coordinator credit — symmetric with the denominator.
  for (const coordId of coordinatorTaskIds) {
    const touched = new Set();
    for (const tr of matrix.transfers) {
      if (tr.from === coordId && eligibleTaskIds.has(tr.to)) {
        touched.add(tr.to);
      } else if (tr.to === coordId && eligibleTaskIds.has(tr.from)) {
        touched.add(tr.from);
      }
    }
    const ratio = touched.size / nonCoordinatorTasks.length;
    if (ratio < 0.5) {
      const region = regionById[
        matrix.tasks.find((t) => t.id === coordId).region
      ];
      issues.push({
        code: "coordinator_should_connect_widely",
        severity,
        message: `Coordinator task "${coordId}" (region "${region?.id ?? "?"}") connects to ${touched.size} of ${nonCoordinatorTasks.length} non-coordinator tasks (${(ratio * 100).toFixed(0)}%). A central coordinator typically connects to at least half of operators (I8).`,
        locator: { taskId: coordId, region: region?.id },
      });
    }
  }
  return issues;
}

// I11 — Module thin crossing. In platform systems, transfers from a
// module region to the integration region should be few (a single
// summary arrow per Fig 8). Warns per module that exceeds the threshold.
//
// Threshold: > 3 transfers from one module to integration. CORPUS notes
// "~2-3 transfers (compared to typical Fig 8 single-arrow)" — we treat
// 3 as the edge of acceptable, 4+ as warning. This is a soft heuristic.
export function I11(matrix, severity) {
  const issues = [];
  if (!matrix.regions) return issues;
  const regionById = indexById(matrix.regions);
  const taskRegion = Object.fromEntries(
    matrix.tasks.map((t) => [t.id, t.region]),
  );
  // Count: moduleRegionId -> outbound transfers to integration.
  const counts = new Map();
  for (const tr of matrix.transfers) {
    const fromR = regionById[taskRegion[tr.from]];
    const toR = regionById[taskRegion[tr.to]];
    if (!fromR || !toR) continue;
    if (
      fromR.semanticKind === "module" &&
      toR.semanticKind === "integration"
    ) {
      counts.set(fromR.id, (counts.get(fromR.id) ?? 0) + 1);
    }
  }
  const THRESHOLD = 3;
  for (const [moduleId, n] of counts) {
    if (n > THRESHOLD) {
      issues.push({
        code: "module_to_integration_too_dense",
        severity,
        message: `Module "${moduleId}" sends ${n} transfers to integration. Platform modules should expose simple interfaces — Fig 8's single-arrow per module is the canonical shape. ${n} transfers suggests leaky information hiding (I11).`,
        locator: { region: moduleId },
      });
    }
  }
  return issues;
}
