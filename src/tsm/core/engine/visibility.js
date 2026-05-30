// Visibility matrix (Warshall transitive closure) for the Hidden Structure
// engine. Pure graph math, no presentation concerns.

export const N_CAP = 64;

/**
 * Compute the visibility (transitive closure) matrix.
 *
 * @param {Array} nodes — [{ id, label, ... }]
 * @param {Array} edges — [{ from, to, ... }]
 * @returns {{ V: number[][], idx: Object<string, number> }}
 */
export function computeVisibilityMatrix(nodes, edges) {
  const n = nodes.length;
  if (n > N_CAP) {
    throw new Error(`Algorithm hard-capped at n=${N_CAP} (got ${n} nodes)`);
  }
  const idx = Object.fromEntries(nodes.map((node, i) => [node.id, i]));
  const V = Array.from({ length: n }, () => new Array(n).fill(0));

  // Reflexive: every node depends on itself.
  for (let i = 0; i < n; i++) V[i][i] = 1;

  // Direct edges: from depends on to.
  for (const e of edges) {
    const i = idx[e.from];
    const j = idx[e.to];
    if (i === undefined || j === undefined) continue;
    V[i][j] = 1;
  }

  // Warshall transitive closure: V[i][j] = OR_k (V[i][k] AND V[k][j]).
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      if (V[i][k] === 0) continue;
      for (let j = 0; j < n; j++) {
        if (V[k][j]) V[i][j] = 1;
      }
    }
  }

  return { V, idx };
}
