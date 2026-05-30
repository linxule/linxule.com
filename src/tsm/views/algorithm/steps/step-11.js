// Algorithm view — Step 11 renderer.
//
// Step 11: "A proper TSM." Closes the loop. The dependency dump from Step 3
// is now a clean Baldwin-style TSM, or multiple linked TSMs when the source
// observation declared matrix boundaries. The viewer reads the *same* data
// Step 3 showed, but the algorithm's reordering has made the structure
// legible.
//
// Plus: an "Export as scene.json" button that downloads the derived
// tsm-scene as a standalone JSON file. The derived scene is computed once
// at mount time and threaded through ctx.derivedScene by
// views/algorithm/index.js.
//
// Placement contract: cell-by-cell rendering delegates to computeGrid()
// from core/layout.js — the same authority the canonical mountTSM uses.
// A transfer from X (supplier) to Y (receiver) lands at row=Y, col=X:
// reading down a column tells you "what this task supplies"; reading
// across a row tells you "what this task receives". Hand-rolling that
// placement is forbidden — see reviews/2026-05-27-v1.6.3-precycle-codex-
// audit.md §2 for the prior bug (Step 11 used to transpose). Direction
// (forward/backward) is computed from grid position because the derived
// scene from core/synthesis/derive.js is not run through scene-adapter
// before Step 11 sees it.

import { computeGrid } from "../../../core/layout.js";
import { decorateScene } from "../../../core/scene-adapter.js";
import { mountAllMatrices } from "../../../main.js";

const REGION_ORDER = ["shared", "core", "control", "peripheral"];
const REGION_LABELS = {
  shared: "Shared",
  core: "Core",
  control: "Control",
  peripheral: "Periphery",
  task: "Task",
};

/**
 * @param {{
 *   stageEl: HTMLElement,
 *   nodes: Array,
 *   derivedScene: object,
 *   shortCodes?: Object<string, string>,
 * }} ctx
 */
export function renderStep11({ stageEl, derivedScene, shortCodes }) {
  if ((derivedScene.matrices?.length ?? 0) > 1) {
    return renderMultiMatrixStep11({ stageEl, derivedScene, shortCodes });
  }

  return renderSingleMatrixStep11({ stageEl, derivedScene, shortCodes });
}

/**
 * Return a display copy of a multi-matrix scene whose every task.shortLabel is
 * the ctx code (observation order), so the canonical renderer's diagonal cells
 * read the SAME codes as every earlier step and the decode key. Without this,
 * mountAllMatrices renders derive.js's own sorted-order shortLabels — which, on
 * the canonical upstream-downstream-derive (Fig 18.1) fixture, permute against
 * the observation-order decode key (the key says U1, the cell shows U2). The
 * original scene is left untouched so the export carries derive's canonical
 * codes. Shallow-clones matrices + tasks; nothing else is copied.
 */
function withDisplayCodes(scene, shortCodes) {
  if (!shortCodes) return scene;
  return {
    ...scene,
    matrices: (scene.matrices ?? []).map((matrix) => ({
      ...matrix,
      tasks: (matrix.tasks ?? []).map((task) => ({
        ...task,
        shortLabel: shortCodes[task.id] || task.shortLabel,
      })),
    })),
  };
}

function renderSingleMatrixStep11({ stageEl, derivedScene, shortCodes }) {
  const matrix = derivedScene.matrices[0];
  const tasks = matrix.tasks;
  const regions = matrix.regions ?? [];
  const n = tasks.length;

  const root = document.createElement("div");
  root.className = "algorithm-step-content algorithm-final-tsm";
  root.dataset.step = "11";
  root.dataset.size = String(n);
  root.dataset.architectureType = matrix.architectureType;
  root.dataset.order = tasks.map((t) => t.id).join(",");

  // --- Region label strip (left side; mirrors Baldwin-style region bands) --
  const regionStrip = document.createElement("div");
  regionStrip.className = "algorithm-final-tsm-regions";
  if (regionStrip.style) {
    regionStrip.style.display = "flex";
    regionStrip.style.flexWrap = "wrap";
    regionStrip.style.gap = "0.35rem";
    regionStrip.style.marginBottom = "0.5rem";
    regionStrip.style.fontSize = "0.85em";
  }

  // Emit one band per region that's actually populated by the partition
  // (matrix.regions is built from regionsPresent in derive.js). Order by
  // canonical four-square sequence so the strip reads top-down even if the
  // synthesis plugin emits them in another order.
  const regionsById = Object.fromEntries(regions.map((r) => [r.id, r]));
  const regionMembersById = {};
  for (const t of tasks) {
    (regionMembersById[t.region] ??= []).push(t.id);
  }
  const renderedRegionIds = [];
  for (const id of [...REGION_ORDER, "task"]) {
    if (!regionsById[id]) continue;
    renderedRegionIds.push(id);
    const r = regionsById[id];
    const members = regionMembersById[id] ?? [];
    const band = document.createElement("span");
    band.className = "algorithm-final-tsm-region-band";
    band.dataset.region = id;
    band.dataset.size = String(members.length);
    band.textContent = `${REGION_LABELS[id] ?? r.label ?? id} (${members.length})`;
    regionStrip.appendChild(band);
  }
  root.appendChild(regionStrip);

  // --- The TSM grid -------------------------------------------------------
  // Delegate placement to the canonical layout authority. computeGrid()
  // emits one cell per (row, col): row=receiver (transfer.to), col=supplier
  // (transfer.from). Step 11 just translates each cell into a DOM node with
  // the algorithm-view-specific classes + datasets.
  const layout = computeGrid(matrix);

  const grid = document.createElement("div");
  grid.className = "algorithm-final-tsm-grid";
  grid.dataset.step = "11";
  grid.dataset.size = String(n);
  if (grid.style) {
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${n}, minmax(0, 1fr))`;
    grid.style.gridTemplateRows = `repeat(${n}, minmax(0, 1fr))`;
  }

  for (const layoutCell of layout.cells) {
    const { row: r, col: c, kind } = layoutCell;
    const cell = document.createElement("div");
    cell.className = "algorithm-final-tsm-cell";
    cell.dataset.row = String(r);
    cell.dataset.col = String(c);
    const rowTask = tasks[r];
    const colTask = tasks[c];
    cell.dataset.rowRegion = rowTask.region;
    cell.dataset.colRegion = colTask.region;
    if (kind === "diagonal") {
      cell.classList.add("diagonal");
      cell.classList.add(`region-${rowTask.region}`);
      cell.dataset.region = rowTask.region;
      cell.dataset.id = rowTask.id;
      // SPEC-LENSES §6: Stage 2b's derive.js stamps rendering.emphasis +
      // rendering.lens on the derived scene's tasks/transfers. Surface
      // those attributes when present so the rendered v0.4 matrix tracks
      // the spec contract.
      const taskEmphasis = rowTask.rendering?.emphasis;
      if (taskEmphasis) cell.dataset.emphasis = taskEmphasis;
      const taskLens = rowTask.rendering?.lens;
      if (Array.isArray(taskLens) && taskLens.length > 0) {
        cell.dataset.lens = taskLens.join(",");
      } else if (typeof taskLens === "string") {
        cell.dataset.lens = taskLens;
      }
      // Same ctx code as Steps 3-9 + the decode key (observation-order, so the
      // component a reader tracked through the chaos keeps its code in the Core).
      // The derived scene's own task.shortLabel (sorted-order seq) still rides in
      // the exported JSON — a download-only detail, never on screen here.
      cell.textContent = shortCodes?.[rowTask.id] || rowTask.shortLabel || rowTask.label || rowTask.id;
      cell.title = rowTask.label || rowTask.id;
    } else if (kind === "transfer") {
      const tr = layoutCell.transfer;
      // Direction is derived from grid position (col=fromIdx, row=toIdx)
      // because deriveSceneFromObservation does not run the result through
      // scene-adapter; transfers reach Step 11 without a `direction` field.
      // Equivalent to scene-adapter.decorateMatrix: fromIdx<toIdx ⇒ forward.
      const direction = c < r ? "forward" : "backward";
      const cross = layoutCell.fromTask.region !== layoutCell.toTask.region;
      cell.classList.add("transfer");
      cell.classList.add(direction);
      if (cross) cell.classList.add("cross");
      cell.dataset.direction = direction;
      cell.dataset.from = tr.from;
      cell.dataset.to = tr.to;
      const emphasis = tr.rendering?.emphasis;
      if (emphasis) cell.dataset.emphasis = emphasis;
      const lens = tr.rendering?.lens;
      if (Array.isArray(lens) && lens.length > 0) {
        cell.dataset.lens = lens.join(",");
      } else if (typeof lens === "string") {
        cell.dataset.lens = lens;
      }
      cell.textContent = direction === "forward" ? "→" : "↑";
    }
    grid.appendChild(cell);
  }
  root.appendChild(grid);

  // --- Export button + status --------------------------------------------
  const exportRow = document.createElement("div");
  exportRow.className = "algorithm-export-row";
  if (exportRow.style) {
    exportRow.style.display = "flex";
    exportRow.style.alignItems = "center";
    exportRow.style.gap = "0.6rem";
    exportRow.style.marginTop = "0.75rem";
  }

  const exportBtn = document.createElement("button");
  exportBtn.type = "button";
  exportBtn.className = "algorithm-export-btn";
  exportBtn.textContent = "Export as scene.json";
  exportRow.appendChild(exportBtn);

  const statusEl = document.createElement("span");
  statusEl.className = "algorithm-export-status";
  statusEl.dataset.state = "idle";
  if (statusEl.style) {
    statusEl.style.fontSize = "0.85em";
    statusEl.style.opacity = "0.75";
  }
  exportRow.appendChild(statusEl);

  // Filename: <observation.id>-derived.json. The derived scene's id is
  // already `<observation.id>-derived` (see core/synthesis/derive.js), so
  // we strip the trailing "-derived" only when present and add ".json".
  const baseId = derivedScene.id?.endsWith("-derived")
    ? derivedScene.id.slice(0, -"-derived".length)
    : derivedScene.id || "system";
  const filename = `${baseId || "system"}-derived.json`;

  exportBtn.addEventListener?.("click", () => exportSceneAsJson(derivedScene, filename, statusEl));

  root.appendChild(exportRow);

  stageEl.appendChild(root);
}

function renderMultiMatrixStep11({ stageEl, derivedScene, shortCodes }) {
  const matrices = derivedScene.matrices ?? [];
  const totalTasks = matrices.reduce((sum, matrix) => sum + (matrix.tasks?.length ?? 0), 0);

  const root = document.createElement("div");
  root.className = "algorithm-step-content algorithm-final-tsm algorithm-final-tsm-multi";
  root.dataset.step = "11";
  root.dataset.size = String(totalTasks);
  root.dataset.matrixCount = String(matrices.length);
  root.dataset.crossArrowCount = String(derivedScene.arrows?.length ?? 0);
  root.dataset.splitModel = derivedScene.provenance?.splitModel ?? "";
  root.dataset.order = matrices.map((matrix) => matrix.tasks.map((t) => t.id).join(",")).join(" | ");

  const summary = document.createElement("div");
  summary.className = "algorithm-final-tsm-summary";
  summary.textContent =
    `${matrices.length} linked matrices; ${derivedScene.arrows?.length ?? 0} cross-matrix arrows.`;
  if (summary.style) {
    summary.style.marginBottom = "0.5rem";
    summary.style.fontSize = "0.85em";
    summary.style.opacity = "0.8";
  }
  root.appendChild(summary);

  const host = document.createElement("div");
  host.className = "algorithm-final-tsm-multi-host";
  root.appendChild(host);

  // Render with ctx codes (so the cells match the decode key); export keeps the
  // original scene's derive-time codes.
  const controller = mountAllMatrices(host, decorateScene(withDisplayCodes(derivedScene, shortCodes)), {
    enableExplore: false,
  });

  appendExportRow(root, derivedScene);
  stageEl.appendChild(root);

  return () => controller.destroy();
}

function appendExportRow(root, derivedScene) {
  // --- Export button + status --------------------------------------------
  const exportRow = document.createElement("div");
  exportRow.className = "algorithm-export-row";
  if (exportRow.style) {
    exportRow.style.display = "flex";
    exportRow.style.alignItems = "center";
    exportRow.style.gap = "0.6rem";
    exportRow.style.marginTop = "0.75rem";
  }

  const exportBtn = document.createElement("button");
  exportBtn.type = "button";
  exportBtn.className = "algorithm-export-btn";
  exportBtn.textContent = "Export as scene.json";
  exportRow.appendChild(exportBtn);

  const statusEl = document.createElement("span");
  statusEl.className = "algorithm-export-status";
  statusEl.dataset.state = "idle";
  if (statusEl.style) {
    statusEl.style.fontSize = "0.85em";
    statusEl.style.opacity = "0.75";
  }
  exportRow.appendChild(statusEl);

  // Filename: <observation.id>-derived.json. The derived scene's id is
  // already `<observation.id>-derived` (see core/synthesis/derive.js), so
  // we strip the trailing "-derived" only when present and add ".json".
  const baseId = derivedScene.id?.endsWith("-derived")
    ? derivedScene.id.slice(0, -"-derived".length)
    : derivedScene.id || "system";
  const filename = `${baseId || "system"}-derived.json`;

  exportBtn.addEventListener?.("click", () => exportSceneAsJson(derivedScene, filename, statusEl));

  root.appendChild(exportRow);
}

function exportSceneAsJson(scene, filename, statusEl) {
  const json = JSON.stringify(scene, null, 2);
  try {
    // Browser path: Blob + object URL + synthetic <a download>.
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    // Track the blob payload + url on the button's status element so tests
    // and devtools can introspect the most recent export without needing to
    // mock URL.revokeObjectURL.
    statusEl.dataset.lastFilename = filename;
    statusEl.dataset.lastPayload = json;
    statusEl.dataset.state = "exported";
    statusEl.textContent = `Saved as ${filename}`;
    if (typeof link.click === "function") link.click();
    if (typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
      // Defer revoke so the synthetic click has time to commit the download
      // — irrelevant in shim land (no real download) but harmless.
      setTimeout?.(() => URL.revokeObjectURL(url), 0);
    }
  } catch (err) {
    statusEl.dataset.state = "error";
    statusEl.textContent = `Export failed: ${err.message ?? err}`;
  }
}
