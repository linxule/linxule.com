// Multi-core architecture — declared for registry completeness.
//
// The current classifyArchitecture in synthesis/derive.js never returns
// "multi-core"; the heuristic only distinguishes core-periphery vs
// hierarchical. This plugin's classify always returns null, so the
// registry's pick-loop falls through to hierarchical. Phase 3+ may add a
// real classifier (e.g., when findCyclicGroups returns multiple groups
// above the size threshold).
//
// Invariants mirror INVARIANT_TABLE["multi-core"] in core/invariants.js.

import { buildDefaultNarrative } from "../../synthesis/narrative.js";

export default {
  id: "multi-core",
  origin: "derived",
  partitionStrategy: "four-square",
  classify() {
    // Never fires today — placeholder until a real heuristic lands.
    return null;
  },
  blockOrder: ["shared", "core", "control", "peripheral"],
  regions: ({ regionsPresent }) => {
    const map = {
      shared:     { id: "shared",     layoutKind: "diagonal-block", semanticKind: "shared",     label: "Shared" },
      core:       { id: "core",       layoutKind: "diagonal-block", semanticKind: "core",       label: "Core" },
      control:    { id: "control",    layoutKind: "diagonal-block", semanticKind: "control",    label: "Control" },
      peripheral: { id: "peripheral", layoutKind: "diagonal-block", semanticKind: "peripheral", label: "Peripheral" },
    };
    return regionsPresent.map((r) => map[r]).filter(Boolean);
  },
  overlays: ({ regionsPresent }) =>
    regionsPresent
      .filter((r) => r !== "peripheral" && r !== "task")
      .map((r) => ({ kind: "module-border", regionId: r })),
  buildNarrative({ partition, overlays, cyclicGroups, hasForwardTransfers, hasBackwardTransfers }) {
    return buildDefaultNarrative({
      partition,
      architectureType: "multi-core",
      overlays,
      cyclicGroups,
      hasForwardTransfers,
      hasBackwardTransfers,
    });
  },
  invariants: [
    { check: "I1" },
    { check: "I3" },
    { check: "I14", severity: "warning" },
    { check: "I15", severity: "warning" },
    { check: "I16", severity: "warning" },
  ],
};
