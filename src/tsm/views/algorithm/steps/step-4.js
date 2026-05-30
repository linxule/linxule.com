// Algorithm view — Step 4 renderer.
//
// Step 4: "What if A depends on B, and B depends on C?" Introduces the
// conceptual hinge of the algorithm — indirect dependencies are real
// even when there's no direct edge. The storyboard traces one specific
// 2-hop chain (claude-code → skill-cite → mcp-zotero) and one 3-hop
// chain (agent-orchestrator → claude-code → skill-cite → mcp-zotero).
//
// In practice the canonical IDs from the storyboard may not form a
// chain of *direct* edges in the actual fixture (e.g., xule-harness
// routes claude-code → plugin-scholarly → skill-cite instead). The
// canonical chain is preferred if the direct edges exist; otherwise we
// pick the first 2-hop + 3-hop deterministically from edges order.
//
// Visual: a small horizontal path diagram showing each node as a tile
// connected by direct-arrow elements; a dashed "indirect" arrow connects
// the chain's endpoints to make the implied dependency visible. A small
// caption annotation labels the chain in words.

const CANONICAL_2HOP = ["claude-code", "skill-cite", "mcp-zotero"];
const CANONICAL_3HOP = ["agent-orchestrator", "claude-code", "skill-cite", "mcp-zotero"];

function hasDirectEdge(edgeSet, from, to) {
  return edgeSet.has(`${from}→${to}`);
}

function isValidChain(edgeSet, ids) {
  for (let i = 0; i < ids.length - 1; i++) {
    if (!hasDirectEdge(edgeSet, ids[i], ids[i + 1])) return false;
  }
  return true;
}

/**
 * Pick a 2-hop chain (A, B, C) where (A→B) and (B→C) are direct edges,
 * C ≠ A, and there is no direct (A→C) edge. First match in edges order.
 */
function pickTwoHop(edges, edgeSet) {
  for (const eAB of edges) {
    if (eAB.from === eAB.to) continue;
    for (const eBC of edges) {
      if (eBC.from !== eAB.to) continue;
      if (eBC.to === eAB.from) continue; // skip mutual 2-cycles
      if (eBC.to === eBC.from) continue;
      if (hasDirectEdge(edgeSet, eAB.from, eBC.to)) continue;
      return [eAB.from, eAB.to, eBC.to];
    }
  }
  return null;
}

/**
 * Pick a 3-hop chain by extending a 2-hop (A,B,C) with X→A where
 * X ≠ B, C. If no extension exists for the given 2-hop, scan all
 * 2-hops in edges order and return the first that has a valid prepend.
 */
function pickThreeHop(edges, edgeSet, twoHop) {
  const tryExtend = (chain) => {
    const [A, B, C] = chain;
    for (const eXA of edges) {
      if (eXA.to !== A) continue;
      if (eXA.from === B || eXA.from === C) continue;
      if (eXA.from === eXA.to) continue;
      // Prefer extensions where X has no direct shortcut to the tail —
      // otherwise the "indirect" 3-hop is undercut by a direct edge.
      if (hasDirectEdge(edgeSet, eXA.from, C)) continue;
      return [eXA.from, A, B, C];
    }
    return null;
  };

  if (twoHop) {
    const direct = tryExtend(twoHop);
    if (direct) return direct;
  }

  // Fallback: scan all 2-hops for the first one whose head has an
  // incoming edge with the right disjointness.
  for (const eAB of edges) {
    if (eAB.from === eAB.to) continue;
    for (const eBC of edges) {
      if (eBC.from !== eAB.to) continue;
      if (eBC.to === eAB.from) continue;
      if (eBC.to === eBC.from) continue;
      if (hasDirectEdge(edgeSet, eAB.from, eBC.to)) continue;
      const candidate = [eAB.from, eAB.to, eBC.to];
      const ext = tryExtend(candidate);
      if (ext) return ext;
    }
  }
  return null;
}

/**
 * Choose 2-hop + 3-hop chain IDs.
 *
 * Strategy:
 *   1. Prefer the canonical storyboard chains if their direct edges
 *      all exist.
 *   2. Otherwise pick deterministically by edges order.
 *
 * @returns {{ twoHop: string[]|null, threeHop: string[]|null, canonical: boolean }}
 */
export function selectChains(nodes, edges) {
  const nodeById = new Set(nodes.map((node) => node.id));
  const edgeSet = new Set(edges.map((edge) => `${edge.from}→${edge.to}`));

  const canonical2 = CANONICAL_2HOP.every((id) => nodeById.has(id)) && isValidChain(edgeSet, CANONICAL_2HOP);
  const canonical3 = CANONICAL_3HOP.every((id) => nodeById.has(id)) && isValidChain(edgeSet, CANONICAL_3HOP);

  if (canonical2 && canonical3) {
    return { twoHop: CANONICAL_2HOP.slice(), threeHop: CANONICAL_3HOP.slice(), canonical: true };
  }

  const twoHop = pickTwoHop(edges, edgeSet);
  const threeHop = pickThreeHop(edges, edgeSet, twoHop);
  return { twoHop, threeHop, canonical: false };
}

function buildChainDiagram({ chain, nodeById, label, kind }) {
  const wrap = document.createElement("div");
  wrap.className = `algorithm-chain algorithm-chain-${kind}`;
  wrap.dataset.kind = kind;
  wrap.dataset.length = String(chain.length);
  wrap.dataset.chain = chain.join(",");

  const heading = document.createElement("div");
  heading.className = "algorithm-chain-label";
  heading.textContent = label;
  wrap.appendChild(heading);

  const path = document.createElement("div");
  path.className = "algorithm-chain-path";
  if (path.style) {
    path.style.display = "flex";
    path.style.flexDirection = "row";
    path.style.alignItems = "center";
    path.style.gap = "0.4rem";
    path.style.flexWrap = "wrap";
  }

  for (let i = 0; i < chain.length; i++) {
    const id = chain[i];
    const node = nodeById[id];

    const tile = document.createElement("div");
    tile.className = "algorithm-chain-tile";
    tile.dataset.id = id;
    if (node?.entityType) tile.dataset.entityType = node.entityType;
    tile.textContent = node?.label || id;
    path.appendChild(tile);

    if (i < chain.length - 1) {
      const arrow = document.createElement("div");
      arrow.className = "algorithm-chain-arrow algorithm-chain-arrow-direct";
      arrow.dataset.from = chain[i];
      arrow.dataset.to = chain[i + 1];
      arrow.dataset.kind = "direct";
      arrow.textContent = "→";
      path.appendChild(arrow);
    }
  }
  wrap.appendChild(path);

  // The implied indirect dependency — endpoint to endpoint — rendered as
  // a dashed arrow with the "indirect" kind so tests and CSS can target
  // it independently of the direct chain arrows.
  const indirect = document.createElement("div");
  indirect.className = "algorithm-chain-indirect";
  indirect.dataset.from = chain[0];
  indirect.dataset.to = chain[chain.length - 1];
  indirect.dataset.kind = "indirect";
  if (indirect.style) {
    indirect.style.borderTop = "1.5px dashed currentColor";
    indirect.style.opacity = "0.6";
  }
  indirect.textContent = `${nodeById[chain[0]]?.label || chain[0]} ⇢ ${
    nodeById[chain[chain.length - 1]]?.label || chain[chain.length - 1]
  } (indirect, ${chain.length - 1} hops)`;
  wrap.appendChild(indirect);

  return wrap;
}

/**
 * @param {{ stageEl: HTMLElement, nodes: Array, edges: Array, V: number[][], nodeIndex: Object<string,number> }} ctx
 */
export function renderStep4({ stageEl, nodes, edges }) {
  const nodeById = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const { twoHop, threeHop, canonical } = selectChains(nodes, edges);

  const wrap = document.createElement("div");
  wrap.className = "algorithm-step-content algorithm-step-4";
  wrap.dataset.step = "4";
  wrap.dataset.canonical = String(canonical);

  if (twoHop) {
    wrap.appendChild(
      buildChainDiagram({
        chain: twoHop,
        nodeById,
        label: "2-hop chain — direct edges, implied dependency",
        kind: "two-hop",
      }),
    );
  }
  if (threeHop) {
    wrap.appendChild(
      buildChainDiagram({
        chain: threeHop,
        nodeById,
        label: "3-hop chain — change at the far end still ripples back",
        kind: "three-hop",
      }),
    );
  }

  const annotation = document.createElement("p");
  annotation.className = "algorithm-step-annotation";
  annotation.textContent =
    "Each solid arrow is a direct dependency. The dashed line names the indirect dependency the chain implies: " +
    "the head still depends on the tail, even though no single edge says so.";
  wrap.appendChild(annotation);

  stageEl.appendChild(wrap);
}
