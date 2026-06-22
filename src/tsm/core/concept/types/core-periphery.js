// Core-periphery architecture — algorithm-derived.
// Produced by deriveSceneFromObservation when the four-square partition has
// a core that is at least 6% of total nodes (Hidden Structure threshold).
//
// Invariants mirror INVARIANT_TABLE["core-periphery"] in core/invariants.js.

import { buildDefaultNarrative } from "../../synthesis/narrative.js";

export default {
  id: "core-periphery",
  origin: "derived",
  partitionStrategy: "four-square",
  /**
   * Does this type fit the computed partition?
   * Returns { type, confidence } if yes, null otherwise.
   */
  classify({ partition, totalNodes }) {
    if (!partition) return null;
    return partition.core.length / totalNodes >= 0.06
      ? { type: "core-periphery", confidence: 1 }
      : null;
  },
  // Order in which blocks are emitted on the diagonal.
  blockOrder: ["shared", "core", "control", "peripheral"],
  // Map each region id present on the diagonal to its scene-level descriptor.
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
      architectureType: "core-periphery",
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
