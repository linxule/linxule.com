// Algorithm view — Hidden Structure discovery animation.
//
// Implements the 12-step pedagogy from STORYBOARD-ALGORITHM.md as a
// state machine over a dependency-observation document. Each step
// has its own renderer module under steps/. Phase → step mapping
// lives in meta.js.
//
// The view owns currentStep ∈ [1..12]. It mounts a stage element
// where each step renders its visuals, plus a caption pane and
// controls (prev / next / restart). Mirror surface of
// views/walkthrough.js: callers receive
// { destroy(), step(n), next(), prev(), getState() }.
//
// This file uses only standard DOM APIs (document.createElement,
// classList, etc.) so it runs in the browser unchanged. Tests
// inject a minimal DOM shim before importing — see
// tests/unit/algorithm-view.test.js.

import { TOTAL_STEPS, STEP_META } from "./meta.js";
import { renderStep1 } from "./steps/step-1.js";
import { renderStep2 } from "./steps/step-2.js";
import { renderStep3 } from "./steps/step-3.js";
import { renderStep4 } from "./steps/step-4.js";
import { renderStep5 } from "./steps/step-5.js";
import { renderStep6 } from "./steps/step-6.js";
import { renderStep7 } from "./steps/step-7.js";
import { renderStep8 } from "./steps/step-8.js";
import { renderStep9 } from "./steps/step-9.js";
import { renderStep10 } from "./steps/step-10.js";
import { renderStep11 } from "./steps/step-11.js";
import { renderStep12 } from "./steps/step-12.js";
import { renderStub } from "./steps/stub.js";
import { computeVisibilityMatrix } from "../../core/engine/visibility.js";
import { computeVFIVFO } from "../../core/engine/vfi-vfo.js";
import { findCyclicGroups } from "../../core/engine/cyclic-groups.js";
import {
  partitionFourSquare,
  classifyArchitecture,
  deriveSceneFromObservation,
} from "../../core/synthesis/derive.js";
import { buildShortCodeMap } from "../../core/synthesis/present.js";
import { renderTaskLegend } from "../../render/legend.js";

// Steps whose stage renders the matrix with code-coded diagonal cells
// (L1, R3, … — the ctx shortCodes). On these the label key is shown; on the others —
// intro tiles (1), direction example (2), indirect-chain diagram (4),
// architecture verdict (10), drop zone (12) — the codes aren't on screen,
// so the key stays hidden to avoid clutter. Pinned by
// tests/unit/algorithm-view.test.js against the shortLabel-bearing steps.
const CODED_DIAGONAL_STEPS = new Set([3, 5, 6, 7, 8, 9, 11]);

// One-word phase names for the left-rail step index. Condensed from the six
// phases in meta.js / STORYBOARD-ALGORITHM.md — orientation labels, not the
// canonical phase definitions.
const PHASE_LABELS = {
  1: "The system",
  2: "Direction",
  3: "Visibility",
  4: "Cycles",
  5: "The Core",
  6: "Your TSM",
};

/**
 * Mount the algorithm view into a container.
 *
 * @param {HTMLElement} container — element to mount into. Existing content is cleared.
 * @param {object} observation — v0.3 dependency-observation document
 *   (nodes: [{id,label,entityType}], edges: [{from,to,relation}]).
 * @param {object} [options]
 * @param {number} [options.initialStep=1] — step to start on (1..12).
 * @param {(state: object) => void} [options.onChange] — fired after each step transition.
 * @returns {{ destroy(), step(n), next(), prev(), getState() }}
 */
export function mountAlgorithmView(container, observation, options = {}) {
  if (!container) throw new Error("mountAlgorithmView: container is required");
  if (!observation || observation.kind !== "dependency-observation") {
    throw new Error(
      `mountAlgorithmView: expected kind="dependency-observation", got "${observation?.kind}"`,
    );
  }

  const nodes = observation.nodes ?? [];
  const edges = observation.edges ?? [];
  if (nodes.length === 0) {
    throw new Error("mountAlgorithmView: observation has no nodes");
  }

  const initialStep = Number.isInteger(options.initialStep) ? options.initialStep : 1;
  if (initialStep < 1 || initialStep > TOTAL_STEPS) {
    throw new Error(`mountAlgorithmView: initialStep must be in [1..${TOTAL_STEPS}]`);
  }

  // Visibility (transitive-closure) matrix is needed by Phase 3 onward
  // (Steps 4-5 are the indirect-dependency hinge). Computed once at
  // mount time — pure graph math, no DOM dependencies. Phase 4 layers
  // VFI/VFO + cyclic groups on top; Phase 5 adds the four-square
  // partition + architecture-type verdict. ctx grows per phase; we
  // precompute everything that's pure graph math so individual step
  // renderers stay declarative.
  const { V, idx: nodeIndex } = computeVisibilityMatrix(nodes, edges);
  const vfivfo = computeVFIVFO(V, nodes);
  const cyclicGroups = findCyclicGroups(V, vfivfo, nodes);
  const partition = partitionFourSquare(V, nodeIndex, nodes, cyclicGroups);
  const architectureType = partition
    ? classifyArchitecture(partition, nodes.length)
    : "hierarchical";
  // Derived tsm-scene — the full v0.3 document the algorithm produces from
  // the observation. Step 11 renders this directly as a "proper TSM" + an
  // "Export as scene.json" button; the rest of the steps ignore it.
  const derivedScene = deriveSceneFromObservation(observation);

  // Stable id → terse diagonal code (L1/R2/…). Threaded through ctx so every
  // coded step + the decode key show the SAME code for a component, from the
  // Step-3 chaos to the Step-11 Core. See buildShortCodeMap in present.js.
  const shortCodes = buildShortCodeMap(nodes);

  // Build the shell as a 3-region marginalia layout, mirroring the figure
  // walkthrough (rail / plate / cockpit): the STAGE (the matrix plate + its
  // per-step annotations) takes the centre column; a left RAIL carries the
  // 12-step index for orientation; the right COCKPIT holds the step title,
  // controls, and caption, sticky. The decode key spans full width below the
  // grid. This recovers the empty side-margins the old centred single column
  // left, and lets the dense matrix grow toward the viewport height.
  container.innerHTML = "";
  const root = document.createElement("div");
  root.className = "algorithm-view";

  const layoutEl = document.createElement("div");
  layoutEl.className = "algorithm-layout";
  root.appendChild(layoutEl);

  // --- Left rail: the 12-step index, grouped by phase (orientation only) -----
  // A plain container, NOT a <nav> landmark: the items are non-interactive
  // orientation (unlike the figure view's clickable scene index), so promising
  // "navigation" would mislead assistive tech. The accessible progress is the
  // cockpit's step title + "N / 12" indicator; this rail is a visual aid.
  const railEl = document.createElement("div");
  railEl.className = "algorithm-rail";
  const railItemByStep = {};
  let lastPhase = null;
  for (let s = 1; s <= TOTAL_STEPS; s++) {
    const meta = STEP_META[s];
    if (meta.phase !== lastPhase) {
      lastPhase = meta.phase;
      const phaseEl = document.createElement("p");
      phaseEl.className = "algorithm-rail-phase";
      phaseEl.textContent = `Phase ${meta.phase} · ${PHASE_LABELS[meta.phase] ?? ""}`.trim();
      railEl.appendChild(phaseEl);
    }
    const item = document.createElement("div");
    item.className = "algorithm-rail-step";
    item.dataset.step = String(s);
    const num = document.createElement("span");
    num.className = "algorithm-rail-num";
    num.textContent = String(s);
    item.appendChild(num);
    const label = document.createElement("span");
    label.className = "algorithm-rail-label";
    label.textContent = meta.title.replace(/\.\s*$/, "");
    item.appendChild(label);
    railEl.appendChild(item);
    railItemByStep[s] = item;
  }
  layoutEl.appendChild(railEl);

  // --- Centre: the stage (each step renders its visuals here) ----------------
  const mainEl = document.createElement("div");
  mainEl.className = "algorithm-main";
  layoutEl.appendChild(mainEl);

  const stageEl = document.createElement("div");
  stageEl.className = "algorithm-stage";
  mainEl.appendChild(stageEl);

  // --- Right: the cockpit (title + caption + controls), sticky ---------------
  const cockpitEl = document.createElement("div");
  cockpitEl.className = "algorithm-cockpit";
  layoutEl.appendChild(cockpitEl);

  // h2: the page <h1> is the demo title; the step title is the next level down
  // (no <h2> between them would skip a heading level).
  const titleEl = document.createElement("h2");
  titleEl.className = "algorithm-step-title";
  cockpitEl.appendChild(titleEl);

  // DOM order is title → caption → controls so a screen reader meets the
  // explanation before the nav buttons (the figure .narrative's deliberate
  // choice). CSS `order` lifts the controls ABOVE the caption visually so
  // Next/Back hold position as the caption length swings step to step.
  // aria-live announces the new caption when the step changes.
  const captionEl = document.createElement("p");
  captionEl.className = "algorithm-caption";
  captionEl.setAttribute("aria-live", "polite");
  cockpitEl.appendChild(captionEl);

  const controlsEl = document.createElement("div");
  controlsEl.className = "algorithm-controls";

  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "algorithm-prev";
  prevBtn.textContent = "← Back";
  controlsEl.appendChild(prevBtn);

  const indicatorEl = document.createElement("span");
  indicatorEl.className = "algorithm-indicator";
  controlsEl.appendChild(indicatorEl);

  // Restart sits in the left cluster; Next (margin-left:auto in CSS) anchors the
  // right edge as the single primary "page-turn" action.
  const restartBtn = document.createElement("button");
  restartBtn.type = "button";
  restartBtn.className = "algorithm-restart";
  restartBtn.textContent = "Restart";
  controlsEl.appendChild(restartBtn);

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "algorithm-next";
  nextBtn.textContent = "Next →";
  controlsEl.appendChild(nextBtn);

  cockpitEl.appendChild(controlsEl);

  // Persistent label key — decodes the diagonal ctx codes (L1, R3, …)
  // back to full component names. Reuses the walkthrough's
  // category-grouped legend renderer; observation nodes already carry the
  // `category` + `shortLabel` fields it groups on. Returns no element for
  // observations without categories (e.g. a user-dropped graph), in which
  // case the key is simply absent — no empty node. render() toggles its
  // visibility per step (CODED_DIAGONAL_STEPS).
  const keyWrap = document.createElement("div");
  keyWrap.className = "algorithm-legend";
  const keyHeading = document.createElement("p");
  keyHeading.className = "algorithm-legend-heading";
  keyHeading.textContent = "Label key";
  // Decode the SAME terse codes the matrix diagonals show: override each node's
  // shortLabel with its ctx code so the key reads "L1 → Kimi Code CLI" to match
  // the cell, not the observation's authored "CLI1". Nodes without a code keep
  // their authored shortLabel (the map only omits letterless categories).
  const keyTasks = nodes.map((node) => ({
    ...node,
    shortLabel: shortCodes[node.id] || node.shortLabel,
  }));
  const { legendEl: keyLegendEl, destroy: destroyKey } = renderTaskLegend(
    keyWrap,
    { tasks: keyTasks },
  );
  const hasKey = Boolean(keyLegendEl);
  if (hasKey) {
    keyWrap.appendChild(keyHeading);
    keyWrap.appendChild(keyLegendEl);
    root.appendChild(keyWrap);
  }

  container.appendChild(root);

  // Event handlers — keep references so destroy() can detach.
  const onPrev = () => api.prev();
  const onNext = () => api.next();
  const onRestart = () => api.step(1);
  prevBtn.addEventListener?.("click", onPrev);
  nextBtn.addEventListener?.("click", onNext);
  restartBtn.addEventListener?.("click", onRestart);

  let currentStep = initialStep;
  let stepCleanup = null;

  function render() {
    stepCleanup?.();
    stepCleanup = null;
    stageEl.innerHTML = "";
    const meta = STEP_META[currentStep];
    titleEl.textContent = `Step ${currentStep}. ${meta.title}`;
    captionEl.textContent = meta.caption;
    indicatorEl.textContent = `${currentStep} / ${TOTAL_STEPS}`;

    // Bookkeeping classes so tests + CSS can target the active step.
    root.dataset.step = String(currentStep);
    root.dataset.phase = String(meta.phase);

    // Mark the current step in the left-rail index (orientation). aria-current
    // toggles "step" ⇆ "false" (both valid) rather than add/remove the attr.
    for (const [s, item] of Object.entries(railItemByStep)) {
      const isCurrent = Number(s) === currentStep;
      item.classList.toggle("current", isCurrent);
      item.setAttribute("aria-current", isCurrent ? "step" : "false");
    }

    // Disabled hints for the controls — keep the buttons present so the
    // DOM is stable across steps; just toggle the disabled flag.
    prevBtn.disabled = currentStep === 1;
    nextBtn.disabled = currentStep === TOTAL_STEPS;

    // Label key follows the matrix: visible only on steps that render
    // coded diagonals, hidden where the codes aren't on screen.
    if (hasKey) keyWrap.hidden = !CODED_DIAGONAL_STEPS.has(currentStep);

    // Dispatch. Each step gets ctx = { stageEl, nodes, edges, V,
    // nodeIndex, vfivfo, cyclicGroups, partition, architectureType,
    // derivedScene }. derivedScene is the full v0.3 tsm-scene produced
    // by core/synthesis/derive.js; Step 11 renders + exports it.
    // Earlier steps ignore fields they don't read.
    const ctx = {
      stageEl,
      nodes,
      edges,
      V,
      nodeIndex,
      vfivfo,
      cyclicGroups,
      partition,
      architectureType,
      derivedScene,
      shortCodes,
    };
    switch (currentStep) {
      case 1:
        renderStep1(ctx);
        break;
      case 2:
        renderStep2(ctx);
        break;
      case 3:
        renderStep3(ctx);
        break;
      case 4:
        renderStep4(ctx);
        break;
      case 5:
        renderStep5(ctx);
        break;
      case 6:
        renderStep6(ctx);
        break;
      case 7:
        renderStep7(ctx);
        break;
      case 8:
        renderStep8(ctx);
        break;
      case 9:
        renderStep9(ctx);
        break;
      case 10:
        renderStep10(ctx);
        break;
      case 11:
        stepCleanup = renderStep11(ctx) ?? null;
        break;
      case 12:
        renderStep12(ctx);
        break;
      default:
        // Defensive fallback — unreachable today since all 12 steps have
        // renderers, but TOTAL_STEPS could grow. Keeps the state machine
        // robust against future expansion of the pedagogy.
        renderStub({ stageEl, stepNum: currentStep, meta });
        break;
    }

    options.onChange?.(api.getState());
  }

  const api = {
    step(n) {
      if (!Number.isInteger(n) || n < 1 || n > TOTAL_STEPS) {
        throw new Error(`algorithm-view: step ${n} out of range [1..${TOTAL_STEPS}]`);
      }
      currentStep = n;
      render();
    },
    next() {
      if (currentStep < TOTAL_STEPS) {
        currentStep += 1;
        render();
      }
    },
    prev() {
      if (currentStep > 1) {
        currentStep -= 1;
        render();
      }
    },
    getState() {
      const meta = STEP_META[currentStep];
      return {
        currentStep,
        total: TOTAL_STEPS,
        phase: meta.phase,
        title: meta.title,
        caption: meta.caption,
        isFirst: currentStep === 1,
        isLast: currentStep === TOTAL_STEPS,
      };
    },
    destroy() {
      stepCleanup?.();
      stepCleanup = null;
      destroyKey?.();
      prevBtn.removeEventListener?.("click", onPrev);
      nextBtn.removeEventListener?.("click", onNext);
      restartBtn.removeEventListener?.("click", onRestart);
      container.innerHTML = "";
    },
  };

  render();
  return api;
}

// Exported for tests that want to introspect step metadata without
// re-deriving the phase table.
export const ALGORITHM_TOTAL_STEPS = TOTAL_STEPS;
export const ALGORITHM_STEP_META = STEP_META;
