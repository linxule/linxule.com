// Annotation renderer. Mounts the peripheral labels from
// `matrix.annotations[]` around the grid, with optional pointer lines to
// regions, single cells, or row/column ranges.
//
// Each annotation gets its own absolutely-positioned label DIV with a
// `data-position` attribute that styles/overlays.css maps to a margin
// offset (top / bottom / left / right / external-NE/SE/NW/SW). When
// `pointer` resolves to a target on the grid we additionally emit a thin
// SVG pointer line from the label edge toward the target's centroid.
//
// The renderer is intentionally permissive: an annotation with no pointer,
// or with a pointer that doesn't resolve, still produces a label so authors
// can use it for unanchored captions. Unresolvable pointers degrade
// gracefully — they leave a marker dataset attribute (`data-pointer-status`)
// so tests can distinguish "no pointer" from "couldn't resolve".

import { buildTaskIndex } from "./util.js";
import { createLayeredEmphasisState } from "./emphasis-state.js";
import { createHoverSpotlight } from "./hover-spotlight.js";

// Disclosure threshold: matrices with 3+ annotations ghost their labels +
// pointer lines by default and surface on hover. Below the threshold,
// annotations stay always-visible (the marginal clutter doesn't justify a
// hover gesture). Store-household (5) and job-shop (3) hit the gate; the
// other Path A scenes mostly carry 0–2 annotations and stay unaffected.
const ANNOTATION_DISCLOSURE_THRESHOLD = 3;

const VALID_POSITIONS = new Set([
  "top",
  "right",
  "bottom",
  "left",
  "external-NE",
  "external-NW",
  "external-SE",
  "external-SW",
]);

/**
 * Resolve an annotation pointer to a cell bbox (row range + col range) in
 * grid coordinates. Returns null when the pointer can't be resolved.
 */
export function resolvePointer(pointer, matrix, taskIndex) {
  if (!pointer) return null;

  if (pointer.taskId) {
    const i = taskIndex.get(pointer.taskId);
    if (i === undefined) return { resolved: false, reason: "unknown-task" };
    return {
      resolved: true,
      kind: "task",
      rowStart: i,
      rowEnd: i,
      colStart: i,
      colEnd: i,
    };
  }

  if (pointer.regionId) {
    const regionTaskIndices = [];
    for (let i = 0; i < matrix.tasks.length; i++) {
      if (matrix.tasks[i].region === pointer.regionId) regionTaskIndices.push(i);
    }
    if (regionTaskIndices.length === 0) return { resolved: false, reason: "unknown-region" };
    const min = Math.min(...regionTaskIndices);
    const max = Math.max(...regionTaskIndices);
    return {
      resolved: true,
      kind: "region",
      rowStart: min,
      rowEnd: max,
      colStart: min,
      colEnd: max,
    };
  }

  if (pointer.rowRange) {
    const [from, to] = pointer.rowRange;
    const fi = taskIndex.get(from);
    const ti = taskIndex.get(to);
    if (fi === undefined || ti === undefined) return { resolved: false, reason: "unknown-row-range" };
    return {
      resolved: true,
      kind: "row-range",
      rowStart: Math.min(fi, ti),
      rowEnd: Math.max(fi, ti),
      colStart: 0,
      colEnd: matrix.tasks.length - 1,
    };
  }

  if (pointer.columnRange) {
    const [from, to] = pointer.columnRange;
    const fi = taskIndex.get(from);
    const ti = taskIndex.get(to);
    if (fi === undefined || ti === undefined) return { resolved: false, reason: "unknown-column-range" };
    return {
      resolved: true,
      kind: "column-range",
      rowStart: 0,
      rowEnd: matrix.tasks.length - 1,
      colStart: Math.min(fi, ti),
      colEnd: Math.max(fi, ti),
    };
  }

  return { resolved: false, reason: "empty-pointer" };
}

/**
 * Mount annotations for a matrix into the wrapper.
 *
 * @param {HTMLElement} wrapper — outer container; annotations append here
 *   so their absolute positioning resolves against the same coordinate
 *   space as the module-border / firm-boundary overlays.
 * @param {HTMLElement} gridEl — the .tsm-grid element
 * @param {object} grid — output of core/layout.js computeGrid; provides `n`
 * @param {object} matrix — the matrix object with `annotations[]` + `tasks[]`
 * @returns {{ redraw, destroy, elements }} — `elements` is the array of
 *   created annotation label DIVs in declaration order, useful for tests.
 */
export function renderAnnotations(wrapper, gridEl, grid, matrix) {
  const annotations = matrix.annotations ?? [];
  const taskIndex = buildTaskIndex(matrix.tasks);
  const elements = [];

  const spotlight = createHoverSpotlight(wrapper);

  // Runtime emphasis overrides — layered diffs keyed by annotation index.
  // Walkthrough setEmphasis writes into walkthroughDiff; Explore chip
  // filter writes into exploreDiff. effectiveEmphasis composes them with
  // explore winning. JSON declarations live on annotation.rendering.emphasis
  // (default: "secondary" per SPEC-LENSES §3.1 v0.4 — matches overlays.js
  // and arrows.js. Was "primary" pre-v1.6.2 — closes CLAUDE-M-NEW2).
  //
  // v1.6.4 D1: state machine is now provided by the shared factory
  // `createLayeredEmphasisState` in `render/emphasis-state.js`. The factory
  // owns the diff Maps + showAllByLayer + applyEmphasis routing/guard; this
  // renderer keeps its keying (annotation index, normalized to number via
  // the `overrides` write below) and DOM apply pass.
  const emphasisState = createLayeredEmphasisState({
    callsite: "annotations.applyEmphasis",
    onApply: () => applyEmphasisToElements(),
  });

  function effectiveEmphasis(idx, annotation) {
    return emphasisState.effectiveEmphasis(idx, annotation?.rendering?.emphasis);
  }
  // Track ghost-default opt-in so destroy() can reverse the wrapper class
  // even if the threshold no longer applies on a later draw.
  let ghostClassApplied = false;

  function clear() {
    spotlight.unregisterAll();
    wrapper.querySelectorAll(".tsm-annotation, .tsm-annotation-pointer").forEach((el) => el.remove());
    elements.length = 0;
  }

  function drawOne(annotation, ai, cellSize, positionGroup) {
    const position = VALID_POSITIONS.has(annotation.position) ? annotation.position : "top";

    const label = document.createElement("div");
    label.className = "tsm-annotation";
    label.dataset.position = position;
    label.dataset.annotationIndex = String(ai);
    label.dataset.emphasis = effectiveEmphasis(ai, annotation);
    const lensList = annotation.rendering?.lens;
    if (Array.isArray(lensList) && lensList.length > 0) {
      label.dataset.lens = lensList.join(",");
    }
    // v1.6.4 D5.3 — orthogonal labelStyle directive (closed enum: load-bearing).
    if (annotation.rendering?.labelStyle) {
      label.dataset.labelStyle = annotation.rendering.labelStyle;
    }
    label.textContent = annotation.label;
    elements.push(label);

    // Per-annotation handle returned so the post-loop wiring can register
    // spotlight anchors / targets. `pointerSvg` is set below if the pointer
    // resolves; `resolved` is the bbox (or null/unresolved marker).
    const result = { label, pointerSvg: null, resolved: null };

    // Resolve pointer (if any) and stash the resolution on the label so
    // tests can verify without re-running resolvePointer.
    const resolved = resolvePointer(annotation.pointer, matrix, taskIndex);
    result.resolved = resolved;
    if (resolved && resolved.resolved) {
      label.dataset.pointerStatus = "resolved";
      label.dataset.pointerKind = resolved.kind;
    } else if (resolved && !resolved.resolved) {
      label.dataset.pointerStatus = "unresolved";
      label.dataset.pointerReason = resolved.reason;
    } else {
      label.dataset.pointerStatus = "none";
    }

    // Inline-position the label relative to the grid box. The label sits
    // next to the grid edge per its position; CSS handles the offset.
    label.style.position = "absolute";
    const gridLeft = gridEl.offsetLeft;
    const gridTop = gridEl.offsetTop;
    const gridRect = gridEl.getBoundingClientRect();
    const gridSize = gridRect.width;

    // v1.5.2: stagger same-position annotations so they don't overlap. For
    // a position-group of count N>1, distribute labels along the axis
    // perpendicular to the edge (top/bottom -> horizontal offset; left/right
    // -> vertical offset). Single-annotation groups keep the original
    // centered placement (idx=0, count=1 -> offset=0).
    const groupCount = positionGroup?.count ?? 1;
    const groupIndex = positionGroup?.index ?? 0;
    const STAGGER_SPREAD = 80;
    let staggerOffset = 0;
    if (groupCount > 1) {
      const step = STAGGER_SPREAD / Math.max(groupCount - 1, 1);
      staggerOffset = -STAGGER_SPREAD / 2 + groupIndex * step;
    }

    switch (position) {
      case "top":
        label.style.left = `${gridLeft + gridSize / 2 + staggerOffset}px`;
        label.style.top = `${gridTop - 28}px`;
        label.style.transform = "translateX(-50%)";
        break;
      case "bottom":
        label.style.left = `${gridLeft + gridSize / 2 + staggerOffset}px`;
        label.style.top = `${gridTop + gridSize + 8}px`;
        label.style.transform = "translateX(-50%)";
        break;
      case "left":
        label.style.left = `${gridLeft - 8}px`;
        label.style.top = `${gridTop + gridSize / 2 + staggerOffset}px`;
        label.style.transform = "translate(-100%, -50%)";
        break;
      case "right":
        label.style.left = `${gridLeft + gridSize + 8}px`;
        label.style.top = `${gridTop + gridSize / 2 + staggerOffset}px`;
        label.style.transform = "translateY(-50%)";
        break;
      case "external-NE":
        label.style.left = `${gridLeft + gridSize + 8}px`;
        label.style.top = `${gridTop - 4}px`;
        break;
      case "external-NW":
        label.style.left = `${gridLeft - 8}px`;
        label.style.top = `${gridTop - 4}px`;
        label.style.transform = "translateX(-100%)";
        break;
      case "external-SE":
        label.style.left = `${gridLeft + gridSize + 8}px`;
        label.style.top = `${gridTop + gridSize - 24}px`;
        break;
      case "external-SW":
        label.style.left = `${gridLeft - 8}px`;
        label.style.top = `${gridTop + gridSize - 24}px`;
        label.style.transform = "translateX(-100%)";
        break;
    }

    wrapper.appendChild(label);

    // Pointer line from the label edge to the target centroid.
    if (resolved && resolved.resolved && cellSize > 0) {
      const targetCx = gridLeft + ((resolved.colStart + resolved.colEnd + 1) / 2) * cellSize;
      const targetCy = gridTop + ((resolved.rowStart + resolved.rowEnd + 1) / 2) * cellSize;

      const svgNS = "http://www.w3.org/2000/svg";
      const svg = (typeof document.createElementNS === "function")
        ? document.createElementNS(svgNS, "svg")
        : document.createElement("svg");
      svg.classList.add("tsm-annotation-pointer");
      svg.dataset.annotationIndex = String(ai);
      // v1.6.3 Batch C1 Fix 3 — mirror the label's data-emphasis onto the
      // pointer SVG so applyEmphasisToElements can keep them in sync. Pre-
      // v1.6.3 the pointer was orphaned: the secondary-annotation hide rule
      // only matched `.tsm-annotation[data-emphasis="secondary"]`, leaving
      // the resolved pointer line visible after the label was hidden.
      svg.dataset.emphasis = effectiveEmphasis(ai, annotation);
      svg.style.position = "absolute";
      svg.style.left = `${gridLeft}px`;
      svg.style.top = `${gridTop}px`;
      svg.style.width = `${gridSize}px`;
      svg.style.height = `${gridSize}px`;
      if (typeof svg.setAttribute === "function") {
        svg.setAttribute("viewBox", `0 0 ${gridSize} ${gridSize}`);
      }

      // The line starts from the label-side edge of the grid (anchor based
      // on position) and ends at the target centroid. We approximate the
      // label edge as the grid edge — CSS already keeps the label adjacent.
      let x1, y1;
      switch (position) {
        case "top":            x1 = gridSize / 2; y1 = 0; break;
        case "bottom":         x1 = gridSize / 2; y1 = gridSize; break;
        case "left":           x1 = 0; y1 = gridSize / 2; break;
        case "right":          x1 = gridSize; y1 = gridSize / 2; break;
        case "external-NE":    x1 = gridSize; y1 = 0; break;
        case "external-NW":    x1 = 0; y1 = 0; break;
        case "external-SE":    x1 = gridSize; y1 = gridSize; break;
        case "external-SW":    x1 = 0; y1 = gridSize; break;
        default:               x1 = gridSize / 2; y1 = 0;
      }
      const x2 = targetCx - gridLeft;
      const y2 = targetCy - gridTop;

      const line = (typeof document.createElementNS === "function")
        ? document.createElementNS(svgNS, "line")
        : document.createElement("line");
      if (typeof line.setAttribute === "function") {
        line.setAttribute("x1", String(x1));
        line.setAttribute("y1", String(y1));
        line.setAttribute("x2", String(x2));
        line.setAttribute("y2", String(y2));
      } else {
        // Shim fallback: store as dataset so tests can read.
        line.dataset.x1 = String(x1);
        line.dataset.y1 = String(y1);
        line.dataset.x2 = String(x2);
        line.dataset.y2 = String(y2);
      }
      svg.appendChild(line);
      wrapper.appendChild(svg);
      result.pointerSvg = svg;
    }

    return result;
  }

  // Resolve a resolved-pointer bbox to one or more anchor DOM elements
  // inside the grid. For a task pointer this is the single diagonal cell;
  // for a region / row-range / column-range it's every diagonal cell whose
  // task index falls within the resolved row span. Returns [] when no
  // matching elements are found (e.g., when the grid has not yet rendered
  // diagonal cells in test setups that don't seed them).
  function resolveAnchorElements(resolved) {
    if (!resolved || !resolved.resolved) return [];
    const cells = gridEl.querySelectorAll?.(".cell.diagonal") ?? [];
    const matched = [];
    for (const cell of Array.from(cells)) {
      const tid = cell.dataset?.taskId;
      if (!tid) continue;
      const i = taskIndex.get(tid);
      if (i === undefined) continue;
      if (i >= resolved.rowStart && i <= resolved.rowEnd) matched.push(cell);
    }
    return matched;
  }

  function wireSpotlights(perAnnotation) {
    // Matrix-wrapper hover surfaces every annotation in this matrix at once.
    // Each annotation contributes its label (+ pointer SVG when present) as
    // a target — including annotations without a resolvable pointer, which
    // would otherwise have no individual surface gesture.
    const allTargets = [];
    for (const { label, pointerSvg } of perAnnotation) {
      allTargets.push(label);
      if (pointerSvg) allTargets.push(pointerSvg);
    }
    if (allTargets.length > 0) {
      spotlight.register({
        anchor: wrapper,
        targets: allTargets,
        group: "annotation",
      });
    }

    // Per-annotation: hovering the resolved anchor (cell or region span)
    // surfaces just that annotation. Annotations without a resolvable
    // pointer skip this step — matrix-wrapper hover is their only gesture.
    for (const { label, pointerSvg, resolved } of perAnnotation) {
      const targets = pointerSvg ? [label, pointerSvg] : [label];
      const anchors = resolveAnchorElements(resolved);
      for (const anchor of anchors) {
        spotlight.register({
          anchor,
          targets,
          group: "annotation",
        });
      }
    }
  }

  function draw() {
    clear();
    if (annotations.length === 0) return;
    const gridRect = gridEl.getBoundingClientRect();
    const cellSize = gridRect.width / grid.n;

    // Group annotations by their effective (post-validation) position, then
    // assign each annotation its index within the group. drawOne uses this
    // to stagger labels that would otherwise share the same anchor point.
    // External-corner positions (external-NE/SE/NW/SW) are unique by design
    // but participate in the same group bookkeeping for uniformity.
    const groupCounts = new Map();
    const groupIndices = annotations.map((a) => {
      const pos = VALID_POSITIONS.has(a.position) ? a.position : "top";
      const idx = groupCounts.get(pos) ?? 0;
      groupCounts.set(pos, idx + 1);
      return { pos, index: idx };
    });
    const perAnnotation = annotations.map((a, ai) => {
      const { pos, index } = groupIndices[ai];
      const count = groupCounts.get(pos) ?? 1;
      return drawOne(a, ai, cellSize, { count, index });
    });

    // Disclosure threshold: only wire ghost-and-hover when the matrix has
    // enough annotations to crowd the margins. Below the threshold the
    // labels stay always-visible (current default behavior).
    if (annotations.length >= ANNOTATION_DISCLOSURE_THRESHOLD) {
      wrapper.classList?.add?.("has-many-annotations");
      ghostClassApplied = true;
      wireSpotlights(perAnnotation);
    } else if (ghostClassApplied) {
      wrapper.classList?.remove?.("has-many-annotations");
      ghostClassApplied = false;
    }
    // Re-apply emphasis state in case a setEmphasis call happened before
    // the deferred rAF rebuild fired.
    applyEmphasisToElements();
  }

  function destroy() {
    clear();
    if (ghostClassApplied) {
      wrapper.classList?.remove?.("has-many-annotations");
      ghostClassApplied = false;
    }
    spotlight.destroy();
  }

  function applyEmphasisToElements() {
    // Label nodes (`.tsm-annotation`) are tracked in `elements` parallel to
    // the annotations array. Pointer SVGs (`.tsm-annotation-pointer`) live
    // as wrapper siblings keyed by `data-annotation-index`; we re-query and
    // re-stamp both surfaces so an emphasis change touches BOTH (v1.6.3
    // Batch C1 Fix 3 — pre-v1.6.3 only the label was updated and resolved
    // pointers stayed visible after the label was hidden).
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const annotation = annotations[i];
      if (!el || !annotation) continue;
      const eff = effectiveEmphasis(i, annotation);
      el.dataset.emphasis = eff;
    }
    const pointers = wrapper.querySelectorAll?.(".tsm-annotation-pointer") ?? [];
    for (const ptr of Array.from(pointers)) {
      const idx = ptr.dataset?.annotationIndex;
      if (idx === undefined || idx === null || idx === "") continue;
      const i = Number(idx);
      const annotation = annotations[i];
      if (!annotation) continue;
      ptr.dataset.emphasis = effectiveEmphasis(i, annotation);
    }
    if (wrapper?.classList?.toggle) {
      wrapper.classList.toggle("tsm-show-all-emphasis", emphasisState.effectiveShowAll());
    }
  }

  /**
   * Update the runtime emphasis state. Layer-aware: walkthrough setEmphasis
   * writes hit "walkthrough"; Explore chip filter writes hit "explore"; the
   * matrix-switcher app slot is showAll-only (annotations have no current
   * app-layer writer; the slot exists for shape symmetry with the other
   * three renderers).
   * reset:true clears BOTH the named layer's diff Map AND its Show All
   * slot (symmetric, per SPEC §7.5 v0.3.6). Default layer = "walkthrough"
   * for back-compat. When a single call passes both `reset:true` and
   * `showAll: <boolean>`, the explicit showAll write wins (clear-first
   * then set).
   *
   * v1.6.4 D1 — `layer:"app"` is showAll-only per SPEC §7.5 v0.3.6.
   * `applyEmphasis({ overrides, layer:"app" })` THROWS TypeError.
   *
   * `overrides` shape: production callers (walkthrough fan-out, Explore
   * disclosure) always pass a Map. Plain objects are accepted for test
   * ergonomics so unit tests can write `{ 0: "primary" }` directly. Keys
   * may be numeric indices or string annotation ids — string keys that
   * parse as integers are normalized to numeric indices before reaching
   * the factory's diff Map, so DOM lookups by `Number(idx)` find them.
   */
  function applyEmphasis(args = {}) {
    if (args.overrides) {
      const entries = args.overrides instanceof Map
        ? args.overrides.entries()
        : Object.entries(args.overrides);
      const normalized = new Map();
      for (const [k, v] of entries) {
        const idx = typeof k === "string" && /^\d+$/.test(k) ? Number(k) : k;
        normalized.set(idx, v);
      }
      emphasisState.applyEmphasis({ ...args, overrides: normalized });
    } else {
      emphasisState.applyEmphasis(args);
    }
  }

  // Initial paint deferred until after the browser lays out the grid.
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(draw);
  }

  // v1.6.4 D5.2 — count annotation labels currently rendered secondary for
  // the "Show all (N)" matrix-switcher label (aggregated via
  // controller.countHidden; the Explore Show All button was removed in
  // v0.4.1). Annotations don't gate on
  // reveal tokens; they're always rendered (the schema doesn't ship an
  // overlay-style `.visible` class for the label surface), so "revealed"
  // here means "the label element exists in the DOM". When effective
  // showAll is ON the items aren't visually hidden — count clamps to 0.
  function countHidden() {
    if (emphasisState.effectiveShowAll()) return 0;
    let n = 0;
    for (const el of elements) {
      if (!el) continue;
      if (el.dataset?.emphasis !== "secondary") continue;
      n += 1;
    }
    return n;
  }

  return {
    redraw: draw,
    destroy,
    applyEmphasis,
    countHidden,
    elements,
  };
}
