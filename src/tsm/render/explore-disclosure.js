// Explore disclosure — the power-user surface over a Path A scene.
//
// Per current SPEC-LENSES §7.2 (Explore disclosure) and §7.6 (multi-matrix
// scenes get a single chip strip operating on the union of all matrices):
// a small "Explore" button sits in the corner of the matrix wrapper.
// Default state is closed; clicking opens a horizontal chip strip below
// the matrix, one chip per lens in `scene.lenses` (or derived from
// `rendering.lens` references). Clicking a chip bulk-sets the runtime
// emphasis on items tagged with that lens to "primary"; everything else
// becomes "secondary". Clicking the same chip again, clicking a Reset
// button, or closing the disclosure reverts to the scene's declared
// emphasis.
//
// Path B (algorithm view) does NOT mount the Explore disclosure — that
// surface stays chip-free by design (narrative copy carries the naming).
//
// This module never reads the matrix DOM directly. The host (mountTSM) is
// responsible for wiring an emphasis-target object that exposes
// `applyEmphasis({ overrides, reset })` per renderer slot (`arrows`,
// `overlays`, `annotations`, `crossArrows`). Each chip click pushes a fresh
// override map; Reset pushes `reset: true` with no overrides.

// Canonical lens vocabulary from current SPEC-LENSES §2. The one-line claim
// is the aria-label for each chip. Unknown lens ids fall back to the id as
// both label and claim — better than throwing, lets the validator catch
// authoring drift separately.
//
// The id LIST itself lives in core/lenses.js (single source of truth used by
// validator + synthesis). This map only adds the presentation strings
// (label + claim) — they belong here because they are renderer concerns. A
// guard test (tests/unit/lens-vocab-sync.test.js) pins that the keys of this
// map match CANONICAL_LENS_IDS so the two cannot drift.
const LENS_VOCAB = {
  "cyclic-flow": {
    label: "Cyclic flow",
    claim: "Backward transfers route work back to earlier stages by design",
  },
  "coordinator-dispatch": {
    label: "Coordinator dispatch",
    claim: "A coordinator pushes work outward to many stations in parallel",
  },
  "forward-handoff": {
    label: "Forward handoff",
    claim: "Linear hand-off down the production line",
  },
  "modularity-boundary": {
    label: "Modularity boundary",
    claim: "Module borders divide the diagonal into information-hiding zones",
  },
  "cross-region-edge": {
    label: "Cross-region edge",
    claim: "A transfer crosses a modularity boundary",
  },
  "core-periphery-boundary": {
    label: "Core/periphery",
    claim: "A Core (largest cyclic group) sits with Control/Shared/Peripheral around it",
  },
};
// v1.6.4 D5.3 — `label-only` was dropped from this vocab and from
// CANONICAL_LENS_IDS. Items whose label is the load-bearing claim now carry
// `rendering.labelStyle: "load-bearing"` (SPEC-LENSES §3.5). That field is
// orthogonal to lenses and never surfaces as a chip on the Explore strip —
// authors get a cleaner mental model and Fig 4 / 6 / 18.1 no longer show a
// "Label only" chip that didn't function as a lens-style claim filter.

/**
 * Derive the lens set for a scene. Prefers `scene.lenses` (the author's
 * declared order), else walks the matrix's transfers / overlays /
 * annotations and the scene's cross-matrix arrows to collect every
 * referenced lens id. Order is insertion-order; duplicates are deduped.
 */
function deriveLenses(scene) {
  if (Array.isArray(scene?.lenses) && scene.lenses.length > 0) {
    return [...new Set(scene.lenses)];
  }
  const out = new Set();
  function collect(item) {
    const l = item?.rendering?.lens;
    if (Array.isArray(l)) for (const v of l) out.add(v);
    else if (typeof l === "string") out.add(l);
  }
  for (const m of scene?.matrices ?? []) {
    for (const t of m.transfers ?? []) collect(t);
    for (const o of m.overlays ?? []) collect(o);
    for (const a of m.annotations ?? []) collect(a);
  }
  for (const a of scene?.arrows ?? []) collect(a);
  return [...out];
}

/**
 * Compute the per-renderer emphasis override maps for a single active lens.
 * Items tagged with the lens become "primary"; every other lens-tagged item
 * becomes "secondary". Untagged items aren't touched in the override map —
 * the renderer's `reset: true` + override push handles this by clearing
 * prior overrides before applying the new ones. Overlay keys are region ids
 * for module borders and `firm-boundary:${index}` for firm boundaries.
 *
 * **Multi-matrix broadcast contract (per SPEC-LENSES §7.6 v0.3.7).**
 * For the three per-matrix renderer kinds (arrows, overlays, annotations)
 * the function returns `overridesByMatrix: Map<matrixIdx, Map<key, tier>>`
 * — each matrix gets its own slice keyed on the matrix's local index. The
 * fan-out (`createPerMatrixEmphasisFanOut` in main.js) dispatches each
 * slice to that matrix's renderer instance only; matrix-local keys
 * (`firm-boundary:N`, region ids, annotation indices, transfer `${from}→${to}`)
 * never reach a sibling matrix's renderer. Cross-arrows stay scene-level
 * (one renderer for the whole scene) with a plain `Map<key, tier>` because
 * their keys are already matrix-qualified (`${fromMatrix}:${taskId}→${toMatrix}:${taskId}`).
 *
 * This shape replaces the pre-v1.6.4-D2 scene-level union Map + primary-wins
 * setMerge band-aid. Same-key collisions across matrices (e.g., both have
 * `firm-boundary:0` but with different lens tags) can no longer cross-leak:
 * each matrix's renderer sees only its own slice. The structural fix is
 * "namespacing at fan-out", not "namespacing inside the key" — renderers
 * keep their existing renderer-local key shape and the annotation
 * integer-string normalization wrapper continues to work unchanged.
 *
 * Pre-seed: every matrix's slice is created even if empty so a chip click
 * that touches no items in matrix i still emits an empty Map to that
 * matrix's renderer (the renderer's `reset:true` then clears its
 * exploreDiff cleanly — same contract as the walkthrough fan-out).
 */
function buildLensFilter(scene, activeLens) {
  const arrowsByMatrix = new Map();
  const overlaysByMatrix = new Map();
  const annotationsByMatrix = new Map();
  const crossArrows = new Map();

  const matrices = scene?.matrices ?? [];

  function lensesOf(item) {
    const l = item?.rendering?.lens;
    if (Array.isArray(l)) return l;
    if (typeof l === "string") return [l];
    return [];
  }
  function tier(item) {
    const lenses = lensesOf(item);
    if (lenses.length === 0) return null;
    return lenses.includes(activeLens) ? "primary" : "secondary";
  }

  for (let mi = 0; mi < matrices.length; mi++) {
    const m = matrices[mi];
    const arrows = new Map();
    const overlays = new Map();
    const annotations = new Map();

    for (const t of m.transfers ?? []) {
      if (t?.rendering?.arrow !== true) continue;
      const tr = tier(t);
      if (tr) arrows.set(`${t.from}→${t.to}`, tr);
    }
    const matrixOverlays = m.overlays ?? [];
    for (let oi = 0; oi < matrixOverlays.length; oi++) {
      const o = matrixOverlays[oi];
      if (o.kind !== "module-border" && o.kind !== "firm-boundary") continue;
      const tr = tier(o);
      if (!tr) continue;
      if (o.kind === "module-border" && o.regionId) {
        overlays.set(o.regionId, tr);
      } else if (o.kind === "firm-boundary") {
        overlays.set(`firm-boundary:${oi}`, tr);
      }
    }
    const anns = m.annotations ?? [];
    for (let i = 0; i < anns.length; i++) {
      const tr = tier(anns[i]);
      if (tr) annotations.set(i, tr);
    }

    arrowsByMatrix.set(mi, arrows);
    overlaysByMatrix.set(mi, overlays);
    annotationsByMatrix.set(mi, annotations);
  }

  for (const a of scene?.arrows ?? []) {
    const k = a.id ?? `${a.from?.matrix}:${a.from?.taskId}→${a.to?.matrix}:${a.to?.taskId}`;
    const tr = tier(a);
    if (tr) crossArrows.set(k, tr);
  }

  return {
    arrows: arrowsByMatrix,
    overlays: overlaysByMatrix,
    annotations: annotationsByMatrix,
    crossArrows,
  };
}

/**
 * Mount the Explore disclosure. The button is appended to `container`
 * (typically the matrix wrapper element); the chip strip is appended after
 * the button when opened.
 *
 * @param {HTMLElement} container — element to host the button + chip strip
 * @param {object} scene — the decorated tsm-scene
 * @param {{
 *   emphasis?: {
 *     arrows?: { applyEmphasis(args) },
 *     overlays?: { applyEmphasis(args) },
 *     annotations?: { applyEmphasis(args) },
 *     crossArrows?: { applyEmphasis(args) },
 *   },
 *   onChange?: (state) => void,
 * }} [options]
 * @returns {{ open, close, toggle, isOpen, onChange, destroy, getActiveLens, setActiveLens, getLenses }}
 */
export function createExploreDisclosure(container, scene, options = {}) {
  const {
    emphasis = {},
    onChange,
    // Fires after the disclosure mutates renderer emphasis via a lens chip /
    // Reset / close. Lets the controller refresh other UI surfaces — notably
    // app.js's matrix-switcher "Show all (N)" label, which re-counts the
    // still-dimmed items after a lens changes what's emphasized.
    onEmphasisChange,
    // NOTE: the strip's own "Show all" button was removed (UX pass 2026-05-29).
    // The lens strip is a pick-one tool; Reset already reverts the dim, and a
    // global un-dim duplicated the app-level matrix-switcher toggle with a
    // second, drifting copy of its count. `countHidden` is no longer consumed
    // here; callers may still pass it (ignored) for back-compat.
  } = options;
  const lenses = deriveLenses(scene);

  // No named patterns to highlight → no control. Pre-rail-mount the button
  // lived at the bottom of #tsm, where a dead "Highlight patterns" button
  // (opening an empty strip) was harmlessly buried. In the app's rail mount
  // (v0.4.4, default-open) it would be a prominent control that does nothing —
  // so for a lens-less scene (e.g. langchain / autogen / the smoke fixtures,
  // which carry no `rendering.lens` tags) suppress it entirely: append nothing
  // to the container and hand back an inert handle so the caller's
  // destroy()/refresh calls stay safe. The container's `:empty` state then
  // collapses the rail slot (base.css `#explore-mount:empty`).
  if (lenses.length === 0) {
    return {
      open() {},
      close() {},
      toggle() {},
      isOpen: () => false,
      onChange: () => () => {},
      getActiveLens: () => null,
      setActiveLens() {},
      getLenses: () => [],
      refreshShowAllLabel() {},
      destroy() {},
    };
  }

  let opened = false;
  let activeLens = null;
  const subscribers = new Set();
  if (typeof onChange === "function") subscribers.add(onChange);

  // v1.6.5 Wave 1 (W1B-D4-CF) — full-API inertness after destroy(). The pre-
  // v1.6.5 destroy() cleared subscribers + removed the root node, but every
  // mutator (`setActiveLens`, `pushFilter`, `open`/`close`/`toggle`) and the
  // chip/Reset DOM handlers remained live. A caller holding a leaked handle —
  // or a chip click on a detached-but-still-event-listening root — could fire
  // emphasis.*.applyEmphasis callbacks against the orphaned disclosure.
  // The flag gates every mutator + every internal write path; read-only
  // accessors (`isOpen`, `getActiveLens`, `getLenses`) stay functional.
  // `onChange` registration returns a harmless unsubscribe.
  let destroyed = false;

  const root = document.createElement("div");
  root.className = "tsm-explore-disclosure";
  root.dataset.open = "false";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "tsm-explore-button";
  // "Explore" didn't telegraph what the control does. Name the function:
  // it highlights a structural pattern (lens) and dims the rest. The title
  // says which patterns are inside so a reader knows before opening; the
  // disclosure caret (overlays.css ::after, rotates on data-open) signals it
  // opens. Chips keep the "lens" vocabulary the essays + SPEC use.
  button.textContent = "Highlight patterns";
  button.title = "Highlight a structural pattern — cyclic flow, cross-region edges, the core";
  button.setAttribute?.("aria-expanded", "false");
  button.setAttribute?.("aria-controls", "tsm-explore-strip");
  root.appendChild(button);

  const strip = document.createElement("div");
  strip.className = "tsm-explore-strip";
  strip.id = "tsm-explore-strip";
  strip.setAttribute?.("role", "toolbar");
  strip.setAttribute?.("aria-label", "Lens filters");
  strip.dataset.visible = "false";
  root.appendChild(strip);

  // Strip header — names the purpose AND signals single-select. The word
  // "one" telegraphs the radio behavior before the reader discovers it by
  // surprise; the verb matches the "Highlight patterns" button. Addresses
  // Xule's "I don't know what clicking each option does / why only one."
  const stripLabel = document.createElement("span");
  stripLabel.className = "explore-strip-label";
  // "one" signals single-select when there's a choice; drop it for a lone
  // lens (e.g. Fig 8 platform → just "cross-region edge"), where there's
  // nothing to choose between and "one pattern" reads oddly.
  stripLabel.textContent = lenses.length === 1 ? "Highlight pattern" : "Highlight one pattern";

  // Lens chips live in their own group (a visual tray) so they read as a
  // pick-one set distinct from the Reset / Show-hidden utilities. role="group"
  // (not radiogroup): the chips are role=button + aria-pressed toggles, and a
  // radiogroup announces to assistive tech that it expects role=radio +
  // aria-checked children — a semantic mismatch (post-layout audit M8). A
  // labeled group of toggle buttons is the honest description; the arrow-key
  // roving in onKey still works.
  const lensGroup = document.createElement("div");
  lensGroup.className = "explore-lens-group";
  lensGroup.setAttribute?.("role", "group");
  lensGroup.setAttribute?.("aria-label", "Structural patterns");

  // Build chips lazily once and re-use; chip state is driven by
  // aria-pressed + data-active so we don't rebuild on toggle.
  const chipEls = [];
  for (const lensId of lenses) {
    const entry = LENS_VOCAB[lensId] ?? { label: lensId, claim: lensId };
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "explore-chip";
    chip.dataset.lens = lensId;
    chip.setAttribute?.("aria-label", entry.claim);
    // Mouse-visible tooltip (was aria-label only — invisible to a sighted
    // mouse user). Belt-and-suspenders with the claim line below.
    chip.title = entry.claim;
    chip.setAttribute?.("aria-pressed", "false");
    chip.setAttribute?.("role", "button");
    chip.tabIndex = 0;
    chip.textContent = entry.label;
    lensGroup.appendChild(chip);
    chipEls.push(chip);
  }
  if (lenses.length > 0) {
    strip.appendChild(stripLabel);
    strip.appendChild(lensGroup);
  }

  // Reset = revert to the scene-declared view (clears the active lens, so the
  // dimmed rest returns to full strength). This is the strip's only utility —
  // it doubles as the "stop dimming / show everything again" escape, which is
  // why the separate "Show all" button was removed. Only render with ≥1 chip.
  let resetBtn = null;
  if (lenses.length > 0) {
    resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "explore-chip explore-reset";
    resetBtn.dataset.role = "reset";
    resetBtn.textContent = "Reset";
    resetBtn.setAttribute?.("aria-label", "Clear lens filter");
    resetBtn.tabIndex = 0;
    strip.appendChild(resetBtn);
  }

  // When the scene yields no lenses (e.g. langchain / autogen: no arrowed
   // items, no lens-tagged overlays) the disclosure has nothing to disclose.
   // Mounting a button that opens an empty strip with no Reset / Show All is
   // worse than mounting nothing — the user sees a control they can't use.
   // Caller still gets a stable API (open/close/destroy are no-ops). Closes
   // audit M1.
  if (lenses.length === 0) {
    root.dataset.empty = "true";
    root.style.display = "none";
  }

  // "Speak the lens" — when a pattern is active, name it in plain words
  // right below the strip. The claim text already exists in LENS_VOCAB but
  // was wired to aria-label only (screen-reader-only). Surfacing it answers
  // "what did clicking do / what am I looking at now." Hidden until a chip
  // is active; cleared on Reset / chip-toggle-off / close via refreshClaim().
  const claimEl = document.createElement("p");
  claimEl.className = "explore-claim";
  claimEl.hidden = true;
  root.appendChild(claimEl);

  // Append at the BOTTOM of the matrix wrapper — keep it here. The arrow /
  // overlay SVG layers position at `gridEl.offsetTop` and `redraw()` rebuilds
  // them from scratch (render/arrows.js#clear), so any control mounted ABOVE
  // the grid shifts it and forces a full arrow-layer rebuild on every
  // open/close (flicker + churn). A more discoverable placement belongs in the
  // page toolbar, decoupled from this wrapper — not inserted above the grid.
  container.appendChild(root);

  function notify() {
    const state = { open: opened, activeLens, lenses: [...lenses] };
    for (const cb of subscribers) {
      try { cb(state); } catch { /* swallow — onChange is observer-only */ }
    }
  }

  // Propagate to the controller after any emphasis mutation (lens click /
  // Reset / close) so external UI — the app-level matrix-switcher "Show
  // hidden (N)" label — can re-count the still-dimmed items. Fires AFTER the
  // renderer apply-pass so the DOM is settled when the callback runs.
  function emitEmphasisChange() {
    if (typeof onEmphasisChange === "function") {
      try { onEmphasisChange(); } catch { /* observer-only */ }
    }
  }

  // All Explore pushes target the "explore" layer in the renderer's layered
  // override model. The walkthrough writes to "walkthrough"; the two state
  // machines coexist without trampling each other. Explore wins composition
  // (chip filter survives walkthrough Restart/Next/Prev). `reset: true`
  // clears the explore layer's diff Map AND its showAll slot, so selecting /
  // clearing a lens never leaves a stale explore-layer show-all behind.
  function pushFilter(lensId) {
    if (destroyed) return;
    if (!lensId) {
      emphasis.arrows?.applyEmphasis?.({ reset: true, layer: "explore" });
      emphasis.overlays?.applyEmphasis?.({ reset: true, layer: "explore" });
      emphasis.annotations?.applyEmphasis?.({ reset: true, layer: "explore" });
      emphasis.crossArrows?.applyEmphasis?.({ reset: true, layer: "explore" });
      emitEmphasisChange();
      return;
    }
    // v1.6.4 D2 — per-matrix dispatch for the three per-matrix renderer
    // kinds. `buildLensFilter` returns `overridesByMatrix:
    // Map<matrixIdx, Map<key, tier>>` (parallel to walkthrough.js's shape);
    // the fan-out adapter delivers each matrix's slice to its renderer only.
    // Cross-arrows stays scene-level (single renderer for the whole scene)
    // and uses plain `overrides:` because its keys are already matrix-
    // qualified.
    const diff = buildLensFilter(scene, lensId);
    emphasis.arrows?.applyEmphasis?.({ overridesByMatrix: diff.arrows, reset: true, layer: "explore" });
    emphasis.overlays?.applyEmphasis?.({ overridesByMatrix: diff.overlays, reset: true, layer: "explore" });
    emphasis.annotations?.applyEmphasis?.({ overridesByMatrix: diff.annotations, reset: true, layer: "explore" });
    emphasis.crossArrows?.applyEmphasis?.({ overrides: diff.crossArrows, reset: true, layer: "explore" });
    emitEmphasisChange();
  }

  // Render (or clear) the active lens's plain-words claim. Driven from
  // refreshChipState so every state change that updates the chips — chip
  // click, toggle-off, chip-swap, Reset, close — keeps the claim line in
  // lock-step with no extra call sites.
  function refreshClaim() {
    if (!claimEl) return;
    const entry = activeLens ? LENS_VOCAB[activeLens] : null;
    if (entry) {
      claimEl.textContent = "";
      const labelSpan = document.createElement("span");
      labelSpan.className = "explore-claim-label";
      labelSpan.textContent = entry.label;
      const textSpan = document.createElement("span");
      textSpan.className = "explore-claim-text";
      textSpan.textContent = ` — ${entry.claim}`;
      claimEl.appendChild(labelSpan);
      claimEl.appendChild(textSpan);
      claimEl.hidden = false;
    } else {
      claimEl.textContent = "";
      claimEl.hidden = true;
    }
  }

  function refreshChipState() {
    for (const chip of chipEls) {
      const lensId = chip.dataset.lens;
      const isActive = lensId === activeLens;
      chip.setAttribute?.("aria-pressed", isActive ? "true" : "false");
      if (isActive) chip.classList.add("active");
      else chip.classList.remove("active");
    }
    refreshClaim();
  }

  function setActiveLens(lensId) {
    if (destroyed) return;
    // Single-active filter (current SPEC constraint). Clicking the active
    // chip toggles it off.
    if (lensId && lensId === activeLens) {
      activeLens = null;
    } else {
      activeLens = lensId || null;
    }
    refreshChipState();
    pushFilter(activeLens);
    notify();
  }

  for (const chip of chipEls) {
    chip.addEventListener?.("click", () => setActiveLens(chip.dataset.lens));
  }
  if (resetBtn) {
    resetBtn.addEventListener?.("click", () => setActiveLens(null));
  }

  // Keyboard accessibility: left/right traverse, Enter/Space toggle.
  function onKey(event) {
    const focusable = [...chipEls];
    if (resetBtn) focusable.push(resetBtn);
    if (focusable.length === 0) return;
    const idx = focusable.indexOf(event.target);
    if (idx < 0) return;
    if (event.key === "ArrowLeft") {
      const next = focusable[(idx - 1 + focusable.length) % focusable.length];
      next.focus?.();
      event.preventDefault?.();
    } else if (event.key === "ArrowRight") {
      const next = focusable[(idx + 1) % focusable.length];
      next.focus?.();
      event.preventDefault?.();
    } else if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      const lens = event.target?.dataset?.lens ?? null;
      const role = event.target?.dataset?.role;
      if (role === "reset") {
        setActiveLens(null);
      } else if (lens) {
        setActiveLens(lens);
      }
      event.preventDefault?.();
    }
  }
  strip.addEventListener?.("keydown", onKey);

  function open() {
    if (destroyed) return;
    if (opened) return;
    opened = true;
    root.dataset.open = "true";
    strip.dataset.visible = "true";
    button.setAttribute?.("aria-expanded", "true");
    notify();
  }
  function close() {
    if (destroyed) return;
    if (!opened) return;
    opened = false;
    root.dataset.open = "false";
    strip.dataset.visible = "false";
    button.setAttribute?.("aria-expanded", "false");
    // Closing the disclosure reverts the lens filter — narrative authority
    // belongs to the default view.
    if (activeLens !== null) {
      activeLens = null;
      refreshChipState();
      pushFilter(null);
    }
    notify();
  }
  function toggle() {
    if (destroyed) return;
    opened ? close() : open();
  }

  button.addEventListener?.("click", toggle);

  return {
    open,
    close,
    toggle,
    isOpen: () => opened,
    onChange(cb) {
      // v1.6.5 (W1B-D4-CF) — post-destroy: refuse new subscribers and hand
      // back a harmless no-op unsubscribe so callers don't blow up on
      // `register(); ...; unsubscribe()` patterns that span the destroy line.
      if (destroyed) return () => {};
      if (typeof cb === "function") subscribers.add(cb);
      return () => subscribers.delete(cb);
    },
    getActiveLens: () => activeLens,
    setActiveLens,
    getLenses: () => [...lenses],
    // Symmetry with the inert lens-less handle (above) and main.js's
    // `explore` placeholder, both of which expose `refreshShowAllLabel`.
    // The strip's own "Show all" button was removed (UX pass 2026-05-29),
    // so the live disclosure owns no show-all label to refresh — this is a
    // deliberate no-op that keeps the handle's contract honest rather than
    // relying on main.js's `explore?.refreshShowAllLabel?.()` optional-chain
    // to silently skip a missing method.
    refreshShowAllLabel() {},
    destroy() {
      if (destroyed) return;
      strip.removeEventListener?.("keydown", onKey);
      // Drop subscribers so any onChange callbacks registered prior to
      // destroy() can be garbage-collected. Without this, a caller that
      // retains the disclosure handle after destroy() and re-invokes
      // setActiveLens / pushFilter (e.g. via leaked references in tests
      // or hot-reload scenarios) would still fire registered callbacks.
      subscribers.clear();
      // Best-effort: drop the host element so the next mount has a clean
      // surface. If a caller wired their own removal already this is a
      // no-op via the parentNode guard.
      if (root.parentNode) {
        try { root.parentNode.removeChild(root); } catch { /* ignore */ }
      }
      // v1.6.5 Wave 1 (W1B-D4-CF) — full-API inertness. Flip the flag LAST so
      // any callbacks fired during cleanup above still observe the live
      // disclosure. From here on every mutator (setActiveLens, pushFilter,
      // open/close/toggle) early-returns and chip/Reset DOM events become
      // no-ops via the same gate. Read-only accessors (isOpen, getActiveLens,
      // getLenses) keep working.
      destroyed = true;
    },
  };
}

// Exported for tests + future tooling that wants to introspect the canonical
// vocabulary without re-deriving it.
export const EXPLORE_LENS_VOCAB = LENS_VOCAB;
