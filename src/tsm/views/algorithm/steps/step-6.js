// Algorithm view — Step 6 renderer.
//
// Step 6: "Counting reach." The visibility matrix from Step 5, now
// annotated with two numbers per component:
//   • VFO per row — "what this component depends on, total" — surface
//     area into the system.
//   • VFI per column — "what depends on this component" — reach.
//
// Storyboard pedagogy (STORYBOARD-ALGORITHM.md §Step 6): don't call them
// "row sums" or "column sums" in the visible copy. Two annotations
// concretize the abstraction: one pointer to the highest-VFI component
// ("depended on by many — downstream foundation"), one to the highest-
// VFO component ("depends on many — sits atop long chains"). Ties are
// broken deterministically by node index so unit tests are stable.

/**
 * Pick the node id with the maximum value of `metric` ("vfi" or "vfo").
 * Iterates in nodes-order so ties resolve to the first-by-index node.
 *
 * @param {Array} nodes
 * @param {Object<string, { vfi: number, vfo: number }>} vfivfo
 * @param {"vfi" | "vfo"} metric
 * @returns {{ id: string, value: number, index: number } | null}
 */
function pickHighest(nodes, vfivfo, metric) {
  let best = null;
  for (let i = 0; i < nodes.length; i++) {
    const id = nodes[i].id;
    const value = vfivfo[id]?.[metric] ?? 0;
    if (best === null || value > best.value) {
      best = { id, value, index: i };
    }
  }
  return best;
}

/**
 * @param {{
 *   stageEl: HTMLElement,
 *   nodes: Array,
 *   edges: Array,
 *   V: number[][],
 *   nodeIndex: Object<string, number>,
 *   vfivfo: Object<string, { vfi: number, vfo: number }>,
 *   shortCodes?: Object<string, string>
 * }} ctx
 */
export function renderStep6({ stageEl, nodes, edges, V, nodeIndex, vfivfo, shortCodes }) {
  const n = nodes.length;
  const idx = nodeIndex ?? Object.fromEntries(nodes.map((node, i) => [node.id, i]));

  // Direct-edge matrix — same construction as step-5 so the direct vs
  // indirect distinction carries over visually.
  const D = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const edge of edges) {
    const i = idx[edge.from];
    const j = idx[edge.to];
    if (i === undefined || j === undefined) continue;
    if (i === j) continue;
    D[i][j] = 1;
  }

  const root = document.createElement("div");
  root.className = "algorithm-step-content algorithm-vfi-vfo-matrix";
  root.dataset.step = "6";
  root.dataset.size = String(n);

  // Layout: V matrix + a right-side VFO column + a bottom VFI row, with a
  // labelled header over each margin so the two abbreviations are never bare:
  //
  //        [ corner ] [ Fan-Out (VFO) ↓ ]
  //        [ matrix ] [ VFO column      ]
  //        [ VFI row] [ Fan-In (VFI) →  ]
  //
  // The headers sit in their own grid rows/cols (explicit placement) so they
  // label the margins without offsetting the matrix↔column row alignment.
  const layout = document.createElement("div");
  layout.className = "algorithm-vfi-vfo-layout";
  if (layout.style) {
    layout.style.display = "grid";
    // Definite matrix track (not content-shrinking "auto"), so the matrix keeps
    // the same viewport-bound square as every other step instead of collapsing
    // against the VFO column's intrinsic width. Mirrors .algorithm-matrix's cap.
    layout.style.gridTemplateColumns =
      "minmax(0, min(640px, calc(100vh - var(--algo-matrix-chrome, 200px)))) auto";
    layout.style.gridTemplateRows = "auto auto auto";
    layout.style.columnGap = "0.5rem";
    layout.style.rowGap = "0.3rem";
    layout.style.alignItems = "start";
    layout.style.justifyContent = "start";
  }

  // Header over the VFO column.
  const foHeader = document.createElement("div");
  foHeader.className = "algorithm-axis-header";
  foHeader.dataset.axis = "vfo";
  foHeader.textContent = "Fan-Out";
  if (foHeader.style) {
    foHeader.style.gridRow = "1";
    foHeader.style.gridColumn = "2";
  }
  layout.appendChild(foHeader);

  // --- The V matrix (direct + indirect, like step-5) -----------------------
  const grid = document.createElement("div");
  grid.className = "algorithm-matrix algorithm-matrix-visibility";
  grid.dataset.step = "6";
  grid.dataset.size = String(n);
  if (grid.style) {
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${n}, minmax(0, 1fr))`;
    grid.style.gridTemplateRows = `repeat(${n}, minmax(0, 1fr))`;
    grid.style.gridRow = "2";
    grid.style.gridColumn = "1";
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
  layout.appendChild(grid);

  // --- VFO column (one cell per row — "what this component depends on") ----
  const vfoCol = document.createElement("div");
  vfoCol.className = "algorithm-vfo-column";
  if (vfoCol.style) {
    vfoCol.style.display = "grid";
    vfoCol.style.gridTemplateRows = `repeat(${n}, minmax(0, 1fr))`;
    vfoCol.style.gap = "0";
    vfoCol.style.gridRow = "2";
    vfoCol.style.gridColumn = "2";
  }
  for (let i = 0; i < n; i++) {
    const id = nodes[i].id;
    const value = vfivfo[id]?.vfo ?? 0;
    const cell = document.createElement("div");
    cell.className = "algorithm-vfo-cell";
    cell.dataset.row = String(i);
    cell.dataset.id = id;
    cell.dataset.value = String(value);
    cell.textContent = String(value);
    if (cell.style) {
      cell.style.padding = "0 0.5rem";
      cell.style.fontVariantNumeric = "tabular-nums";
    }
    vfoCol.appendChild(cell);
  }
  layout.appendChild(vfoCol);

  // --- VFI row (one cell per column — "what depends on this component") ----
  const vfiRow = document.createElement("div");
  vfiRow.className = "algorithm-vfi-row";
  if (vfiRow.style) {
    vfiRow.style.display = "grid";
    vfiRow.style.gridTemplateColumns = `repeat(${n}, minmax(0, 1fr))`;
    vfiRow.style.gap = "0";
    vfiRow.style.gridRow = "3";
    vfiRow.style.gridColumn = "1"; // align under the matrix column
  }
  for (let j = 0; j < n; j++) {
    const id = nodes[j].id;
    const value = vfivfo[id]?.vfi ?? 0;
    const cell = document.createElement("div");
    cell.className = "algorithm-vfi-cell";
    cell.dataset.col = String(j);
    cell.dataset.id = id;
    cell.dataset.value = String(value);
    cell.textContent = String(value);
    if (cell.style) {
      cell.style.textAlign = "center";
      cell.style.fontVariantNumeric = "tabular-nums";
    }
    vfiRow.appendChild(cell);
  }
  layout.appendChild(vfiRow);

  // Header beside the VFI row.
  const fiHeader = document.createElement("div");
  fiHeader.className = "algorithm-axis-header";
  fiHeader.dataset.axis = "vfi";
  fiHeader.textContent = "Fan-In";
  if (fiHeader.style) {
    fiHeader.style.gridRow = "3";
    fiHeader.style.gridColumn = "2";
  }
  layout.appendChild(fiHeader);

  root.appendChild(layout);

  // --- Plain-terms key: name the two abbreviations the margins use ----------
  // The caption talks in "Fan-In / Fan-Out"; the margins are labelled the same,
  // but the matrix margins are terse, so spell out what each number counts and
  // where it lives. (VFI/VFO are the paper's "visible fan-in/out" — named once
  // here so a reader who meets the abbreviation elsewhere recognises it.)
  const key = document.createElement("div");
  key.className = "algorithm-vfivfo-key";
  const mkKeyItem = (axis, term, abbr, rest) => {
    const item = document.createElement("p");
    item.className = "algorithm-vfivfo-key-item";
    item.dataset.axis = axis;
    const strong = document.createElement("span");
    strong.className = "algorithm-vfivfo-key-term";
    strong.textContent = term;
    item.appendChild(strong);
    const ab = document.createElement("span");
    ab.className = "algorithm-vfivfo-key-abbr";
    ab.textContent = ` (${abbr})`;
    item.appendChild(ab);
    const body = document.createElement("span");
    body.className = "algorithm-vfivfo-key-body";
    body.textContent = rest;
    item.appendChild(body);
    return item;
  };
  key.appendChild(
    mkKeyItem("vfo", "Fan-Out", "VFO", " — right column: how many components each one depends on."),
  );
  key.appendChild(
    mkKeyItem("vfi", "Fan-In", "VFI", " — bottom row: how many components depend on it."),
  );
  root.appendChild(key);

  // --- Annotations: the two extremes, each self-labelled by metric ----------
  // The dot colour (control / warm) carries no meaning on its own, so each line
  // opens with its metric in words — "Highest Fan-In …", "Highest Fan-Out …" —
  // making the coloured dots a redundant cue, not a puzzle.
  const highVfi = pickHighest(nodes, vfivfo, "vfi");
  const highVfo = pickHighest(nodes, vfivfo, "vfo");

  const annotations = document.createElement("div");
  annotations.className = "algorithm-annotations";
  if (annotations.style) {
    annotations.style.display = "flex";
    annotations.style.flexDirection = "column";
    annotations.style.gap = "0.3rem";
    annotations.style.marginTop = "0.75rem";
    annotations.style.fontSize = "0.9em";
  }

  const mkAnnotation = (kind, lead, node, value, rest) => {
    const ann = document.createElement("p");
    ann.className = "algorithm-annotation";
    ann.dataset.kind = kind;
    ann.dataset.nodeId = node.id;
    ann.dataset.value = String(value);
    const tag = document.createElement("span");
    tag.className = "algorithm-annotation-lead";
    tag.textContent = lead;
    ann.appendChild(tag);
    const body = document.createElement("span");
    body.className = "algorithm-annotation-body";
    body.textContent = ` ${node.label || node.id} (${value}) ${rest}`;
    ann.appendChild(body);
    return ann;
  };

  if (highVfi) {
    annotations.appendChild(
      mkAnnotation(
        "high-vfi",
        "Highest Fan-In —",
        nodes[highVfi.index],
        highVfi.value,
        "is depended on by many: a downstream foundation. Changing it ripples out across the system.",
      ),
    );
  }

  if (highVfo) {
    annotations.appendChild(
      mkAnnotation(
        "high-vfo",
        "Highest Fan-Out —",
        nodes[highVfo.index],
        highVfo.value,
        "depends on many: it sits atop a long chain. Almost everything else can shake it.",
      ),
    );
  }

  root.appendChild(annotations);

  stageEl.appendChild(root);
}
