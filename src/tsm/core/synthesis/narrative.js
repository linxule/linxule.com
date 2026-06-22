// Walkthrough-narrative templates for the derived scene.
// Lives in the synthesis layer so the engine stays free of HTML strings.

/**
 * Build a 4-step walkthrough narrative for a derived scene. Every step's
 * caption adapts to the RENDERED data — forward/backward transfers actually
 * present, module-border overlays actually emitted, and the cyclic-core size —
 * so no step asserts something the matrix doesn't show, and no two steps can
 * contradict.
 *
 * @param {object} ctx
 * @param {object|null} ctx.partition — four-square partition (null when none)
 * @param {string} ctx.architectureType — synthesis-plugin id; DISPLAY LABEL ONLY
 * @param {{ kind: string }[]} [ctx.overlays] — overlays actually emitted
 * @param {string[][]} [ctx.cyclicGroups] — detected cyclic cores (largest first)
 * @param {boolean} [ctx.hasForwardTransfers] — any forward transfer rendered
 * @param {boolean} [ctx.hasBackwardTransfers] — any backward transfer rendered
 */
export function buildDefaultNarrative({
  partition,
  architectureType,
  overlays = [],
  cyclicGroups = [],
  hasForwardTransfers = true,
  hasBackwardTransfers = (cyclicGroups?.length ?? 0) > 0,
}) {
  // Structural classification is DATA-DRIVEN — keyed on whether module-border
  // overlays were actually emitted and the detected core size, NOT on the
  // architectureType string (which is only the display label and can be an
  // authored "modular"/"job-shop" id whose synthesis fell back to hierarchical).
  //   - genuineFourSquare: real module-border overlays exist → reveal them.
  //   - smallCore: a cyclic core exists but below the partition threshold (no
  //     overlays) → acknowledge the cycle, draw no overlay.
  //   - cyclicNoCore: backward transfers are rendered but the detector found no
  //     sized core (findCyclicGroups can under-report — KNOWN-ISSUES.md D-1);
  //     acknowledge the cycle so Step 4 never denies what Step 3 shows.
  //   - fully hierarchical: no backward transfers, no cyclic core.
  // Only genuineFourSquare reveals overlay:module-border; revealing it without
  // emitted overlays spawns an empty phantom auto-border.
  const hasModuleBorder = overlays.some((o) => o.kind === "module-border");
  const coreCount = cyclicGroups?.[0]?.length ?? 0;
  const genuineFourSquare = hasModuleBorder;
  const smallCore = !hasModuleBorder && coreCount > 0;
  const cyclicNoCore = !hasModuleBorder && coreCount === 0 && hasBackwardTransfers;

  const coreLine = coreCount > 0
    ? `Core: ${coreCount} nodes in a mutually-dependent cycle.`
    : "";
  const sharedLine = partition && partition.shared.length > 0
    ? `Shared: ${partition.shared.length} nodes the core depends on.`
    : "";
  const controlLine = partition && partition.control.length > 0
    ? `Control: ${partition.control.length} nodes that depend on the core.`
    : "";
  const peripheralLine = partition && partition.peripheral.length > 0
    ? `Peripheral: ${partition.peripheral.length} unrelated nodes.`
    : "";

  // Step 2 + Step 3 captions describe the RENDERED transfers, not graph theory
  // (a self-loop is filtered from transfers, so "acyclic" would over-claim).
  const step2Caption = hasForwardTransfers
    ? "<strong>Step 2.</strong> Forward transfers show the dependency flow as it actually runs. Below the diagonal, each mark is a direct invocation or load."
    : "<strong>Step 2.</strong> No forward transfers below the diagonal — there are no downward dependencies to show.";
  const step3Caption = hasBackwardTransfers
    ? "<strong>Step 3.</strong> Backward transfers — above the diagonal — show where the system loops back on itself. These are the cycles that make ordinary topological sorting impossible."
    : "<strong>Step 3.</strong> No backward transfers above the diagonal — the rendered dependencies sort cleanly into layers, so ordinary topological sorting succeeds.";

  // Step 4 caption adapts to the four structural cases above.
  let partitionBody;
  if (genuineFourSquare) {
    partitionBody = `The four-square partition.<br/>${[coreLine, sharedLine, controlLine, peripheralLine].filter(Boolean).join("<br/>")}`;
  } else if (smallCore) {
    partitionBody = `A small cyclic core was found — ${coreCount} ${coreCount === 1 ? "node" : "nodes"} in a mutually-dependent cycle — but it is below the threshold to partition the whole system around, so the system sorts into dependency layers.`;
  } else if (cyclicNoCore) {
    partitionBody = "Cyclic dependencies are present, but no single core large enough to organize the system — it sorts into dependency layers.";
  } else {
    partitionBody = "No backward transfers and no cyclic core — the system is fully hierarchical, so it sorts into dependency layers rather than a core-periphery partition.";
  }

  return {
    mode: "walkthrough",
    steps: [
      {
        caption: "<strong>Step 1.</strong> Hidden Structure has sorted the system. Every node sits on the diagonal in a position that reveals its structural role.",
        reveal: { include: ["diagonal"] },
      },
      {
        caption: step2Caption,
        reveal: { include: ["diagonal", "transfer:directed:forward"] },
      },
      {
        caption: step3Caption,
        reveal: { include: ["diagonal", "transfer:directed:forward", "transfer:directed:backward"] },
      },
      {
        caption: `<strong>Step 4.</strong> ${partitionBody}<br/><em>Architecture: ${architectureType}.</em>`,
        reveal: {
          include: [
            "diagonal",
            "transfer:directed:forward",
            "transfer:directed:backward",
            // Reveal partition boxes only when real module-border overlays were
            // emitted; otherwise the token spawns an empty phantom auto-border.
            ...(genuineFourSquare ? ["overlay:module-border"] : []),
          ],
        },
      },
    ],
  };
}

/**
 * Build a scene-level 4-step walkthrough for a MULTI-matrix derived scene.
 *
 * The single-matrix path (buildDefaultNarrative) is attached per matrix and
 * the single-mount controller reads it. The multi-matrix mount
 * (mountAllMatrices) fans every step's reveal tokens out to EVERY matrix at
 * once and drives them from the SCENE-level narrative — so a multi-matrix
 * derived scene needs its own scene-level narrative or the walkthrough has
 * zero steps and the caption strands on "Loading…" with a dead Next.
 *
 * Reveal token sequence mirrors the single-matrix narrative (diagonal →
 * forward → backward → module-border) so it fans out cleanly; captions speak
 * to the multi-system view and name the cross-matrix contracts.
 *
 * @param {{ id: string, label?: string, architectureType?: string, hasModuleBorder?: boolean, hasForwardTransfers?: boolean, hasBackwardTransfers?: boolean, coreCount?: number }[]} matrixSummaries
 * @param {number} crossArrowCount — number of cross-matrix arrows (contracts)
 * @returns {{ mode: "walkthrough", steps: object[] }}
 */
export function buildMultiMatrixNarrative(matrixSummaries, crossArrowCount = 0) {
  const n = matrixSummaries.length;
  const archLine = matrixSummaries
    .map((m) => `${m.label ?? m.id}: ${m.architectureType ?? "—"}`)
    .join("; ");
  const contractLine = crossArrowCount === 1
    ? "The one arrow crossing between the matrices is the contract — the transaction that links otherwise-separate systems."
    : crossArrowCount > 1
      ? `The ${crossArrowCount} arrows crossing between the matrices are the contracts — the transactions that link otherwise-separate systems.`
      : "";

  // Data-driven, per-matrix signals (mirrors the single-matrix builder):
  //   - hasModuleBorder: this matrix emitted real module-border overlays.
  //   - coreCount: detected cyclic-core size.
  //   - hasForwardTransfers / hasBackwardTransfers: rendered transfer directions.
  const allBorder = n > 0 && matrixSummaries.every((m) => m.hasModuleBorder);
  const anyBorder = matrixSummaries.some((m) => m.hasModuleBorder);
  const anyForward = matrixSummaries.some((m) => m.hasForwardTransfers);
  const anyBackward = matrixSummaries.some((m) => m.hasBackwardTransfers);
  // A matrix with cyclic dependencies but no emitted border: a small core, or a
  // core the detector under-reported (KNOWN-ISSUES.md D-1).
  const anyCyclicNoBorder = matrixSummaries.some(
    (m) => !m.hasModuleBorder && ((m.coreCount ?? 0) > 0 || m.hasBackwardTransfers),
  );

  const step2Caption = anyForward
    ? "<strong>Step 2.</strong> Forward transfers — below each diagonal — show the dependency flow as it actually runs inside each system. Each mark is a direct invocation or load."
    : "<strong>Step 2.</strong> No forward transfers below any diagonal — these systems have no downward dependencies to show.";
  const step3Caption = anyBackward
    ? "<strong>Step 3.</strong> Backward transfers — above each diagonal — show where a system loops back on itself. These are the cycles that make ordinary topological sorting impossible."
    : "<strong>Step 3.</strong> No backward transfers above any diagonal — the rendered dependencies sort cleanly into layers, so ordinary topological sorting succeeds.";

  // Step-4 caption: gate the four-square claim on matrices that ACTUALLY emit
  // module-border overlays; distinguish small/under-reported cyclic cores from
  // fully-hierarchical layers so the caption never denies a rendered cycle.
  let step4Body;
  if (allBorder) {
    step4Body = "The four-square partition in each system.";
  } else if (anyBorder) {
    // Mixed: at least one four-square, the rest are layers. Don't over-specify
    // the layered matrices as "small cyclic core" — some may be acyclic, others
    // cyclic-without-a-sized-core (cyclicNoCore). "no core is large enough" covers all.
    step4Body = "Each system's internal structure — a four-square partition where a cyclic core organizes it, dependency layers where no core is large enough.";
  } else if (anyCyclicNoBorder) {
    step4Body = "Each system sorts into dependency layers; some carry cyclic dependencies below the threshold to partition around.";
  } else {
    step4Body = "Each system sorts into dependency layers — none contains a cyclic core.";
  }

  return {
    mode: "walkthrough",
    steps: [
      {
        caption: `<strong>Step 1.</strong> ${n} systems, each its own boundary-bounded TSM. Every node sits on its own matrix's diagonal in a position that reveals its structural role.`,
        reveal: { include: ["diagonal"] },
      },
      {
        caption: step2Caption,
        reveal: { include: ["diagonal", "transfer:directed:forward"] },
      },
      {
        caption: step3Caption,
        reveal: { include: ["diagonal", "transfer:directed:forward", "transfer:directed:backward"] },
      },
      {
        caption: `<strong>Step 4.</strong> ${step4Body}${archLine ? `<br/><em>Architecture — ${archLine}.</em>` : ""}${contractLine ? `<br/>${contractLine}` : ""}`,
        reveal: {
          include: [
            "diagonal",
            "transfer:directed:forward",
            "transfer:directed:backward",
            // Reveal module-border only if >=1 matrix actually emits those
            // overlays; the N-2 renderer fix prevents a coreless matrix from
            // drawing a phantom even when the scene-level token reaches it.
            ...(anyBorder ? ["overlay:module-border"] : []),
          ],
        },
      },
    ],
  };
}
