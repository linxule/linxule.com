// Page-glue layer. Fetches a scene JSON (selectable via the box-less scene
// index in the left margin or a URL param), decorates it, then mounts the
// walkthrough and wires page controls to the controller.
//
// Schema validation does NOT run in the browser — that happens at build time
// via `bun run validate`. Runtime trusts pre-validated JSON.
//
// URL-param scheme (B2/A3 wiring, v1.x):
//   ?scene=NAME          unified canonical param. NAME is looked up in the
//                        SCENE_REGISTRY below; the registry encodes which
//                        directory (examples/ or fixtures/) the JSON lives in.
//   ?example=NAME        legacy alias, accepted for back-compat with v1.0
//                        URLs (only Tier 1 scenes were addressable). If both
//                        ?scene and ?example are present, ?scene wins.
//   ?m=N                 matrix index for multi-matrix scenes. Defaults to 0
//                        when absent or unparseable (parser-level: clamp +
//                        console.warn). Out-of-range values for the active
//                        scene are also clamped to 0 with a console.warn at
//                        the page-glue layer (see mountScene below), so a
//                        stale ?m= from a previous scene doesn't blow up an
//                        in-page switch. mountTSM still throws as a final
//                        backstop for direct callers that bypass app.js.
//
// We picked ?scene= (unified) over a split ?example=/?fixture= scheme because
// readers care about a scene by NAME, not where the JSON sits in the repo.
// The scene index groups by provenance for skimmability, but the URL stays flat.

import { mountTSM, mountAllMatrices } from "./main.js";
import { decorateScene } from "./core/scene-adapter.js";
import { mountAlgorithmView } from "./views/algorithm/index.js";

// Scene registry. Each entry maps an id → { url, label, category, multi?, hidden? }.
// Category drives the scene-index grouping; url is the fetch path. Order here =
// order in the index.
//
// Taxonomy (2026-05-29): grouped by PROVENANCE (book vs real code), not by
// structure. The prior third group "Multi-matrix examples" split the derived
// upstream/downstream scene from its six "Derived" siblings — confusing. Now
// multi-matrix is a TRAIT (`multi: true`) shown as a small tag, not a group.
//   • "Baldwin's worked examples" — authored figures, in numeric order.
//   • "Derived from real codebases" — Hidden Structure algorithm output.
// Figures run 1, 3, 4, 6, 7A, 7B, 8, 18.1 (Fig 4 was previously stranded last).
export const SCENE_REGISTRY = {
  "laptop-integral": {
    url: "examples/laptop-integral.json",
    label: "Fig 1 · Integral laptop",
    category: "Baldwin's worked examples",
  },
  "laptop-modular": {
    url: "examples/laptop-modular.json",
    label: "Fig 3 · Modular laptop",
    category: "Baldwin's worked examples",
  },
  // Fig 4 is ONE TSM with internal zones sharing a coordinator (single
  // matrices[] entry, no cross-matrix arrows) — single-mount, not `multi`.
  "store-household": {
    url: "examples/store-household.json",
    label: "Fig 4 · Store + Household",
    category: "Baldwin's worked examples",
  },
  "job-shop": {
    url: "examples/job-shop.json",
    label: "Fig 6 · Job shop",
    category: "Baldwin's worked examples",
  },
  "flow-central": {
    url: "examples/flow-central.json",
    label: "Fig 7A · Flow + coordinator",
    category: "Baldwin's worked examples",
  },
  "flow-kanban": {
    url: "examples/flow-kanban.json",
    label: "Fig 7B · Flow + kanban",
    category: "Baldwin's worked examples",
  },
  "platform": {
    url: "examples/platform.json",
    label: "Fig 8 · Platform",
    category: "Baldwin's worked examples",
  },
  // Fig 18.1 — N>1 genuinely separate TSMs linked via scene.arrows[]. `multi`.
  "upstream-downstream": {
    url: "examples/upstream-downstream.json",
    label: "Fig 18.1 · Upstream + Downstream",
    category: "Baldwin's worked examples",
    multi: true,
  },
  // "Derived from real codebases" — Hidden Structure algorithm output over real
  // dependency graphs (Xule's harness + five OSS agent frameworks).
  "xule-harness": {
    url: "fixtures/xule-harness-scene.json",
    label: "Xule's agent harness",
    category: "Derived from real codebases",
  },
  "opencode": {
    url: "fixtures/opencode-scene.json",
    label: "opencode",
    category: "Derived from real codebases",
  },
  "codex-cli": {
    url: "fixtures/codex-cli-scene.json",
    label: "Codex CLI",
    category: "Derived from real codebases",
  },
  "kimi-code": {
    url: "fixtures/kimi-code-scene.json",
    label: "Kimi Code",
    category: "Derived from real codebases",
  },
  "langchain": {
    url: "fixtures/langchain-scene.json",
    label: "LangChain",
    category: "Derived from real codebases",
  },
  "autogen": {
    url: "fixtures/autogen-scene.json",
    label: "AutoGen",
    category: "Derived from real codebases",
  },
  // Derived AND multi-matrix → sits with its Derived siblings (provenance),
  // carries the `multi` trait tag.
  "upstream-downstream-derive": {
    url: "fixtures/upstream-downstream-derive-scene.json",
    label: "Upstream/downstream contracts",
    category: "Derived from real codebases",
    multi: true,
  },
  // Synthetic dev smoke test. `hidden`: still addressable via ?scene= (deep
  // links + Playwright nav keep working through parseSceneParam) but omitted
  // from the public scene index. Not a reader-facing example.
  "multi-matrix-smoke": {
    url: "examples/multi-matrix-smoke.json",
    label: "Multi-matrix smoke test (synthetic)",
    category: "Derived from real codebases",
    multi: true,
    hidden: true,
  },
};
const DEFAULT_SCENE = "laptop-integral";

// The algorithm-discovery view runs on a dependency-observation (NOT a scene).
// kimi-code is the canonical default per DEPLOYMENT.md — public OSS extraction,
// 26 nodes, monolithic core-periphery. Reachable at ?view=algorithm.
const ALGORITHM_OBSERVATION_URL = "fixtures/kimi-code-observation.json";

/**
 * Pure URL-param parser for the scene id. Accepts a URLSearchParams (or any
 * object exposing `.get(key)`); returns a known scene id or DEFAULT_SCENE.
 *
 * Resolution order: ?scene= wins; ?example= is a legacy alias.
 *
 * Exported for unit tests — no DOM access, no fetch.
 *
 * @param {URLSearchParams | {get(name: string): string | null}} params
 * @returns {string}
 */
export function parseSceneParam(params) {
  const requested = params.get("scene") ?? params.get("example");
  if (requested && Object.prototype.hasOwnProperty.call(SCENE_REGISTRY, requested)) {
    return requested;
  }
  return DEFAULT_SCENE;
}

/**
 * Pure URL-param parser for the matrix index. Returns a non-negative integer.
 * Missing, malformed, negative, or non-finite values resolve to 0 (with a
 * console warning for the malformed case so silent corruption is loud).
 *
 * Bounds-checking against the actual scene happens in mountTSM's guard —
 * keeping this parser pure means it doesn't need to know the scene yet.
 *
 * Exported for unit tests.
 *
 * @param {URLSearchParams | {get(name: string): string | null}} params
 * @returns {number}
 */
export function parseMatrixIndexParam(params) {
  const raw = params.get("m");
  if (raw === null || raw === undefined || raw === "") return 0;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0) {
    console.warn(`app.js: ignoring unparseable ?m=${raw}; defaulting matrixIndex=0`);
    return 0;
  }
  return n;
}

/**
 * Pure URL-param parser for the active view. Returns "algorithm" when
 * ?view=algorithm is present; "walkthrough" (the figure walkthrough) otherwise.
 * Exported for unit tests — no DOM, no fetch.
 *
 * @param {URLSearchParams | {get(name: string): string | null}} params
 * @returns {"algorithm" | "walkthrough"}
 */
export function parseViewParam(params) {
  return params.get("view") === "algorithm" ? "algorithm" : "walkthrough";
}

/**
 * Group the registry by category, preserving insertion order both for
 * categories and for scenes within each category. Returns an array of
 * `{ category, scenes: [{ id, label }] }` entries.
 *
 * Exported for unit tests so the dropdown construction can be exercised
 * without touching the DOM.
 *
 * @returns {{ category: string, scenes: { id: string, label: string }[] }[]}
 */
export function groupedScenes() {
  const groups = new Map();
  for (const [id, entry] of Object.entries(SCENE_REGISTRY)) {
    if (entry.hidden) continue; // dev-only scenes stay addressable but unlisted
    if (!groups.has(entry.category)) groups.set(entry.category, []);
    groups.get(entry.category).push({ id, label: entry.label, multi: entry.multi === true });
  }
  return Array.from(groups.entries()).map(([category, scenes]) => ({ category, scenes }));
}

async function loadScene(id) {
  const entry = SCENE_REGISTRY[id];
  if (!entry) throw new Error(`Unknown scene: ${id}`);
  const resp = await fetch(entry.url);
  if (!resp.ok) {
    throw new Error(`Failed to fetch ${entry.url}: HTTP ${resp.status}`);
  }
  return resp.json();
}

// Build the scene index — the machine-voice "contents" in the left margin that
// replaces the native <select>. Box-less, grouped by provenance, each scene a
// clickable line; the current scene wears the cyan accident dot (.current).
// linxule.com idiom: structure from typography + placement, not a form control.
// `onSelect(id)` fires on click.
function buildSceneIndex(navEl, currentId, onSelect) {
  if (!navEl) return;
  navEl.innerHTML = "";
  let groupSeq = 0;
  for (const { category, scenes } of groupedScenes()) {
    const group = document.createElement("div");
    group.className = "scene-index-group";
    // role=group + aria-labelledby restores the grouping the native <select>'s
    // <optgroup> conveyed to assistive tech — the heading names the group.
    group.setAttribute("role", "group");

    const heading = document.createElement("p");
    heading.className = "scene-index-heading";
    heading.id = `scene-index-group-${groupSeq++}`;
    heading.textContent = category;
    group.setAttribute("aria-labelledby", heading.id);
    group.appendChild(heading);

    for (const { id, label, multi } of scenes) {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "scene-index-item";
      item.dataset.scene = id;
      if (id === currentId) {
        item.classList.add("current");
        item.setAttribute("aria-current", "page");
      }

      const name = document.createElement("span");
      name.className = "scene-index-name";
      name.textContent = label;
      item.appendChild(name);

      if (multi) {
        const tag = document.createElement("span");
        tag.className = "scene-index-tag";
        tag.textContent = "multi";
        item.appendChild(tag);
      }

      item.addEventListener("click", () => onSelect(id));
      group.appendChild(item);
    }
    navEl.appendChild(group);
  }
}

// Move the `.current` marker without rebuilding (keeps listeners + avoids a
// flash on in-page scene switches). Exported for unit tests.
export function markCurrentScene(navEl, currentId) {
  if (!navEl) return;
  for (const item of navEl.querySelectorAll(".scene-index-item")) {
    const isCurrent = item.dataset.scene === currentId;
    item.classList.toggle("current", isCurrent);
    if (isCurrent) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  }
}

export function rebuildMatrixSwitcher(switcherEl, matrixCount, currentIndex, onSelect, options = {}) {
  if (!switcherEl) return { refresh() {} };
  switcherEl.innerHTML = "";

  // Two clusters live in this container: the per-matrix selector buttons
  // (matrixCount > 1) and the "show all transactions" toggle for cross-
  // matrix arrows (any scene that declares them). Each appears
  // independently — a multi-matrix scene without cross-arrows shows only
  // the switcher; a multi-matrix scene with cross-arrows shows both.
  //
  // Multi-mount mode (`multiMount: true`) means all matrices are already
  // mounted side-by-side; the buttons select a focus matrix rather than
  // switching the page to a different single mount. A leading "Both"
  // button returns to no-focus. `currentIndex === null` indicates the
  // no-focus default.
  //
  // v1.6.4 D5.2 — Show All buttons take their label + disabled state from
  // a `getHiddenCount` map: `{ crossArrows?(): number, intraArrows?(): number }`.
  // Returns a `refresh()` callback the caller invokes after step changes
  // and after any emphasis state change (chip click, Show All toggle) so
  // the buttons can re-read the count and re-stamp their labels. The brief
  // (D5.2) makes the label "Show all (N)" when N > 0 and "All revealed
  // items shown." (disabled) when N = 0 — SPEC §4 reveal-token gating wins,
  // never bypassed.
  const {
    hasCrossArrows = false,
    onToggleShowAll = null,
    hasRenderedArrows = false,
    onToggleShowAllIntraArrows = null,
    multiMount = false,
    getHiddenCount = null,
  } = options;
  const showSwitcher = matrixCount > 1;
  const showToggle = hasCrossArrows && typeof onToggleShowAll === "function";
  const showIntraArrowToggle =
    hasRenderedArrows && typeof onToggleShowAllIntraArrows === "function";

  if (!showSwitcher && !showToggle && !showIntraArrowToggle) {
    switcherEl.hidden = true;
    return { refresh() {} };
  }
  switcherEl.hidden = false;

  // v1.6.4 D5.2 — Helper: compute the "Show all (N)" label payload for a
  // Show All button. When N === 0 we mark the button disabled and swap to
  // the "All revealed items shown." text; when N > 0 the button is enabled
  // and the text counts what would actually toggle.
  //
  // v0.4.2 (2026-05-29) — active-state label renamed "Show hidden (N)" →
  // "Show all (N)". The button does NOT reveal reveal-gated-hidden items
  // (countHidden excludes anything not `.visible`); it un-dims already-
  // visible secondary arrows to full strength. "hidden" wrongly promised
  // new items would appear; "all" matches the buttons' aria-labels
  // ("Show all transactions" / "Show all arrows") and the real effect.
  function buildHiddenLabel(n) {
    if (n <= 0) {
      return { text: "All revealed items shown.", disabled: true };
    }
    return { text: `Show all (${n})`, disabled: false };
  }

  function stampHiddenLabel(btn, n) {
    const { text, disabled } = buildHiddenLabel(n);
    btn.textContent = text;
    btn.disabled = disabled;
    if (disabled) {
      btn.setAttribute?.("aria-disabled", "true");
    } else {
      btn.removeAttribute?.("aria-disabled");
    }
  }

  if (showSwitcher) {
    const label = document.createElement("span");
    label.className = "matrix-switcher-label";
    label.textContent = multiMount ? "Focus:" : "Matrix:";
    switcherEl.appendChild(label);

    // Track every focus button so the multi-mount click handler can update
    // which one wears `.active` without rebuilding the switcher (which would
    // re-attach listeners and reset toggle state). The map is keyed by the
    // focus argument we pass to onSelect: null for the "Both/All" button,
    // integer i for the per-matrix buttons. Single-mount branches reload the
    // page (URL mutation + re-mount) so the switcher gets rebuilt anyway —
    // no in-place tracking needed there.
    const focusButtons = multiMount ? new Map() : null;

    function setActiveFocusButton(focusKey) {
      if (!focusButtons) return;
      for (const [key, btn] of focusButtons) {
        btn.classList.toggle("active", key === focusKey);
      }
    }

    // Multi-mount: leading "Both" button returns to no-focus.
    if (multiMount) {
      const bothBtn = document.createElement("button");
      bothBtn.type = "button";
      bothBtn.className = "matrix-switcher-btn";
      bothBtn.textContent = matrixCount === 2 ? "Both" : "All";
      if (currentIndex === null || currentIndex === undefined) {
        bothBtn.classList.add("active");
      }
      focusButtons.set(null, bothBtn);
      bothBtn.addEventListener("click", () => {
        setActiveFocusButton(null);
        onSelect(null);
      });
      switcherEl.appendChild(bothBtn);
    }

    for (let i = 0; i < matrixCount; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "matrix-switcher-btn";
      btn.textContent = String(i);
      if (i === currentIndex) btn.classList.add("active");
      if (multiMount) {
        focusButtons.set(i, btn);
        const idx = i;
        btn.addEventListener("click", () => {
          // mountAllMatrices.focusMatrix(same) toggles back to no-focus
          // (controller contract). The visually-active button should follow:
          // if the user re-clicks the already-active per-matrix button, the
          // controller will land at focusedIndex=null, so mark "Both/All" as
          // active instead. Otherwise activate the clicked button.
          const alreadyActive = btn.classList.contains("active");
          setActiveFocusButton(alreadyActive ? null : idx);
          onSelect(idx);
        });
      } else {
        btn.addEventListener("click", () => onSelect(i));
      }
      switcherEl.appendChild(btn);
    }
  }

  let crossArrowsBtn = null;
  let intraArrowsBtn = null;

  if (showToggle) {
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "cross-arrows-toggle";
    // v1.6.4 D5.2 — the static "Show all transactions" label is replaced
    // by the count-based "Show all (N)" / "All revealed items shown."
    // pair. The first stamp happens immediately via refresh() below so the
    // initial render matches the renderer state.
    toggleBtn.textContent = "Show all (0)";
    toggleBtn.setAttribute("aria-pressed", "false");
    toggleBtn.setAttribute("aria-label", "Show all transactions");
    // Closure-local cursor + renderer read-back (v1.6.4 D1 / L-new-1).
    // Pre-v1.6.4 aria-pressed was driven solely from `let on = false`,
    // which was safe today (one button is the sole writer to its layer)
    // but brittle if a future code path writes the renderer's app slot
    // from elsewhere (URL param restore, keyboard shortcut, Embed API) —
    // the button label would silently drift from the renderer. Now the
    // setter returns the renderer's authoritative app-slot value and the
    // button reflects it. The closure-local boolean still drives the
    // toggle gesture (click N+1 should land at the opposite of click N's
    // result).
    let cursor = false;
    toggleBtn.addEventListener("click", () => {
      const desired = !cursor;
      const actual = onToggleShowAll(desired);
      // Renderer return value is authoritative. Fall back to `desired` if
      // the wiring doesn't yet return one (defensive — keeps embedders
      // who stub onToggleShowAll with a void callback working).
      cursor = typeof actual === "boolean" ? actual : desired;
      toggleBtn.classList.toggle("active", cursor);
      toggleBtn.setAttribute("aria-pressed", String(cursor));
      // After the renderer updates state the visible-but-secondary count
      // changes (countHidden clamps to 0 when effective showAll is ON).
      // Refresh the label so the button text + disabled state match.
      refresh();
    });
    switcherEl.appendChild(toggleBtn);
    crossArrowsBtn = toggleBtn;
  }

  if (showIntraArrowToggle) {
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "cross-arrows-toggle intra-arrows-toggle";
    toggleBtn.textContent = "Show all (0)";
    toggleBtn.setAttribute("aria-pressed", "false");
    toggleBtn.setAttribute("aria-label", "Show all arrows");
    // Keep this as a separate button from "Show all transactions": cross-
    // matrix contracts and intra-matrix visual-emphasis arrows are different
    // reading layers, and readers may want one without forcing the other.
    // Read-back contract identical to the show-all-transactions button above.
    let cursor = false;
    toggleBtn.addEventListener("click", () => {
      const desired = !cursor;
      const actual = onToggleShowAllIntraArrows(desired);
      cursor = typeof actual === "boolean" ? actual : desired;
      toggleBtn.classList.toggle("active", cursor);
      toggleBtn.setAttribute("aria-pressed", String(cursor));
      refresh();
    });
    switcherEl.appendChild(toggleBtn);
    intraArrowsBtn = toggleBtn;
  }

  // v1.6.4 D5.2 — Refresh the Show All button labels + disabled state by
  // re-reading countHidden from the controller. Caller wires this to step
  // changes (controller `onChange`) and to any other emphasis state
  // mutation (Explore chip click, Explore Show All toggle, etc.) so the
  // labels stay in sync with what's actually rendered. countHidden lookups
  // are cheap DOM scans bounded by the number of arrow / overlay /
  // annotation elements in the current scene — call freely.
  function refresh() {
    if (crossArrowsBtn) {
      const n = getHiddenCount?.crossArrows?.() ?? 0;
      stampHiddenLabel(crossArrowsBtn, n);
    }
    if (intraArrowsBtn) {
      const n = getHiddenCount?.intraArrows?.() ?? 0;
      stampHiddenLabel(intraArrowsBtn, n);
    }
  }

  // First stamp happens synchronously so callers that don't call refresh()
  // explicitly still get a sane initial label. Subsequent stamps come from
  // caller-driven refresh() invocations on step/emphasis changes.
  refresh();

  return { refresh };
}

let activeController = null;

async function mountScene(id, matrixIndex, els) {
  if (activeController) {
    activeController.destroy();
    activeController = null;
  }
  els.caption.textContent = "Loading…";

  let scene;
  try {
    const raw = await loadScene(id);
    scene = decorateScene(raw);
  } catch (err) {
    els.caption.innerHTML = `<strong>Error.</strong> Could not load scene: ${err.message}`;
    console.error(err);
    return;
  }

  // Clamp matrixIndex to the available range, so a stale ?m= from a previous
  // scene doesn't blow up the mount. mountTSM still guards out-of-range
  // values, but for in-page scene switches we prefer to fall back gracefully.
  const matrices = scene?.matrices ?? [];
  const safeMatrixIndex = matrixIndex < matrices.length ? matrixIndex : 0;
  if (safeMatrixIndex !== matrixIndex) {
    console.warn(
      `app.js: ?m=${matrixIndex} out of range for scene "${id}" (${matrices.length} matrices); using 0.`
    );
  }

  function buildProgressDots(total) {
    els.progress.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      els.progress.appendChild(dot);
    }
  }

  // v1.6.4 D5.2 — switcherHandle is set after rebuildMatrixSwitcher returns
  // below. Captured here so onChange (step transitions) and the emphasis-
  // change hook (Explore chip click / Show All toggle) can both invoke
  // refresh() to re-stamp the Show All button labels.
  let switcherHandle = null;
  function refreshHiddenLabels() {
    switcherHandle?.refresh?.();
  }

  function onChange({ stepIndex, step, isFirst, isLast }) {
    els.caption.innerHTML = step.caption;

    const dots = els.progress.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i <= stepIndex);
    });

    els.prevBtn.disabled = isFirst;
    els.nextBtn.disabled = isLast;
    els.nextBtn.textContent = isLast ? "Done" : "Next step →";
    // Restart is only ever disabled by the stepCount===0 backstop below; a
    // walkthrough scene that fires onChange must re-enable it, otherwise a
    // prior no-narrative scene leaves it stuck disabled for the session.
    els.restartBtn.disabled = false;

    // After a step transition the walkthrough may have shifted items
    // between primary and secondary (setEmphasis on the new step). The
    // countHidden DOM scan runs after the renderer's apply-pass has
    // re-stamped data-emphasis, so the refresh sees the post-step counts.
    refreshHiddenLabels();
  }

  // Multi-matrix scenes mount EVERY matrix side-by-side via
  // mountAllMatrices; single-matrix scenes (the vast majority) keep the
  // existing single-mount mountTSM path. The two controllers expose the
  // same shape, so the wiring below doesn't have to branch.
  const isMultiMount = matrices.length > 1;
  if (isMultiMount) {
    activeController = mountAllMatrices(els.tsm, scene, {
      onChange,
      legendContainer: els.taskLegend,
      exploreContainer: els.exploreMount,
      onEmphasisChange: refreshHiddenLabels,
    });
  } else {
    activeController = mountTSM(els.tsm, scene, {
      onChange,
      matrixIndex: safeMatrixIndex,
      legendContainer: els.taskLegend,
      exploreContainer: els.exploreMount,
      onEmphasisChange: refreshHiddenLabels,
    });
  }

  buildProgressDots(activeController.getState().stepCount);
  // Re-fire step(0) now that the dots exist (the initial step in
  // mountTSM/mountAllMatrices ran before the DOM nodes were available for
  // the active-dot toggle).
  activeController.step(0);

  // Provenance: scene.source now lives in the .matrix-meta collapsible (it was
  // squashed below the capped matrix card). Write it here and hide the <details>
  // when the scene has no source. (The algorithm view hides .matrix-meta via CSS.)
  if (els.provenanceBody) {
    const src = String(scene.source ?? "").trim();
    els.provenanceBody.innerHTML = src;
    if (els.provenance) els.provenance.hidden = src === "";
  }

  // Defense: a scene with no walkthrough steps (no narrative) leaves step(0)
  // a no-op, so onChange never fires and the caption stays on "Loading…"
  // with a dead Next — the exact silent hang the multi-matrix derived scenes
  // shipped with. Never strand the reader: show a neutral static caption and
  // disable the step controls. All shipped scenes now carry a narrative
  // (enforced by tests/unit/scene-walkthrough-coverage.test.js); this is the
  // backstop that keeps a future no-narrative scene degrading gracefully.
  if ((activeController.getState().stepCount ?? 0) === 0) {
    els.caption.innerHTML = `<strong>${scene.title ?? "Static view"}.</strong> This scene renders as a static matrix — no guided walkthrough.`;
    els.prevBtn.disabled = true;
    els.nextBtn.disabled = true;
    els.restartBtn.disabled = true;
  }

  // Refresh the matrix switcher. In multi-mount mode the buttons toggle
  // FOCUS on an already-mounted matrix (no page reload) rather than
  // switching to a different single-mount. The "Show all transactions"
  // toggle stays orthogonal — it works in either mode.
  const hasCrossArrows = (scene.arrows?.length ?? 0) > 0;
  const hasRenderedArrows = matrices.some((matrix) =>
    (matrix.transfers ?? []).some((transfer) => transfer?.rendering?.arrow === true)
  );
  switcherHandle = rebuildMatrixSwitcher(
    els.matrixSwitcher,
    matrices.length,
    isMultiMount ? null : safeMatrixIndex,
    (newIndex) => {
      if (isMultiMount) {
        // newIndex === null means the "Both" / "All" button — return to
        // no-focus default. Otherwise focus the selected matrix. No URL
        // mutation: focus is a transient view state, not a deep-link
        // target. (URL deep-linking to a focus matrix is parked.)
        activeController?.focusMatrix(newIndex);
      } else {
        const url = new URL(location.href);
        url.searchParams.set("m", String(newIndex));
        history.replaceState(null, "", url);
        mountScene(id, newIndex, els);
      }
    },
    {
      hasCrossArrows,
      onToggleShowAll: (on) => activeController?.setShowAllCrossArrows(on),
      hasRenderedArrows,
      onToggleShowAllIntraArrows: (on) => activeController?.setShowAllIntraArrows(on),
      multiMount: isMultiMount,
      // v1.6.4 D5.2 — Show All buttons read their N from the controller's
      // countHidden() DOM scan. The cross-arrows button counts cross-arrows
      // only (scene-level); the intra-arrows button counts intra-arrows
      // across every matrix (multi-mount sums; single-mount = one matrix).
      getHiddenCount: {
        crossArrows: () => activeController?.countHidden?.("crossArrows") ?? 0,
        intraArrows: () => activeController?.countHidden?.("intraArrows") ?? 0,
      },
    },
  );

  // First refresh after the initial step settles — countHidden depends on
  // post-apply DOM state, so the controller's step(0) above must have
  // already run.
  refreshHiddenLabels();
}

// The algorithm-discovery view runs on a dependency-observation and supplies
// its own title/caption/controls inside the container. Mount it into #tsm; the
// walkthrough aside chrome is hidden by applyViewMode while it's active.
async function mountAlgorithmScene(els) {
  if (activeController) {
    activeController.destroy();
    activeController = null;
  }
  let observation;
  try {
    const resp = await fetch(ALGORITHM_OBSERVATION_URL);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    observation = await resp.json();
  } catch (err) {
    els.tsm.innerHTML = `<p class="algorithm-load-error"><strong>Error.</strong> Could not load the observation: ${err.message}</p>`;
    console.error(err);
    return;
  }
  activeController = mountAlgorithmView(els.tsm, observation);
}

// Toggle page chrome between the figure walkthrough and the algorithm view.
// In algorithm mode the walkthrough aside + scene picker hide (the algorithm
// view brings its own controls); the toggle relabels itself as a way back.
function applyViewMode(mode, els) {
  const algo = mode === "algorithm";
  // Drop the two-column grid in algorithm mode: the walkthrough rail is hidden
  // (below) and the algorithm view fills #tsm with its own chrome, so the grid
  // would otherwise leave an empty 360px rail column. base.css `.view-algorithm`
  // collapses .layout to a block and re-widens #tsm.
  document.body.classList.toggle("view-algorithm", algo);
  // Use inline display (not the `hidden` attribute) — `.layout` / `.narrative`
  // carry CSS `display` rules that win over the UA `[hidden]` stylesheet. This
  // toggles only the RIGHT cockpit; the LEFT rail (scene index + legend) is
  // hidden separately in algorithm mode by the `.view-algorithm .rail-left`
  // rule in base.css (scene choice is moot while the algorithm runs).
  if (els.narrative) els.narrative.style.display = algo ? "none" : "";
  if (algo && els.matrixSwitcher) els.matrixSwitcher.hidden = true;
  if (els.viewToggle) {
    els.viewToggle.textContent = algo
      ? "← Back to the figures"
      : "Watch the algorithm build a TSM →";
    els.viewToggle.classList.toggle("active", algo);
  }
}

async function init() {
  const els = {
    tsm: document.getElementById("tsm"),
    caption: document.getElementById("caption"),
    progress: document.getElementById("progress"),
    prevBtn: document.getElementById("prev-btn"),
    nextBtn: document.getElementById("next-btn"),
    restartBtn: document.getElementById("restart-btn"),
    sceneIndex: document.querySelector(".scene-index"),
    matrixSwitcher: document.getElementById("matrix-switcher"),
    taskLegend: document.getElementById("task-legend"),
    provenance: document.querySelector(".provenance"),
    provenanceBody: document.getElementById("provenance-body"),
    exploreMount: document.getElementById("explore-mount"),
    viewToggle: document.getElementById("view-toggle"),
    narrative: document.querySelector("aside.narrative"),
  };

  const params = new URLSearchParams(location.search);
  const initialScene = parseSceneParam(params);
  const initialMatrixIndex = parseMatrixIndexParam(params);
  const initialView = parseViewParam(params);

  // Scene selection: clicking an index item canonicalises the URL, moves the
  // .current marker in place, and re-mounts (no full reload).
  async function onSelectScene(id) {
    const url = new URL(location.href);
    url.searchParams.set("scene", id);
    url.searchParams.delete("example"); // drop legacy alias; keep URL canonical
    url.searchParams.delete("m");       // a prior m=N rarely fits another scene
    history.replaceState(null, "", url);
    markCurrentScene(els.sceneIndex, id);
    await mountScene(id, 0, els);
  }
  buildSceneIndex(els.sceneIndex, initialScene, onSelectScene);

  els.prevBtn.addEventListener("click", () => activeController?.prev());
  els.nextBtn.addEventListener("click", () => activeController?.next());
  els.restartBtn.addEventListener("click", () => activeController?.restart());

  // View toggle: flip between the figure walkthrough and the algorithm view.
  // Each side mounts its own controller into #tsm; the switch destroys the
  // prior controller (both mount paths tear down activeController first).
  if (els.viewToggle) {
    els.viewToggle.addEventListener("click", async () => {
      const url = new URL(location.href);
      const goingAlgo = parseViewParam(url.searchParams) !== "algorithm";
      if (goingAlgo) {
        url.searchParams.set("view", "algorithm");
      } else {
        url.searchParams.delete("view");
      }
      history.replaceState(null, "", url);
      applyViewMode(goingAlgo ? "algorithm" : "walkthrough", els);
      if (goingAlgo) {
        await mountAlgorithmScene(els);
      } else {
        await mountScene(parseSceneParam(url.searchParams), 0, els);
      }
    });
  }

  // "Try your own" (Step 12) dispatches a bubbling tsm-try-your-own event with
  // the parsed observation; re-mount the algorithm view on it. Attached once to
  // #tsm (which persists across re-mounts) so listeners don't accumulate.
  if (els.tsm) {
    els.tsm.addEventListener("tsm-try-your-own", (e) => {
      const observation = e.detail;
      if (!observation || observation.kind !== "dependency-observation") return;
      try {
        activeController?.destroy();
      } catch (err) {
        console.warn("re-mount: prior controller destroy failed", err);
      }
      try {
        activeController = mountAlgorithmView(els.tsm, observation);
      } catch (err) {
        els.tsm.innerHTML = `<p class="algorithm-load-error"><strong>Could not run that observation.</strong> ${err.message}</p>`;
        console.error(err);
      }
    });
  }

  applyViewMode(initialView, els);
  if (initialView === "algorithm") {
    await mountAlgorithmScene(els);
  } else {
    await mountScene(initialScene, initialMatrixIndex, els);
  }
}

// Browser-only bootstrap. The pure helpers (parseSceneParam,
// parseMatrixIndexParam, groupedScenes, SCENE_REGISTRY) above are
// importable from Bun unit tests; guard the DOM hook so importing
// app.js in a non-browser environment doesn't ReferenceError.
//
// We probe for `getElementById` rather than just `typeof document` because
// other unit tests in the suite (algorithm-view.test.js) stub a partial
// globalThis.document — bun:test shares the global between files, so a
// `typeof document !== "undefined"` check would falsely fire on those runs.
if (typeof document !== "undefined" && typeof document.getElementById === "function") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
