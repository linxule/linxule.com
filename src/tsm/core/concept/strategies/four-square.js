// Four-square partition strategy.
//
// Computes the {core, control, shared, peripheral} partition of nodes
// relative to the largest cyclic group. Moved verbatim from
// synthesis/derive.js as part of Phase 2; derive.js retains a
// pass-through `partitionFourSquare` for the algorithm.js barrel.

export default {
  id: "four-square",
  /**
   * @param {{ V: number[][], idx: Record<string, number>, nodes: Array, cyclicGroups: string[][] }} args
   * @returns {{ core: string[], control: string[], shared: string[], peripheral: string[] } | null}
   */
  run({ V, idx, nodes, cyclicGroups }) {
    if (cyclicGroups.length === 0) return null;

    const coreSet = new Set(cyclicGroups[0]);
    const coreIndices = cyclicGroups[0].map((id) => idx[id]);

    const partition = { core: [...coreSet], control: [], shared: [], peripheral: [] };

    for (const node of nodes) {
      if (coreSet.has(node.id)) continue;
      const ni = idx[node.id];

      let coreDependsOnNode = false; // core node → this node in V (core depends on it)
      let nodeDependsOnCore = false; // this node → some core node in V (it depends on core)

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
        // Both true — would imply node is in a cycle with core, but it's not in
        // the core group. Edge case (a separate cycle intersecting core). Treat
        // as control (it depends on core).
        partition.control.push(node.id);
      }
    }

    return partition;
  },
};
