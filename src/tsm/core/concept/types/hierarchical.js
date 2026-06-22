// Hierarchical architecture — algorithm-derived (last-resort fallback).
//
// Fires when no cyclic group is found (partition is null) OR when the
// pick-loop exhausts more specific options. classify here returns a
// fallback verdict only when partition is null; the registry's pick-loop
// uses hierarchical as the ultimate fallback when no plugin matches.
//
// Invariants mirror INVARIANT_TABLE.hierarchical in core/invariants.js.

import { buildDefaultNarrative } from "../../synthesis/narrative.js";

export default {
  id: "hierarchical",
  origin: "derived",
  partitionStrategy: "four-square",
  classify({ partition }) {
    if (partition) return null;
    return { type: "hierarchical", confidence: 0.5 };
  },
  // Hierarchical has a single "task" diagonal block — no four-square split.
  blockOrder: ["task"],
  regions: ({ regionsPresent }) => {
    const desc = { id: "task", layoutKind: "diagonal-block", semanticKind: "task", label: "Tasks" };
    return regionsPresent.includes("task") ? [desc] : [];
  },
  // No module borders on hierarchical — peripheral and task are both filtered
  // out by the core-periphery overlay rule, and hierarchical only emits task.
  overlays: () => [],
  buildNarrative({ partition, overlays, cyclicGroups, hasForwardTransfers, hasBackwardTransfers }) {
    return buildDefaultNarrative({
      partition,
      architectureType: "hierarchical",
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
  ],
};
