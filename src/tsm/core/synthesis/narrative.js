// Walkthrough-narrative templates for the derived scene.
// Lives in the synthesis layer so the engine stays free of HTML strings.

/**
 * Build a 4-step walkthrough narrative for a derived scene. Captions
 * adapt to the discovered architecture type and partition sizes.
 */
export function buildDefaultNarrative(partition, architectureType, vfivfo) {
  const coreCount = partition ? partition.core.length : 0;

  // Three structural cases, keyed on the synthesis plugin (architectureType is
  // the id of the plugin whose narrative() ran — core-periphery / multi-core /
  // hierarchical) AND whether a cyclic core was found:
  //   - genuineFourSquare: a core-periphery/multi-core plugin ran, so a cyclic
  //     core large enough to organize the system exists AND module-border
  //     overlays are actually rendered.
  //   - smallCore: the hierarchical plugin ran but a cyclic group WAS found —
  //     it's just below the threshold to partition the whole system around, so
  //     no module-border overlays exist. The caption must ACKNOWLEDGE the cycle
  //     (Step 3 just revealed its backward transfers), not deny it.
  //   - fully hierarchical: no cyclic core at all.
  // Only genuineFourSquare reveals overlay:module-border; revealing it in either
  // hierarchical case spawns an empty phantom auto-border (the L1 footgun).
  // KNOWN LIMITATION (see KNOWN-ISSUES.md N-3): this keys on the synthesis-plugin
  // id string, which equals "has module-border overlays" for every CURRENT plugin
  // but would mis-fire for a future non-hierarchical plugin that draws no module
  // borders. The multi-matrix path gates on an actual hasModuleBorder flag; mirror
  // that here (thread hasModuleBorder through buildNarrative) if such a plugin lands.
  // NOTE: Step 3 below still claims "cycles" unconditionally (KNOWN-ISSUES.md N-1).
  const isHierarchical = architectureType === "hierarchical";
  const genuineFourSquare = !isHierarchical && coreCount > 0;
  const smallCore = isHierarchical && coreCount > 0;

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

  // Step 4 caption adapts to the three cases above.
  let partitionBody;
  if (genuineFourSquare) {
    partitionBody = `The four-square partition.<br/>${[coreLine, sharedLine, controlLine, peripheralLine].filter(Boolean).join("<br/>")}`;
  } else if (smallCore) {
    partitionBody = `A small cyclic core was found — ${coreCount} ${coreCount === 1 ? "node" : "nodes"} in a mutually-dependent cycle — but it is below the threshold to partition the whole system around, so the system sorts into dependency layers.`;
  } else {
    partitionBody = "No cyclic core was found — the system is fully hierarchical, so it sorts into dependency layers rather than a core-periphery partition.";
  }

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
            // Reveal the partition boxes only for a genuine four-square (a
            // core-periphery/multi-core synthesis with real module-border
            // overlays). Both hierarchical cases (small cyclic core or none)
            // have no overlays; revealing the token there spawns an empty
            // phantom auto-border (the L1 auto-border footgun).
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
 * @param {{ id: string, label?: string, architectureType?: string, hasModuleBorder?: boolean }[]} matrixSummaries
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

  // Whether the scene-level Step-4 caption/reveal should claim a four-square
  // partition: gate on matrices that ACTUALLY emit module-border overlays
  // (a coreless/hierarchical matrix emits none), not on the architectureType
  // label — mirrors the single-matrix buildDefaultNarrative 3-state model.
  const anyModuleBorder = matrixSummaries.some((m) => m.hasModuleBorder);
  const allModuleBorder = n > 0 && matrixSummaries.every((m) => m.hasModuleBorder);
  const step4Body = allModuleBorder
    ? "The four-square partition in each system."
    : anyModuleBorder
      ? "Each system's internal structure — a four-square partition where a cyclic core organizes it, dependency layers where none is large enough."
      : "Each system sorts into dependency layers — no cyclic core large enough to partition any of them.";

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
        caption: `<strong>Step 4.</strong> ${step4Body}${archLine ? `<br/><em>Architecture — ${archLine}.</em>` : ""}${contractLine ? `<br/>${contractLine}` : ""}`,
        reveal: {
          include: [
            "diagonal",
            "transfer:directed:forward",
            "transfer:directed:backward",
            // Reveal module-border only if >=1 matrix actually emits those
            // overlays; a coreless/hierarchical matrix has none, so revealing
            // the token there would spawn an empty phantom auto-border.
            ...(anyModuleBorder ? ["overlay:module-border"] : []),
          ],
        },
      },
    ],
  };
}
