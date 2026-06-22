// Multi-core four-square partition strategy.
//
// A system with ≥2 cyclic cores each ≥6% of nodes has no single organizing
// core, so the single-core four-square strategy (which boxes only
// cyclicGroups[0]) misrepresents it. This strategy boxes EACH qualifying core
// as its own diagonal region (`core-1`, `core-2`, …, in cyclicGroups order =
// largest-first with the engine's index tie-break), then sorts the remaining
// nodes into shared / control / peripheral relative to the UNION of all cores
// using the same reach rules as the single-core four-square strategy.
//
// Returns null when fewer than 2 cores qualify (the caller — pickArchitectureType
// / pickSynthesisPlugin — only selects this strategy's plugin when multi-core's
// classify already confirmed ≥2 qualifying cores, so null is a defensive guard).

const CORE_THRESHOLD = 0.06; // mirrors core-periphery's 6% (Hidden Structure §171)

export default {
  id: "multi-core-four-square",
  /**
   * @param {{ V: number[][], idx: Record<string, number>, nodes: Array, cyclicGroups: string[][], totalNodes?: number }} args
   * @returns {Record<string, string[]> | null} — { "core-1", "core-2", …, shared, control, peripheral }
   */
  run({ V, idx, nodes, cyclicGroups, totalNodes }) {
    const n = totalNodes ?? nodes.length;
    const coreGroups = (cyclicGroups ?? []).filter((g) => g.length / n >= CORE_THRESHOLD);
    if (coreGroups.length < 2) return null;

    const partition = {};
    coreGroups.forEach((group, i) => {
      partition[`core-${i + 1}`] = [...group];
    });

    const coreSet = new Set(coreGroups.flat());
    const coreIndices = [...coreSet].map((id) => idx[id]);
    partition.shared = [];
    partition.control = [];
    partition.peripheral = [];

    for (const node of nodes) {
      if (coreSet.has(node.id)) continue;
      const ni = idx[node.id];

      let coreDependsOnNode = false; // some core node → this node (core depends on it)
      let nodeDependsOnCore = false; // this node → some core node (it depends on core)
      for (const ci of coreIndices) {
        if (V[ci][ni]) coreDependsOnNode = true;
        if (V[ni][ci]) nodeDependsOnCore = true;
        if (coreDependsOnNode && nodeDependsOnCore) break;
      }

      if (nodeDependsOnCore && !coreDependsOnNode) {
        partition.control.push(node.id);
      } else if (coreDependsOnNode && !nodeDependsOnCore) {
        partition.shared.push(node.id);
      } else if (!nodeDependsOnCore && !coreDependsOnNode) {
        partition.peripheral.push(node.id);
      } else {
        // Both true — node sits in a cycle touching some core but isn't a core
        // member (e.g. a sub-threshold SCC bridging two cores). Treat as control
        // (it depends on core), matching the single-core four-square edge case.
        partition.control.push(node.id);
      }
    }

    return partition;
  },
};
