// Modular-family invariants — apply to modular / proto-modular / platform.
//
// I4  — Information hiding (no cross-module transfers).
// I5  — Design rules dispatch only (design-rules region does not receive
//       inbound from modules / integration).
// I6  — Integration receives but does not send back to modules /
//       design-rules.
// I10 — Platform requires at least one design-rules region.
//
// I4 / I5 / I6 take a severity argument supplied by the plugin's
// invariant declaration ({check: "I4", severity: "error" | "warning"}).
// I10 always fires "error"; it ignores any severity argument.
//
// Helpers (indexById) are duplicated locally — see shared.js for rationale.

function indexById(items) {
  return Object.fromEntries(items.map((x) => [x.id, x]));
}

// Bundles the (regionById, taskRegion) lookup pair that I4/I5/I6 each need.
// Local helper — not lifted to shared.js for the same reason indexById isn't
// (see comment above). Not memoized: 3 calls per invariant pass is trivial,
// and a cache would have to track matrix identity to be sound.
function regionContext(matrix) {
  const regionById = indexById(matrix.regions);
  const taskRegion = Object.fromEntries(matrix.tasks.map((t) => [t.id, t.region]));
  return { regionById, taskRegion };
}

// I4 — Information hiding. No transfers between distinct module regions.
export function I4(matrix, severity) {
  const issues = [];
  if (!matrix.regions) return issues;
  const { regionById, taskRegion } = regionContext(matrix);
  for (const tr of matrix.transfers) {
    const fromR = regionById[taskRegion[tr.from]];
    const toR = regionById[taskRegion[tr.to]];
    if (!fromR || !toR) continue;
    if (
      fromR.semanticKind === "module" &&
      toR.semanticKind === "module" &&
      fromR.id !== toR.id
    ) {
      issues.push({
        code: "module_interaction_not_allowed",
        severity,
        message: `Cross-module transfer ${tr.from} → ${tr.to} (${fromR.id} → ${toR.id}). Modules should not communicate directly in a modular system (I4).`,
        locator: { from: tr.from, to: tr.to, fromRegion: fromR.id, toRegion: toR.id },
      });
    }
  }
  return issues;
}

// I5 — Design rules dispatch only (no inbound from modules / integration).
export function I5(matrix, severity) {
  const issues = [];
  if (!matrix.regions) return issues;
  const { regionById, taskRegion } = regionContext(matrix);
  for (const tr of matrix.transfers) {
    const fromR = regionById[taskRegion[tr.from]];
    const toR = regionById[taskRegion[tr.to]];
    if (!fromR || !toR) continue;
    if (
      toR.semanticKind === "design-rules" &&
      (fromR.semanticKind === "module" || fromR.semanticKind === "integration")
    ) {
      issues.push({
        code: "design_rule_cannot_receive",
        severity,
        message: `Transfer ${tr.from} → ${tr.to}: design-rules "${toR.id}" should not receive from ${fromR.semanticKind} "${fromR.id}" (I5).`,
        locator: { from: tr.from, to: tr.to, fromRegion: fromR.id, toRegion: toR.id },
      });
    }
  }
  return issues;
}

// I6 — Integration receives but does not send back to modules / design-rules.
export function I6(matrix, severity) {
  const issues = [];
  if (!matrix.regions) return issues;
  const { regionById, taskRegion } = regionContext(matrix);
  for (const tr of matrix.transfers) {
    const fromR = regionById[taskRegion[tr.from]];
    const toR = regionById[taskRegion[tr.to]];
    if (!fromR || !toR) continue;
    if (
      fromR.semanticKind === "integration" &&
      (toR.semanticKind === "module" || toR.semanticKind === "design-rules")
    ) {
      issues.push({
        code: "integration_cannot_send_to_modules",
        severity,
        message: `Transfer ${tr.from} → ${tr.to}: integration "${fromR.id}" should not send back to ${toR.semanticKind} "${toR.id}" (I6).`,
        locator: { from: tr.from, to: tr.to, fromRegion: fromR.id, toRegion: toR.id },
      });
    }
  }
  return issues;
}

// I10 — Platform requires design-rules region. Severity is fixed (error)
// regardless of any severity passed by the plugin declaration.
export function I10(matrix) {
  if (matrix.architectureType !== "platform") return [];
  const hasDR = (matrix.regions ?? []).some((r) => r.semanticKind === "design-rules");
  if (!hasDR) {
    return [
      {
        code: "platform_requires_design_rules",
        severity: "error",
        message: `Platform architecture requires at least one region with semanticKind="design-rules" (I10).`,
      },
    ];
  }
  return [];
}
