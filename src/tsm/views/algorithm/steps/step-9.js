// Algorithm view — Step 9 renderer.
//
// Step 9: "The four-square partition." Each component takes one of four
// roles relative to the Core:
//   - Shared:     the Core depends on these (foundations everyone leans on)
//   - Core:       the mutual-dependency knot
//   - Control:    depends on the Core (users of the architecture)
//   - Periphery:  unrelated to the Core (separate concerns)
//
// We render two visualizations stacked:
//   (a) Annotated sorted matrix — each diagonal cell tagged with its
//       region; per-region summary badges below.
//   (b) Small VFI/VFO scatter inset — one dot per node, colored by
//       region. Same four-square pattern in 2D.
//
// If `partition` is null (acyclic system) we render a soft "hierarchical"
// notice and a single .algorithm-region-empty placeholder per region so
// downstream consumers can still introspect.

import { sortIdsByMetrics } from "../../../core/engine/ordering.js";

const REGION_ORDER = ["shared", "core", "control", "peripheral"];
const REGION_BLURBS = {
  shared: "the Core depends on these",
  core: "the mutual-dependency knot",
  control: "depends on the Core",
  peripheral: "unrelated to the Core",
};

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
 * }} ctx
 */
export function renderStep9({
  stageEl,
  nodes,
  edges,
  V,
  nodeIndex,
  vfivfo,
  partition,
  shortCodes,
}) {
  const n = nodes.length;
  const idx = nodeIndex ?? Object.fromEntries(nodes.map((node, i) => [node.id, i]));
  const nodeById = Object.fromEntries(nodes.map((node) => [node.id, node]));

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

  // Region lookup. For acyclic fixtures partition is null, so every node
  // falls into a single "task" bucket; we surface that as an empty-region
  // placeholder per the four canonical regions so tests can verify the
  // partition machinery wasn't silently skipped.
  const regionOf = {};
  if (partition) {
    for (const region of REGION_ORDER) {
      for (const id of partition[region] ?? []) regionOf[id] = region;
    }
  }

  const root = document.createElement("div");
  root.className = "algorithm-step-content algorithm-four-square";
  root.dataset.step = "9";
  root.dataset.size = String(n);
  root.dataset.order = sortedIds.join(",");
  if (partition) root.dataset.hasPartition = "true";
  else root.dataset.hasPartition = "false";

  // --- Part 1: annotated sorted matrix --------------------------------------

  const matrix = document.createElement("div");
  matrix.className = "algorithm-four-square-matrix";
  matrix.dataset.step = "9";
  matrix.dataset.size = String(n);

  const grid = document.createElement("div");
  grid.className = "algorithm-matrix algorithm-matrix-sorted";
  grid.dataset.step = "9";
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
      const rowRegion = regionOf[sortedIds[r]];
      const colRegion = regionOf[sortedIds[c]];
      if (rowRegion) cell.dataset.rowRegion = rowRegion;
      if (colRegion) cell.dataset.colRegion = colRegion;
      if (r === c) {
        cell.classList.add("diagonal");
        if (rowRegion) {
          cell.classList.add(`region-${rowRegion}`);
          cell.dataset.region = rowRegion;
          // SPEC-LENSES §6 Path B emphasis. Step 8 already emitted the
          // core-periphery-boundary lens on Core cells; Step 9 keeps the
          // Core emphasis and adds region-boundary overlays for the other
          // three regions. Region-boundary overlays use modularity-boundary
          // lens semantically (module borders) but the four-square is
          // structurally the core-periphery-boundary surface — so Core
          // stays on core-periphery-boundary and the other regions get
          // modularity-boundary as their lens tag.
          if (rowRegion === "core") {
            cell.dataset.emphasis = "primary";
            cell.dataset.lens = "core-periphery-boundary";
          } else {
            cell.dataset.emphasis = "primary";
            cell.dataset.lens = "modularity-boundary";
          }
        }
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
      grid.appendChild(cell);
    }
  }
  matrix.appendChild(grid);
  root.appendChild(matrix);

  // Per-region summary badges. We emit one .algorithm-region per
  // populated region and one .algorithm-region-empty placeholder per
  // empty region — so tests can verify the partition's full shape.
  const regionsEl = document.createElement("div");
  regionsEl.className = "algorithm-regions";
  if (regionsEl.style) {
    regionsEl.style.display = "flex";
    regionsEl.style.flexWrap = "wrap";
    regionsEl.style.gap = "0.4rem";
    regionsEl.style.marginTop = "0.5rem";
    regionsEl.style.fontSize = "0.85em";
  }
  for (const region of REGION_ORDER) {
    const members = partition ? partition[region] ?? [] : [];
    if (members.length === 0) {
      const empty = document.createElement("span");
      empty.className = "algorithm-region-empty";
      empty.dataset.region = region;
      empty.dataset.size = "0";
      empty.textContent = `${capitalize(region)} 0`;
      if (empty.style) empty.style.opacity = "0.55";
      regionsEl.appendChild(empty);
      continue;
    }
    const badge = document.createElement("span");
    badge.className = "algorithm-region";
    badge.dataset.region = region;
    badge.dataset.size = String(members.length);
    badge.dataset.members = members.join(",");
    // Path B emphasis: every region-boundary overlay is primary at Step 9.
    // Core inherits core-periphery-boundary from Step 8 conceptually; other
    // regions tag as modularity-boundary.
    badge.dataset.emphasis = "primary";
    badge.dataset.lens = region === "core"
      ? "core-periphery-boundary"
      : "modularity-boundary";
    // First few members for concreteness, then "+N more" — the colored cells +
    // decode key carry the full roster, so the role badges stay one line each.
    const preview = members.slice(0, 3).map((id) => nodeById[id]?.label || id).join(", ");
    const moreCount = members.length - Math.min(3, members.length);
    const tail = moreCount > 0 ? `, +${moreCount} more` : "";
    badge.textContent =
      `${capitalize(region)} (${members.length}) — ${REGION_BLURBS[region]}: ${preview}${tail}`;
    regionsEl.appendChild(badge);
  }
  root.appendChild(regionsEl);

  // --- Part 2: VFI/VFO scatter inset ---------------------------------------
  // Core members share an identical (VFI, VFO) by Proposition 1, so a naive plot
  // collapses the whole Core to ONE pixel. We keep one dot per node (the data
  // contract) but spread co-located dots in a tight golden-angle spiral, so a
  // dense role reads as a visible cluster. Enlarged 180 → 300 so the four
  // quadrant-clusters separate; a count key under it keys the colours locally.
  const INSET = 300;
  const PAD = 24; // axis margin inside the inset
  const PLOT = INSET - 2 * PAD - 6;

  const inset = document.createElement("div");
  inset.className = "algorithm-scatter-inset";
  inset.dataset.step = "9";
  inset.dataset.size = String(n);
  if (inset.style) {
    inset.style.position = "relative";
    inset.style.marginTop = "0.75rem";
    inset.style.width = `${INSET}px`;
    inset.style.height = `${INSET}px`;
  }

  // Extents for the (vfi, vfo) → (x, y) mapping.
  let maxVfi = 1;
  let maxVfo = 1;
  for (const node of nodes) {
    const v = vfivfo[node.id] || { vfi: 0, vfo: 0 };
    if (v.vfi > maxVfi) maxVfi = v.vfi;
    if (v.vfo > maxVfo) maxVfo = v.vfo;
  }

  // Index each node within its exactly-co-located (vfi, vfo) group so the
  // spiral fans only the overlaps; lone points stay put (index 0 → radius 0).
  const byPoint = new Map();
  for (const node of nodes) {
    const v = vfivfo[node.id] || { vfi: 0, vfo: 0 };
    const key = `${v.vfi},${v.vfo}`;
    if (!byPoint.has(key)) byPoint.set(key, []);
    byPoint.get(key).push(node.id);
  }
  const spiralIndex = {};
  for (const ids of byPoint.values()) ids.forEach((id, i) => { spiralIndex[id] = i; });

  const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // ~137.5° — even sunflower packing
  const JITTER_STEP = 4.5;
  for (const node of nodes) {
    const v = vfivfo[node.id] || { vfi: 0, vfo: 0 };
    const baseX = PAD + (v.vfi / maxVfi) * PLOT;
    const baseY = PAD + (1 - v.vfo / maxVfo) * PLOT; // VFO grows upward
    const k = spiralIndex[node.id] ?? 0;
    const r = JITTER_STEP * Math.sqrt(k);
    const theta = k * GOLDEN;
    const x = baseX + r * Math.cos(theta);
    const y = baseY + r * Math.sin(theta);
    const dot = document.createElement("span");
    dot.className = "algorithm-scatter-dot";
    dot.dataset.id = node.id;
    dot.dataset.vfi = String(v.vfi);
    dot.dataset.vfo = String(v.vfo);
    const region = regionOf[node.id];
    if (region) {
      dot.dataset.region = region;
      dot.classList.add(`region-${region}`);
    } else {
      dot.dataset.region = "unassigned";
    }
    if (dot.style) {
      dot.style.position = "absolute";
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      dot.style.width = "7px";
      dot.style.height = "7px";
      dot.style.borderRadius = "50%";
      dot.style.background = "currentColor";
      dot.style.transform = "translate(-50%, -50%)";
    }
    dot.title = `${node.label || node.id} — VFI ${v.vfi}, VFO ${v.vfo}${region ? ` (${region})` : ""}`;
    inset.appendChild(dot);
  }

  const xLabel = document.createElement("span");
  xLabel.className = "algorithm-scatter-axis";
  xLabel.dataset.axis = "x";
  xLabel.textContent = "Fan-In →";
  if (xLabel.style) {
    xLabel.style.position = "absolute";
    xLabel.style.bottom = "0";
    xLabel.style.left = "50%";
    xLabel.style.transform = "translateX(-50%)";
    xLabel.style.fontSize = "0.7em";
  }
  inset.appendChild(xLabel);

  const yLabel = document.createElement("span");
  yLabel.className = "algorithm-scatter-axis";
  yLabel.dataset.axis = "y";
  yLabel.textContent = "Fan-Out ↑";
  if (yLabel.style) {
    yLabel.style.position = "absolute";
    yLabel.style.top = "50%";
    yLabel.style.left = "2px";
    yLabel.style.transform = "translateY(-50%) rotate(-90deg)";
    yLabel.style.fontSize = "0.7em";
  }
  inset.appendChild(yLabel);
  root.appendChild(inset);

  // Per-region count key under the scatter, so a reader can read the dot colours
  // without scrolling back to the badges.
  if (partition) {
    const scatterKey = document.createElement("div");
    scatterKey.className = "algorithm-scatter-key";
    for (const region of REGION_ORDER) {
      const count = (partition[region] ?? []).length;
      const item = document.createElement("span");
      item.className = "algorithm-scatter-key-item";
      item.dataset.region = region;
      const swatch = document.createElement("span");
      swatch.className = "algorithm-scatter-key-swatch";
      item.appendChild(swatch);
      const label = document.createElement("span");
      label.className = "algorithm-scatter-key-label";
      label.textContent = `${capitalize(region)} ${count}`;
      item.appendChild(label);
      scatterKey.appendChild(item);
    }
    root.appendChild(scatterKey);
  }

  if (!partition) {
    const notice = document.createElement("p");
    notice.className = "algorithm-four-square-notice";
    notice.dataset.kind = "hierarchical";
    notice.textContent =
      "This system has no Core, so the four-square partition collapses — every node sits on the strict hierarchy. The scatter still shows fan-in vs fan-out.";
    if (notice.style) {
      notice.style.marginTop = "0.5rem";
      notice.style.fontSize = "0.85em";
      notice.style.opacity = "0.75";
    }
    root.appendChild(notice);
  }

  stageEl.appendChild(root);
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
