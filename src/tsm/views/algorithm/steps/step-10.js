// Algorithm view — Step 10 renderer.
//
// Step 10: "This is a core-periphery system." The verdict — a textual
// summary that names the architecture type, breaks down the four-square
// partition in component counts and percentages, and closes with a short
// sentence connecting size to organizational implication.
//
// Verdict text is composed deterministically from partition +
// architectureType. We deliberately do NOT import any narrative helper
// from core/synthesis — the storyboard voice should live alongside the
// other algorithm-view steps so revisions stay consistent across the
// whole 12-step arc.

const HEADLINES = {
  "core-periphery": "Core-periphery system",
  "multi-core": "Multi-core system",
  hierarchical: "Hierarchical system",
};

/**
 * @param {{
 *   stageEl: HTMLElement,
 *   nodes: Array,
 *   edges: Array,
 *   vfivfo: Object<string, { vfi: number, vfo: number }>,
 *   partition: ({ core: string[], control: string[], shared: string[], peripheral: string[] } | null),
 *   architectureType: string,
 * }} ctx
 */
// Core regions in a multi-core partition are `core-1`, `core-2`, …
function coreKeysOf(partition) {
  return Object.keys(partition || {})
    .filter((k) => /^core-\d+$/.test(k))
    .sort((a, b) => Number(a.slice(5)) - Number(b.slice(5)));
}

export function renderStep10({
  stageEl,
  nodes,
  vfivfo,
  partition,
  multiCorePartition,
  architectureType,
}) {
  const total = nodes.length;
  // A multi-core verdict must enumerate every core and SUM the Core count
  // across core-1…N — the single-core `partition.core` only carries
  // cyclicGroups[0], so a bare read would headline "Multi-core" over a Core
  // count that contradicts it. Drive the multi-core branch off the same
  // partition Steps 8/9/11 box.
  const verdictPartition =
    architectureType === "multi-core" && multiCorePartition
      ? multiCorePartition
      : partition;

  const root = document.createElement("div");
  root.className = "algorithm-step-content algorithm-verdict";
  root.dataset.step = "10";
  root.dataset.architectureType = architectureType;
  root.dataset.total = String(total);

  // SPEC-LENSES §6 Path B emphasis: top-quartile VFI fan-in nodes get their
  // incoming edges marked primary. Step 10 doesn't draw the matrix, so we
  // emit the names via a hidden metadata element that tests + a future
  // emphasis-aware renderer can introspect. No chip strip — the narrative
  // copy in the bullets is what frames the finding for the reader.
  if (vfivfo && total > 0) {
    const vfiList = nodes
      .map((n) => ({ id: n.id, vfi: vfivfo[n.id]?.vfi ?? 0 }))
      .sort((a, b) => b.vfi - a.vfi);
    const cutoffIdx = Math.max(0, Math.floor(vfiList.length * 0.25) - 1);
    const cutoffVfi = vfiList[cutoffIdx]?.vfi ?? 0;
    const topQuartile = vfiList.filter((x) => x.vfi >= cutoffVfi && x.vfi > 0);
    if (topQuartile.length > 0) {
      const meta = document.createElement("div");
      meta.className = "algorithm-vfi-top-quartile";
      meta.dataset.emphasis = "primary";
      meta.dataset.count = String(topQuartile.length);
      meta.dataset.cutoff = String(cutoffVfi);
      meta.dataset.members = topQuartile.map((x) => x.id).join(",");
      // No lens tag per SPEC §2: hub-fan-in dropped in v0.2; emphasis alone
      // carries the visual weight and the bullets carry the name.
      if (meta.style) {
        meta.style.display = "none";
      }
      root.appendChild(meta);
    }
  }

  // Headline ----------------------------------------------------------------
  const headline = document.createElement("h3");
  headline.className = "algorithm-verdict-headline";
  headline.textContent = HEADLINES[architectureType] ?? capitalize(architectureType);
  if (headline.style) {
    headline.style.margin = "0 0 0.5rem 0";
  }
  root.appendChild(headline);

  // Bullets -----------------------------------------------------------------
  const bullets = document.createElement("ul");
  bullets.className = "algorithm-verdict-bullets";
  if (bullets.style) {
    bullets.style.listStyle = "none";
    bullets.style.padding = "0";
    bullets.style.margin = "0 0 0.5rem 0";
  }

  const coreKeys = coreKeysOf(verdictPartition);
  if (architectureType === "multi-core" && verdictPartition && coreKeys.length >= 2) {
    // One bullet per core, then a combined-Core total so the headline's
    // "Multi-core" claim and the numbers agree (the prior single-core read
    // reported only cyclicGroups[0]'s size). Shared/Control/Peripheral are
    // computed relative to the union of all cores by the partition strategy.
    let coreTotal = 0;
    coreKeys.forEach((key, i) => {
      const size = verdictPartition[key]?.length ?? 0;
      coreTotal += size;
      const pct = total > 0 ? Math.round((size / total) * 100) : 0;
      appendBullet(bullets, key, `Core ${i + 1}: ${size} nodes (${pct}% of the system)`);
    });
    const corePct = total > 0 ? Math.round((coreTotal / total) * 100) : 0;
    appendBullet(
      bullets,
      "core",
      `Cores combined: ${coreTotal} nodes (${corePct}% of the system) across ${coreKeys.length} cores`,
    );
    const sharedSize = verdictPartition.shared?.length ?? 0;
    const controlSize = verdictPartition.control?.length ?? 0;
    const peripheralSize = verdictPartition.peripheral?.length ?? 0;
    appendBullet(bullets, "shared", `Shared: ${sharedSize} nodes the Cores depend on`);
    appendBullet(bullets, "control", `Control: ${controlSize} nodes that depend on the Cores`);
    appendBullet(
      bullets,
      "peripheral",
      `Periphery: ${peripheralSize} nodes unrelated to the Cores`,
    );
  } else if (partition) {
    const coreSize = partition.core?.length ?? 0;
    const sharedSize = partition.shared?.length ?? 0;
    const controlSize = partition.control?.length ?? 0;
    const peripheralSize = partition.peripheral?.length ?? 0;
    const corePct = total > 0 ? Math.round((coreSize / total) * 100) : 0;

    appendBullet(bullets, "core", `Core: ${coreSize} nodes (${corePct}% of the system)`);
    appendBullet(bullets, "shared", `Shared: ${sharedSize} nodes the Core depends on`);
    appendBullet(bullets, "control", `Control: ${controlSize} nodes that depend on the Core`);
    appendBullet(
      bullets,
      "peripheral",
      `Periphery: ${peripheralSize} nodes unrelated to the Core`,
    );
  } else {
    appendBullet(bullets, "core", "Core: 0 nodes (no cyclic group found)");
    appendBullet(bullets, "shared", "Shared: 0 nodes");
    appendBullet(bullets, "control", "Control: 0 nodes");
    appendBullet(bullets, "peripheral", "Periphery: 0 nodes");
  }
  root.appendChild(bullets);

  // Verdict sentence --------------------------------------------------------
  const sentence = document.createElement("p");
  sentence.className = "algorithm-verdict-sentence";
  sentence.dataset.architectureType = architectureType;
  if (sentence.style) sentence.style.margin = "0";
  sentence.textContent = composeVerdictSentence({
    architectureType,
    partition: verdictPartition,
    total,
  });
  root.appendChild(sentence);

  stageEl.appendChild(root);
}

function appendBullet(parent, region, text) {
  const li = document.createElement("li");
  li.className = "algorithm-verdict-bullet";
  li.dataset.region = region;
  li.textContent = text;
  if (li.style) {
    li.style.padding = "0.15rem 0";
  }
  parent.appendChild(li);
}

function composeVerdictSentence({ architectureType, partition, total }) {
  if (architectureType === "hierarchical" || !partition) {
    return "This system has no Core — every dependency is one-way. Hierarchical.";
  }
  if (architectureType === "multi-core") {
    const coreKeys = coreKeysOf(partition);
    if (coreKeys.length >= 2) {
      const coreTotal = coreKeys.reduce((sum, k) => sum + (partition[k]?.length ?? 0), 0);
      const corePct = total > 0 ? Math.round((coreTotal / total) * 100) : 0;
      return (
        `This system has ${coreKeys.length} separate Cores totalling ${coreTotal} components ` +
        `(${corePct}% of the system). Multi-core — the structural risk is distributed across ` +
        `more than one knot, not concentrated in a single one.`
      );
    }
    return "This system has several Cores. Multi-core — the structural risk is distributed across more than one knot.";
  }
  // core-periphery
  const coreSize = partition.core?.length ?? 0;
  const sharedSize = partition.shared?.length ?? 0;
  const controlSize = partition.control?.length ?? 0;
  const dependent = sharedSize + controlSize + coreSize;
  const dependentPct = total > 0 ? Math.round((dependent / total) * 100) : 0;
  const corePct = total > 0 ? Math.round((coreSize / total) * 100) : 0;
  return (
    `Most of the system depends on the Core — ${dependentPct}% sits in Shared, Core, or Control. ` +
    `The Core itself is ${corePct}% of the components. This is a core-periphery architecture.`
  );
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
