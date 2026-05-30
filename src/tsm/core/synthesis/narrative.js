// Walkthrough-narrative templates for the derived scene.
// Lives in the synthesis layer so the engine stays free of HTML strings.

/**
 * Build a 4-step walkthrough narrative for a derived scene. Captions
 * adapt to the discovered architecture type and partition sizes.
 */
export function buildDefaultNarrative(partition, architectureType, vfivfo) {
  const hasCore = partition && partition.core.length > 0;
  const coreLine = hasCore
    ? `Core: ${partition.core.length} nodes in a mutually-dependent cycle.`
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

  // Step 4 adapts to whether a cyclic core exists. With a core, the boxes are
  // the four-square partition (Core/Shared/Control drawn; Peripheral nodes sit
  // unboxed). With no cyclic group the system is fully hierarchical — no core
  // to partition around and no module-border overlays — so the caption must
  // NOT claim a four-square partition it can't draw (post-layout audit M2).
  const partitionBody = hasCore
    ? `The four-square partition.<br/>${[coreLine, sharedLine, controlLine, peripheralLine].filter(Boolean).join("<br/>")}`
    : "No cyclic core was found — the system is fully hierarchical, so it sorts into dependency layers rather than a core-periphery partition.";

  return {
    mode: "walkthrough",
    steps: [
      {
        caption: "<strong>Step 1.</strong> Hidden Structure has sorted the system. Every node sits on the diagonal in a position that reveals its structural role.",
        reveal: { include: ["diagonal"] },
      },
      {
        caption: "<strong>Step 2.</strong> Forward transfers show the dependency flow as it actually runs. Below the diagonal, each mark is a direct invocation or load.",
        reveal: { include: ["diagonal", "transfer:directed:forward"] },
      },
      {
        caption: "<strong>Step 3.</strong> Backward transfers — above the diagonal — show where the system loops back on itself. These are the cycles that make ordinary topological sorting impossible.",
        reveal: { include: ["diagonal", "transfer:directed:forward", "transfer:directed:backward"] },
      },
      {
        caption: `<strong>Step 4.</strong> ${partitionBody}<br/><em>Architecture: ${architectureType}.</em>`,
        reveal: {
          include: [
            "diagonal",
            "transfer:directed:forward",
            "transfer:directed:backward",
            // Only reveal the partition boxes when there's a core to partition
            // around. A fully-hierarchical scene has no module-border overlays;
            // revealing the token there spawns an empty auto-border overlay
            // (invisible, but a phantom node — the L1 auto-border footgun).
            ...(hasCore ? ["overlay:module-border"] : []),
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
 * @param {{ id: string, label?: string, architectureType?: string }[]} matrixSummaries
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

  return {
    mode: "walkthrough",
    steps: [
      {
        caption: `<strong>Step 1.</strong> ${n} systems, each its own boundary-bounded TSM. Every node sits on its own matrix's diagonal in a position that reveals its structural role.`,
        reveal: { include: ["diagonal"] },
      },
      {
        caption: "<strong>Step 2.</strong> Forward transfers — below each diagonal — show the dependency flow as it actually runs inside each system. Each mark is a direct invocation or load.",
        reveal: { include: ["diagonal", "transfer:directed:forward"] },
      },
      {
        caption: "<strong>Step 3.</strong> Backward transfers — above each diagonal — show where a system loops back on itself. These are the cycles that make ordinary topological sorting impossible.",
        reveal: { include: ["diagonal", "transfer:directed:forward", "transfer:directed:backward"] },
      },
      {
        caption: `<strong>Step 4.</strong> The four-square partition in each system.${archLine ? `<br/><em>Architecture — ${archLine}.</em>` : ""}${contractLine ? `<br/>${contractLine}` : ""}`,
        reveal: {
          include: [
            "diagonal",
            "transfer:directed:forward",
            "transfer:directed:backward",
            "overlay:module-border",
          ],
        },
      },
    ],
  };
}
