// Per-node VFI / VFO computation. Pure graph math.

/**
 * Compute VFI and VFO per node (excluding self).
 *
 * @param {number[][]} V — visibility matrix
 * @param {Array} nodes
 * @returns {Object<string, { vfi: number, vfo: number }>}
 */
export function computeVFIVFO(V, nodes) {
  const n = V.length;
  const result = {};
  for (let i = 0; i < n; i++) {
    let vfo = 0;
    let vfi = 0;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        if (V[i][j]) vfo += 1;
        if (V[j][i]) vfi += 1;
      }
    }
    result[nodes[i].id] = { vfi, vfo };
  }
  return result;
}
