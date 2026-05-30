// Shared utilities for the renderer modules.
//
// Kept intentionally tiny: anything here must be (a) pure, (b) used by two or
// more render/* files, and (c) free of DOM dependencies. Adding helpers that
// touch the DOM belongs in the consuming renderer, not here.

/**
 * Build a task-id → index lookup for a matrix's task list.
 *
 * Shared by render/annotations.js, render/arrows.js, and render/overlays.js
 * (firm-boundary path). All three need the same id-keyed integer index to
 * map a declared `taskId` / `from` / `to` / `excludedTaskIds` entry to its
 * grid position.
 *
 * @param {Array<{ id: string }>} tasks — matrix.tasks
 * @returns {Map<string, number>}
 */
export function buildTaskIndex(tasks) {
  const idx = new Map();
  for (let i = 0; i < tasks.length; i++) idx.set(tasks[i].id, i);
  return idx;
}

// Emphasis layer constants (v1.6.3 — Round-3 adversarial pickup #3;
// extended v1.6.3 Batch C1 to include APP; documented v1.6.4 D1).
//
// The layered-diff model (SPEC-LENSES §7.5) keys diff Maps by an open
// string `layer: "walkthrough" | "explore" | "app"`. Every renderer's
// `applyEmphasis` defaults to "walkthrough" for back-compat, which means a
// typo like `layer: "Walkthrough"` silently falls through the
// `layer === "explore" ? exploreDiff : walkthroughDiff` ternary and writes
// to the walkthrough layer. The Claude audit's adversarial pickup #3 named
// this as a footgun.
//
// EMPHASIS_LAYERS is a frozen const-enum — callsites import the symbol
// rather than spelling the string. assertEmphasisLayer is a defensive
// guard: it accepts the three known strings (WALKTHROUGH / EXPLORE / APP)
// so external callers that pass raw strings still work, and warns once per
// unknown value so a typo surfaces in the console without breaking the
// call. The ternary still routes unknown layers to walkthroughDiff — the
// warning is the signal.
//
// `APP` is showAll-only per SPEC §7.5 v0.3.6: the renderer factory in
// `render/emphasis-state.js` THROWS a TypeError when a caller passes both
// `overrides` and `layer: "app"`. The two override-supporting layers are
// `WALKTHROUGH` and `EXPLORE`.
export const EMPHASIS_LAYERS = Object.freeze({
  WALKTHROUGH: "walkthrough",
  EXPLORE: "explore",
  // v1.6.3 Batch C1 — `APP` is the layer the app.js matrix-switcher buttons
  // ("Show all transactions" / "Show all arrows") write into. Pre-v1.6.3
  // those buttons routed through `setShowAllCrossArrows` / `setShowAllIntraArrows`,
  // which wrote directly into a single scalar `showAllEmphasis` that any
  // subsequent Explore `pushShowAll(false)` could silently clear — leaving
  // the button's aria-pressed="true" out of sync with the renderer state.
  // Layering the boolean alongside the diff Maps means each gesture owns its
  // own slot; the effective showAll is the OR across all layers.
  APP: "app",
});

const KNOWN_LAYERS = new Set(Object.values(EMPHASIS_LAYERS));
const warnedLayerTypos = new Set();

/**
 * Warn once per unknown emphasis-layer value. The renderer still routes
 * the unknown layer to the walkthrough diff (back-compat with the existing
 * ternary) — this guard is the signal that something is wrong.
 *
 * @param {string} layer
 * @param {string} callsite — identifier for the calling renderer (helps
 *   point at the right code path in the warning).
 */
export function assertEmphasisLayer(layer, callsite = "applyEmphasis") {
  if (KNOWN_LAYERS.has(layer)) return;
  const key = `${callsite}:${layer}`;
  if (warnedLayerTypos.has(key)) return;
  warnedLayerTypos.add(key);
  // eslint-disable-next-line no-console
  console.warn(
    `${callsite}: unknown emphasis layer "${layer}" — expected one of ${[...KNOWN_LAYERS].join(", ")}. ` +
    "Falling back to walkthrough layer; check for typos or import EMPHASIS_LAYERS from render/util.js.",
  );
}
