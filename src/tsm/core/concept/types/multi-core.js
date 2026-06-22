// Multi-core architecture — algorithm-derived.
//
// Fires when the dependency graph has ≥2 strongly-connected cores, each ≥6% of
// total nodes (the same threshold core-periphery uses for its single core).
// Such a system has no single organizing core, so it is boxed as multiple core
// regions (core-1, core-2, …) via the `multi-core-four-square` partition
// strategy, with shared / control / peripheral computed relative to the union
// of all cores.
//
// Precedence: the registry pick-loop tries [core-periphery, multi-core,
// hierarchical]. core-periphery bows out (returns null) when ≥2 cores qualify,
// so multi-core is reached without reordering the loop — single-core systems
// stay core-periphery untouched.
//
// Invariants mirror INVARIANT_TABLE["multi-core"] in core/invariants.js.

import { buildDefaultNarrative } from "../../synthesis/narrative.js";

const CORE_THRESHOLD = 0.06;

// Core regions are emitted as `core-1`, `core-2`, … — sort by the numeric suffix
// so the diagonal order matches cyclicGroups order (largest-first).
function coreKeys(partition) {
  return Object.keys(partition || {})
    .filter((k) => /^core-\d+$/.test(k))
    .sort((a, b) => Number(a.slice(5)) - Number(b.slice(5)));
}

export default {
  id: "multi-core",
  origin: "derived",
  partitionStrategy: "multi-core-four-square",
  /**
   * Fits when ≥2 cyclic groups are each ≥6% of total nodes.
   * @param {{ totalNodes: number, cyclicGroups?: string[][] }} ctx
   */
  classify({ totalNodes, cyclicGroups }) {
    if (!totalNodes) return null;
    const qualifying = (cyclicGroups ?? []).filter(
      (g) => g.length / totalNodes >= CORE_THRESHOLD,
    );
    return qualifying.length >= 2 ? { type: "multi-core", confidence: 1 } : null;
  },
  // Diagonal order: shared, then each core (largest-first), then control,
  // peripheral. A function because the number of core regions is data-driven.
  blockOrder: (partition) => ["shared", ...coreKeys(partition), "control", "peripheral"],
  regions: ({ regionsPresent }) => {
    const staticMap = {
      shared:     { id: "shared",     layoutKind: "diagonal-block", semanticKind: "shared",     label: "Shared" },
      control:    { id: "control",    layoutKind: "diagonal-block", semanticKind: "control",    label: "Control" },
      peripheral: { id: "peripheral", layoutKind: "diagonal-block", semanticKind: "peripheral", label: "Peripheral" },
    };
    return regionsPresent
      .map((r) => {
        if (staticMap[r]) return staticMap[r];
        const m = /^core-(\d+)$/.exec(r);
        if (m) {
          return { id: r, layoutKind: "diagonal-block", semanticKind: "core", label: `Core ${m[1]}` };
        }
        return null;
      })
      .filter(Boolean);
  },
  // Box every core region plus shared + control (the full partition), matching
  // core-periphery's four-square rendering. Peripheral carries no box.
  overlays: ({ regionsPresent }) =>
    regionsPresent
      .filter((r) => r !== "peripheral" && r !== "task")
      .map((r) => ({ kind: "module-border", regionId: r })),
  buildNarrative({ partition, overlays, cyclicGroups, hasForwardTransfers, hasBackwardTransfers }) {
    // coreGroups = exactly what is boxed (the partition's core regions) so the
    // narrative cannot over- or under-claim relative to the render.
    const coreGroups = coreKeys(partition).map((k) => partition[k]);
    return buildDefaultNarrative({
      partition,
      architectureType: "multi-core",
      overlays,
      cyclicGroups,
      hasForwardTransfers,
      hasBackwardTransfers,
      coreGroups,
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
