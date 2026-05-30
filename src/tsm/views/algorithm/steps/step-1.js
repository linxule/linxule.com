// Algorithm view — Step 1 renderer.
//
// Step 1: "Here's a system." Vertical/grid strip of named tiles. CSS Grid
// auto-fill so ~20 tiles wrap into a sensible shape without physics.
//
// Step render contract (shared across all step-N.js modules):
//   renderStep(ctx) where ctx = { stageEl, nodes, edges, V, nodeIndex,
//                                 vfivfo, cyclicGroups, partition,
//                                 architectureType, ... }
//   - stageEl:           the DOM element to append visuals into (already cleared)
//   - nodes:             observation.nodes (the system's components)
//   - edges:             observation.edges (directed dependencies; not all steps use)
//   - V:                 NxN transitive-closure (visibility) matrix from
//                        core/engine/visibility.js — V[i][j] = 1 iff nodes[i]
//                        reaches nodes[j] (directly or via a chain). Diagonal is 1.
//                        Available from Phase 3 (Step 4) onward.
//   - nodeIndex:         { [id]: rowIndex } — id → row/col index in V.
//   - vfivfo:            { [id]: { vfi, vfo } } — per-node fan-in / fan-out
//                        from core/engine/vfi-vfo.js. Available from Phase 4
//                        (Step 6) onward.
//   - cyclicGroups:      Array<Array<string>> — node-id groups that share a
//                        (VFI, VFO) pair *and* are mutually reachable; sorted
//                        largest first. From core/engine/cyclic-groups.js.
//                        Available from Phase 4 (Step 7) onward.
//   - partition:         { core, control, shared, peripheral } | null — the
//                        four-square partition relative to the largest cyclic
//                        group, from core/synthesis/derive.js#partitionFourSquare.
//                        `null` for fully acyclic systems. Available from
//                        Phase 5 (Step 8) onward; steps that read it must
//                        handle the null branch.
//   - architectureType:  "core-periphery" | "multi-core" | "hierarchical".
//                        Derived from partition + total node count; defaults to
//                        "hierarchical" when partition is null. Available from
//                        Phase 5 (Step 10) onward.
//   - derivedScene:      the full v0.3 tsm-scene produced from this observation
//                        by core/synthesis/derive.js#deriveSceneFromObservation
//                        — tasks already partition-ordered + region-tagged,
//                        transfers in supply-direction, regions present,
//                        provenance populated. Available from Phase 6 (Step 11)
//                        onward; that step renders it as a "proper TSM" and
//                        exposes the "Export as scene.json" button.

/**
 * @param {{ stageEl: HTMLElement, nodes: Array, edges: Array }} ctx
 */
export function renderStep1({ stageEl, nodes }) {
  const wrap = document.createElement("div");
  wrap.className = "algorithm-tiles";
  wrap.dataset.step = "1";
  for (const node of nodes) {
    const tile = document.createElement("div");
    tile.className = "algorithm-tile";
    tile.dataset.id = node.id;
    if (node.entityType) tile.dataset.entityType = node.entityType;

    const label = document.createElement("span");
    label.className = "algorithm-tile-label";
    label.textContent = node.label || node.id;
    tile.appendChild(label);

    if (node.entityType) {
      const kind = document.createElement("span");
      kind.className = "algorithm-tile-kind";
      kind.textContent = node.entityType;
      tile.appendChild(kind);
    }

    wrap.appendChild(tile);
  }
  stageEl.appendChild(wrap);

  // Color-rail key. Each tile's left rail encodes the component family; without
  // this legend the colors are undecodable (a UX-audit P1). Colors mirror the
  // CSS rail rules in styles/algorithm.css.
  const legend = document.createElement("div");
  legend.className = "algorithm-tile-legend";
  legend.dataset.step = "1";
  const TILE_LEGEND = [
    { label: "runtime / protocol", color: "var(--color-core)" },
    { label: "agent / subagent", color: "var(--color-control)" },
    { label: "skill", color: "var(--color-shared)" },
    { label: "tool", color: "var(--color-case)" },
    { label: "provider", color: "var(--color-screen)" },
  ];
  for (const item of TILE_LEGEND) {
    const tag = document.createElement("span");
    tag.className = "algorithm-tile-legend-item";
    const swatch = document.createElement("span");
    swatch.className = "algorithm-tile-legend-swatch";
    if (swatch.style) swatch.style.background = item.color;
    tag.appendChild(swatch);
    const text = document.createElement("span");
    text.textContent = item.label;
    tag.appendChild(text);
    legend.appendChild(tag);
  }
  stageEl.appendChild(legend);
}
