// Cyclic-group detection via Proposition 1. Pure graph math.

/**
 * Identify cyclic groups using Proposition 1 (same VFI/VFO ⟹ same cycle, then
 * verify mutual reachability).
 *
 * @returns {Array<Array<string>>} — list of cyclic groups, each a list of
 *   node ids; sorted by group size, largest first.
 */
export function findCyclicGroups(V, vfivfo, nodes) {
  const n = V.length;
  const buckets = new Map();
  for (let i = 0; i < n; i++) {
    const node = nodes[i];
    const { vfi, vfo } = vfivfo[node.id];
    const key = `${vfi}/${vfo}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(i);
  }

  const groups = [];
  for (const members of buckets.values()) {
    if (members.length <= 1) continue;
    let allCyclic = true;
    for (let a = 0; a < members.length && allCyclic; a++) {
      for (let b = a + 1; b < members.length; b++) {
        if (!V[members[a]][members[b]] || !V[members[b]][members[a]]) {
          allCyclic = false;
          break;
        }
      }
    }
    if (allCyclic) {
      groups.push(members.map((i) => nodes[i].id));
    }
  }

  groups.sort((a, b) => b.length - a.length);
  return groups;
}
