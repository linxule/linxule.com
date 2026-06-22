// Algorithm view — Step 7 renderer.
//
// Step 7: "Equal numbers reveal cycles." Proposition 1 from Hidden
// Structure paper — components that share a (VFI, VFO) pair AND are
// mutually reachable form a cyclic group. After sorting rows + columns
// by (VFI desc, VFO asc; ties keep observation order), those groups
// cluster on the diagonal.
//
// We render two parts in one frame:
//   1. The V matrix reordered by sortIdsByMetrics(ids, vfivfo).
//   2. A highlight box around the first non-trivial cyclic group's
//      diagonal block, plus a small inset showing the A → B → C → A
//      loop (or as many arrows as the group has members).
//
// FLIP animation (First-Last-Invert-Play): in a real browser we want
// the rows + columns to *slide* from their Step 6 (unsorted) positions
// into their Step 7 (sorted) positions, rather than snap. We do that
// self-contained inside this renderer (Option A) — the dispatcher
// clears the stage between steps, so we can't FLIP across the
// step-6 → step-7 boundary; we recreate the visual moment here.
//
// Approach:
//   1. Build cells in their final sorted DOM order (so test assertions
//      and the matrix's natural CSS-grid placement match the sorted
//      state). dataset.row / dataset.col hold the SORTED indices.
//   2. Before painting, give each cell an inline `grid-row` /
//      `grid-column` override pointing at its UNSORTED (original)
//      position — i.e. where the corresponding node sat in Step 6.
//   3. Append everything. Capture each cell's getBoundingClientRect()
//      — this is the "First" position (unsorted layout).
//   4. Clear the override styles. Cells fall into their natural
//      sorted-order grid positions — the "Last" position.
//   5. Compute delta = first - last per cell. Apply
//      `transform: translate(dx, dy)` with `transition: none` — the
//      "Invert" (cells appear pinned to their old spots).
//   6. requestAnimationFrame → clear the transform and set
//      `transition: transform 300ms ease-out` — the "Play"; the
//      browser interpolates from the inverted position to identity,
//      producing the slide.
//
// Capability gate: jsdom (unit-test env) provides a synchronous rAF
// shim and a stub getBoundingClientRect that returns
// { top:0, left:0, ... } for every element — so all deltas would be
// zero and the FLIP would be a no-op anyway. We still skip the
// transform/rAF dance when (a) window is undefined or (b) every
// captured rect collapses to the same point, to keep the unit-test
// DOM contract pristine (no inline transform / transition on cells).

import { sortIdsByMetrics } from "../../../core/engine/ordering.js";

/**
 * Pick the cyclic group to highlight. Convention: the first group with
 * ≥ 2 members. `findCyclicGroups` already sorts largest-first, so this
 * picks the biggest cycle when there are multiple.
 *
 * @param {Array<Array<string>>} cyclicGroups
 * @returns {string[] | null}
 */
function pickClusterGroup(cyclicGroups) {
  if (!Array.isArray(cyclicGroups)) return null;
  for (const group of cyclicGroups) {
    if (Array.isArray(group) && group.length >= 2) return group;
  }
  return null;
}

/**
 * @param {{
 *   stageEl: HTMLElement,
 *   nodes: Array,
 *   edges: Array,
 *   V: number[][],
 *   nodeIndex: Object<string, number>,
 *   vfivfo: Object<string, { vfi: number, vfo: number }>,
 *   cyclicGroups: Array<Array<string>>,
 *   shortCodes?: Object<string, string>
 * }} ctx
 */
export function renderStep7({ stageEl, nodes, edges, V, nodeIndex, vfivfo, cyclicGroups, shortCodes }) {
  const n = nodes.length;
  const idx = nodeIndex ?? Object.fromEntries(nodes.map((node, i) => [node.id, i]));
  const nodeById = Object.fromEntries(nodes.map((node) => [node.id, node]));

  // 1. Compute the sorted order. ids → order in the rendered matrix.
  const allIds = nodes.map((node) => node.id);
  const sortedIds = sortIdsByMetrics(allIds, vfivfo);
  // sortedRow[k] = the *original* index of the node now in row k.
  const sortedRow = sortedIds.map((id) => idx[id]);

  // Direct-edge matrix in original coordinates — we'll resolve to the
  // sorted order at draw time.
  const D = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const edge of edges) {
    const i = idx[edge.from];
    const j = idx[edge.to];
    if (i === undefined || j === undefined) continue;
    if (i === j) continue;
    D[i][j] = 1;
  }

  const root = document.createElement("div");
  root.className = "algorithm-step-content algorithm-sorted-matrix";
  root.dataset.step = "7";
  root.dataset.size = String(n);
  // Comma-separated sort order so tests can pin the exact reorder.
  root.dataset.order = sortedIds.join(",");

  // 2. Render the reordered V matrix.
  const grid = document.createElement("div");
  grid.className = "algorithm-matrix algorithm-matrix-sorted";
  grid.dataset.step = "7";
  grid.dataset.size = String(n);
  if (grid.style) {
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${n}, minmax(0, 1fr))`;
    grid.style.gridTemplateRows = `repeat(${n}, minmax(0, 1fr))`;
  }

  // Cluster lookup so we can tag cells that fall inside the highlighted
  // diagonal block.
  const cluster = pickClusterGroup(cyclicGroups);
  const clusterPositions = cluster
    ? new Set(cluster.map((id) => sortedIds.indexOf(id)).filter((p) => p >= 0))
    : new Set();
  const clusterRange = cluster
    ? {
        min: Math.min(...[...clusterPositions]),
        max: Math.max(...[...clusterPositions]),
      }
    : null;

  // Browser-capability gate for the FLIP animation. We require a real
  // window + rAF; the unit-test shim has rAF but no window, which
  // doubles as a clean "this is jsdom, skip the transform dance" signal.
  const isBrowserCapable =
    typeof window !== "undefined" &&
    typeof requestAnimationFrame === "function";

  // Collect cells so the FLIP pass can iterate them once without
  // re-walking the DOM tree.
  const flipCells = [];

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const origRow = sortedRow[r];
      const origCol = sortedRow[c];
      const cell = document.createElement("div");
      cell.className = "algorithm-matrix-cell";
      cell.dataset.row = String(r);
      cell.dataset.col = String(c);
      cell.dataset.id = sortedIds[r];
      if (r === c) {
        cell.classList.add("diagonal");
        cell.dataset.id = sortedIds[r];
        cell.textContent = shortCodes?.[sortedIds[r]] || nodes[origRow].shortLabel || nodes[origRow].label || nodes[origRow].id;
        cell.title = nodes[origRow].label || nodes[origRow].id;
      } else if (D[origRow][origCol] === 1) {
        cell.classList.add("dependency");
        cell.classList.add("direct");
        cell.textContent = "x";
      } else if (V && V[origRow][origCol] === 1) {
        cell.classList.add("dependency");
        cell.classList.add("indirect");
        cell.textContent = "·";
        if (cell.style) cell.style.opacity = "0.55";
      }
      // Mark every cell inside the cluster block — tests can target
      // any one of them, and visual styling can shade the whole square.
      if (
        clusterRange &&
        r >= clusterRange.min &&
        r <= clusterRange.max &&
        c >= clusterRange.min &&
        c <= clusterRange.max
      ) {
        cell.classList.add("in-cluster");
      }
      // FLIP step (a): pre-position the cell at its UNSORTED grid slot
      // (the original row/col of this node from Step 6's layout). CSS
      // grid lines are 1-indexed. We'll clear these overrides after
      // measuring so the cells fall back into their natural sorted
      // positions (which match the DOM append order).
      if (isBrowserCapable && cell.style) {
        cell.style.gridRow = String(origRow + 1);
        cell.style.gridColumn = String(origCol + 1);
      }
      grid.appendChild(cell);
      flipCells.push(cell);
    }
  }
  root.appendChild(grid);

  // 3. Cluster highlight badge — a sibling element with explicit
  // position metadata so a CSS layer can draw the box without sniffing
  // child cells. If the fixture has no cycles we render a soft
  // "no cycles found" badge instead.
  if (cluster && clusterRange) {
    const highlight = document.createElement("div");
    highlight.className = "algorithm-cycle-cluster";
    highlight.dataset.size = String(cluster.length);
    highlight.dataset.start = String(clusterRange.min);
    highlight.dataset.end = String(clusterRange.max);
    highlight.dataset.members = cluster.join(",");
    // Count + meaning, not a roll-call: the shaded block + the decode key carry
    // membership, so the prose stays scannable even for an 18-member Core.
    highlight.textContent =
      `Cyclic group of ${cluster.length} — identical Fan-In and Fan-Out: every member ` +
      `reaches every other, and the same parts reach them. They share the shaded block.`;
    if (highlight.style) {
      highlight.style.marginTop = "0.5rem";
      highlight.style.padding = "0.4rem 0.6rem";
      highlight.style.border = "1.5px solid currentColor";
      highlight.style.fontSize = "0.9em";
    }
    root.appendChild(highlight);

    // 4. The cycle inset — a small arrow loop A → B → C → A. Member
    // order follows the sort (and within a cluster all members have the
    // same VFI/VFO, so sortedIds.indexOf gives a deterministic order).
    //
    // A large Core (the kimi-code fixture's is 18) would draw a wall of tiles
    // that teaches nothing, so we cap the drawn loop at MAX_LOOP_MEMBERS and
    // splice in an ellipsis node before closing back to the first member. The
    // loop concept stays legible; dataset.size keeps the true cycle size and
    // dataset.loop keeps the full ordering for anything that needs it.
    const MAX_LOOP_MEMBERS = 5;
    const inset = document.createElement("div");
    inset.className = "algorithm-cycle-inset";
    inset.dataset.size = String(cluster.length);
    const orderedMembers = cluster
      .slice()
      .sort((a, b) => sortedIds.indexOf(a) - sortedIds.indexOf(b));
    inset.dataset.loop = orderedMembers.concat(orderedMembers[0]).join(",");
    const truncated = orderedMembers.length > MAX_LOOP_MEMBERS;
    const shownMembers = truncated
      ? orderedMembers.slice(0, MAX_LOOP_MEMBERS)
      : orderedMembers;
    inset.dataset.shown = String(shownMembers.length);
    if (truncated) inset.dataset.truncated = "true";
    if (inset.style) {
      inset.style.display = "flex";
      inset.style.flexDirection = "row";
      inset.style.alignItems = "center";
      inset.style.gap = "0.4rem";
      inset.style.flexWrap = "wrap";
      inset.style.marginTop = "0.5rem";
      inset.style.fontSize = "0.85em";
    }
    // Build the display sequence: shown members → (ellipsis if truncated) →
    // back to the first member, closing the loop.
    const sequence = shownMembers.map((id) => ({ kind: "node", id }));
    if (truncated) sequence.push({ kind: "ellipsis" });
    sequence.push({ kind: "node", id: orderedMembers[0] });
    for (let i = 0; i < sequence.length; i++) {
      const entry = sequence[i];
      if (entry.kind === "ellipsis") {
        const dots = document.createElement("span");
        dots.className = "algorithm-cycle-ellipsis";
        dots.textContent = "…";
        inset.appendChild(dots);
      } else {
        const tile = document.createElement("span");
        tile.className = "algorithm-cycle-node";
        tile.dataset.id = entry.id;
        tile.textContent = nodeById[entry.id]?.label || entry.id;
        inset.appendChild(tile);
      }
      if (i < sequence.length - 1) {
        const arrow = document.createElement("span");
        arrow.className = "algorithm-cycle-arrow";
        arrow.textContent = "→";
        inset.appendChild(arrow);
      }
    }
    root.appendChild(inset);
  } else {
    const badge = document.createElement("div");
    badge.className = "algorithm-cycle-cluster algorithm-no-cycles";
    badge.dataset.size = "0";
    badge.dataset.kind = "no-cycles";
    badge.textContent =
      "No cycles found in this system — every component sits on a strict hierarchy. " +
      "Hidden Structure calls this the hierarchical case.";
    if (badge.style) {
      badge.style.marginTop = "0.5rem";
      badge.style.padding = "0.4rem 0.6rem";
      badge.style.border = "1.5px dashed currentColor";
      badge.style.opacity = "0.75";
      badge.style.fontSize = "0.9em";
    }
    root.appendChild(badge);
  }

  stageEl.appendChild(root);

  // ---- FLIP animation pass ------------------------------------------------
  // Now that the grid is in the document tree, each cell's grid-row /
  // grid-column override pins it at its UNSORTED position. We measure,
  // then clear the overrides so the cells settle into their sorted
  // slots, measure again, and translate them back to where they
  // started. The next rAF clears the transform with a transition,
  // producing the slide. See the FLIP note at the top of this file.
  if (isBrowserCapable && flipCells.length > 0) {
    // First: capture pre-sort (unsorted) bounding rects.
    const firstRects = flipCells.map((cell) =>
      typeof cell.getBoundingClientRect === "function"
        ? cell.getBoundingClientRect()
        : null,
    );

    // Last: clear the overrides so each cell falls into its natural
    // sorted-order grid slot (matching DOM append order).
    for (const cell of flipCells) {
      if (cell.style) {
        cell.style.gridRow = "";
        cell.style.gridColumn = "";
      }
    }

    // Measure the post-sort rects and decide whether any cell actually
    // moved. If every delta is zero (jsdom's stub rects, or a 1×1
    // matrix), bail out so we don't leave inline transform/transition
    // styles on cells.
    const deltas = [];
    let anyMovement = false;
    for (let i = 0; i < flipCells.length; i++) {
      const cell = flipCells[i];
      const first = firstRects[i];
      const last =
        typeof cell.getBoundingClientRect === "function"
          ? cell.getBoundingClientRect()
          : null;
      if (!first || !last) {
        deltas.push(null);
        continue;
      }
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      deltas.push({ dx, dy });
      if (dx !== 0 || dy !== 0) anyMovement = true;
    }

    if (anyMovement) {
      // Invert: translate each cell back to its unsorted screen
      // location, with transition disabled so the jump is instant.
      for (let i = 0; i < flipCells.length; i++) {
        const d = deltas[i];
        const cell = flipCells[i];
        if (!d || !cell.style) continue;
        cell.style.transition = "none";
        cell.style.transform = `translate(${d.dx}px, ${d.dy}px)`;
      }

      // Play: on the next frame, clear the transform and enable the
      // transition — the browser interpolates from the inverted
      // position back to identity, sliding each cell to its sorted
      // slot.
      requestAnimationFrame(() => {
        for (const cell of flipCells) {
          if (!cell.style) continue;
          cell.style.transition = "transform 300ms ease-out";
          cell.style.transform = "";
        }
      });
    }
  }
}
