// Module overlay renderer. Positions absolutely-placed overlay rectangles on
// top of the matrix grid, sized to the contiguous group span on the diagonal.
//
// This module DOES read getBoundingClientRect — overlay positioning depends
// on rendered grid dimensions, which only exist after layout. This is the
// only place runtime DOM reads are allowed.
//
// Returns { redraw, setVisible, applyReveal, destroy }. `applyReveal(tokens)`
// is the preferred entry point — it routes the token array through the
// shared dispatcher in render/reveal.js, matching render/matrix.js's flow.
// `setVisible(boolean)` is retained as a low-level setter for direct toggling.
//
// v1.1-deferred additions:
//   - firm-boundary overlay (SO paper Fig 6 — Job Shop). When a matrix has
//     `overlays[].kind === "firm-boundary"` with `excludedTaskIds`, we draw a
//     dashed perimeter around the bounding box of the INCLUDED tasks. The
//     excluded tasks (external actors) sit visually outside via the
//     `.external-actor` row/col classes in render/matrix.js. The firm
//     boundary is always-visible (it's part of the matrix identity), so it
//     does not gate on a reveal token — matching how the job-shop scene
//     references CS in every step's narrative.

import { resolveReveal } from "./reveal.js";
import { buildTaskIndex } from "./util.js";
import { createLayeredEmphasisState } from "./emphasis-state.js";

/**
 * Mount module overlays. Call redraw() after the grid renders, after resize,
 * or whenever the container width changes.
 *
 * @param {HTMLElement} wrapper — outer container (e.g., #tsm)
 * @param {HTMLElement} gridEl — the .tsm-grid element
 * @param {object} grid — output of core/layout.js computeGrid
 * @param {{
 *   overlayRegionIds?: string[],
 *   firmBoundaries?: Array<{ excludedTaskIds?: string[], label?: string }>,
 *   tasks?: Array<{ id: string }>,
 * }} [opts] — which region ids should render as module-border overlays:
 *   ABSENT/undefined → legacy "every contiguous group span gets one" (Fig 1);
 *   [] (explicit empty) → this matrix emits NO module-border overlays, draw
 *   none (a coreless matrix passes []; treating it like "absent" auto-drew a
 *   phantom whole-matrix border — the N-2 footgun); non-empty → only the
 *   listed ids. Plus any firm-boundary overlays to draw with their excluded
 *   task ids. `tasks` is the matrix's task list; required when
 *   `firmBoundaries` is given so excluded-task indices can be resolved.
 */
export function renderOverlays(wrapper, gridEl, grid, opts = {}) {
  const { groupSpans, groupById, n } = grid;
  // Distinguish ABSENT (undefined) from explicit EMPTY ([]):
  //   undefined → null → draw every contiguous group span (legacy Fig-1).
  //   [] or non-empty → exactly the listed region ids — so a coreless matrix's
  //   [] draws NOTHING instead of an auto-drawn whole-matrix border. That border
  //   was a hidden phantom on every coreless scene (no shipped scene declares
  //   module-border overlays without also revealing them — declared ⟺ revealed),
  //   and the N-2 footgun is exactly that phantom going visible when a mixed
  //   multi-matrix scene fans overlay:module-border to a coreless matrix.
  const allowedSet = (opts.overlayRegionIds === undefined || opts.overlayRegionIds === null)
    ? null
    : new Set(opts.overlayRegionIds);
  const firmBoundaries = opts.firmBoundaries ?? [];
  const tasks = opts.tasks ?? [];
  // Per-region (or per-overlay-id) emphasis declarations resolved by the
  // caller from the matrix's `overlays[].rendering.emphasis` + `rendering.lens`.
  // Indexed by regionId for module-border overlays. Defaults: missing entries
  // resolve to "secondary" in v0.4 (per SPEC-LENSES §3.1) which the renderer
  // reads via effectiveEmphasis(); module-border overlays without explicit
  // emphasis on a v0.4 scene therefore default to secondary.
  const overlayDecls = opts.overlayDecls ?? new Map(); // regionId → { emphasis, lens }

  // Runtime emphasis overrides — layered diffs. Two independent state
  // machines (walkthrough setEmphasis, Explore chip) own DISJOINT diff
  // Maps; effectiveEmphasis composes them with Explore winning over
  // walkthrough so a chip filter survives Restart / Next / Prev. Module-
  // border keys are regionIds; firm-boundary keys are `firm-boundary:${idx}`.
  //
  // v1.6.4 D1: state machine is now provided by the shared factory
  // `createLayeredEmphasisState` in `render/emphasis-state.js`. The factory
  // owns the diff Maps + showAllByLayer + applyEmphasis routing/guard
  // (including the layer:"app"+overrides throw); this renderer keeps its
  // dual keying (regionId for module-border, firm-boundary:N for firm
  // perimeters) and DOM apply pass.
  //
  // Note: app-layer showAll on overlays is currently unused — Explore's
  // pushShowAll(false) writes layer:"explore", and the matrix-switcher
  // buttons in app.js don't touch overlays. The slot exists for shape
  // symmetry with the other three renderers; an app-layer writer would be
  // a future overlay-specific toggle.
  const emphasisState = createLayeredEmphasisState({
    callsite: "overlays.applyEmphasis",
    onApply: () => applyEmphasisToElements(),
  });

  function effectiveEmphasis(regionId) {
    // v0.4 default per SPEC-LENSES §3.1. The adapter applies emphasis to
    // every overlay's rendering on decorateScene, so this fallback only
    // covers overlays added at runtime without going through the adapter.
    return emphasisState.effectiveEmphasis(regionId, overlayDecls.get?.(regionId)?.emphasis);
  }

  // Build a task-id → index lookup so firm-boundary overlays can map
  // `excludedTaskIds` to integer indices. Independent of the grid's
  // `taskById` (which holds decorated entries) — the renderer only needs
  // the index. Shared helper at render/util.js so annotations + arrows
  // can use the same lookup.
  const taskIndex = buildTaskIndex(tasks);

  // Latest reveal tokens, captured by applyReveal and re-applied at the end
  // of every draw(). This closes the deferred-redraw bug: rAF-scheduled
  // redraws used to clear+rebuild the DOM without re-applying the tokens
  // that walkthrough.step(0) had already resolved. Storing the tokens makes
  // either order — applyReveal-then-draw or draw-then-applyReveal — converge
  // on the same end state. Null sentinel means "no tokens applied yet".
  let lastTokens = null;

  function clear() {
    wrapper.querySelectorAll(".module-overlay, .firm-boundary-overlay").forEach((el) => el.remove());
  }

  function drawModuleBorders(cellSize) {
    for (const [gid, span] of groupSpans) {
      if (allowedSet && !allowedSet.has(gid)) continue;

      const overlay = document.createElement("div");
      overlay.className = "module-overlay";
      overlay.dataset.group = gid;
      overlay.dataset.emphasis = effectiveEmphasis(gid);
      const lens = overlayDecls.get?.(gid)?.lens;
      if (Array.isArray(lens) && lens.length > 0) {
        overlay.dataset.lens = lens.join(",");
      }
      // v1.6.4 D5.3 — labelStyle directive on module-border overlays. Stamped
      // for parity with arrows/cross-arrows/annotations; no shipping scene
      // uses this on a module border today but the field exists at schema
      // parity so authors aren't surprised.
      const moduleLabelStyle = overlayDecls.get?.(gid)?.labelStyle;
      if (typeof moduleLabelStyle === "string" && moduleLabelStyle.length > 0) {
        overlay.dataset.labelStyle = moduleLabelStyle;
      }

      const offsetX = gridEl.offsetLeft + span.start * cellSize;
      const offsetY = gridEl.offsetTop + span.start * cellSize;
      const size = (span.end - span.start + 1) * cellSize;

      overlay.style.left = `${offsetX}px`;
      overlay.style.top = `${offsetY}px`;
      overlay.style.width = `${size}px`;
      overlay.style.height = `${size}px`;
      overlay.style.color = groupById[gid].color;
      // Also published as a custom property so child elements (the cluster
      // label badge) can use the region color even when they override their
      // own `color` for contrast — currentColor on a child resolves to its
      // OWN color, so a CSS variable is the only way to thread the region
      // color past a color override on the child.
      overlay.style.setProperty("--region-color", groupById[gid].color);

      // Suppress the .module-label pill when the region spans the entire
      // matrix (start=0, end=n-1). A whole-matrix region IS the matrix's
      // identity, which `.tsm-matrix-header` (in render/matrix.js) already
      // surfaces above the grid. Without this suppression, multi-zone /
      // multi-matrix scenes (Fig 4, Fig 18.1) double-label: the header
      // shows the firm name ("DOWNSTREAM FIRM") and the module pill
      // shows the region name ("Downstream (flow)") right beneath, with
      // the two visually colliding. Partial-region overlays (Fig 1's
      // proto-modular clusters, Fig 3's modules + DR) span a subset of
      // tasks and keep their pill.
      const coversWholeMatrix = span.start === 0 && span.end === n - 1;
      if (!coversWholeMatrix) {
        const label = document.createElement("span");
        label.className = "module-label";
        label.textContent = groupById[gid].label;
        overlay.appendChild(label);
      }

      wrapper.appendChild(overlay);
    }
  }

  function drawFirmBoundaries(cellSize) {
    for (let bi = 0; bi < firmBoundaries.length; bi++) {
      const boundary = firmBoundaries[bi];
      const declared = boundary.excludedTaskIds ?? [];

      // Resolve every declared excludedTaskId through the task index.
      // Unknown ids (typos like `["Cs"]` instead of `["CS"]`) used to
      // silently no-op — the set was checked against `tasks[i]?.id` and
      // an unknown id never matched, so the perimeter wrapped ALL tasks
      // while reporting `data-excluded-count=N`. That silently changed
      // Fig 6 semantics. We now fail loudly: emit a console.warn AND
      // stamp the overlay element with `data-firm-boundary-error` so
      // tests + an inspector can see the misconfiguration. The perimeter
      // is NOT drawn for an invalid boundary — loud failure beats silent
      // misrender.
      const unknownIds = declared.filter((id) => !taskIndex.has(id));
      if (unknownIds.length > 0) {
        if (typeof console !== "undefined" && typeof console.warn === "function") {
          console.warn(
            `renderOverlays: firm-boundary[${bi}] references unknown excludedTaskIds: ${JSON.stringify(unknownIds)}. ` +
            `Known task ids: ${JSON.stringify([...taskIndex.keys()])}.`,
          );
        }
        const errorOverlay = document.createElement("div");
        errorOverlay.className = "firm-boundary-overlay firm-boundary-overlay--error";
        errorOverlay.dataset.boundaryIndex = String(bi);
        errorOverlay.dataset.firmBoundaryError = "unknown-excluded-ids";
        errorOverlay.dataset.unknownExcludedIds = unknownIds.join(",");
        wrapper.appendChild(errorOverlay);
        continue;
      }

      const excluded = new Set(declared);

      // Compute the bounding box of INCLUDED task indices. The perimeter
      // wraps a contiguous block — in practice excluded tasks live at the
      // edge (Fig 6's CS sits at the last index), so the bbox is well
      // defined. If excluded tasks are scattered, the bbox still
      // encloses all included tasks; some excluded ones may end up inside.
      // That's the schema author's call — we render what they declare.
      const includedIndices = [];
      for (let i = 0; i < n; i++) {
        const taskId = tasks[i]?.id;
        if (!excluded.has(taskId)) includedIndices.push(i);
      }
      if (includedIndices.length === 0) continue;
      const startIdx = Math.min(...includedIndices);
      const endIdx = Math.max(...includedIndices);

      const overlay = document.createElement("div");
      overlay.className = "firm-boundary-overlay";
      const boundaryKey = `firm-boundary:${bi}`;
      overlay.dataset.boundaryIndex = String(bi);
      overlay.dataset.excludedCount = String(excluded.size);
      // Stash the scene-declared emphasis so applyEmphasisToElements can
      // resolve symmetrically with the module-border path — the runtime
      // layered diffs win (Explore over walkthrough), otherwise the
      // declared value (or §3.1 default "secondary") falls through.
      const declaredEmphasis = boundary.rendering?.emphasis ?? "secondary";
      overlay.dataset.declaredEmphasis = declaredEmphasis;
      // Layered-diff composition: Explore wins over walkthrough, then
      // declared (v1.6.4 D1 — delegated to the factory's effectiveEmphasis).
      overlay.dataset.emphasis = emphasisState.effectiveEmphasis(boundaryKey, declaredEmphasis);
      const lens = boundary.rendering?.lens;
      if (Array.isArray(lens) && lens.length > 0) {
        overlay.dataset.lens = lens.join(",");
      } else if (typeof lens === "string" && lens.length > 0) {
        overlay.dataset.lens = lens;
      }
      // v1.6.4 D5.3 — labelStyle directive on firm-boundary overlays. No
      // shipping scene uses this today (firm boundaries carry the firm name
      // via overlay.label, not via load-bearing label semantics) but the
      // field exists at schema parity so authors aren't surprised.
      const boundaryLabelStyle = boundary.rendering?.labelStyle;
      if (typeof boundaryLabelStyle === "string" && boundaryLabelStyle.length > 0) {
        overlay.dataset.labelStyle = boundaryLabelStyle;
      }

      const offsetX = gridEl.offsetLeft + startIdx * cellSize;
      const offsetY = gridEl.offsetTop + startIdx * cellSize;
      const size = (endIdx - startIdx + 1) * cellSize;

      overlay.style.left = `${offsetX}px`;
      overlay.style.top = `${offsetY}px`;
      overlay.style.width = `${size}px`;
      overlay.style.height = `${size}px`;

      // Boundary label is rendered as `.tsm-matrix-header` above the grid by
      // render/matrix.js. The old floating `.firm-boundary-label` pill
      // (absolute, top:-14px) overlapped the source paragraph when the title
      // and source sat close above the grid; moving the label into the
      // header line removes the overlap entirely. The boundary's `.label`
      // string is still authoritative — matrix.js's resolveMatrixHeaderLabel
      // reads it directly from the matrix overlays.

      wrapper.appendChild(overlay);
    }
  }

  function draw() {
    clear();
    const gridRect = gridEl.getBoundingClientRect();
    const cellSize = gridRect.width / n;
    drawModuleBorders(cellSize);
    drawFirmBoundaries(cellSize);
    // Re-apply the latest reveal tokens after rebuilding the DOM. Without
    // this, a deferred redraw (rAF-scheduled initial paint, resize) would
    // wipe the `.visible` class that applyReveal had set on overlays
    // created in a previous draw cycle. See R1-B1 in
    // reviews/2026-05-26-r1-codex-renderer-ui.md.
    if (lastTokens !== null) applyRevealTokens(lastTokens);
    applyEmphasisToElements();
  }

  function applyEmphasisToElements() {
    // H1a (explore lens visibility) — module overlays gate on `.visible`,
    // which the reveal layer sets from walkthrough tokens. The Explore chip
    // path writes emphasis only, so a lens-primary module border the current
    // step hasn't revealed stayed at opacity:0 (highlight invisible). Fix:
    // re-derive the visibility baseline from the latest reveal tokens here
    // (not just in draw()), then force-reveal the Explore layer's OWN primary
    // targets on top. Clearing the lens empties exploreDiff → the next
    // apply restores the pure walkthrough baseline with no stale `.visible`.
    if (lastTokens !== null) applyRevealTokens(lastTokens);
    const exploreDiff = emphasisState.exploreDiff;
    const overlays = wrapper.querySelectorAll?.(".module-overlay") ?? [];
    for (const ov of Array.from(overlays)) {
      const gid = ov.dataset?.group;
      if (!gid) continue;
      ov.dataset.emphasis = effectiveEmphasis(gid);
      if (exploreDiff.get(gid) === "primary") ov.classList.add("visible");
    }
    // Path B firm-boundaries participate in the same override Map. Keys
    // arrive as `firm-boundary:${index}` (see buildLensFilter in
    // render/explore-disclosure.js + walkthrough setEmphasis.byId). Without
    // this loop the chip click would update the Map but never touch the
    // DOM until the next full redraw — Batch B r2 audit B1. The mount-time
    // attribute already lives in drawFirmBoundaries; this is the runtime
    // override path. We resolve effectiveEmphasis symmetrically with the
    // module-border path above: override wins, otherwise the
    // mount-time-stashed `data-declared-emphasis` falls through.
    const firmBoundaries = wrapper.querySelectorAll?.(".firm-boundary-overlay") ?? [];
    for (const ov of Array.from(firmBoundaries)) {
      // Skip the error-overlay variant: it is a misconfiguration marker,
      // not a styleable boundary.
      if (ov.dataset?.firmBoundaryError) continue;
      const idx = ov.dataset?.boundaryIndex;
      if (idx === undefined || idx === null || idx === "") continue;
      const key = `firm-boundary:${idx}`;
      const declared = ov.dataset?.declaredEmphasis ?? "secondary";
      // Layered-diff composition: Explore wins over walkthrough, then
      // declared (v1.6.4 D1 — delegated to the factory).
      ov.dataset.emphasis = emphasisState.effectiveEmphasis(key, declared);
    }
    if (wrapper?.classList?.toggle) {
      wrapper.classList.toggle("tsm-show-all-emphasis", emphasisState.effectiveShowAll());
    }
  }

  /**
   * Update the runtime emphasis state. Layer-aware: writes hit the named
   * layer ("walkthrough" | "explore" | "app"); reset:true clears BOTH that
   * layer's diff Map (when present) AND its Show All slot (symmetric, per
   * SPEC §7.5 v0.3.6). Default layer = "walkthrough" for back-compat with
   * callers that don't specify. When a single call passes both `reset:true`
   * and `showAll: <boolean>`, the explicit showAll write wins (clear-first
   * then set).
   *
   * `overrides` shape: production callers (walkthrough fan-out, Explore
   * disclosure) always pass a Map. Plain objects are accepted for test
   * ergonomics so unit tests can write `{ regionId: "primary" }` directly.
   *
   * `showAll` writes are layered: each layer owns its own slot, the effective
   * showAll is OR across layers (v1.6.3 Batch C1). Explore writes the
   * "explore" layer via `pushShowAll`; walkthrough writes "walkthrough". The
   * "app" slot is currently unused on overlays — no app-level toggle writes
   * to overlays today (arrows + cross-arrows are the app-layer writers via
   * `setShowAllIntraArrows` / `setShowAll`).
   *
   * v1.6.4 D1 — `layer:"app"` is showAll-only per SPEC §7.5 v0.3.6.
   * `applyEmphasis({ overrides, layer:"app" })` THROWS TypeError. The
   * shared factory at `render/emphasis-state.js` enforces the guard;
   * this renderer delegates.
   */
  const applyEmphasis = emphasisState.applyEmphasis;

  function setVisible(visible) {
    wrapper.querySelectorAll(".module-overlay").forEach((o) => {
      o.classList.toggle("visible", visible);
    });
  }

  // Internal: resolve + apply without touching `lastTokens`. Used both by
  // the public applyReveal entry point and by draw()'s re-apply step.
  function applyRevealTokens(tokens) {
    const { showOverlays } = resolveReveal(tokens);
    setVisible(showOverlays);
    // Firm-boundary overlays don't gate on reveal — they're part of the
    // matrix identity, not a progressive disclosure. The .firm-boundary-overlay
    // is visible whenever the matrix renders.
  }

  function applyReveal(tokens) {
    lastTokens = tokens;
    applyRevealTokens(tokens);
    // H1e — re-layer the Explore emphasis so an active lens survives
    // walkthrough Next/Prev/Restart ("Explore wins composition"), instead of
    // the chip staying pressed while its force-revealed targets vanish.
    applyEmphasisToElements();
  }

  // Initial paint deferred until after the browser lays out the grid.
  requestAnimationFrame(draw);

  // v1.6.4 D5.2 — count revealed-but-secondary overlays for the
  // "Show all (N)" matrix-switcher label (aggregated via
  // controller.countHidden; the Explore Show All button was removed in
  // v0.4.1). Module-border overlays gate
  // on reveal tokens (`.visible`); firm-boundary overlays are matrix-identity
  // (always rendered, no `.visible` class). Both contribute to N when their
  // emphasis is "secondary" and the effective showAll is OFF. Error-overlay
  // firm boundaries are excluded — they're misconfiguration markers, not
  // styleable items. When effective showAll is ON nothing is visually
  // hidden, so the count clamps to 0.
  //
  // Predicate asymmetry (v1.6.4 D5.2 r-2 — intentional, documented per
  // Codex D5.2-PRED-1): module overlays check `.visible` because they
  // pass through reveal-token gating (a module border can be revealed
  // step-by-step). Firm-boundary overlays do NOT check `.visible`
  // because `drawFirmBoundaries` draws them unconditionally from frame
  // one (matrix identity, not progressive disclosure — see core/scene-
  // adapter.js firm-boundary carve-out and SPEC-LENSES §3.1). A
  // firm-boundary at data-emphasis="secondary" is ghost-visible at 25%
  // opacity from frame one, so it counts as "revealed-but-secondary"
  // regardless of reveal-token state.
  function countHidden() {
    if (emphasisState.effectiveShowAll()) return 0;
    let n = 0;
    const modules = wrapper.querySelectorAll?.(".module-overlay") ?? [];
    for (const ov of Array.from(modules)) {
      if (!ov.classList?.contains?.("visible")) continue;
      if (ov.dataset?.emphasis !== "secondary") continue;
      n += 1;
    }
    const firmBoundaries = wrapper.querySelectorAll?.(".firm-boundary-overlay") ?? [];
    for (const ov of Array.from(firmBoundaries)) {
      if (ov.dataset?.firmBoundaryError) continue;
      if (ov.dataset?.emphasis !== "secondary") continue;
      n += 1;
    }
    return n;
  }

  return {
    redraw: draw,
    setVisible,
    applyReveal,
    applyEmphasis,
    countHidden,
    destroy: clear,
  };
}
