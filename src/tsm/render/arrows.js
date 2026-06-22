// Arrow renderer. Mounts an SVG layer over the matrix and draws explicit
// arrows for every transfer with `rendering.arrow === true`. These are the
// "visual emphasis" arrows from SO paper Figs 3 and 6 — the DR-to-module
// dispatch, the job-shop cyclic flow, the platform module-to-integration
// thin crossings. The cell mark (→ / ↑) already conveys the transfer's
// presence; the arrow adds the visual emphasis Baldwin uses in the figures.
//
// One <svg class="tsm-arrows"> overlay holds all arrows for a matrix. Each
// arrow is an SVG <path> with class `.tsm-arrow.forward` or `.backward`
// matching the transfer direction, plus `data-from` and `data-to` so tests
// (and a debug inspector) can map an arrow back to its transfer.
//
// Visibility is gated by reveal token — applyReveal({ showForward,
// showBackward }) toggles the `.visible` class per direction. Until the
// matching transfer direction is revealed, the arrow stays transparent.

import { resolveReveal } from "./reveal.js";
import { buildTaskIndex } from "./util.js";
import { createLayeredEmphasisState } from "./emphasis-state.js";
import { createHoverSpotlight } from "./hover-spotlight.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function createSVG(tag) {
  if (typeof document.createElementNS === "function") {
    return document.createElementNS(SVG_NS, tag);
  }
  // Test-shim fallback. Tests that rely on the shim only need a creatable
  // element with classList/dataset/setAttribute, all of which the shim
  // provides.
  return document.createElement(tag);
}

function setAttr(el, name, value) {
  if (typeof el.setAttribute === "function") {
    el.setAttribute(name, value);
  } else {
    el.attributes ??= {};
    el.attributes[name] = String(value);
  }
}

/**
 * Route an arrow from one cell center to another. Returns an SVG path `d`
 * attribute. The route is a curved quadratic Bezier that arcs outward from
 * the diagonal so the arrow doesn't cross the diagonal cell or other
 * arrows. The arc direction depends on whether the arrow is above or
 * below the diagonal.
 *
 * Exported for testability.
 */
export function routeArrowPath(fromX, fromY, toX, toY, cellSize, direction) {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  // Push the control point away from the diagonal. Forward (below) arcs
  // down-left; backward (above) arcs up-right. The push magnitude scales
  // with cell size so the curvature reads on both small and large grids.
  const offset = cellSize * 0.4;
  const arc = direction === "forward" ? +offset : -offset;
  // Perpendicular to the from→to vector, normalized.
  const dx = toX - fromX;
  const dy = toY - fromY;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = midX + nx * arc;
  const cy = midY + ny * arc;
  return `M ${fromX} ${fromY} Q ${cx} ${cy} ${toX} ${toY}`;
}

/**
 * Mount the arrows layer. Call redraw() after the grid renders, after
 * resize, or whenever the container width changes.
 *
 * @param {HTMLElement} wrapper — outer container
 * @param {HTMLElement} gridEl — the .tsm-grid element
 * @param {object} grid — output of core/layout.js computeGrid
 * @param {object} matrix — the matrix with `transfers[]`
 * @returns {{ redraw, applyReveal, destroy, elements }}
 */
export function renderArrows(wrapper, gridEl, grid, matrix) {
  const transfers = (matrix.transfers ?? []).filter((t) => t?.rendering?.arrow === true);
  const taskIndex = buildTaskIndex(matrix.tasks);
  const elements = [];

  let svg = null;
  const spotlight = createHoverSpotlight(wrapper);

  // Runtime emphasis state — layered diffs keyed by `${from}→${to}`. Two
  // independent state machines push into this renderer: the walkthrough
  // (step-by-step choreography) and the Explore disclosure (chip filter).
  // Each owns its OWN diff Map; effectiveEmphasis composes them with Explore
  // winning over walkthrough (the chip is the user's explicit filter intent,
  // walkthrough is the default narrative). The matrix-switcher "Show all
  // arrows" button writes the `app` showAll slot (showAll-only — no override
  // Map; SPEC §7.5 v0.3.6).
  //
  // v1.6.4 D1: state machine is now provided by the shared factory
  // `createLayeredEmphasisState` in `render/emphasis-state.js`. The factory
  // owns the diff Maps + showAllByLayer + applyEmphasis routing/guard; this
  // renderer keeps its keying strategy (`${from}→${to}`) and DOM apply pass.
  const emphasisState = createLayeredEmphasisState({
    callsite: "arrows.applyEmphasis",
    onApply: () => applyEmphasisToElements(),
  });

  function effectiveEmphasis(t) {
    const key = `${t.from}→${t.to}`;
    return emphasisState.effectiveEmphasis(key, t?.rendering?.emphasis);
  }

  // Latest reveal tokens, captured by applyReveal and re-applied at the end
  // of every draw(). Without this, a deferred initial paint (rAF) clears
  // and recreates the SVG layer AFTER walkthrough.step(0) called
  // applyReveal — wiping the `.visible` class on the new path elements.
  // See R1-B1 in reviews/2026-05-26-r1-codex-renderer-ui.md.
  let lastTokens = null;

  // Per-path label DOM elements. Parallel array to `elements`; index N's label
  // (or null) corresponds to elements[N]. The label is a sibling of the SVG
  // overlay rather than an SVG <text> so we get full HTML/CSS styling control
  // (small pill, capitalize, transition) without fighting SVG text metrics.
  const labelElements = [];

  function clear() {
    spotlight.unregisterAll();
    wrapper.querySelectorAll(".tsm-arrows").forEach((el) => el.remove());
    wrapper.querySelectorAll(".tsm-arrow-label").forEach((el) => el.remove());
    elements.length = 0;
    labelElements.length = 0;
    svg = null;
  }

  function ensureMarker(defs) {
    // Single shared arrowhead marker for all arrows. The marker fill is
    // currentColor so each <path>'s stroke color also colors its head.
    const marker = createSVG("marker");
    setAttr(marker, "id", "tsm-arrowhead");
    setAttr(marker, "viewBox", "0 0 10 10");
    setAttr(marker, "refX", "8");
    setAttr(marker, "refY", "5");
    setAttr(marker, "markerWidth", "6");
    setAttr(marker, "markerHeight", "6");
    setAttr(marker, "orient", "auto-start-reverse");
    const triangle = createSVG("path");
    setAttr(triangle, "d", "M 0 0 L 10 5 L 0 10 z");
    setAttr(triangle, "fill", "currentColor");
    marker.appendChild(triangle);
    defs.appendChild(marker);
  }

  function draw() {
    clear();
    if (transfers.length === 0) return;

    const gridRect = gridEl.getBoundingClientRect();
    const gridSize = gridRect.width;
    const cellSize = gridSize / grid.n;
    if (gridSize === 0 || cellSize === 0) return;

    svg = createSVG("svg");
    svg.classList.add("tsm-arrows");
    setAttr(svg, "viewBox", `0 0 ${gridSize} ${gridSize}`);
    svg.style.position = "absolute";
    svg.style.left = `${gridEl.offsetLeft}px`;
    svg.style.top = `${gridEl.offsetTop}px`;
    svg.style.width = `${gridSize}px`;
    svg.style.height = `${gridSize}px`;

    const defs = createSVG("defs");
    ensureMarker(defs);
    svg.appendChild(defs);

    for (const t of transfers) {
      const fi = taskIndex.get(t.from);
      const ti = taskIndex.get(t.to);
      if (fi === undefined || ti === undefined) continue;

      // The cell representing "transfer from F to T" sits at row=T, col=F
      // (matches core/layout.js's mapping). We draw from the source
      // diagonal cell to the destination diagonal cell along the path
      // — i.e., from (F,F) to (T,T) — so the visual arrow tracks the
      // task-to-task flow on the diagonal axis, not the off-diagonal mark.
      // This matches SO paper Fig 6 where arrows arc between station
      // diagonal cells rather than originating in the mark cells.
      // Cell centers of the source/target diagonal cells.
      const fromXc = (fi + 0.5) * cellSize;
      const fromYc = (fi + 0.5) * cellSize;
      const toXc = (ti + 0.5) * cellSize;
      const toYc = (ti + 0.5) * cellSize;
      // Inset both endpoints toward each other along the chord by ~half a
      // cell so the arrowhead lands at the cell EDGE, not on top of the
      // target diagonal label at the cell center (#3: arrowheads were
      // covering cell text). Clamp to 40% of the chord so adjacent-cell
      // arrows don't invert.
      const dxc = toXc - fromXc;
      const dyc = toYc - fromYc;
      const dist = Math.hypot(dxc, dyc) || 1;
      const ux = dxc / dist;
      const uy = dyc / dist;
      const inset = Math.min(cellSize * 0.5, dist * 0.4);
      const fromX = fromXc + ux * inset;
      const fromY = fromYc + uy * inset;
      const toX = toXc - ux * inset;
      const toY = toYc - uy * inset;

      const direction = t.direction ?? (fi < ti ? "forward" : "backward");
      const d = routeArrowPath(fromX, fromY, toX, toY, cellSize, direction);

      const path = createSVG("path");
      path.classList.add("tsm-arrow", direction);
      path.dataset.from = t.from;
      path.dataset.to = t.to;
      path.dataset.emphasis = effectiveEmphasis(t);
      // Persist a stable handle to the underlying transfer so emphasis
      // re-application after rebuild reads consistent JSON state.
      path._transfer = t;
      path.style.pointerEvents = "stroke";
      setAttr(path, "d", d);
      setAttr(path, "marker-end", "url(#tsm-arrowhead)");
      if (t.rendering?.label) {
        path.dataset.label = t.rendering.label;
      }
      const lensList = t.rendering?.lens;
      if (Array.isArray(lensList) && lensList.length > 0) {
        path.dataset.lens = lensList.join(",");
      }
      // v1.6.4 D5.3 — orthogonal labelStyle directive. Stamped to the DOM as
      // data-label-style so CSS hooks + tests can target "label IS the claim"
      // items (knife/money in Fig 4, delivery/order in Fig 6, contracts in
      // Fig 18.1). The field is closed-enum at the schema; this renderer
      // copies the value verbatim because the schema is the gatekeeper.
      if (t.rendering?.labelStyle) {
        path.dataset.labelStyle = t.rendering.labelStyle;
      }
      svg.appendChild(path);
      elements.push(path);

      // Floating label rendered when this arrow is spotlight-highlighted.
      // The label sits at the midpoint of the visible Bezier curve, computed
      // analytically from the control point so we don't depend on
      // path.getPointAtLength (not available in the jsdom shim). The label is
      // an absolutely-positioned <div> sibling of the SVG so HTML/CSS styling
      // applies cleanly; visibility is hover-driven via spotlight CSS.
      if (t.rendering?.label) {
        const label = document.createElement("div");
        label.className = "tsm-arrow-label";
        label.dataset.from = t.from;
        label.dataset.to = t.to;
        label.dataset.emphasis = effectiveEmphasis(t);
        label._transfer = t;
        label.textContent = t.rendering.label;
        // Quadratic Bezier midpoint at t=0.5:
        //   B(0.5) = 0.25*P0 + 0.5*P1 + 0.25*P2
        // where P0=(fromX,fromY), P2=(toX,toY), P1=control point (cx,cy)
        // recomputed here to mirror routeArrowPath's geometry.
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        const offset = cellSize * 0.4;
        const arc = direction === "forward" ? +offset : -offset;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const cx = midX + nx * arc;
        const cy = midY + ny * arc;
        const labelX = 0.25 * fromX + 0.5 * cx + 0.25 * toX;
        const labelY = 0.25 * fromY + 0.5 * cy + 0.25 * toY;
        label.style.position = "absolute";
        label.style.left = `${gridEl.offsetLeft + labelX}px`;
        label.style.top = `${gridEl.offsetTop + labelY}px`;
        labelElements.push(label);
      } else {
        labelElements.push(null);
      }
    }

    wrapper.appendChild(svg);
    for (const label of labelElements) {
      if (label) wrapper.appendChild(label);
    }

    attachSpotlightHandles();

    // Re-apply the latest reveal tokens after rebuilding the SVG. Same
    // pattern as render/overlays.js — closes R1-B1 where rAF-scheduled
    // draws wiped applyReveal's visibility state.
    if (lastTokens !== null) applyRevealTokens(lastTokens);
    // Re-apply the current emphasis state (overrides + show-all). Same
    // rebuild guarantee: an emphasis change made BEFORE rAF still lands
    // on the new path/label nodes after rAF rebuilds them.
    applyEmphasisToElements();
  }

  function findDiagonalCell(taskId) {
    const cells = gridEl.querySelectorAll?.(".cell.diagonal") ?? [];
    return Array.from(cells).find((cell) => cell.dataset?.taskId === taskId) ?? null;
  }

  function attachSpotlightHandles() {
    // v1.5.2: the matrix-wrapper anchor used to register every intra-arrow
    // path as a target so that hovering anywhere in the matrix lit them all.
    // That convenience always won the pointerenter race over individual cell
    // anchors — the wrapper entered first and stayed entered. The "Show all
    // arrows" toggle already covers the show-everything gesture, so the
    // wrapper-hover registration is gone. Per-cell + per-path stays.
    const allPathEls = Array.from(elements);

    for (let i = 0; i < allPathEls.length; i++) {
      const pathEl = allPathEls[i];
      const labelEl = labelElements[i] ?? null;
      const targets = labelEl ? [pathEl, labelEl] : [pathEl];
      const fromCell = findDiagonalCell(pathEl.dataset.from);
      const toCell = findDiagonalCell(pathEl.dataset.to);
      if (fromCell) {
        spotlight.register({
          anchor: fromCell,
          targets,
          group: "intra-arrow",
          partnerAnchors: toCell ? [toCell] : [],
        });
      }
      if (toCell) {
        spotlight.register({
          anchor: toCell,
          targets,
          group: "intra-arrow",
          partnerAnchors: fromCell ? [fromCell] : [],
        });
      }
      spotlight.register({
        anchor: pathEl,
        targets,
      });
    }
  }

  // Internal: resolve + apply without touching `lastTokens`. Shared by the
  // public applyReveal entry point and draw()'s post-rebuild re-apply.
  function applyRevealTokens(tokens) {
    const { showForward, showBackward } = resolveReveal(tokens);
    for (const el of elements) {
      const isForward = el.classList.contains("forward");
      const visible = isForward ? showForward : showBackward;
      el.classList.toggle("visible", visible);
    }
  }

  function applyReveal(tokens) {
    lastTokens = tokens;
    applyRevealTokens(tokens);
    // H1e — re-layer the Explore emphasis so an active lens survives
    // walkthrough Next/Prev/Restart ("Explore wins composition"), instead of
    // the chip staying pressed while its force-revealed arrows vanish.
    applyEmphasisToElements();
  }

  function destroy() {
    clear();
    spotlight.destroy();
  }

  // Re-tag every rendered arrow + label with its current effective emphasis,
  // and toggle the wrapper-level show-all class. Called after redraw and
  // after applyEmphasis updates the override map.
  function applyEmphasisToElements() {
    // H1a (explore lens visibility) — arrows gate on `.visible` (set per
    // direction by the reveal layer). The Explore chip writes emphasis only,
    // so a lens-primary transfer the current step hasn't revealed stayed
    // hidden. Re-derive the visibility baseline from the latest reveal tokens,
    // then force-reveal the Explore layer's OWN primary arrows on top. Clearing
    // the lens empties exploreDiff → the next apply restores the baseline.
    if (lastTokens !== null) applyRevealTokens(lastTokens);
    const exploreDiff = emphasisState.exploreDiff;
    for (const el of elements) {
      const t = el._transfer;
      if (!t) continue;
      el.dataset.emphasis = effectiveEmphasis(t);
      if (exploreDiff.get(`${t.from}→${t.to}`) === "primary") el.classList.add("visible");
    }
    for (const label of labelElements) {
      if (!label) continue;
      const t = label._transfer;
      if (!t) continue;
      label.dataset.emphasis = effectiveEmphasis(t);
      if (exploreDiff.get(`${t.from}→${t.to}`) === "primary") label.classList.add("visible");
    }
    if (wrapper?.classList?.toggle) {
      wrapper.classList.toggle("tsm-show-all-emphasis", emphasisState.effectiveShowAll());
    }
  }

  /**
   * Update the runtime emphasis state. Accepts overrides as a Map or plain
   * object keyed by "${from}→${to}" → "primary"|"secondary", and an optional
   * showAll boolean. Items not referenced retain their JSON-declared
   * emphasis (the override map is the only place runtime overrides live).
   *
   * Pass `{ reset: true }` to clear overrides on the named layer (default
   * "walkthrough"). Explore-layer resets are independent from walkthrough
   * resets — the two state machines coexist via priority composition in
   * effectiveEmphasis (explore wins over walkthrough).
   *
   * `overrides` shape: production callers (walkthrough fan-out, Explore
   * disclosure) always pass a Map. Plain objects are accepted for test
   * ergonomics so unit tests can write `{ "A→B": "primary" }` directly.
   *
   * `showAll` writes are layered (v1.6.3 Batch C1): each layer owns its own
   * slot, effective = OR across layers. The "app" layer is used by app.js's
   * matrix-switcher "Show all arrows" button via setShowAllIntraArrows.
   *
   * v1.6.4 D1 — `layer:"app"` is showAll-only per SPEC §7.5 v0.3.6. Passing
   * `{ overrides, layer:"app" }` THROWS TypeError. The shared factory at
   * `render/emphasis-state.js` enforces the guard; this renderer delegates.
   *
   * @param {object} [args]
   * @param {Map|object} [args.overrides]
   * @param {boolean} [args.showAll]
   * @param {boolean} [args.reset]
   * @param {"walkthrough"|"explore"|"app"} [args.layer="walkthrough"]
   */
  const applyEmphasis = emphasisState.applyEmphasis;

  // v0.2: the intra-arrow show-all toggle is repurposed as the emphasis
  // gate release. Hover-spotlight's per-cell exploration stays orthogonal.
  // v1.6.3 Batch C1: writes the "app" layer of the layered showAll model so
  // an Explore pushShowAll(false) does not silently clear the matrix-switcher
  // button's state. v1.6.4 D1: delegated to factory's setAppShowAll.
  const setShowAllIntraArrows = emphasisState.setAppShowAll;

  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(draw);
  }

  // v1.6.4 D5.2 — count revealed-but-secondary intra-arrows for the
  // "Show all (N)" matrix-switcher button label. An item is "hidden by
  // emphasis" iff it would render at the secondary CSS opacity in the
  // current effective state: reveal-token gate has it `.visible`, the
  // effective showAll across all layers is OFF, and its data-emphasis is
  // "secondary". When effective showAll is ON the items are not visually
  // hidden — the button has nothing to toggle — so the count clamps to 0.
  function countHidden() {
    if (emphasisState.effectiveShowAll()) return 0;
    let n = 0;
    for (const el of elements) {
      if (!el.classList?.contains?.("visible")) continue;
      if (el.dataset?.emphasis !== "secondary") continue;
      n += 1;
    }
    return n;
  }

  return {
    redraw: draw,
    applyReveal,
    applyEmphasis,
    destroy,
    setShowAllIntraArrows,
    countHidden,
    elements,
  };
}
