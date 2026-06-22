// Algorithm view — Step 8 renderer.
//
// Step 8: "The biggest cycle is the Core." Builds on Step 7's sorted
// matrix and emphasizes the largest cyclic group's diagonal block as
// the Core. The Core is the indivisible center — where architectural
// decisions cost the most.
//
// Visual contract: same sorted matrix as Step 7, plus
//   - `.algorithm-core-block` overlay carrying size + members in data-*.
//   - `.algorithm-core-label` rendered next to the matrix.
// If `cyclicGroups[0]` is absent (acyclic system) or `partition` is null,
// a "No Core — this system is hierarchical" badge replaces both.

import { sortIdsByMetrics } from "../../../core/engine/ordering.js";

/**
 * @param {{
 *   stageEl: HTMLElement,
 *   nodes: Array,
 *   edges: Array,
 *   V: number[][],
 *   nodeIndex: Object<string, number>,
 *   vfivfo: Object<string, { vfi: number, vfo: number }>,
 *   cyclicGroups: Array<Array<string>>,
 *   partition: ({ core: string[], control: string[], shared: string[], peripheral: string[] } | null),
 *   architectureType: string,
 *   shortCodes?: Object<string, string>,
 * }} ctx
 */
export function renderStep8({
  stageEl,
  nodes,
  edges,
  V,
  nodeIndex,
  vfivfo,
  cyclicGroups,
  partition,
  coreGroups,
  shortCodes,
}) {
  const n = nodes.length;
  const idx = nodeIndex ?? Object.fromEntries(nodes.map((node, i) => [node.id, i]));

  // Same sort + direct-edge construction as Step 7.
  const allIds = nodes.map((node) => node.id);
  const sortedIds = sortIdsByMetrics(allIds, vfivfo);
  const sortedRow = sortedIds.map((id) => idx[id]);

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
  root.dataset.step = "8";
  root.dataset.size = String(n);
  root.dataset.order = sortedIds.join(",");

  // Identify the Core block(s). A multi-core system boxes EACH ≥6% core
  // (Core 1, Core 2, …) — threaded as `coreGroups` from the multi-core
  // classification, in cyclicGroups order. A core-periphery / hierarchical
  // system boxes the single largest cyclic group. Build one
  // { members, range, coreIndex } descriptor per box; coreIndex is null for
  // the single-core path so its label + datasets stay byte-identical.
  const singleCoreMembers =
    partition && Array.isArray(partition.core) && partition.core.length > 0
      ? partition.core
      : Array.isArray(cyclicGroups) &&
          Array.isArray(cyclicGroups[0]) &&
          cyclicGroups[0].length >= 2
        ? cyclicGroups[0]
        : null;
  const coreDescriptors =
    Array.isArray(coreGroups) && coreGroups.length >= 2
      ? coreGroups.map((members, i) => ({ members, coreIndex: i }))
      : singleCoreMembers
        ? [{ members: singleCoreMembers, coreIndex: null }]
        : [];
  for (const desc of coreDescriptors) {
    const positions = desc.members
      .map((id) => sortedIds.indexOf(id))
      .filter((p) => p >= 0);
    desc.range =
      positions.length > 0
        ? { min: Math.min(...positions), max: Math.max(...positions) }
        : null;
  }
  const renderableCores = coreDescriptors.filter((d) => d.range);
  // Union of all core members — drives the in-core cell shading so a
  // multi-core matrix shades every core block, not just the first.
  const coreSet = new Set(renderableCores.flatMap((d) => d.members));

  // Render the sorted matrix.
  const grid = document.createElement("div");
  grid.className = "algorithm-matrix algorithm-matrix-sorted";
  grid.dataset.step = "8";
  grid.dataset.size = String(n);
  if (grid.style) {
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${n}, minmax(0, 1fr))`;
    grid.style.gridTemplateRows = `repeat(${n}, minmax(0, 1fr))`;
  }

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
      // Mark cells inside a Core block so a CSS layer can shade them and tests
      // can pin block geometry independently from the overlay. With multiple
      // cores, a cell is in-core if it falls inside ANY core's square; the
      // 0-based core index rides on data-core so a CSS layer can hue each core
      // block.
      for (const desc of renderableCores) {
        const cr = desc.range;
        if (r >= cr.min && r <= cr.max && c >= cr.min && c <= cr.max) {
          cell.classList.add("in-core");
          if (desc.coreIndex !== null) cell.dataset.core = String(desc.coreIndex);
          // SPEC-LENSES §6 Path B emphasis: Core-block cells get emphasis
          // primary + lens core-periphery-boundary. The algorithm view does
          // not render a chip strip; the attributes are still useful for
          // tests, the CSS layer, and a future export of the derived scene.
          cell.dataset.emphasis = "primary";
          cell.dataset.lens = "core-periphery-boundary";
          break;
        }
      }
      grid.appendChild(cell);
    }
  }
  root.appendChild(grid);

  if (renderableCores.length > 0) {
    // One boxed block + label per core. For a single-core system coreIndex is
    // null, so the block text reads "Core block …" and the label reads "Core"
    // — byte-identical to the pre-multi-core output. A multi-core system gets
    // "Core 1 block …" / "Core 1", "Core 2 block …" / "Core 2", … so the
    // headline can't claim more cores than the boxes show.
    for (const desc of renderableCores) {
      const coreLabel = desc.coreIndex !== null ? `Core ${desc.coreIndex + 1}` : "Core";
      const cr = desc.range;
      // Sibling element with explicit position metadata — visual layer
      // draws the thick border without sniffing child cells.
      const block = document.createElement("div");
      block.className = "algorithm-core-block";
      block.dataset.size = String(desc.members.length);
      block.dataset.start = String(cr.min);
      block.dataset.end = String(cr.max);
      block.dataset.members = desc.members.join(",");
      if (desc.coreIndex !== null) block.dataset.core = String(desc.coreIndex);
      // Path B emphasis: Core boundary overlay is the primary visual claim.
      block.dataset.emphasis = "primary";
      block.dataset.lens = "core-periphery-boundary";
      if (block.style) {
        block.style.marginTop = "0.5rem";
        block.style.padding = "0.35rem 0.55rem";
        block.style.border = "2.5px solid currentColor";
        block.style.fontSize = "0.9em";
      }
      // Count + meaning, not a roll-call: the shaded square + the decode key
      // already name the members, so the prose stays scannable for a large Core.
      block.textContent =
        `${coreLabel} block — ${desc.members.length} of the ${n} components, every one depending ` +
        `on every other directly or transitively. Untying the knot means changing them all at once.`;
      root.appendChild(block);

      const label = document.createElement("span");
      label.className = "algorithm-core-label";
      label.dataset.size = String(desc.members.length);
      if (desc.coreIndex !== null) label.dataset.core = String(desc.coreIndex);
      label.textContent = coreLabel;
      if (label.style) {
        label.style.display = "inline-block";
        label.style.marginTop = "0.4rem";
        label.style.padding = "0.15rem 0.45rem";
        label.style.fontWeight = "600";
        label.style.letterSpacing = "0.05em";
        label.style.textTransform = "uppercase";
      }
      root.appendChild(label);
    }
  } else {
    const badge = document.createElement("div");
    badge.className = "algorithm-core-label algorithm-no-core";
    badge.dataset.kind = "no-core";
    badge.textContent =
      "No Core — this system is hierarchical. Every dependency flows one way; nothing depends on itself transitively.";
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
}
