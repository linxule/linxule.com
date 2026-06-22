// Cyclic-group detection — exact strongly-connected components. Pure graph math.

/**
 * Identify cyclic groups — the strongly-connected components (SCCs) of size ≥2
 * in the dependency graph — directly from the reflexive-transitive closure `V`.
 *
 * Two nodes i, j are in the same cyclic group iff they are mutually reachable:
 * `V[i][j] && V[j][i]`. Mutual reachability over a transitive closure IS the
 * strong-connectivity equivalence relation, so a union-find over every such
 * pair recovers the exact SCCs.
 *
 * Note on Proposition 1 (Hidden Structure §314): SCC members necessarily share
 * one (VFI, VFO) pair — but that is a NECESSARY condition, not a sufficient one
 * (two disjoint cycles can coincidentally share a metric pair). So (VFI, VFO)
 * cannot be used to *group* nodes. The previous implementation bucketed nodes
 * by (VFI, VFO) and then discarded any bucket whose members weren't all
 * mutually reachable; that silently dropped real cycles whenever two
 * disconnected cycles shared a bucket (KNOWN-ISSUES.md D-1). Reachability is the
 * detector; `vfivfo` is retained only for call-site signature compatibility.
 *
 * @param {number[][]} V — reflexive-transitive closure (visibility) matrix
 * @param {Object} vfivfo — unused (kept for signature compatibility)
 * @param {Array<{id: string}>} nodes
 * @returns {Array<Array<string>>} — cyclic groups, each a list of node ids in
 *   input-node order; groups sorted largest-first, ties broken by smallest
 *   member index so equal-size order is deterministic. (The four-square
 *   partition keys off cyclicGroups[0], so group order is load-bearing and
 *   must stay byte-stable for provenance.)
 */
export function findCyclicGroups(V, vfivfo, nodes) {
  const n = nodes.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]; // path compression
      x = parent[x];
    }
    return x;
  };
  const union = (a, b) => {
    parent[find(a)] = find(b);
  };

  // Union every mutually-reachable pair → strongly-connected components.
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (V[i][j] && V[j][i]) union(i, j);
    }
  }

  // Collect components; members keep ascending input-index order.
  const byRoot = new Map();
  for (let i = 0; i < n; i++) {
    const r = find(i);
    if (!byRoot.has(r)) byRoot.set(r, []);
    byRoot.get(r).push(i);
  }

  // Size-≥2 components are the cyclic groups. Sort largest-first, then by
  // smallest member index (a[0] is the smallest index, since members are
  // pushed in ascending order) — a deterministic tie-break that reproduces the
  // legacy bucket-insertion order on equal-size groups.
  const groups = [...byRoot.values()].filter((idxs) => idxs.length >= 2);
  groups.sort((a, b) => b.length - a.length || a[0] - b[0]);
  return groups.map((idxs) => idxs.map((i) => nodes[i].id));
}
