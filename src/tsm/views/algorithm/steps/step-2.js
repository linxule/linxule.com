// Algorithm view — Step 2 renderer.
//
// Step 2: "Direction matters." Pedagogical, not exhaustive. The storyboard
// specifies two one-way exemplar arrows + one mutual pair (rendered as
// both directions) + a "social network vs DSM" pop-out. Rendering every
// edge here was the old behavior; it muddied the lesson (direction
// matters, mutual pairs are special) by showing too much at once.
//
// Heuristic for exemplars:
//   - one-way: first two edges (a→b) where the observation has no
//     reverse edge (b→a)
//   - mutual:  first edge (a→b) where (b→a) also exists; emit BOTH
//     directions as separate arrow elements
// Order is deterministic — fixture order — so tests can pin exact
// endpoint pairs without re-deriving the heuristic.

/**
 * @param {{ stageEl: HTMLElement, nodes: Array, edges: Array }} ctx
 */
export function renderStep2({ stageEl, nodes, edges }) {
  const edgeKey = (e) => `${e.from}→${e.to}`;
  const edgeSet = new Set(edges.map(edgeKey));

  const oneWay = [];
  let mutual = null;
  for (const edge of edges) {
    if (edge.from === edge.to) continue;
    const reverseExists = edgeSet.has(`${edge.to}→${edge.from}`);
    if (reverseExists) {
      if (!mutual) mutual = edge;
    } else if (oneWay.length < 2) {
      oneWay.push(edge);
    }
    if (oneWay.length === 2 && mutual) break;
  }

  const wrap = document.createElement("div");
  wrap.className = "algorithm-tiles algorithm-tiles-with-arrows";
  wrap.dataset.step = "2";

  // Limit visible tiles to the exemplar participants so the pedagogy is
  // legible — 22 tiles + 4 arrows reads as noise. Order matches first-
  // mention in the exemplar selection above.
  const exemplarIds = [];
  const addId = (id) => {
    if (!exemplarIds.includes(id)) exemplarIds.push(id);
  };
  for (const e of oneWay) {
    addId(e.from);
    addId(e.to);
  }
  if (mutual) {
    addId(mutual.from);
    addId(mutual.to);
  }
  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));
  for (const id of exemplarIds) {
    const node = nodeById[id];
    if (!node) continue;
    const tile = document.createElement("div");
    tile.className = "algorithm-tile";
    tile.dataset.id = node.id;
    if (node.entityType) tile.dataset.entityType = node.entityType;
    const label = document.createElement("span");
    label.className = "algorithm-tile-label";
    label.textContent = node.label || node.id;
    tile.appendChild(label);
    wrap.appendChild(tile);
  }

  const arrowsLayer = document.createElement("div");
  arrowsLayer.className = "algorithm-arrows";

  const emitArrow = (edge, { mutualPair = false } = {}) => {
    const arrow = document.createElement("div");
    arrow.className = "algorithm-arrow";
    arrow.dataset.from = edge.from;
    arrow.dataset.to = edge.to;
    if (edge.relation) arrow.dataset.relation = edge.relation;
    arrow.dataset.kind = mutualPair ? "mutual" : "one-way";
    // Render human labels (not raw ids) to match the tiles above — the tiles
    // show "Kimi Code CLI", so the arrows must too (UX-audit P1). ids stay on
    // the data-* attributes for tests + the matrix steps that follow.
    const fromLabel = nodeById[edge.from]?.label || edge.from;
    const toLabel = nodeById[edge.to]?.label || edge.to;
    arrow.textContent = edge.relation
      ? `${fromLabel} → ${toLabel}  (${edge.relation})`
      : `${fromLabel} → ${toLabel}`;
    arrowsLayer.appendChild(arrow);
  };

  for (const e of oneWay) emitArrow(e);
  if (mutual) {
    emitArrow({ from: mutual.from, to: mutual.to, relation: mutual.relation }, { mutualPair: true });
    const reverse = edges.find((e) => e.from === mutual.to && e.to === mutual.from);
    emitArrow(
      { from: mutual.to, to: mutual.from, relation: reverse?.relation },
      { mutualPair: true },
    );
  }
  wrap.appendChild(arrowsLayer);

  stageEl.appendChild(wrap);

  // Pop-out callout: contrasts undirected social graphs with directed
  // DSMs. Storyboard owns the canonical voicing; the text below is the
  // condensed version that fits in a small callout.
  const popout = document.createElement("div");
  popout.className = "algorithm-popout algorithm-popout-social-vs-dsm";
  popout.dataset.step = "2";

  const popoutTitle = document.createElement("div");
  popoutTitle.className = "algorithm-popout-title";
  popoutTitle.textContent = "social network  ↔  DSM";
  popout.appendChild(popoutTitle);

  const popoutBody = document.createElement("p");
  popoutBody.className = "algorithm-popout-body";
  popoutBody.textContent =
    "Social networks ask 'who knows who.' TSMs ask 'who depends on who.' " +
    "The second question is sharper.";
  popout.appendChild(popoutBody);

  stageEl.appendChild(popout);
}
