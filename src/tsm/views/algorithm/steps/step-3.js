// Algorithm view — Step 3 renderer.
//
// Step 3: "The first-order matrix." NxN matrix grid. Cell (i,j) is "1"
// iff node i depends on node j — i.e., there is an edge from nodes[i] to
// nodes[j]. Order is the observation order — deliberately not yet sorted
// (storyboard calls this out as "the chaos the algorithm earns").

/**
 * @param {{ stageEl: HTMLElement, nodes: Array, edges: Array, shortCodes?: Object<string,string> }} ctx
 */
export function renderStep3({ stageEl, nodes, edges, shortCodes }) {
  const n = nodes.length;
  const idx = Object.fromEntries(nodes.map((node, i) => [node.id, i]));
  const M = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const edge of edges) {
    const i = idx[edge.from];
    const j = idx[edge.to];
    if (i === undefined || j === undefined) continue;
    M[i][j] = 1;
  }

  const grid = document.createElement("div");
  grid.className = "algorithm-matrix";
  grid.dataset.step = "3";
  grid.dataset.size = String(n);
  // Inline grid template so the matrix renders correctly even without
  // the project's CSS file loaded (e.g., in a minimal embed page).
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
        // Terse ctx code (L1/R2/…) — same code every step + the decode key show;
        // full label on hover. Falls back to the observation's authored shortLabel.
        cell.textContent = shortCodes?.[nodes[i].id] || nodes[i].shortLabel || nodes[i].label || nodes[i].id;
        cell.title = nodes[i].label || nodes[i].id;
      } else if (M[i][j] === 1) {
        cell.classList.add("dependency");
        cell.textContent = "x";
      }
      grid.appendChild(cell);
    }
  }
  stageEl.appendChild(grid);
}
