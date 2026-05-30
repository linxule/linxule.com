// Universal structural invariants — apply to every architectureType.
//
// I1 — unique task ids; every transfer references valid tasks; every
//      task.region references a valid region.
// I3 — signal-position invariant: mark "s" requires above-diagonal
//      (backward) placement.
//
// Both checks are universal: the registry references them by id with no
// severity argument. Severity is hardcoded inside each check (always
// "error") because the rules are referential-integrity guarantees, not
// architectural style preferences.
//
// Helpers (indexById, taskPositionMap) are duplicated in
// modular-family.js because the two universes don't overlap behaviorally
// and the helpers are 3 lines each. Lifting them to a shared util adds
// one more file for no gain.

function taskPositionMap(matrix) {
  return Object.fromEntries(matrix.tasks.map((t, i) => [t.id, i]));
}

// I1 — unique task ids; every transfer references valid tasks; every
// task.region references a valid region (if regions are declared).
export function I1(matrix) {
  const issues = [];
  const seen = new Set();
  const dupes = new Set();
  for (const t of matrix.tasks) {
    if (seen.has(t.id)) dupes.add(t.id);
    seen.add(t.id);
  }
  for (const id of dupes) {
    issues.push({
      code: "duplicate_task_id",
      severity: "error",
      message: `Task id "${id}" appears more than once on the diagonal (I1).`,
      locator: { taskId: id },
    });
  }
  for (const tr of matrix.transfers) {
    if (!seen.has(tr.from)) {
      issues.push({
        code: "unknown_task_in_transfer",
        severity: "error",
        message: `Transfer references unknown 'from' task: "${tr.from}" (I1).`,
        locator: { from: tr.from, to: tr.to },
      });
    }
    if (!seen.has(tr.to)) {
      issues.push({
        code: "unknown_task_in_transfer",
        severity: "error",
        message: `Transfer references unknown 'to' task: "${tr.to}" (I1).`,
        locator: { from: tr.from, to: tr.to },
      });
    }
  }
  // Also: every task.region must reference a valid region (if regions declared).
  if (matrix.regions && matrix.regions.length > 0) {
    const regionIds = new Set(matrix.regions.map((r) => r.id));
    for (const t of matrix.tasks) {
      if (t.region && !regionIds.has(t.region)) {
        issues.push({
          code: "unknown_task_region",
          severity: "error",
          message: `Task "${t.id}" references unknown region "${t.region}" (I1).`,
          locator: { taskId: t.id, region: t.region },
        });
      }
    }
  }
  return issues;
}

// I3 — signal-position invariant. Mark "s" requires above-diagonal (backward).
// from.index > to.index → above-diagonal → backward → valid.
// from.index <= to.index → at-or-below-diagonal → invalid for signal.
export function I3(matrix) {
  const issues = [];
  const pos = taskPositionMap(matrix);
  for (const tr of matrix.transfers) {
    if (tr.mark !== "s") continue;
    const fromIdx = pos[tr.from];
    const toIdx = pos[tr.to];
    if (fromIdx === undefined || toIdx === undefined) continue;
    if (fromIdx <= toIdx) {
      issues.push({
        code: "invalid_signal_position",
        severity: "error",
        message: `Signal transfer (${tr.from} → ${tr.to}) must be above-diagonal (backward). Position-derived direction is forward/diagonal (I3).`,
        locator: { from: tr.from, to: tr.to },
      });
    }
  }
  return issues;
}
