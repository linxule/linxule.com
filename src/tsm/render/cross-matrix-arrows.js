// Cross-matrix arrow renderer. Mounts an SVG overlay spanning a parent
// container that holds two or more rendered matrix DOMs and draws Bezier
// paths between cells of different matrices — the "Contract" / transaction
// arrows of Fig 18.1 (Baldwin &amp; Holgersson, 2026) being the canonical
// case.
//
// Why a separate module: render/arrows.js is bounded to one matrix and
// computes coordinates from a single gridEl's cell grid. Cross-matrix
// arrows route in the WHITESPACE between two grids and need a wrapper
// reference frame so the SVG can span the gap. The two renderers share the
// same shape — Bezier path with reveal tokens — but the coordinate
// resolution differs enough that fusing them would obscure both.
//
// One <svg class="tsm-cross-arrows"> overlay holds all cross-matrix arrows
// for the wrapper. Each arrow is a <path> with class `.tsm-cross-arrow.<kind>`
// where `kind` is `transaction` (default — the contract case) / `forward` /
// `backward`. Dataset attributes `data-from-matrix`, `data-from-task`,
// `data-to-matrix`, `data-to-task` map an arrow back to its scene declaration.
//
// Reveal: cross-matrix arrows participate in the same applyReveal lifecycle
// as intra-matrix arrows. When ANY transfer-directed token is present
// (forward or backward) the arrow becomes visible. Conceptually the contract
// has no above/below-diagonal direction — it's a thin crossing point — so
// we tie its visibility to "any flow shown" rather than a single direction.
// Same closure-local `lastTokens` pattern as render/arrows.js.
//
// Hover progressive disclosure is delegated to render/hover-spotlight.js
// (v1.5 Phase 2 refactor). The component owns class-stamping
// (`spotlight-highlighted` on paths, `spotlight-partner` on partner cells,
// `spotlight-show-all-cross-arrow` on the wrapper) so this module only
// declares the anchor → targets → partners graph.

import { resolveReveal } from "./reveal.js";
import { createHoverSpotlight } from "./hover-spotlight.js";
import { createLayeredEmphasisState } from "./emphasis-state.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function createSVG(tag) {
  if (typeof document.createElementNS === "function") {
    return document.createElementNS(SVG_NS, tag);
  }
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
 * Route a cross-matrix arrow as a quadratic Bezier from (fromX, fromY) to
 * (toX, toY). The control point is pushed perpendicular to the from→to
 * vector so the arrow curves through the gap between matrices rather than
 * cutting straight across either grid. `offset` scales the curvature with
 * the distance between endpoints so short hops stay readable and long
 * spans don't flatten.
 *
 * Exported for testability.
 */
export function routeCrossArrowPath(fromX, fromY, toX, toY, offset) {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const len = Math.hypot(dx, dy) || 1;
  // Perpendicular unit vector. Push the control point one side of the
  // chord — the side doesn't matter geometrically; we pick the
  // anti-clockwise normal so left-to-right arrows curve downward and
  // right-to-left arrows curve upward, matching reading direction.
  const nx = -dy / len;
  const ny = dx / len;
  const cx = midX + nx * offset;
  const cy = midY + ny * offset;
  return `M ${fromX} ${fromY} Q ${cx} ${cy} ${toX} ${toY}`;
}

/**
 * Resolve an endpoint declaration to a `{ matrixHandle, taskIndex }`. Returns
 * null when the matrix index is out of range or the task id isn't in the
 * referenced matrix's task list. Callers (the renderer below + tests) treat
 * null as "skip this endpoint loudly" — they log via console.warn and stamp
 * the arrow element with a data-error attribute.
 *
 * Exported for testability.
 *
 * @param {{ matrix: number, taskId: string }} endpoint
 * @param {Array<{ sceneMatrix: { tasks: Array<{ id: string }> } }>} matrices
 */
export function resolveCrossMatrixEndpoint(endpoint, matrices) {
  if (!endpoint || typeof endpoint.matrix !== "number") return null;
  const handle = matrices[endpoint.matrix];
  if (!handle) return null;
  const tasks = handle.sceneMatrix?.tasks ?? [];
  const taskIndex = tasks.findIndex((t) => t.id === endpoint.taskId);
  if (taskIndex === -1) return null;
  return { handle, taskIndex };
}

/**
 * Mount the cross-matrix arrow layer.
 *
 * @param {HTMLElement} wrapper — parent container that visually holds all
 *   the matrix DOMs. The SVG overlay is appended to this element and sized
 *   to its bounding rect; arrow endpoints are computed in wrapper-local
 *   coordinates via each gridEl's getBoundingClientRect.
 * @param {Array<{ gridEl: HTMLElement, grid: { n: number }, sceneMatrix: { tasks: Array<{ id: string }> } }>} matrices
 *   — one handle per mounted matrix, ordered to match scene.matrices indices.
 *   A matrix the host hasn't mounted should be passed as `null`/`undefined`
 *   in its slot so arrow endpoints referencing it resolve cleanly to skip.
 * @param {Array<object>} sceneArrows — `scene.arrows[]` from a v0.3 tsm-scene
 * @returns {{ redraw, applyReveal, destroy, elements }}
 */
export function renderCrossMatrixArrows(wrapper, matrices, sceneArrows) {
  const arrows = sceneArrows ?? [];
  const elements = [];

  let svg = null;
  let lastTokens = null;

  // Runtime emphasis state — layered diffs. Two state machines push here:
  // walkthrough setEmphasis (one Map) and Explore chip filter (another).
  // effectiveEmphasis composes them; Explore wins over walkthrough so the
  // chip filter survives walkthrough Restart / Next / Prev (closes
  // CONVERGENCE-2 + carry-forward B3). Keys are arrow.id when declared,
  // else `${fromMatrix}:${fromTask}→${toMatrix}:${toTask}` fallback. The
  // app showAll slot is written by app.js's "Show all transactions"
  // matrix-switcher button via setShowAll.
  //
  // v1.6.4 D1: state machine is now provided by the shared factory
  // `createLayeredEmphasisState` in `render/emphasis-state.js`. The factory
  // owns the diff Maps + showAllByLayer + applyEmphasis routing/guard; this
  // renderer keeps its keying (arrowKey) and DOM apply pass. Cross-arrow's
  // applyEmphasisToElements additionally updates the legacy
  // `.spotlight-show-all-cross-arrow` wrapper class so the two stay in
  // lock-step.
  const emphasisState = createLayeredEmphasisState({
    callsite: "crossArrows.applyEmphasis",
    onApply: () => applyEmphasisToElements(),
  });

  function arrowKey(arrow) {
    if (arrow.id) return arrow.id;
    return `${arrow.from?.matrix}:${arrow.from?.taskId}→${arrow.to?.matrix}:${arrow.to?.taskId}`;
  }

  function effectiveEmphasis(arrow) {
    return emphasisState.effectiveEmphasis(arrowKey(arrow), arrow?.rendering?.emphasis);
  }

  // Hover progressive disclosure: a single spotlight scoped to the host
  // wrapper. Each draw() rebuilds path elements; clear() calls
  // spotlight.unregisterAll() to drop the previous registrations before
  // the underlying targets are GC'd.
  const spotlight = createHoverSpotlight(wrapper);

  function clear() {
    spotlight.unregisterAll();
    wrapper.querySelectorAll(".tsm-cross-arrows").forEach((el) => el.remove());
    elements.length = 0;
    svg = null;
  }

  function ensureMarker(defs) {
    const marker = createSVG("marker");
    setAttr(marker, "id", "tsm-cross-arrowhead");
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

  function endpointXY(resolved, wrapperRect) {
    // The cell representing task T sits at row=T, col=T on the diagonal.
    // We anchor at the cell center: (T + 0.5) * cellSize, measured in the
    // grid's local space, then translated into wrapper-local coordinates
    // using gridEl.getBoundingClientRect().
    const { handle, taskIndex } = resolved;
    const rect = handle.gridEl.getBoundingClientRect();
    const cellSize = rect.width / (handle.grid?.n || 1);
    const localX = (taskIndex + 0.5) * cellSize;
    const localY = (taskIndex + 0.5) * cellSize;
    return {
      x: rect.left - wrapperRect.left + localX,
      y: rect.top - wrapperRect.top + localY,
      cellSize,
    };
  }

  function draw() {
    clear();
    if (arrows.length === 0) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const width = wrapperRect.width;
    const height = wrapperRect.height;
    if (width === 0 || height === 0) return;

    svg = createSVG("svg");
    svg.classList.add("tsm-cross-arrows");
    setAttr(svg, "viewBox", `0 0 ${width} ${height}`);
    svg.style.position = "absolute";
    svg.style.left = "0";
    svg.style.top = "0";
    svg.style.width = `${width}px`;
    svg.style.height = `${height}px`;
    svg.style.pointerEvents = "none";

    const defs = createSVG("defs");
    ensureMarker(defs);
    svg.appendChild(defs);

    for (let ai = 0; ai < arrows.length; ai++) {
      const arrow = arrows[ai];
      const fromResolved = resolveCrossMatrixEndpoint(arrow.from, matrices);
      const toResolved = resolveCrossMatrixEndpoint(arrow.to, matrices);

      if (!fromResolved || !toResolved) {
        // Loud-non-fatal. Mirrors render/overlays.js firm-boundary
        // unknown-id pattern: log + stamp the surface so an inspector
        // (or test) can detect the misconfiguration without crashing
        // the mount. Skip the draw.
        if (typeof console !== "undefined" && typeof console.warn === "function") {
          const reason = !fromResolved ? "from" : "to";
          const ep = !fromResolved ? arrow.from : arrow.to;
          console.warn(
            `renderCrossMatrixArrows: arrow[${ai}] (${arrow.id ?? "<no-id>"}) ${reason} endpoint unresolved: ` +
            `${JSON.stringify(ep)}.`,
          );
        }
        const errorPath = createSVG("path");
        errorPath.classList.add("tsm-cross-arrow", "error");
        errorPath.dataset.arrowIndex = String(ai);
        errorPath.dataset.crossArrowError = !fromResolved ? "unresolved-from" : "unresolved-to";
        if (arrow.id) errorPath.dataset.id = arrow.id;
        svg.appendChild(errorPath);
        elements.push(errorPath);
        continue;
      }

      const fromCenter = endpointXY(fromResolved, wrapperRect);
      const toCenter = endpointXY(toResolved, wrapperRect);
      // Inset both endpoints toward each other along the chord by ~half a
      // cell so the arrowhead lands at the cell EDGE facing the gap, not on
      // top of the diagonal label at the cell center (#3: arrowheads were
      // covering cell text). Clamp the inset to 40% of the chord so close
      // endpoints don't cross past each other.
      const dxc = toCenter.x - fromCenter.x;
      const dyc = toCenter.y - fromCenter.y;
      const dist = Math.hypot(dxc, dyc) || 1;
      const ux = dxc / dist;
      const uy = dyc / dist;
      const fromInset = Math.min(fromCenter.cellSize * 0.5, dist * 0.4);
      const toInset = Math.min(toCenter.cellSize * 0.5, dist * 0.4);
      const from = { x: fromCenter.x + ux * fromInset, y: fromCenter.y + uy * fromInset };
      const to = { x: toCenter.x - ux * toInset, y: toCenter.y - uy * toInset };
      // Curvature: 25% of the (inset) chord length. A gentle arc that reads
      // as distinct from a straight line without overcurving long spans.
      const chord = Math.hypot(to.x - from.x, to.y - from.y);
      const d = routeCrossArrowPath(from.x, from.y, to.x, to.y, chord * 0.25);

      const kind = arrow.kind ?? "transaction";
      const path = createSVG("path");
      path.classList.add("tsm-cross-arrow", kind);
      path.dataset.fromMatrix = String(arrow.from.matrix);
      path.dataset.fromTask = String(arrow.from.taskId);
      path.dataset.toMatrix = String(arrow.to.matrix);
      path.dataset.toTask = String(arrow.to.taskId);
      path.dataset.emphasis = effectiveEmphasis(arrow);
      path._arrow = arrow;
      if (arrow.id) path.dataset.id = arrow.id;
      if (arrow.label) path.dataset.label = arrow.label;
      const lens = arrow.rendering?.lens;
      if (Array.isArray(lens) && lens.length > 0) {
        path.dataset.lens = lens.join(",");
      }
      // v1.6.4 D5.3 — labelStyle directive (e.g. "load-bearing" for contract
      // arrows in Fig 18.1). Orthogonal to lens; stamped for CSS + tests.
      if (arrow.rendering?.labelStyle) {
        path.dataset.labelStyle = arrow.rendering.labelStyle;
      }
      setAttr(path, "d", d);
      setAttr(path, "marker-end", "url(#tsm-cross-arrowhead)");
      // Re-enable pointer events ON THE PATHS only. The SVG container
      // keeps `pointer-events: none` so it doesn't block clicks reaching
      // the matrix grids underneath; the paths themselves opt back in
      // with `stroke` (hit-testing limited to the rendered stroke) so a
      // user can hover an arrow directly and light it up — third hover
      // route alongside diagonal-cell and matrix-wrapper hovers.
      path.style.pointerEvents = "stroke";
      svg.appendChild(path);
      elements.push(path);
    }

    wrapper.appendChild(svg);

    // Wire hover progressive disclosure via the shared spotlight component.
    // Each arrow's endpoint cells become anchors with the path as target +
    // the OTHER endpoint cell as partner. Each path itself is an anchor
    // (third hover route). Each matrix-wrapper an arrow touches becomes an
    // anchor for the full set of paths intersecting that matrix.
    attachSpotlightHandles();

    // Re-apply the latest reveal tokens after rebuilding the SVG. Same
    // pattern as render/arrows.js: a deferred rAF could wipe the visible
    // state that walkthrough.step(0) had already resolved.
    if (lastTokens !== null) applyRevealTokens(lastTokens);
    applyEmphasisToElements();
  }

  function applyEmphasisToElements() {
    for (const el of elements) {
      const arrow = el._arrow;
      if (!arrow) continue;
      el.dataset.emphasis = effectiveEmphasis(arrow);
    }
    const eff = emphasisState.effectiveShowAll();
    if (wrapper?.classList?.toggle) {
      wrapper.classList.toggle("tsm-show-all-emphasis", eff);
    }
    // Keep the spotlight wrapper class (`spotlight-show-all-cross-arrow`) in
    // lock-step with the effective showAll. Pre-v1.6.3 only setShowAll
    // touched this class; layering means any layer's flip needs to recompute.
    spotlight.setShowAll(eff, "cross-arrow");
  }

  /**
   * Update the runtime emphasis state. Layer-aware: walkthrough setEmphasis
   * writes hit "walkthrough"; Explore chip filter writes hit "explore"; the
   * app.js matrix-switcher "Show all transactions" button hits "app" via
   * the convenience `setShowAll` setter (v1.6.3 Batch C1; v1.6.4 D1 routes
   * through the shared factory).
   * reset:true clears BOTH the named layer's diff Map (when supported) AND
   * its Show All slot (symmetric, per SPEC §7.5 v0.3.6). Default layer =
   * "walkthrough". When a single call passes both `reset:true` and
   * `showAll: <boolean>`, the explicit showAll write wins (clear-first
   * then set).
   *
   * The showAll flag is also layered — each layer owns its own slot, the
   * effective gate = OR across layers. The spotlight wrapper class
   * (`spotlight-show-all-cross-arrow`) and `tsm-show-all-emphasis` toggle on
   * effective; both move in lock-step regardless of which layer triggered
   * (closes CLAUDE-H3 + pre-v1.6.3 leak where Explore.pushShowAll(false)
   * would clear the matrix-switcher button's state).
   *
   * v1.6.4 D1 — `layer:"app"` is showAll-only per SPEC §7.5 v0.3.6.
   * `applyEmphasis({ overrides, layer:"app" })` THROWS TypeError. The
   * shared factory at `render/emphasis-state.js` enforces the guard.
   *
   * `overrides` shape: production callers (walkthrough, Explore disclosure)
   * always pass a Map. Plain objects are accepted for test ergonomics so
   * unit tests can write `{ "arrowId": "primary" }` directly.
   */
  const applyEmphasis = emphasisState.applyEmphasis;

  function findDiagonalCell(handle, taskId) {
    // The diagonal cell carries data-task-id (see render/matrix.js); query
    // it within the handle's gridEl so we don't accidentally cross matrix
    // boundaries when both matrices share a wrapper.
    return handle.gridEl?.querySelector?.(
      `.cell.diagonal[data-task-id="${taskId}"]`,
    ) ?? null;
  }

  function attachSpotlightHandles() {
    // v1.5.2: the matrix-wrapper anchor used to register every cross-arrow
    // touching a matrix as a target — pointerenter on the wrapper lit every
    // arrow with an endpoint in it. That convenience always won over
    // cell-specific behavior because the wrapper's pointerenter fired first
    // and the wrapper didn't leave until the user exited the matrix
    // entirely. The "Show all transactions" toggle already covers the
    // show-everything gesture, so the wrapper-hover registration is gone.
    // Per-cell + per-path stays.
    for (let i = 0; i < arrows.length; i++) {
      const arrow = arrows[i];
      const pathEl = elements[i];
      if (!pathEl || pathEl.dataset?.crossArrowError) continue;

      const fromHandle = matrices[arrow.from?.matrix];
      const toHandle = matrices[arrow.to?.matrix];
      if (!fromHandle || !toHandle) continue;

      const fromCell = findDiagonalCell(fromHandle, arrow.from.taskId);
      const toCell = findDiagonalCell(toHandle, arrow.to.taskId);

      // Source cell: lights this path, outlines the destination cell.
      if (fromCell) {
        spotlight.register({
          anchor: fromCell,
          targets: [pathEl],
          group: "cross-arrow",
          partnerAnchors: toCell ? [toCell] : [],
        });
      }
      // Destination cell: lights this path, outlines the source cell.
      if (toCell) {
        spotlight.register({
          anchor: toCell,
          targets: [pathEl],
          group: "cross-arrow",
          partnerAnchors: fromCell ? [fromCell] : [],
        });
      }
      // Path itself: hover directly on the rendered stroke.
      spotlight.register({
        anchor: pathEl,
        targets: [pathEl],
        group: "cross-arrow",
      });
    }
  }

  function applyRevealTokens(tokens) {
    const { showForward, showBackward } = resolveReveal(tokens);
    // Cross-matrix arrows reveal once ANY transfer-directed token is
    // present — the contract is meaningful as soon as either firm's flow
    // is on screen. Kind-specific reveal (transaction vs forward vs
    // backward) could be layered on later; today the union is enough for
    // Fig 18.1 and keeps the reveal table from gaining a new entry.
    const visible = showForward || showBackward;
    for (const el of elements) {
      // Don't toggle visibility on error placeholders; they're stamped
      // for inspection only and shouldn't appear in any reveal state.
      if (el.dataset.crossArrowError) continue;
      el.classList.toggle("visible", visible);
    }
  }

  function applyReveal(tokens) {
    lastTokens = tokens;
    applyRevealTokens(tokens);
  }

  function destroy() {
    clear();
    // spotlight.destroy() clears all listeners + spotlight classes (including
    // the show-all wrapper class), so the next mount into the same wrapper
    // starts from a clean state. Mirror of mountAllMatrices' .multi-mount
    // cleanup (see main.js destroy()).
    spotlight.destroy();
  }

  /**
   * Toggle the "show all transactions" mode. When `on` is true the wrapper
   * gains `.spotlight-show-all-cross-arrow`, which CSS uses to force every
   * cross-matrix arrow to full opacity regardless of hover. Persists until
   * the next call (or destroy).
   *
   * @param {boolean} on
   */
  // v0.2: the cross-arrow show-all toggle is repurposed as the emphasis
  // gate release. The legacy spotlight wrapper class is also kept so
  // existing CSS rules that gate on `.spotlight-show-all-cross-arrow`
  // continue to work for power-user hovers — the two are additive.
  //
  // v1.6.3 Batch C1: writes the "app" layer of the layered showAll model
  // (used by app.js's "Show all transactions" matrix-switcher button). An
  // Explore pushShowAll(false) — which writes the "explore" layer — no
  // longer clobbers this state. applyEmphasisToElements recomputes the
  // effective OR-state for both wrapper classes. v1.6.4 D1: delegated to
  // factory's setAppShowAll.
  const setShowAll = emphasisState.setAppShowAll;

  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(draw);
  }

  // v1.6.4 D5.2 — count revealed-but-secondary cross-matrix arrows for the
  // "Show all (N)" matrix-switcher "Show all transactions" label. Cross-
  // arrows gate on reveal tokens (`.visible`); error placeholders carry
  // `data-cross-arrow-error` and never contribute to N. When effective
  // showAll is ON the items aren't visually hidden — count clamps to 0.
  function countHidden() {
    if (emphasisState.effectiveShowAll()) return 0;
    let n = 0;
    for (const el of elements) {
      if (!el) continue;
      if (el.dataset?.crossArrowError) continue;
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
    setShowAll,
    countHidden,
    elements,
  };
}
