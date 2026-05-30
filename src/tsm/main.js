// Public API for the TSM renderer surface.
//
// Exports:
//   - mountTSM(element, scene, options) — primary entry point. Renders ONE
//     matrix of a scene into an element and returns a walkthrough controller.
//     Single-matrix scenes and callers that explicitly want one matrix
//     (the `<tsm-scene>` embed, snapshot tests, app.js's single-matrix
//     branch) keep this entry point.
//   - mountAllMatrices(element, scene, options) — multi-matrix host. Mounts
//     EVERY matrix in `scene.matrices` side-by-side under a single parent
//     element and draws cross-matrix arrows in the gap between them.
//     Returns the same controller shape as mountTSM so callers can branch
//     on `scene.matrices.length > 1` and swap entry points without changing
//     the surrounding plumbing.
//   - displayLabelFor(task) — presentation adapter the renderer uses to
//     resolve a task's diagonal label. Centralizes the
//     "shortLabel?.trim() || label" rule so the resolution can evolve
//     (e.g. theme-driven category mapping) without renderer edits.
//
// Future agentic producers (per ARCHITECTURE.md v0.3 Path B) write JSON
// files that get loaded and passed to mountTSM — the renderer never knows
// whether the scene was authored or algorithmically derived.

import { renderMatrix } from "./render/matrix.js";
import { renderOverlays } from "./render/overlays.js";
import { renderAnnotations } from "./render/annotations.js";
import { renderArrows } from "./render/arrows.js";
import { renderCrossMatrixArrows } from "./render/cross-matrix-arrows.js";
import { renderTaskLegend } from "./render/legend.js";
import { createHoverSpotlight } from "./render/hover-spotlight.js";
import { createExploreDisclosure } from "./render/explore-disclosure.js";
import { resolveNarrative } from "./core/scene-adapter.js";
import { createWalkthrough } from "./views/walkthrough.js";

// Re-export so external pages that build their own multi-matrix host
// (tests, future embed flavors) can draw cross-matrix arrows directly.
// `mountAllMatrices` is the in-tree consumer; the re-export covers callers
// that want a different orchestration shape.
export { renderCrossMatrixArrows } from "./render/cross-matrix-arrows.js";

/**
 * Resolve a task's display label for the matrix diagonal.
 *
 * Today the rule is: trimmed `shortLabel` (if non-empty) → `label`.
 * Keeping this behind an adapter lets future changes (theme-driven
 * category mapping, locale-specific overrides) land here without
 * touching render/matrix.js.
 *
 * @param {{label: string, shortLabel?: string}} task
 * @returns {string}
 */
export function displayLabelFor(task) {
  const short = task.shortLabel?.trim();
  return short || task.label;
}

/**
 * Mount ONE matrix of a scene into a given parent element. Internal helper
 * shared by `mountTSM` (single-matrix) and `mountAllMatrices` (multi-matrix).
 *
 * Returns the renderer parts (`matrix`, `overlays`, `annotations`, `arrows`)
 * plus a `matrixHandle` ready for inclusion in the cross-matrix-arrows
 * matrices array. Does NOT mount the cross-arrows layer or the task legend
 * — those are owned by the caller because their site differs between the
 * two mount modes (single: same wrapper; multi: parent of all sub-wrappers).
 *
 * @param {HTMLElement} parentEl — sub-wrapper to render into (its contents are replaced)
 * @param {object} scene — decorated v0.3 tsm-scene
 * @param {number} matrixIndex
 * @returns {{ matrix, overlays, annotations, arrows, sceneMatrix, matrixHandle, measureAndRedraw }}
 */
function mountMatrixInto(parentEl, scene, matrixIndex) {
  const sceneMatrix = scene?.matrices?.[matrixIndex];
  if (!sceneMatrix) {
    throw new Error(`mountMatrixInto: scene has no matrix at index ${matrixIndex}`);
  }
  if (sceneMatrix.transfers?.length && sceneMatrix.transfers[0].direction === undefined) {
    throw new Error(
      "mountMatrixInto: scene appears undecorated; call decorateScene() before mounting."
    );
  }

  parentEl.innerHTML = "";

  const overlayRegionIds = (sceneMatrix.overlays ?? [])
    .filter((o) => o.kind === "module-border")
    .map((o) => o.regionId);
  const firmBoundaries = (sceneMatrix.overlays ?? []).filter(
    (o) => o.kind === "firm-boundary",
  );
  // Per-region emphasis + lens declarations resolved from each module-border
  // overlay's `rendering` block. Feeds renderOverlays so each .module-overlay
  // element carries data-emphasis / data-lens / data-label-style at render
  // time. v1.6.4 D5.3 added the labelStyle directive (orthogonal to lens).
  const overlayDecls = new Map();
  for (const ov of sceneMatrix.overlays ?? []) {
    if (ov.kind !== "module-border" || !ov.regionId) continue;
    overlayDecls.set(ov.regionId, {
      emphasis: ov.rendering?.emphasis,
      lens: ov.rendering?.lens,
      labelStyle: ov.rendering?.labelStyle,
    });
  }

  const matrix = renderMatrix(parentEl, scene, matrixIndex);
  const overlays = renderOverlays(parentEl, matrix.gridEl, matrix.grid, {
    overlayRegionIds,
    firmBoundaries,
    tasks: sceneMatrix.tasks,
    overlayDecls,
  });
  const annotations = renderAnnotations(parentEl, matrix.gridEl, matrix.grid, sceneMatrix);
  const arrows = renderArrows(parentEl, matrix.gridEl, matrix.grid, sceneMatrix);
  annotations.redraw();
  arrows.redraw();

  const matrixHandle = {
    gridEl: matrix.gridEl,
    grid: matrix.grid,
    sceneMatrix,
  };

  // Per-matrix re-measure helper. The orchestrator calls this on resize
  // before redrawing the cross-matrix overlay so individual matrix
  // geometry is settled before the SVG that spans them recomputes.
  function measureAndRedraw() {
    matrix.measure();
    overlays.redraw();
    annotations.redraw();
    arrows.redraw();
  }

  return { matrix, overlays, annotations, arrows, sceneMatrix, matrixHandle, measureAndRedraw };
}

/**
 * Per-matrix emphasis fan-out adapter (v1.6.3 — Round-3 Fix 1, Path B).
 *
 * Wraps an array of matrix-renderer instances behind the single
 * `applyEmphasis({overrides|overridesByMatrix, ...})` shape that the
 * walkthrough + Explore disclosure expect. Routes by payload shape:
 *
 *   - `overridesByMatrix: Map<matrixIdx, Map<key, tier>>` → per-matrix
 *     dispatch. Each renderer receives ONLY its slice — matrix 0's
 *     overrides never reach matrix 1's DOM. The walkthrough emits this
 *     shape so matrix-local keys (annotation indices, transfers/overlays
 *     whose ids may collide across matrices) stay scoped.
 *
 *   - Broadcast (no overrides at all) → every renderer receives the same
 *     `{ showAll, reset, layer, ... }` payload. Used by showAll-only and
 *     reset-only calls from pushShowAll / pushFilter's null branch.
 *     v1.6.5 Wave 1 (W2A-D2-CF-2, SPEC §7.6 v0.3.12) — a producer that
 *     emits plain `overrides:` (non-null) without the per-matrix wrapper
 *     against a multi-matrix fan-out now throws a TypeError naming SPEC
 *     §7.6: broadcasting overrides cross-leaks matrix-local keys between
 *     sibling matrices (exactly the collision risk D2 closed). The
 *     per-matrix dispatch is the only sanctioned override-write path;
 *     broadcast (no overrides) for showAll/reset-only calls is still
 *     supported. Closes Codex's precycle adversarial #2.
 *
 * Pre-v1.6.3 these adapters were anonymous inline object literals in
 * `mountAllMatrices`. Pulling them into a named factory (a) gives stack
 * traces a recognizable callsite and (b) makes the per-matrix vs
 * broadcast contract testable in isolation. Closes the Claude audit's
 * adversarial pickup #4.
 *
 * @param {Array<{matrix, overlays, annotations, arrows}>} matrixParts
 * @param {"arrows"|"overlays"|"annotations"} slot
 * @returns {{ applyEmphasis(args): void }}
 */
function createPerMatrixEmphasisFanOut(matrixParts, slot) {
  return {
    applyEmphasis(args = {}) {
      const { overridesByMatrix, overrides, ...rest } = args;
      if (overridesByMatrix instanceof Map) {
        // Per-matrix dispatch — each renderer gets ONLY its slice. A
        // matrix the producer's diff didn't touch receives an empty Map
        // (pre-seeded by resolveEmphasisDiff for walkthrough; by
        // buildLensFilter for Explore) so the layer is still reset
        // cleanly. v1.6.4 D2: this branch now serves BOTH the walkthrough
        // and the Explore disclosure — they share the per-matrix shape so
        // matrix-local keys never cross-leak between sibling matrices'
        // renderers.
        for (let i = 0; i < matrixParts.length; i++) {
          const slice = overridesByMatrix.get(i);
          matrixParts[i]?.[slot]?.applyEmphasis?.({ ...rest, overrides: slice });
        }
      } else {
        // Broadcast — every renderer receives the same payload. Used by
        // showAll-only / reset-only calls (no overrides at all) that
        // legitimately fan out the same payload to every renderer
        // (`{ showAll, reset, layer:"explore" }` from pushShowAll and
        // pushFilter's null branch).
        //
        // v1.6.5 Wave 1 (W2A-D2-CF-2) — runtime guard: if a producer emits
        // plain `overrides:` against a multi-matrix fan-out without the
        // per-matrix wrapper, broadcasting would send the same Map to every
        // renderer — exactly the cross-matrix key collision risk that D2
        // closed for the legitimate paths. SPEC §7.6 v0.3.13 makes the
        // per-matrix dispatch the only sanctioned override-write path; this
        // throw enforces that contract at runtime. Codex's precycle
        // adversarial #2 named this as the failure mode that loses §7.6
        // enforcement once D2 made per-matrix dispatch the only path.
        // ShowAll-only / reset-only calls (overrides === undefined) still
        // broadcast cleanly.
        //
        // r-2 refinement (Codex r-1 P2): an EMPTY Map carries zero override
        // entries and cannot cross-leak any matrix-local key — guarding it
        // is a false positive that would block legitimate reset+empty-map
        // producer shapes. The predicate now treats an empty Map as a
        // no-op write that broadcasts cleanly. Non-empty Map and other
        // non-null override values (plain objects, arrays) still throw —
        // those are either real cross-leak risks or malformed shapes.
        const isEmptyMap = overrides instanceof Map && overrides.size === 0;
        if (overrides != null && !isEmptyMap && !(overridesByMatrix instanceof Map)) {
          throw new TypeError(
            "createPerMatrixEmphasisFanOut: plain `overrides:` is not a " +
            "sanctioned write shape against a multi-matrix fan-out " +
            "(see SPEC-LENSES §7.6 v0.3.13). Producers must emit " +
            "`overridesByMatrix: Map<matrixIdx, Map<key, tier>>` so each " +
            "renderer receives only its own slice; broadcasting overrides " +
            "would cross-leak matrix-local keys between sibling matrices. " +
            "Broadcast (no overrides or empty Map) for showAll/reset-only " +
            "calls remains supported.",
          );
        }
        for (const p of matrixParts) p[slot]?.applyEmphasis?.({ ...rest, overrides });
      }
    },
  };
}

/**
 * Single-matrix emphasis adapter (v1.6.3 — Round-3 Fix 1, Path B).
 *
 * The walkthrough always emits `overridesByMatrix: Map<localIdx, Map>` —
 * even in single-mount where it iterates a one-element matrices array.
 * In single-mount the renderer is just one instance, not an array, so
 * this adapter strips the per-matrix wrapper and forwards
 * `overridesByMatrix.get(matrixIndex)` as plain `overrides`.
 *
 * Broadcast payloads (`overrides` with no `overridesByMatrix`) pass
 * through unchanged so Explore + showAll-only paths continue to work.
 *
 * @param {{applyEmphasis(args): void}} renderer
 * @param {{matrixIndex?: number}} [options]
 * @param {number} [options.matrixIndex=0] local matrix index to unwrap from
 * `overridesByMatrix`; defaults to today's single-mount index while keeping
 * derived single-slot mounts forward-compatible.
 * @returns {{ applyEmphasis(args): void }}
 */
function createSingleMatrixEmphasisAdapter(renderer, { matrixIndex = 0 } = {}) {
  return {
    applyEmphasis(args = {}) {
      const { overridesByMatrix, overrides, ...rest } = args;
      if (overridesByMatrix instanceof Map) {
        renderer?.applyEmphasis?.({ ...rest, overrides: overridesByMatrix.get(matrixIndex) });
      } else {
        renderer?.applyEmphasis?.({ ...rest, overrides });
      }
    },
  };
}

// Internal exports for unit-test access. Not re-exported through the
// package surface — these are an implementation detail.
export const __test__ = {
  createPerMatrixEmphasisFanOut,
  createSingleMatrixEmphasisAdapter,
};

function getLegendPill(legend, taskId) {
  return legend?.pillByTaskId?.get?.(taskId) ?? null;
}

function clearLegendSpotlightClasses(elements) {
  for (const el of elements) {
    el?.classList?.remove("spotlight-highlighted", "spotlight-partner");
  }
}

// Bidirectional legend↔cell spotlight. Two separate `createHoverSpotlight`
// instances — one scoped to the matrix wrapper (cell→pill highlighting), one
// scoped to the legend element (pill→cell highlighting). Each owns ONLY its
// own subtree, which keeps the per-instance stamping model honest (v1.5.1
// Item 1) — neither instance walks across the gap to the other's targets.
//
// Why not a single multi-root spotlight: the v1.5.0 implementation built a
// synthetic `{ children: [wrapper, legend.legendEl] }` and relied on the
// component's tolerance of duck-typed wrappers. Per-instance stamping makes
// the two scopes trivially separable, so we drop the duck-typed wrapper in
// favor of two real spotlights.
function wireLegendCellSpotlight(wrapper, matrix, legend) {
  if (!legend?.legendEl) {
    return { destroy: () => {} };
  }

  const cellSpotlight = createHoverSpotlight(wrapper);
  const pillSpotlight = createHoverSpotlight(legend.legendEl);
  const pairedElements = new Set();
  const diagonalCells = matrix.gridEl.querySelectorAll?.(".cell.diagonal[data-task-id]") ?? [];

  for (const cellEl of diagonalCells) {
    const taskId = cellEl.dataset?.taskId;
    const pillEl = taskId ? getLegendPill(legend, taskId) : null;
    if (!pillEl) continue;

    pairedElements.add(cellEl);
    pairedElements.add(pillEl);
    // Pill→cell: hovering a legend pill outlines its diagonal cell via
    // .spotlight-partner. The pill spotlight is scoped to the legend
    // element; .spotlight-partner lands on the cell anyway because
    // classList stamping is per-element regardless of scope.
    pillSpotlight.register({
      anchor: pillEl,
      targets: [],
      group: "legend",
      partnerAnchors: [cellEl],
    });
    // Cell→pill: hovering a diagonal cell highlights its legend pill.
    cellSpotlight.register({
      anchor: cellEl,
      targets: [pillEl],
      group: "legend",
    });
  }

  return {
    destroy() {
      pillSpotlight.destroy();
      cellSpotlight.destroy();
      clearLegendSpotlightClasses(pairedElements);
    },
  };
}

/**
 * Mount a TSM scene into an element. Renders ONE matrix.
 *
 * @param {HTMLElement} element — container to render into (its contents are replaced)
 * @param {object} scene — v0.3 tsm-scene, already decorated by scene-adapter.js
 *   (callers — app.js, component.js, tests — own the decoration call so it
 *   runs exactly once per loaded scene; mountTSM trusts a decorated input.)
 * @param {object} [options]
 * @param {"walkthrough"|"static"} [options.view="walkthrough"] — mount the walkthrough controller
 * @param {(state) => void} [options.onChange] — fires when the walkthrough state changes
 * @param {number} [options.matrixIndex=0] — which matrix in scene.matrices to render.
 *   Decoration runs over every matrix; selection is per mount. Defaults to 0
 *   so single-matrix callers don't change.
 * @param {HTMLElement} [options.legendContainer] — optional mount point for the
 *   category-grouped task legend (derived scenes only).
 * @param {HTMLElement} [options.exploreContainer] — optional decoupled mount
 *   point for the Explore disclosure (defaults to `element`).
 * @returns {{ destroy, step, next, prev, restart, getState, setShowAllCrossArrows, setShowAllIntraArrows }}
 */
export function mountTSM(element, scene, options = {}) {
  const {
    view = "walkthrough",
    onChange,
    matrixIndex = 0,
    legendContainer,
    // Explore disclosure: Path A surface (SPEC-LENSES §7.2). Enabled by
    // default for the app's standard scene mounts; embeds that suppress
    // controls (`<tsm-scene controls="false">`) pass `explore: false` so
    // the corner button doesn't appear inside the chrome-free embed.
    explore: exploreEnabled = true,
    // Optional decoupled mount point for the Explore disclosure. The app passes
    // the page-toolbar container (#explore-mount) so the control sits above the
    // fold without living inside #tsm: an in-#tsm mount put it below the fold
    // AND coupled it to the arrow-layer rebuild (a top-of-#tsm mount flickers,
    // since arrows position at gridEl.offsetTop and redraw() rebuilds them).
    // Defaults to `element` (bottom of the matrix wrapper) for embeds, which
    // keep the legacy in-flow placement.
    exploreContainer = null,
    // v1.6.4 D5.2 — fires after Explore disclosure-driven emphasis writes
    // (chip click, chip-swap, Show All toggle, close-restore). The app.js
    // matrix-switcher uses this to refresh the "Show all (N)" labels
    // without having to subscribe to every renderer's onApply individually.
    onEmphasisChange,
  } = options;

  const parts = mountMatrixInto(element, scene, matrixIndex);
  const { matrix, overlays, annotations, arrows, sceneMatrix, matrixHandle, measureAndRedraw } = parts;

  // Cross-matrix arrows. mountTSM mounts ONE matrix per call, so the
  // matrices array passed to renderCrossMatrixArrows has the current
  // matrix in its slot and `undefined` for every other slot.
  //
  // For multi-matrix scenes mounted single-mount (the <tsm-scene> embed,
  // app.js's single-mount branch when a stale ?m= survives a scene
  // switch), every cross-arrow's other endpoint resolves to a missing
  // handle. The renderer's loud-non-fatal behavior would log a warn +
  // stamp an error placeholder for every such arrow — the exact noise
  // pattern that masked v1.2/v1.3 cross-arrows dormancy. Skip the layer
  // entirely in that case: embeds of multi-matrix scenes are intentionally
  // single-matrix today; cross-arrows belong to mountAllMatrices.
  //
  // Single-matrix scenes still get the renderer wired so scene-level arrows
  // declared against a single matrix (none today, but the schema allows it)
  // continue to draw.
  const isMultiMatrixScene = scene.matrices.length > 1;
  const matrixHandles = new Array(scene.matrices.length);
  matrixHandles[matrixIndex] = matrixHandle;
  const arrowsForRenderer = isMultiMatrixScene ? [] : scene.arrows;
  const crossArrows = renderCrossMatrixArrows(element, matrixHandles, arrowsForRenderer);
  crossArrows.redraw();

  // Task legend mounts into a caller-supplied container.
  let legend = { legendEl: null, destroy: () => {} };
  let legendSpotlight = { destroy: () => {} };
  if (legendContainer) {
    legendContainer.innerHTML = "";
    legend = renderTaskLegend(legendContainer, sceneMatrix);
    if (legend.legendEl) {
      legendContainer.appendChild(legend.legendEl);
      // Use matrix.gridEl.parentNode as the cell wrapper so single-mount
      // and multi-mount agree on the scope. For mountTSM the grid's
      // parent IS `element` today, but pinning to gridEl.parentNode keeps
      // both paths describing the same shape: "the cell containing this
      // matrix's grid". v1.5.1 Item 4.
      const cellWrapper = matrix.gridEl?.parentNode ?? element;
      legendSpotlight = wireLegendCellSpotlight(cellWrapper, matrix, legend);
    }
  }

  // Composite overlays wrapper — fans reveal tokens out to arrows +
  // crossArrows alongside the overlays themselves.
  const overlaysWithArrows = {
    ...overlays,
    applyReveal(tokens) {
      overlays.applyReveal(tokens);
      arrows.applyReveal(tokens);
      crossArrows.applyReveal(tokens);
    },
  };

  // Narrative resolution: matrix.narrative ?? scene.narrative ?? null.
  const narrative = resolveNarrative(scene, matrixIndex);

  let walkthrough = null;
  // v1.6.4 D5.2 — wrap the caller's onChange so step transitions also
  // refresh the Explore disclosure's Show All button label. The disclosure
  // is mounted below; declared up here as `let explore = null` so the
  // forward-reference closure resolves cleanly at call-time without a TDZ
  // (walkthrough.step(0) fires onChange synchronously before the disclosure
  // is created, and we want the early call to be a no-op rather than a
  // ReferenceError).
  let explore = { destroy() {}, refreshShowAllLabel() {} };
  function wrappedOnChange(state) {
    onChange?.(state);
    explore?.refreshShowAllLabel?.();
  }
  if (view === "walkthrough") {
    // The walkthrough now emits `overridesByMatrix: Map<localIdx, Map>`
    // for per-matrix slots (v1.6.3 Round-3 Fix 1). In single-mount there's
    // exactly one matrix at local index 0 — wrap each renderer in an
    // adapter that unwraps the Map and forwards the matrix's explicit
    // `matrixIndex` slice as the plain `overrides` the renderer expects. Cross-arrows are
    // scene-level and keep their unwrapped shape.
    walkthrough = createWalkthrough(matrix, overlaysWithArrows, narrative, {
      onChange: wrappedOnChange,
      emphasis: {
        matrix: sceneMatrix,
        sceneArrows: scene.arrows ?? [],
        arrows: createSingleMatrixEmphasisAdapter(arrows, { matrixIndex: 0 }),
        overlays: createSingleMatrixEmphasisAdapter(overlays, { matrixIndex: 0 }),
        annotations: createSingleMatrixEmphasisAdapter(annotations, { matrixIndex: 0 }),
        crossArrows,
      },
    });
    walkthrough.step(0);
  }

  // Explore disclosure — Path A surface. Per SPEC-LENSES §7.3 the algorithm
  // view (Path B) does NOT instantiate this; mountTSM is a Path A entry
  // point, so we mount the disclosure unless the caller suppressed it
  // (no-controls embed).
  //
  // v1.6.4 D1 (M-new-1) + D2: wrap each of the three per-matrix renderers
  // in the single-matrix adapter so the shape contract is symmetric across
  // both the walkthrough wiring (above) and the Explore wiring (here). As
  // of D2, Explore's pushFilter emits `overridesByMatrix: Map<matrixIdx, Map>`
  // (parallel to walkthrough); the adapter unwraps the matrix's explicit
  // `matrixIndex` slice and forwards the inner Map as plain `overrides`. Cross-arrows stays
  // raw — they're scene-level and never need the per-matrix adapter. D5.2
  // wires countHidden + onEmphasisChange so the Show All button's "Show
  // hidden (N)" label refreshes when Explore mutates state.
  if (exploreEnabled) {
    explore = createExploreDisclosure(exploreContainer ?? element, scene, {
      emphasis: {
        arrows: createSingleMatrixEmphasisAdapter(arrows, { matrixIndex: 0 }),
        overlays: createSingleMatrixEmphasisAdapter(overlays, { matrixIndex: 0 }),
        annotations: createSingleMatrixEmphasisAdapter(annotations, { matrixIndex: 0 }),
        crossArrows,
      },
      // v1.6.4 D5.2 — Explore Show All counts the union N across all four
      // surfaces in this single-mount's scope. The renderer DOM scans
      // clamp to 0 when effective showAll is ON so the button disables
      // when nothing would visibly change.
      countHidden: () =>
        (arrows.countHidden?.() ?? 0)
        + (overlays.countHidden?.() ?? 0)
        + (annotations.countHidden?.() ?? 0)
        + (crossArrows.countHidden?.() ?? 0),
      onEmphasisChange,
    });
    // Default-open in the app's rail mount (exploreContainer = #explore-mount):
    // the "Highlight patterns" lens strip should be visible, not buried behind a
    // closed toggle. Embeds (no exploreContainer) keep the closed default.
    // Lens-less scenes return an inert handle whose open() is a no-op.
    if (exploreContainer) explore.open?.();
  }

  function onResize() {
    measureAndRedraw();
    crossArrows.redraw();
    if (walkthrough) {
      const idx = walkthrough.getStepIndex();
      walkthrough.step(idx);
    }
  }
  window.addEventListener("resize", onResize);

  // The viewport cap (styles/matrix.css) settles the grid's size over SEVERAL
  // async layout passes — a fit-content wrapper around an aspect-ratio/max-height
  // grid is briefly 0-width — AFTER the initial rAFs that positioned the matrix,
  // overlays, and arrows. Re-run the resize path once the layout settles so BOTH
  // the typography (--cell-size) AND the overlay/arrow/annotation geometry re-land
  // against the final grid, not only on a later user resize. The timeout lands
  // after the settle the way a resize does; fonts.ready covers a late font swap.
  // (The cap is single-mount only, so this lives in mountTSM, not mountAllMatrices.)
  const settleTimer = setTimeout(onResize, 250);
  if (typeof document !== "undefined" && document.fonts?.ready) {
    document.fonts.ready.then(onResize);
  }

  return {
    destroy() {
      clearTimeout(settleTimer);
      window.removeEventListener("resize", onResize);
      overlays.destroy();
      annotations.destroy();
      arrows.destroy();
      crossArrows.destroy();
      legendSpotlight.destroy();
      legend.destroy();
      explore.destroy();
      element.innerHTML = "";
    },
    step(n) { walkthrough?.step(n); },
    next() { walkthrough?.next(); },
    prev() { walkthrough?.prev(); },
    restart() { walkthrough?.restart(); },
    /**
     * Toggle "show all transactions" mode for cross-matrix arrows. Returns
     * the new app-slot value (v1.6.4 D1 / L-new-1 — aria-pressed read-back).
     * @param {boolean} on
     * @returns {boolean}
     */
    setShowAllCrossArrows(on) {
      const result = crossArrows.setShowAll(on);
      // v1.6.4 D5.2 r-2 — matrix-switcher write to the app slot also flips
      // the Explore Show All label's N count (because effectiveShowAll is
      // OR-composed across layers, and N clamps to 0 when any layer's
      // showAll is ON within scope). Without this hook the matrix-switcher
      // click would refresh its own buttons but the Explore disclosure
      // label would silently drift until the next step or chip event.
      explore?.refreshShowAllLabel?.();
      return result;
    },
    /**
     * Toggle "show all arrows" mode for intra-matrix rendered arrows.
     * Returns the new app-slot value (v1.6.4 D1 / L-new-1).
     * @param {boolean} on
     * @returns {boolean}
     */
    setShowAllIntraArrows(on) {
      const result = arrows.setShowAllIntraArrows(on);
      explore?.refreshShowAllLabel?.();
      return result;
    },
    /**
     * Single-matrix mount has no concept of focus — only one matrix is
     * visible. No-op so callers that uniformly call focusMatrix on the
     * controller (e.g., the matrix-switcher wiring in app.js) don't have
     * to branch. The multi-matrix controller from mountAllMatrices owns
     * the meaningful implementation.
     */
    focusMatrix() {},
    /**
     * Count items currently revealed-but-secondary (data-emphasis="secondary"
     * AND `.visible` AND effective showAll OFF) within a named scope, for
     * the "Show all (N)" button label in app.js's matrix-switcher. v1.6.4
     * D5.2 (label renamed from "Show hidden (N)" in v0.4.2; the Explore
     * disclosure's own Show All button was removed in v0.4.1).
     *
     * Scopes:
     *   - "crossArrows": N for the matrix-switcher's "Show all transactions"
     *     button (cross-arrows are scene-level; one renderer total).
     *   - "intraArrows": N for the matrix-switcher's "Show all arrows"
     *     button (just this matrix; single-mount has only one).
     *   - "explore": N across ALL surfaces in this mount's Explore scope
     *     (arrows + overlays + annotations + crossArrows). Used by the
     *     Explore disclosure when it wants the controller-side count.
     *
     * @param {"crossArrows"|"intraArrows"|"explore"} scope
     * @returns {number}
     */
    countHidden(scope) {
      if (scope === "crossArrows") return crossArrows.countHidden?.() ?? 0;
      if (scope === "intraArrows") return arrows.countHidden?.() ?? 0;
      if (scope === "explore") {
        return (arrows.countHidden?.() ?? 0)
          + (overlays.countHidden?.() ?? 0)
          + (annotations.countHidden?.() ?? 0)
          + (crossArrows.countHidden?.() ?? 0);
      }
      return 0;
    },
    getState() {
      if (!walkthrough) return { view: "static" };
      return {
        view: "walkthrough",
        stepIndex: walkthrough.getStepIndex(),
        stepCount: walkthrough.getStepCount(),
        currentStep: walkthrough.getCurrentStep(),
      };
    },
  };
}

/**
 * Mount EVERY matrix in `scene.matrices` side-by-side under a single parent.
 *
 * Lays out one sub-wrapper per matrix (`.tsm-matrix-cell[data-matrix-index]`)
 * and mounts the matrix renderer into each. Cross-matrix arrows render once
 * on the parent element (their SVG overlay spans the gap between
 * sub-wrappers — see render/cross-matrix-arrows.js). The returned controller
 * has the same shape as mountTSM's so callers can swap entry points based on
 * `scene.matrices.length`.
 *
 * Walkthrough driver: uses the SCENE-level narrative (`scene.narrative`)
 * because the step semantics belong to the cross-matrix view as a whole.
 * Per-matrix `matrix.narrative` is ignored at the scene-walkthrough level
 * (drill-down via `focusMatrix` is a separate concern).
 *
 * @param {HTMLElement} element — parent container to render into
 * @param {object} scene — decorated v0.3 tsm-scene
 * @param {object} [options]
 * @param {(state) => void} [options.onChange]
 * @param {HTMLElement} [options.legendContainer] — optional legend mount
 *   point; the legend is rendered for matrix 0 (the focused matrix when
 *   none is focused) — a reasonable default for the Carliss-test case.
 * @param {HTMLElement} [options.exploreContainer] — optional decoupled mount
 *   point for the Explore disclosure (defaults to `element`).
 * @returns {{ destroy, step, next, prev, restart, getState, setShowAllCrossArrows, setShowAllIntraArrows, focusMatrix }}
 */
export function mountAllMatrices(element, scene, options = {}) {
  const {
    onChange,
    legendContainer,
    enableExplore = true,
    // Decoupled Explore mount — see mountTSM. The app passes #explore-mount
    // (page toolbar); defaults to `element` for embeds.
    exploreContainer = null,
    // v1.6.4 D5.2 — fires after Explore disclosure-driven emphasis writes.
    // app.js's matrix-switcher uses this to refresh the "Show all (N)"
    // labels without subscribing to every renderer's onApply individually.
    onEmphasisChange,
  } = options;

  if (!Array.isArray(scene?.matrices) || scene.matrices.length === 0) {
    throw new Error("mountAllMatrices: scene must have at least one matrix");
  }

  element.innerHTML = "";
  element.classList.add("multi-mount");

  // Build sub-wrappers — one per matrix — and mount each.
  const matrixParts = [];
  const cellEls = [];
  for (let i = 0; i < scene.matrices.length; i++) {
    const cell = document.createElement("div");
    cell.className = "tsm-matrix-cell";
    cell.dataset.matrixIndex = String(i);
    element.appendChild(cell);
    cellEls.push(cell);

    const parts = mountMatrixInto(cell, scene, i);
    matrixParts.push(parts);
  }

  // Build the full matrixHandles array — every slot populated, so
  // every declared scene.arrows[] resolves cleanly to drawable endpoints.
  const matrixHandles = matrixParts.map((p) => p.matrixHandle);
  const crossArrows = renderCrossMatrixArrows(element, matrixHandles, scene.arrows);
  crossArrows.redraw();

  // Task legend: render for matrix 0 by default (the natural "first"
  // matrix). Multi-matrix scenes today (Fig 4, Fig 18.1, multi-matrix-smoke)
  // are authored scenes without `task.category`, so the legend is a no-op;
  // the refresh path is here so derived multi-matrix scenes can rebind
  // spotlight hovers when focus mode switches matrices.
  let legend = { legendEl: null, destroy: () => {} };
  let legendSpotlight = { destroy: () => {} };
  function destroyLegend() {
    legendSpotlight.destroy();
    legend.destroy();
    legend = { legendEl: null, destroy: () => {} };
    legendSpotlight = { destroy: () => {} };
  }
  function renderLegendForMatrix(index) {
    if (!legendContainer) return;
    destroyLegend();
    legendContainer.innerHTML = "";
    const part = matrixParts[index] ?? matrixParts[0];
    const wrapper = cellEls[index] ?? cellEls[0] ?? element;
    legend = renderTaskLegend(legendContainer, part.sceneMatrix);
    if (legend.legendEl) {
      legendContainer.appendChild(legend.legendEl);
      legendSpotlight = wireLegendCellSpotlight(wrapper, part.matrix, legend);
    }
  }
  renderLegendForMatrix(0);

  // Compose a "fan-out" matrix + overlays pair the walkthrough can drive.
  // Each per-step reveal token array is applied to EVERY matrix's parts,
  // so all matrices light up together as the scene walkthrough advances.
  const fanOutMatrix = {
    applyReveal(tokens) {
      for (const p of matrixParts) p.matrix.applyReveal(tokens);
    },
  };
  const fanOutOverlays = {
    applyReveal(tokens) {
      for (const p of matrixParts) {
        p.overlays.applyReveal(tokens);
        p.arrows.applyReveal(tokens);
      }
      crossArrows.applyReveal(tokens);
    },
  };

  // Narrative: scene-level first, fall back to matrix 0's narrative if the
  // scene didn't declare one (rare for multi-matrix scenes, but the
  // resolveNarrative helper already encodes the fallback chain).
  //
  // Per-matrix narratives (`matrix.narrative`) are DORMANT in multi-mount:
  // the walkthrough drives all matrices from the scene-level narrative as
  // one fan-out unit. Authors who declared per-matrix narratives expecting
  // them to surface here would otherwise see silent drop-through. Emit a
  // one-time console.warn at mount so the dead-data condition is loud
  // without spamming on every step/redraw. Schema docs (see schemas/
  // tsm-scene.schema.json $defs.matrix.narrative.description) name the
  // same constraint at authoring time.
  if (scene.matrices.some((m) => m?.narrative)) {
    console.warn(
      "mountAllMatrices: per-matrix narratives are not driven in multi-mount; " +
      "scene.narrative is used. Per-matrix narratives may be surfaced via focus " +
      "mode in a future release.",
    );
  }
  const narrative = scene.narrative ?? resolveNarrative(scene, 0);

  // Walkthrough + Explore push emphasis through the same fan-out hooks.
  // The fan-out is shape-aware (see createPerMatrixEmphasisFanOut):
  //
  //   - Walkthrough emits `overridesByMatrix: Map<matrixIdx, Map>` so
  //     matrix-local keys (annotation indices intrinsically; transfer or
  //     overlay ids that may collide across matrices) stay scoped to the
  //     matrix that authored them. Each renderer instance receives ONLY
  //     its own slice. Closes Round-3 Fix 1 (cross-matrix identity bug).
  //
  //   - Explore disclosure ALSO emits `overridesByMatrix: Map<matrixIdx, Map>`
  //     as of v1.6.4 D2 — parallel to the walkthrough shape. Each matrix's
  //     renderer receives only its own slice of the chip-emitted filter, so
  //     matrix-local keys (`firm-boundary:N`, region ids, annotation indices,
  //     transfer `${from}→${to}`) no longer cross-leak between sibling
  //     matrices' renderers. Replaces the pre-D2 scene-level union Map +
  //     primary-wins setMerge band-aid (SPEC §7.6 false-positive closed
  //     structurally). Cross-arrows stays scene-level (one renderer for
  //     the whole scene) and uses plain `overrides:` — its keys are
  //     already matrix-qualified.
  //
  // Pre-v1.6.2 the walkthrough only saw matrix 0's hooks (no fan-out at
  // all). v1.6.2 added a broadcast fan-out; v1.6.3 swaps it for per-matrix
  // dispatch to close the cross-matrix identity bug surfaced by the
  // round-2 audits (CONVERGENCE-1). v1.6.4 D2 brings Explore onto the
  // same per-matrix shape, closing SPEC §7.6.
  //
  // Each renderer's applyEmphasis is layer-aware: the walkthrough calls
  // with layer:"walkthrough" and Explore with layer:"explore" so the two
  // state machines coexist without trampling each other (CONVERGENCE-2).
  const arrowsFanOut = createPerMatrixEmphasisFanOut(matrixParts, "arrows");
  const overlaysFanOutEmphasis = createPerMatrixEmphasisFanOut(matrixParts, "overlays");
  const annotationsFanOutEmphasis = createPerMatrixEmphasisFanOut(matrixParts, "annotations");

  // v1.6.4 D5.2 — wrap onChange so step transitions also refresh the
  // disclosure's Show All button label. The disclosure is mounted just
  // below; declared upfront as `let explore = { destroy, refreshShowAllLabel
  // }` no-op stub so the synchronous walkthrough.step(0) firing onChange
  // before the disclosure is assigned doesn't ReferenceError on `explore`.
  let explore = { destroy() {}, refreshShowAllLabel() {} };
  function wrappedOnChange(state) {
    onChange?.(state);
    explore?.refreshShowAllLabel?.();
  }
  const walkthrough = createWalkthrough(fanOutMatrix, fanOutOverlays, narrative, {
    onChange: wrappedOnChange,
    emphasis: {
      // Multi-matrix: setEmphasis criteria are resolved against the UNION
      // of all matrices' items, so a scene-level step can address content
      // in any matrix. The walkthrough controller accepts an array under
      // `matrices` (v1.6.2+) or a single `matrix` (back-compat).
      matrices: scene.matrices,
      sceneArrows: scene.arrows ?? [],
      arrows: arrowsFanOut,
      overlays: overlaysFanOutEmphasis,
      annotations: annotationsFanOutEmphasis,
      crossArrows,
    },
  });
  walkthrough.step(0);

  // Explore disclosure for multi-matrix scenes — chip strip operates on the
  // union of all matrices' items (SPEC §7.4). The chip click fans out to
  // every matrix's arrows/overlays/annotations renderer plus the shared
  // cross-arrows renderer. Same fan-out shape as the walkthrough hooks
  // above — both state machines write through the same broadcast
  // infrastructure; layer-aware applyEmphasis keeps them disjoint.
  if (enableExplore) {
    explore = createExploreDisclosure(exploreContainer ?? element, scene, {
      emphasis: {
        arrows: arrowsFanOut,
        overlays: overlaysFanOutEmphasis,
        annotations: annotationsFanOutEmphasis,
        crossArrows,
      },
      /**
       * v1.6.4 D5.2 — Explore Show All counts the union N across every matrix's
       * three per-matrix renderers + the scene-level cross-arrows. The DOM scan
       * clamps to 0 when effective showAll is ON on any layer touching the
       * surface, so the button disables when nothing would visibly change.
       *
       * v1.6.6 Wave 3 W2B-D5.2-CF-1: this closure intentionally captures the
       * mount-time `matrixParts` array and `crossArrows` renderer. Current
       * `mountAllMatrices` has no per-matrix renderer re-mount path; if one is
       * added, this callback must read from a live state holder instead.
       *
       * @returns {number}
       */
      countHidden: () => {
        let n = crossArrows.countHidden?.() ?? 0;
        for (const p of matrixParts) {
          n += p.arrows.countHidden?.() ?? 0;
          n += p.overlays.countHidden?.() ?? 0;
          n += p.annotations.countHidden?.() ?? 0;
        }
        return n;
      },
      onEmphasisChange,
    });
    // Default-open in the app's rail mount — see mountTSM. Inert handle's
    // open() is a no-op for lens-less scenes.
    if (exploreContainer) explore.open?.();
  }

  // Focus mode. `focusMatrix(n)` adds `.tsm-matrix-cell--focused` to the
  // selected cell and `.tsm-matrix-cell--unfocused` to all others; passing
  // null returns to the no-focus default. Cross-matrix arrows stay drawn
  // either way so endpoints remain readable.
  let focusedIndex = null;
  function focusMatrix(idx) {
    // Toggle: clicking the already-focused matrix returns to no-focus.
    if (idx === focusedIndex) idx = null;
    focusedIndex = idx;
    for (let i = 0; i < cellEls.length; i++) {
      const cell = cellEls[i];
      if (idx === null) {
        cell.classList.remove("tsm-matrix-cell--focused");
        cell.classList.remove("tsm-matrix-cell--unfocused");
      } else if (i === idx) {
        cell.classList.add("tsm-matrix-cell--focused");
        cell.classList.remove("tsm-matrix-cell--unfocused");
      } else {
        cell.classList.remove("tsm-matrix-cell--focused");
        cell.classList.add("tsm-matrix-cell--unfocused");
      }
    }
    // Re-measure + redraw — focus-mode CSS may change layout (e.g., a fade
    // doesn't, but a scale would); the cross-arrows recompute from the new
    // bounding rects regardless so endpoints stay anchored.
    renderLegendForMatrix(idx ?? 0);
    onResize();
  }

  function onResize() {
    for (const p of matrixParts) p.measureAndRedraw();
    crossArrows.redraw();
    const idx = walkthrough.getStepIndex();
    walkthrough.step(idx);
  }
  window.addEventListener("resize", onResize);

  return {
    destroy() {
      window.removeEventListener("resize", onResize);
      for (const p of matrixParts) {
        p.overlays.destroy();
        p.annotations.destroy();
        p.arrows.destroy();
      }
      crossArrows.destroy();
      destroyLegend();
      explore.destroy();
      element.classList.remove("multi-mount");
      // Belt-and-suspenders: crossArrows.destroy() already clears
      // .spotlight-show-all-cross-arrow, but if a future code path bypasses
      // that teardown (manual SVG clear, partial mount unwinds), make sure
      // the host wrapper still ends in a clean state.
      element.classList.remove("spotlight-show-all-cross-arrow");
      element.innerHTML = "";
    },
    step(n) { walkthrough.step(n); },
    next() { walkthrough.next(); },
    prev() { walkthrough.prev(); },
    restart() { walkthrough.restart(); },
    setShowAllCrossArrows(on) {
      // v1.6.4 D1 / L-new-1: return the new app-slot value so app.js's
      // matrix-switcher button can drive aria-pressed from renderer state.
      const result = crossArrows.setShowAll(on);
      // v1.6.4 D5.2 r-2 — refresh Explore Show All label so its N count
      // clamps when the matrix-switcher flipped the app slot ON.
      explore?.refreshShowAllLabel?.();
      return result;
    },
    setShowAllIntraArrows(on) {
      // Multi-mount: each per-matrix arrows renderer gets the same write.
      // All slots converge on the same boolean since one button drives all
      // matrices — return the value from any one of them (the last is fine).
      let result = !!on;
      for (const p of matrixParts) {
        result = p.arrows.setShowAllIntraArrows(on);
      }
      // v1.6.4 D5.2 r-2 — refresh Explore Show All label across all matrices.
      explore?.refreshShowAllLabel?.();
      return result;
    },
    focusMatrix,
    /**
     * Count items currently revealed-but-secondary within a named scope, for
     * the "Show all (N)" button label in app.js's matrix-switcher. v1.6.4
     * D5.2 (label renamed from "Show hidden (N)" in v0.4.2; the Explore
     * disclosure's own Show All button was removed in v0.4.1).
     *
     * Scopes:
     *   - "crossArrows": N for the matrix-switcher's "Show all transactions"
     *     button (cross-arrows are scene-level; one renderer total).
     *   - "intraArrows": N for the matrix-switcher's "Show all arrows"
     *     button — sum across every matrix's intra-arrows renderer (one
     *     button drives all matrices in multi-mount).
     *   - "explore": N across ALL surfaces (arrows + overlays + annotations
     *     across every matrix + scene-level crossArrows). Explore's chip
     *     filter fans out to the same union.
     *
     * @param {"crossArrows"|"intraArrows"|"explore"} scope
     * @returns {number}
     */
    countHidden(scope) {
      if (scope === "crossArrows") return crossArrows.countHidden?.() ?? 0;
      if (scope === "intraArrows") {
        let n = 0;
        for (const p of matrixParts) n += p.arrows.countHidden?.() ?? 0;
        return n;
      }
      if (scope === "explore") {
        let n = crossArrows.countHidden?.() ?? 0;
        for (const p of matrixParts) {
          n += p.arrows.countHidden?.() ?? 0;
          n += p.overlays.countHidden?.() ?? 0;
          n += p.annotations.countHidden?.() ?? 0;
        }
        return n;
      }
      return 0;
    },
    getState() {
      return {
        view: "walkthrough",
        stepIndex: walkthrough.getStepIndex(),
        stepCount: walkthrough.getStepCount(),
        currentStep: walkthrough.getCurrentStep(),
        focusedIndex,
      };
    },
  };
}
