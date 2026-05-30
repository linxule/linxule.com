// Algorithm view — Step 5 renderer.
//
// Step 5: "The visibility matrix captures all of them." Renders the same
// NxN grid as step 3 but with direct AND indirect dependencies marked.
// Direct cells display "x" (same as step 3); indirect cells — paths
// implied by the transitive closure — display "·" in a lighter style.
//
// The V matrix is computed once at mount-time in views/algorithm/index.js
// and passed through ctx. Direct edges come from the observation; the
// difference (V minus direct minus diagonal) is the indirect set.

/**
 * @param {{ stageEl: HTMLElement, nodes: Array, edges: Array, V: number[][], nodeIndex: Object<string,number>, shortCodes?: Object<string,string> }} ctx
 */
export function renderStep5({ stageEl, nodes, edges, V, nodeIndex, shortCodes }) {
  const n = nodes.length;
  const idx = nodeIndex ?? Object.fromEntries(nodes.map((node, i) => [node.id, i]));

  // Direct-edge matrix — same shape as step 3.
  const D = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const edge of edges) {
    const i = idx[edge.from];
    const j = idx[edge.to];
    if (i === undefined || j === undefined) continue;
    if (i === j) continue; // self-loops collapse onto the diagonal label
    D[i][j] = 1;
  }

  const grid = document.createElement("div");
  grid.className = "algorithm-matrix algorithm-matrix-visibility";
  grid.dataset.step = "5";
  grid.dataset.size = String(n);
  if (grid.style) {
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${n}, minmax(0, 1fr))`;
    grid.style.gridTemplateRows = `repeat(${n}, minmax(0, 1fr))`;
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const cell = document.createElement("div");
      cell.className = "algorithm-matrix-cell";
      cell.dataset.row = String(i);
      cell.dataset.col = String(j);
      if (i === j) {
        cell.classList.add("diagonal");
        cell.dataset.id = nodes[i].id;
        cell.textContent = shortCodes?.[nodes[i].id] || nodes[i].shortLabel || nodes[i].label || nodes[i].id;
        cell.title = nodes[i].label || nodes[i].id;
      } else if (D[i][j] === 1) {
        cell.classList.add("dependency");
        cell.classList.add("direct");
        cell.textContent = "x";
      } else if (V && V[i][j] === 1) {
        cell.classList.add("dependency");
        cell.classList.add("indirect");
        cell.textContent = "·";
        if (cell.style) cell.style.opacity = "0.55";
      }
      grid.appendChild(cell);
    }
  }
  stageEl.appendChild(grid);

  // Compact legend below the grid so the direct/indirect distinction is
  // legible without external CSS.
  const legend = document.createElement("div");
  legend.className = "algorithm-matrix-legend";
  legend.dataset.step = "5";
  if (legend.style) {
    legend.style.display = "flex";
    legend.style.gap = "1rem";
    legend.style.marginTop = "0.5rem";
    legend.style.fontSize = "0.85em";
  }

  const directSwatch = document.createElement("span");
  directSwatch.className = "algorithm-legend-item";
  directSwatch.dataset.kind = "direct";
  directSwatch.textContent = "x — direct dependency";
  legend.appendChild(directSwatch);

  const indirectSwatch = document.createElement("span");
  indirectSwatch.className = "algorithm-legend-item";
  indirectSwatch.dataset.kind = "indirect";
  indirectSwatch.textContent = "· — indirect (path through chain)";
  legend.appendChild(indirectSwatch);

  stageEl.appendChild(legend);
}
