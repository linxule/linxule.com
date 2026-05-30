// Layered emphasis state factory (v1.6.4 D1).
//
// Pre-v1.6.4 the four renderers (arrows, overlays, annotations,
// cross-matrix-arrows) each carried an identical copy of:
//   - `walkthroughDiff: Map`
//   - `exploreDiff: Map`
//   - `showAllByLayer = { walkthrough, explore, app }`
//   - `effectiveShowAll()` (OR across slots)
//   - `effectiveEmphasis(key)` (explore > walkthrough > declared)
//   - `applyEmphasis({ overrides, showAll, reset, layer })`
//
// The bodies diverged only in keying strategy and DOM application. v1.6.3
// integration audits flagged both the duplication (N2) and a layer-routing
// footgun: `targetDiff` was binary (walkthrough/explore) while `slot` was
// ternary (walkthrough/explore/app), so a call with `{ overrides,
// layer: "app" }` would silently land the overrides in `walkthroughDiff`.
// SPEC §7.5 v0.3.5 documented `app` as showAll-only; this factory now
// enforces it at runtime.
//
// Contract (SPEC §7.5 v0.3.6):
//   - `app` is a showAll-only layer. Override Maps are walkthrough + explore
//     only — no `appDiff`.
//   - `applyEmphasis({ overrides, layer: "app" })` THROWS `TypeError`.
//     Loud failure beats silent misroute.
//   - `reset: true` clears BOTH the named layer's diff Map (when overrides
//     are supported) AND its Show All slot. Symmetric clear.
//   - When a call passes both `reset: true` and `showAll: <boolean>`, the
//     explicit showAll write wins (clear-first then set).
//   - `effectiveEmphasis` composition order is explore > walkthrough >
//     declared. `app` does not participate in the override composition.
//   - `effectiveShowAll` is OR across walkthrough / explore / app slots.

import { assertEmphasisLayer } from "./util.js";

/**
 * Build the layered emphasis state for one renderer. The factory owns the
 * runtime state (diff Maps + showAllByLayer); the renderer owns the keying
 * strategy and DOM application via `onApply`.
 *
 * @param {object} config
 * @param {string} config.callsite — identifier used in assertion warnings
 *   ("arrows.applyEmphasis" / "overlays.applyEmphasis" / etc.). Helps a
 *   future reader trace which renderer hit a bad layer.
 * @param {() => void} [config.onApply] — called after every applyEmphasis
 *   mutation. Renderers wire their `applyEmphasisToElements` here so a state
 *   change immediately re-stamps the DOM.
 * @returns {{
 *   applyEmphasis: (args?: { overrides?: Map|object, showAll?: boolean, reset?: boolean, layer?: string }) => void,
 *   effectiveEmphasis: (key: any, declaredFallback?: any) => any,
 *   effectiveShowAll: () => boolean,
 *   setAppShowAll: (on: boolean) => void,
 *   walkthroughDiff: Map<any, any>,
 *   exploreDiff: Map<any, any>,
 *   showAllByLayer: { walkthrough: boolean, explore: boolean, app: boolean },
 * }}
 */
export function createLayeredEmphasisState({ callsite, onApply } = {}) {
  const walkthroughDiff = new Map();
  const exploreDiff = new Map();
  const showAllByLayer = { walkthrough: false, explore: false, app: false };

  function effectiveShowAll() {
    return showAllByLayer.walkthrough || showAllByLayer.explore || showAllByLayer.app;
  }

  /**
   * Compose the effective emphasis for a key: explore > walkthrough >
   * declared fallback. The caller supplies the declared fallback so the
   * factory stays renderer-agnostic (arrows uses `t.rendering?.emphasis`,
   * overlays uses `overlayDecls.get(gid)?.emphasis`, annotations uses
   * `annotation?.rendering?.emphasis`, cross-arrows uses
   * `arrow?.rendering?.emphasis`).
   */
  function effectiveEmphasis(key, declaredFallback) {
    if (exploreDiff.has(key)) return exploreDiff.get(key);
    if (walkthroughDiff.has(key)) return walkthroughDiff.get(key);
    return declaredFallback ?? "secondary";
  }

  function applyEmphasis({ overrides, showAll, reset, layer = "walkthrough" } = {}) {
    assertEmphasisLayer(layer, callsite ?? "applyEmphasis");

    // v1.6.4 — `app` is showAll-only per SPEC §7.5 v0.3.6. Pre-v1.6.4 the
    // binary `targetDiff` / ternary `slot` mismatch silently routed
    // `{ overrides, layer:"app" }` writes to `walkthroughDiff`. Loud failure
    // beats silent misroute: throw at function head so a future caller (or
    // a typo) surfaces immediately rather than corrupting renderer state.
    if (overrides && layer === "app") {
      throw new TypeError(
        `${callsite ?? "applyEmphasis"}: layer:"app" does not support overrides; ` +
        "the `app` layer accepts only `showAll` and `reset` (see SPEC §7.5 v0.3.6). " +
        "For per-item override writes, route through layer:\"walkthrough\" or layer:\"explore\".",
      );
    }

    // Override routing is binary — walkthrough or explore. The slot tracking
    // for showAll is ternary (walkthrough / explore / app); `app` falls
    // through here without an override Map.
    const targetDiff = layer === "explore" ? exploreDiff : walkthroughDiff;
    const slot = layer === "explore" ? "explore" : layer === "app" ? "app" : "walkthrough";

    // v1.6.3 r-3 — reset clears BOTH the named layer's diff Map AND its
    // Show All slot. Clear-first; if `showAll` is explicitly set this call,
    // it wins (matches the override write order: reset clears Map, then
    // overrides write into the cleared Map).
    if (reset) {
      // App layer has no diff Map (showAll-only). Still clear the showAll
      // slot for symmetry — a `{ reset:true, layer:"app" }` call should
      // honor the SPEC §7.5 contract about clearing the named layer's slot.
      if (layer !== "app") targetDiff.clear();
      showAllByLayer[slot] = false;
    }
    if (overrides) {
      const entries = overrides instanceof Map ? overrides.entries() : Object.entries(overrides);
      for (const [k, v] of entries) targetDiff.set(k, v);
    }
    if (typeof showAll === "boolean") {
      showAllByLayer[slot] = showAll;
    }
    if (typeof onApply === "function") onApply();
  }

  /**
   * Convenience setter for the app layer's showAll slot. Equivalent to
   * `applyEmphasis({ showAll: on, layer: "app" })` but readable from the
   * renderer's public surface (e.g., `setShowAllIntraArrows`, `setShowAll`).
   *
   * Returns the new app-slot value (v1.6.4 D1 / L-new-1) so callers can
   * read back the renderer's authoritative state in the same call. The
   * matrix-switcher buttons in app.js drive their aria-pressed off the
   * return value instead of a closure-local `let on` boolean, so a future
   * code path that toggles the app slot from elsewhere (URL param restore,
   * keyboard shortcut, Embed API) does not leave the button label out of
   * sync with the renderer.
   */
  function setAppShowAll(on) {
    showAllByLayer.app = !!on;
    if (typeof onApply === "function") onApply();
    return showAllByLayer.app;
  }

  /**
   * Read-only snapshot of the per-layer showAll slots. Useful for aria-
   * pressed read-back in app.js and for tests that want to inspect state
   * after a sequence of applyEmphasis calls. The returned object is a
   * shallow copy — mutating it does not affect renderer state.
   */
  function getShowAllByLayer() {
    return { ...showAllByLayer };
  }

  return {
    applyEmphasis,
    effectiveEmphasis,
    effectiveShowAll,
    setAppShowAll,
    getShowAllByLayer,
    // Internal state exposed for tests + future namespacing work (D2). Not
    // expected to be mutated by renderers directly — applyEmphasis is the
    // public mutation surface.
    walkthroughDiff,
    exploreDiff,
    showAllByLayer,
  };
}
