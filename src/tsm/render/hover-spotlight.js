/**
 * Hover spotlight progressive-disclosure helper.
 *
 * Each instance owns its own bookkeeping: the elements it has stamped with
 * `.spotlight-highlighted` / `.spotlight-partner`, and the per-anchor
 * registrations + listeners. A clear() walks ONLY the per-instance stamped
 * sets, not the wrapper subtree — multiple spotlights on overlapping
 * subtrees (Fig 6 has intra-arrows + annotations both anchoring on `#tsm`)
 * no longer stomp each other.
 *
 * The `wrapper` parameter is used for the show-all wrapper class (e.g.
 * `.spotlight-show-all-cross-arrow`) only. Stamping is per-instance,
 * scoped to the elements this instance registered as targets/partners.
 *
 * Idempotency: a `register({ anchor }) → unregister(handle) →
 * register({ same anchor })` cycle re-attaches the listener correctly.
 * See `tests/unit/hover-spotlight.test.js` for the canonical pin.
 *
 * Caller responsibility: unregister stale handles before redraw rebuilds
 * target elements (or call `unregisterAll()`). The component does not
 * inject CSS or set pointer-events.
 *
 * @param {HTMLElement} wrapper — element scoping show-all classes
 * @returns {{ register, unregister, unregisterAll, setShowAll, destroy }}
 */
export function createHoverSpotlight(wrapper) {
  const registrations = new Map();
  const anchors = new Map();
  // Per-instance stamping: only the elements THIS spotlight has classed.
  // clearStampedClasses walks these sets instead of the wrapper subtree,
  // so two spotlights sharing a subtree don't clobber each other's stamps.
  const stampedTargets = new Set();
  const stampedPartners = new Set();
  let destroyed = false;

  function ensureAnchorState(anchor) {
    let state = anchors.get(anchor);
    if (state) return state;

    state = {
      anchor,
      handles: new Set(),
      active: false,
      // The spotlight class toggles synchronously on enter/leave; the
      // hover-INTENT (so a fast sweep across many cells doesn't strobe the
      // highlight) is done in CSS via transition-delay on the engage rules
      // (styles/overlays.css), not a JS timer — that keeps the synchronous
      // hover unit tests valid AND means leave is instant.
      enter: () => {
        if (destroyed) return;
        state.active = true;
        refreshActiveClasses();
      },
      leave: () => {
        if (destroyed) return;
        state.active = false;
        refreshActiveClasses();
      },
    };

    attach(anchor, "pointerenter", state.enter);
    attach(anchor, "pointerleave", state.leave);
    attach(anchor, "mouseenter", state.enter);
    attach(anchor, "mouseleave", state.leave);
    anchors.set(anchor, state);
    return state;
  }

  function attach(anchor, type, handler) {
    anchor?.addEventListener?.(type, handler);
  }

  function detach(anchor, type, handler) {
    anchor?.removeEventListener?.(type, handler);
  }

  function detachAnchor(state) {
    detach(state.anchor, "pointerenter", state.enter);
    detach(state.anchor, "pointerleave", state.leave);
    detach(state.anchor, "mouseenter", state.enter);
    detach(state.anchor, "mouseleave", state.leave);
    anchors.delete(state.anchor);
  }

  function clearStampedClasses() {
    for (const el of stampedTargets) el.classList?.remove("spotlight-highlighted");
    for (const el of stampedPartners) el.classList?.remove("spotlight-partner");
    stampedTargets.clear();
    stampedPartners.clear();
  }

  function refreshActiveClasses() {
    clearStampedClasses();
    for (const state of anchors.values()) {
      if (!state.active) continue;
      for (const handle of state.handles) {
        const registration = registrations.get(handle);
        if (!registration) continue;
        for (const target of registration.targets) {
          if (!target) continue;
          target.classList?.add("spotlight-highlighted");
          stampedTargets.add(target);
        }
        for (const partner of registration.partnerAnchors) {
          if (!partner) continue;
          partner.classList?.add("spotlight-partner");
          stampedPartners.add(partner);
        }
      }
    }
  }

  function register({ anchor, targets, group, partnerAnchors } = {}) {
    if (!anchor) {
      throw new Error("createHoverSpotlight.register: anchor is required");
    }
    // Destroyed-gate parity with explore-disclosure.js mutators: after
    // destroy() has detached everything, a stray register() must not
    // re-attach listeners (there is no teardown path left). Return an
    // inert handle so callers keep a shape unregister() can safely ignore.
    if (destroyed) return {};
    const handle = {};
    const state = ensureAnchorState(anchor);
    const registration = {
      anchor,
      targets: Array.from(targets ?? []).filter(Boolean),
      // `group` is retained as a label for `setShowAll(on, group)`'s wrapper
      // class suffix. It does NOT scope `refreshActiveClasses` — per-instance
      // stamping makes per-group clearing unnecessary.
      group,
      partnerAnchors: Array.from(partnerAnchors ?? []).filter(Boolean),
    };
    registrations.set(handle, registration);
    state.handles.add(handle);
    return handle;
  }

  function unregister(handle) {
    const registration = registrations.get(handle);
    if (!registration) return;
    registrations.delete(handle);

    const state = anchors.get(registration.anchor);
    if (!state) {
      refreshActiveClasses();
      return;
    }
    state.handles.delete(handle);
    if (state.handles.size === 0) {
      state.active = false;
      detachAnchor(state);
    }
    refreshActiveClasses();
  }

  /**
   * Unregister every active handle on this spotlight in one call. Detaches
   * every per-anchor listener (each anchor state ends with `handles.size===0`
   * via the unregister path) and clears any stamped classes. Idempotent:
   * calling on an empty spotlight is a no-op.
   *
   * Replaces the per-adopter `while (handles.length) unregister(pop())`
   * helper that every renderer used to inline (intra-arrows, cross-matrix
   * arrows, annotations).
   */
  function unregisterAll() {
    for (const handle of Array.from(registrations.keys())) {
      unregister(handle);
    }
    // Defensive: refreshActiveClasses inside unregister keeps the stamped
    // sets correct, but a no-op clear here makes the contract explicit.
    clearStampedClasses();
  }

  function setShowAll(on, group) {
    if (!wrapper?.classList) return;
    const className = group ? `spotlight-show-all-${group}` : "spotlight-show-all";
    wrapper.classList.toggle(className, !!on);
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    for (const state of Array.from(anchors.values())) {
      detachAnchor(state);
      state.handles.clear();
    }
    anchors.clear();
    registrations.clear();
    clearStampedClasses();
    // Clear show-all wrapper classes this instance may have set. The
    // class name family is `spotlight-show-all*`; we walk the wrapper's
    // own class list (NOT the subtree) and remove anything matching.
    if (wrapper?.classList) {
      const classAttr = typeof wrapper.getAttribute === "function"
        ? wrapper.getAttribute("class")
        : null;
      const classText = typeof classAttr === "string"
        ? classAttr
        : (typeof wrapper.className === "string" ? wrapper.className : "");
      for (const name of classText.split(/\s+/).filter(Boolean)) {
        if (name.startsWith("spotlight-show-all")) wrapper.classList.remove(name);
      }
    }
  }

  return {
    register,
    unregister,
    unregisterAll,
    setShowAll,
    destroy,
  };
}
