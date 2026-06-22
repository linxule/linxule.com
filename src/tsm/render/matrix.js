// Matrix renderer. Mounts the title, source, and NxN grid into a container.
// Returns the gridEl plus an `applyReveal` function the walkthrough view uses.
//
// Reveal classes managed here (must stay identical to baseline DOM):
//   .cell.transfer.forward, .cell.transfer.backward → "hidden" class
//   .cell.transfer.cross → "highlighted" class
//
// Layout-kind classes applied to cells (purely visual, no geometry change):
//   .cell.corner-wrap-row     — cell sits in a `corner-wrapping` region's row
//   .cell.corner-wrap-col     — cell sits in a `corner-wrapping` region's column
//   .cell.corner-wrap-anchor  — diagonal cell of a `corner-wrapping` region
//   .cell.external-actor      — diagonal cell of an `external-cell` region
//   .cell.external-row        — non-diagonal cell on an external task's row
//   .cell.external-col        — non-diagonal cell on an external task's column
//
// What's NOT here:
//   - Module overlays + firm-boundary perimeters (see render/overlays.js)
//   - Annotations (see render/annotations.js)
//   - Explicit transfer arrows (see render/arrows.js)
//   - Step navigation logic (see views/walkthrough.js)

import { computeGrid } from "../core/layout.js";
import { displayLabelFor } from "../main.js";
import { resolveReveal } from "./reveal.js";

/**
 * Mount the matrix into a container. Returns { gridEl, applyReveal, grid }.
 *
 * @param {HTMLElement} container
 * @param {object} scene — v0.3 tsm-scene (decorated by scene-adapter.js)
 * @param {number} [matrixIndex=0] — which matrix in scene.matrices to render.
 */
export function renderMatrix(container, scene, matrixIndex = 0) {
  const titleEl = document.createElement("p");
  titleEl.className = "tsm-title";
  titleEl.textContent = scene.title;
  container.appendChild(titleEl);

  const sourceEl = document.createElement("p");
  sourceEl.className = "tsm-source";
  sourceEl.innerHTML = scene.source ?? "";
  container.appendChild(sourceEl);

  const matrix = scene.matrices[matrixIndex];

  // Per-matrix header line sits between the scene-level source paragraph and
  // the grid. Replaces the old floating `.firm-boundary-label` pill, which
  // overlapped the source text when the title/source paragraphs sat close
  // above. Resolution order:
  //   1. firm-boundary overlay's own `.label` (matrix-identity wins)
  //   2. first region with layoutKind "diagonal-block" or "corner-wrapping"
  //      (the firm/zone name in multi-matrix scenes like Fig 18.1)
  // No useful label → no header element.
  const headerText = resolveMatrixHeaderLabel(matrix);
  if (headerText) {
    const headerEl = document.createElement("p");
    headerEl.className = "tsm-matrix-header";
    headerEl.textContent = headerText;
    container.appendChild(headerEl);
  }

  const grid = computeGrid(matrix);
  const { n, cells, groupById } = grid;

  // Precompute which task indices belong to corner-wrapping or external-cell
  // regions. The visual treatment is Option B from ARCHITECTURE.md's deferred
  // visual treatments note: the coordinator's row + column visually "wrap" the
  // operator block (background tint + border) while the diagonal index stays
  // at its declared position (typically 0). Geometry is unchanged; downstream
  // layout math, validation, and visibility computations keep treating the
  // coordinator as one task — only the rendering changes.
  const cornerWrappingTaskIndices = new Set();
  const externalTaskIndices = new Set();
  for (let i = 0; i < n; i++) {
    const rid = matrix.tasks[i].region;
    const region = groupById[rid];
    if (!region) continue;
    if (region.layoutKind === "corner-wrapping") cornerWrappingTaskIndices.add(i);
    if (region.layoutKind === "external-cell") externalTaskIndices.add(i);
  }

  const gridEl = document.createElement("div");
  gridEl.className = "tsm-grid";
  if (cornerWrappingTaskIndices.size > 0) gridEl.classList.add("has-corner-wrapping");
  if (externalTaskIndices.size > 0) gridEl.classList.add("has-external-cell");
  gridEl.style.gridTemplateColumns = `repeat(${n}, minmax(0, 1fr))`;
  gridEl.style.gridTemplateRows = `repeat(${n}, minmax(0, 1fr))`;

  for (const cell of cells) {
    const el = document.createElement("div");
    el.className = "cell";
    el.dataset.row = String(cell.row);
    el.dataset.col = String(cell.col);

    // Corner-wrapping: tag every cell in the coordinator's row or column.
    // The anchor (diagonal) cell gets a third class so CSS can elevate it.
    if (cornerWrappingTaskIndices.has(cell.row)) el.classList.add("corner-wrap-row");
    if (cornerWrappingTaskIndices.has(cell.col)) el.classList.add("corner-wrap-col");
    if (cell.kind === "diagonal" && cornerWrappingTaskIndices.has(cell.row)) {
      el.classList.add("corner-wrap-anchor");
    }

    // External-cell: tag the row + column the external task sits on so CSS
    // can de-emphasize them as "outside the firm boundary".
    if (externalTaskIndices.has(cell.row) && cell.kind !== "diagonal") el.classList.add("external-row");
    if (externalTaskIndices.has(cell.col) && cell.kind !== "diagonal") el.classList.add("external-col");

    if (cell.kind === "diagonal") {
      el.classList.add("diagonal");
      el.dataset.taskId = cell.task.id;
      const group = groupById[cell.task.region];
      if (externalTaskIndices.has(cell.row)) el.classList.add("external-actor");
      if (group) el.style.background = group.color;
      const fullName = group ? `${group.label}: ${cell.task.label}` : cell.task.label;
      // data-fullname drives a styled CSS hover tooltip (.cell.diagonal
      // [data-fullname], styles/matrix.css) — it replaces the native title=,
      // whose ~500ms OS delay clashed with the instant spotlight (the "finicky"
      // two-speed feel). aria-label drives the screen-reader announcement when
      // the visible text is a category shortLabel ("agent", "MCP") rather than
      // the specific identity; SRs prefer it over the visible text.
      el.dataset.fullname = fullName;
      el.setAttribute("aria-label", fullName);
      // Display label resolution lives in main.js's displayLabelFor adapter
      // so theme- or category-driven overrides can land there without
      // touching the renderer.
      const display = displayLabelFor(cell.task);
      // Wrap display label in a span so flex + text-overflow: ellipsis works
      // for matrices where even the short label exceeds the cell width.
      const labelEl = document.createElement("span");
      labelEl.className = "diagonal-label";
      labelEl.textContent = display;
      el.appendChild(labelEl);
    } else if (cell.kind === "transfer") {
      el.classList.add("transfer", "hidden");
      if (cell.transfer.direction === "forward") {
        el.classList.add("forward");
        el.textContent = "→";
      } else {
        el.classList.add("backward");
        el.textContent = "↑";
      }
      if (cell.transfer.cross) {
        el.classList.add("cross");
      }
      // No hover tooltip on transfer marks: they carry no spotlight highlight, so
      // a lone ~500ms native tooltip on an off-diagonal mark was noise. From/to
      // reads positionally (row = from, col = to); labeled arrows carry their own
      // floating .tsm-arrow-label.
    }
    gridEl.appendChild(el);
  }

  container.appendChild(gridEl);

  /**
   * Measure the rendered grid and publish the cell pixel size as a CSS
   * variable on the wrapper. styles/matrix.css uses this in clamp()
   * formulas to scale typography fluidly. Owned by matrix.js (not
   * overlays.js) so non-overlay scenes still get typography sizing —
   * overlays are an optional decoration; cell measurement is intrinsic
   * to the matrix.
   */
  function measure() {
    const rect = gridEl.getBoundingClientRect();
    if (rect.width > 0) {
      container.style.setProperty("--cell-size", `${rect.width / n}px`);
    }
  }
  // Eager publish. NOTE: the app's viewport cap (styles/matrix.css) settles the
  // grid's size over several async layout passes (it's briefly 0-width), so this
  // first rAF can capture the pre-cap width — that's expected. main.js re-runs
  // the full measure+redraw once the layout settles (post-mount timeout +
  // fonts.ready) and on every resize, which re-lands --cell-size AND the
  // overlay/arrow geometry together. Embeds aren't capped, so the eager rAF is
  // all they need; keeping the single trigger here avoids a leaky per-matrix
  // ResizeObserver (the settle is owned in one place, in main.js).
  requestAnimationFrame(measure);

  /**
   * Apply a reveal to the matrix. Mutates cell classes.
   *
   * Consumes v0.3 reveal-token arrays directly (e.g.
   * ["diagonal", "transfer:directed:forward"]). Token → effect resolution
   * lives in render/reveal.js — this function only consumes the resolved
   * boolean flags (`showForward`, `showBackward`, `highlightCross`) and
   * translates them into DOM class mutations. Overlay visibility uses the
   * same dispatcher via overlays.applyReveal(tokens).
   *
   * @param {string[]} tokens
   */
  function applyReveal(tokens) {
    const { showForward, showBackward, highlightCross } = resolveReveal(tokens);
    const forwardCells = gridEl.querySelectorAll(".cell.transfer.forward");
    const backwardCells = gridEl.querySelectorAll(".cell.transfer.backward");
    const transferCells = gridEl.querySelectorAll(".cell.transfer");
    const crossCells = gridEl.querySelectorAll(".cell.transfer.cross");
    transferCells.forEach((c) => c.classList.add("hidden"));
    crossCells.forEach((c) => c.classList.remove("highlighted"));
    if (showForward) forwardCells.forEach((c) => c.classList.remove("hidden"));
    if (showBackward) backwardCells.forEach((c) => c.classList.remove("hidden"));
    if (highlightCross) crossCells.forEach((c) => c.classList.add("highlighted"));
  }

  return { gridEl, applyReveal, grid, measure };
}

/**
 * Resolve the per-matrix header label. Used to render `.tsm-matrix-header`
 * between the scene source paragraph and the grid.
 *
 * Priority:
 *   1. First firm-boundary overlay's `.label` (matrix-identity)
 *   2. First region with layoutKind === "diagonal-block" or "corner-wrapping"
 *      that carries a non-empty `.label`
 *
 * Returns the resolved string, or "" when no useful label exists.
 *
 * Exported for unit tests.
 */
export function resolveMatrixHeaderLabel(matrix) {
  if (!matrix) return "";
  const overlays = matrix.overlays ?? [];
  for (const overlay of overlays) {
    if (overlay?.kind === "firm-boundary" && typeof overlay.label === "string" && overlay.label.trim() !== "") {
      return overlay.label;
    }
  }
  const regions = matrix.regions ?? [];
  for (const region of regions) {
    if (
      (region?.layoutKind === "diagonal-block" || region?.layoutKind === "corner-wrapping") &&
      typeof region.label === "string" &&
      region.label.trim() !== ""
    ) {
      return region.label;
    }
  }
  return "";
}
