// <tsm-scene> custom element. Embeds a TSM walkthrough into any page.
//
// Usage:
//   <link rel="stylesheet" href="path/to/styles/theme.css">
//   <link rel="stylesheet" href="path/to/styles/base.css">
//   <link rel="stylesheet" href="path/to/styles/matrix.css">
//   <link rel="stylesheet" href="path/to/styles/overlays.css">
//   <script type="module" src="path/to/component.js"></script>
//
//   <tsm-scene src="examples/laptop-modular.json"></tsm-scene>
//
// Attributes:
//   src           (required) URL of a v0.3 tsm-scene JSON file
//   view          "walkthrough" (default) or "static"
//   no-controls   if present, the embed renders the matrix only — no
//                 buttons/caption/progress chrome
//   matrix-index  (optional) which matrix in scene.matrices to render.
//                 Kebab-cased because HTML attributes are case-insensitive;
//                 the component parses it and forwards to mountTSM's
//                 matrixIndex option. Missing or unparseable → 0.
//                 Out-of-range surfaces as the mountTSM guard's loud throw.
//
// Events:
//   tsm-loaded  fires once the scene mounts. detail: { stepCount }
//   tsm-step    fires on every step change. detail: { stepIndex, total }
//   tsm-error   fires on load/validation failure. detail: { message }
//
// Notes:
// - No shadow DOM. The host page's CSS reaches in to theme the matrix.
// - The component re-fetches and re-decorates on ANY observed-attribute
//   change (including `matrix-index`). The fetch + decorate cost is small
//   relative to the layout pass, so we keep _render unconditional rather
//   than cache the decorated scene on the instance — simpler tear-down,
//   no stale-scene risk if `src` is changed independently.

import { mountTSM } from "./main.js";
import { decorateScene, resolveNarrative } from "./core/scene-adapter.js";

/**
 * Parse a kebab-cased `matrix-index` attribute value into a non-negative
 * integer. Missing/null/empty/malformed values yield 0 (with a console
 * warning for the malformed case). Exported for unit tests.
 *
 * @param {string | null | undefined} raw
 * @returns {number}
 */
export function parseMatrixIndexAttr(raw) {
  if (raw === null || raw === undefined || raw === "") return 0;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0) {
    console.warn(`<tsm-scene>: ignoring unparseable matrix-index="${raw}"; defaulting to 0`);
    return 0;
  }
  return n;
}

// Guard the class definition behind a typeof check so importing component.js
// in a non-browser environment (Bun unit tests for parseMatrixIndexAttr)
// doesn't ReferenceError on `HTMLElement`. The registration block at the
// bottom also runs under the same guard.
const TSMScene = typeof HTMLElement === "undefined"
  ? null
  : class TSMScene extends HTMLElement {
  static get observedAttributes() {
    return ["src", "view", "no-controls", "matrix-index"];
  }

  constructor() {
    super();
    this._controller = null;
    this._mounted = false;
    this._buttonState = null;
  }

  async connectedCallback() {
    this._mounted = true;
    await this._render();
  }

  disconnectedCallback() {
    this._mounted = false;
    this._teardown();
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (!this._mounted) return;
    if (oldValue === newValue) return;
    await this._render();
  }

  _teardown() {
    if (this._controller) {
      this._controller.destroy();
      this._controller = null;
    }
    this.innerHTML = "";
  }

  async _render() {
    this._teardown();
    const src = this.getAttribute("src");
    const view = this.getAttribute("view") ?? "walkthrough";
    const showControls = !this.hasAttribute("no-controls");
    const matrixIndex = parseMatrixIndexAttr(this.getAttribute("matrix-index"));

    if (!src) {
      this.innerHTML = '<div class="tsm-embed-error">Missing src attribute.</div>';
      return;
    }

    let raw;
    try {
      const resp = await fetch(src);
      if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
      raw = await resp.json();
    } catch (err) {
      const message = `Failed to load scene at ${src}: ${err.message}`;
      this.innerHTML = `<div class="tsm-embed-error">${message}</div>`;
      this.dispatchEvent(new CustomEvent("tsm-error", { detail: { message }, bubbles: true }));
      return;
    }

    let scene;
    try {
      scene = decorateScene(raw);
    } catch (err) {
      const message = `Failed to decorate scene: ${err.message}`;
      this.innerHTML = `<div class="tsm-embed-error">${message}</div>`;
      this.dispatchEvent(new CustomEvent("tsm-error", { detail: { message }, bubbles: true }));
      return;
    }

    // Lay out the embed: a single tsm-wrapper, optionally with caption +
    // controls + progress bar below it.
    this.classList.add("tsm-embed");

    const wrapper = document.createElement("div");
    wrapper.className = "tsm-wrapper";
    this.appendChild(wrapper);

    let captionEl = null;
    let progressEl = null;
    let prevBtn = null;
    let nextBtn = null;
    let restartBtn = null;

    // Resolve the narrative the same way main.js does — prefer the
    // per-matrix narrative when present, fall back to the scene-level one.
    // Scenes that carry only `matrices[N].narrative` (no root `narrative`)
    // must still get chrome; the earlier `scene.narrative?.steps` read
    // missed that path and rendered the controller without any UI around it.
    const resolvedNarrative = resolveNarrative(scene, matrixIndex);
    const stepCount = resolvedNarrative?.steps?.length ?? 0;
    if (showControls && view === "walkthrough" && stepCount > 0) {
      const chrome = document.createElement("div");
      chrome.className = "tsm-embed-chrome";

      captionEl = document.createElement("div");
      captionEl.className = "step-caption";
      chrome.appendChild(captionEl);

      const controls = document.createElement("div");
      controls.className = "controls";
      prevBtn = document.createElement("button");
      prevBtn.className = "secondary";
      prevBtn.textContent = "← Back";
      restartBtn = document.createElement("button");
      restartBtn.className = "secondary";
      restartBtn.textContent = "Restart";
      nextBtn = document.createElement("button");
      nextBtn.textContent = "Next step →";
      controls.appendChild(prevBtn);
      controls.appendChild(restartBtn);
      controls.appendChild(nextBtn);
      chrome.appendChild(controls);

      progressEl = document.createElement("div");
      progressEl.className = "progress";
      for (let i = 0; i < stepCount; i++) {
        const dot = document.createElement("div");
        dot.className = "dot";
        progressEl.appendChild(dot);
      }
      chrome.appendChild(progressEl);

      this.appendChild(chrome);
    }

    const onChange = ({ stepIndex, step, isFirst, isLast, total }) => {
      if (captionEl) captionEl.innerHTML = step.caption;
      if (progressEl) {
        progressEl.querySelectorAll(".dot").forEach((d, i) => {
          d.classList.toggle("active", i <= stepIndex);
        });
      }
      if (prevBtn) prevBtn.disabled = isFirst;
      if (nextBtn) {
        nextBtn.disabled = isLast;
        nextBtn.textContent = isLast ? "Done" : "Next step →";
      }
      this.dispatchEvent(
        new CustomEvent("tsm-step", {
          detail: { stepIndex, total },
          bubbles: true,
        })
      );
    };

    // Suppress the Explore disclosure on the <tsm-scene> embed entirely.
    // The disclosure is part of the standalone app's Path A reader surface
    // (SPEC-LENSES §7.2); embeds are minimal-chrome hosts for content sites
    // and don't carry the chip strip. Authors who want the chip strip use
    // the standalone app at /tsm/.
    this._controller = mountTSM(wrapper, scene, {
      view, onChange, matrixIndex,
      explore: false,
    });
    // re-fire step(0) to update the chrome we just built (controller's
    // initial step(0) happens before our DOM nodes exist).
    if (this._controller.getState().view === "walkthrough") {
      this._controller.step(0);
    }

    if (prevBtn) prevBtn.addEventListener("click", () => this._controller.prev());
    if (nextBtn) nextBtn.addEventListener("click", () => this._controller.next());
    if (restartBtn)
      restartBtn.addEventListener("click", () => this._controller.restart());

    this.dispatchEvent(
      new CustomEvent("tsm-loaded", {
        detail: { stepCount: this._controller.getState().stepCount ?? 0 },
        bubbles: true,
      })
    );
  }
};

if (typeof customElements !== "undefined" && TSMScene && !customElements.get("tsm-scene")) {
  customElements.define("tsm-scene", TSMScene);
}
