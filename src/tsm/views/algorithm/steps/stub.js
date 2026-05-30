// Algorithm view — Stub renderer for unimplemented steps.
//
// Steps 4-12 fall through to this until their phase ships. Records
// phase + step in the DOM so the state machine can be exercised
// end-to-end before the real visuals land. See meta.js for the
// phase → step mapping.

/**
 * @param {{ stageEl: HTMLElement, stepNum: number, meta: { phase: number, title: string, caption: string } }} ctx
 */
export function renderStub({ stageEl, stepNum, meta }) {
  const stub = document.createElement("div");
  stub.className = "algorithm-step-stub";
  stub.dataset.step = String(stepNum);
  stub.dataset.phase = String(meta.phase);
  stub.textContent = `Step ${stepNum}: not yet implemented (Phase ${meta.phase})`;
  stageEl.appendChild(stub);
}
