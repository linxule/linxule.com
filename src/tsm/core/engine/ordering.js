// Per-block sort helper used by the synthesis layer.
// Pure metric-based ordering: VFI desc, then VFO asc.

/**
 * Sort a list of node ids by their VFI/VFO metrics.
 * Primary: VFI descending (more depended-on first).
 * Secondary: VFO ascending (fewer dependencies first).
 *
 * @param {string[]} ids
 * @param {Object<string, { vfi: number, vfo: number }>} vfivfo
 * @returns {string[]} a new array (does not mutate input)
 */
export function sortIdsByMetrics(ids, vfivfo) {
  return ids.slice().sort((a, b) => {
    const va = vfivfo[a];
    const vb = vfivfo[b];
    return (vb.vfi - va.vfi) || (va.vfo - vb.vfo);
  });
}
