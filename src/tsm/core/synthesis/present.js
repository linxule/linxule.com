// Presentation hints derived from observation metadata.
// The engine layer does NOT call into here; only the synthesis coordinator
// uses these helpers to enrich the derived scene with display hints.

/**
 * Convert an observation node's entityType into a terse display label
 * suitable for crowded matrix diagonals. The result is used as
 * task.shortLabel in the derived scene; the renderer falls back to
 * task.label when shortLabel is absent. Returns undefined for unknown
 * or absent entityTypes so callers can skip the field cleanly.
 *
 * Capitalization deliberately matches how the category reads in the
 * harness fixture: "MCP" (acronym), lowercase for others.
 */
export function shortLabelFromEntityType(entityType) {
  if (!entityType) return undefined;
  const map = {
    mcp: "MCP",
    agent: "agent",
    skill: "skill",
    plugin: "plugin",
    runtime: "runtime",
  };
  return map[entityType];
}

/**
 * Map an observation node's `category` to a single uppercase letter for the
 * matrix diagonal, paired with a per-category sequence number by the derive
 * pass → "C1", "R8". The viewport cap shrinks dense cells to ~2 characters, so
 * the prior multi-letter category codes (COD2 / RT8) ellipsized to "C…" and
 * broke cross-referencing with the decode key; a 1-letter prefix + number stays
 * legible and the decode key (grouped by category) self-documents the letter.
 *
 * The map is collision-free WITHIN every shipped derived scene — no two
 * categories that co-occur in one matrix share a letter (coder/core never
 * co-occur, so both take C; likewise app/agent → A and partners/plugin → P sit
 * in different scenes). Unknown categories fall back to the uppercased first
 * letter; per-matrix shortLabel uniqueness is enforced by validate.js, which
 * would surface any future collision.
 */
export function categoryLetter(category) {
  if (!category) return undefined;
  const map = {
    // codex-cli / kimi-code / opencode
    coder: "C", cli: "L", mcp: "M", runtime: "R", sdk: "S", tools: "T", server: "V",
    // autogen
    app: "A", chat: "H", core: "C", ext: "E",
    // langchain
    graph: "G", integrations: "I", partners: "P", platform: "F",
    // xule-harness
    agent: "A", plugin: "P", skill: "K",
    // multi-matrix derive (upstream / downstream firms)
    upstream: "U", downstream: "D",
  };
  return map[category] || category.charAt(0).toUpperCase();
}

/**
 * Build a stable id → terse diagonal code map for a set of observation nodes:
 * categoryLetter(category) + a per-category sequence in observation order, e.g.
 * { "kimi-cli": "L1", "session-runtime": "R2", ... }.
 *
 * The algorithm view threads this through ctx so EVERY coded step (3/5/6/7/8/9
 * and the single-matrix Step 11) plus the decode key render the SAME code for a
 * given component. Before this, steps 3-9 showed the observation's authored
 * `shortLabel` (CLI1/RT3 — 3-5 chars) while Step 11's derived scene showed
 * derive.js's own `categoryLetter`+sorted-seq codes (C1/R8): the code a reader
 * tracked through the walkthrough silently changed, and on Step 11 the decode
 * key (CLI1) no longer matched the matrix (C1). One shared map fixes both the
 * length and the drift.
 *
 * STABLE = position-independent. The sequence counts within a node's category
 * in OBSERVATION order, so a node's code never depends on whether the rendering
 * step is in observation order (3/5/6) or sorted order (7/8/9/11). The same
 * `categoryLetter` table derive.js uses keeps the letters identical to the
 * exported scene; only the per-category number can differ (derive numbers in
 * sorted order — a download-only detail, never on screen).
 *
 * Nodes whose category yields no letter (categoryLetter → undefined, e.g. a
 * user-dropped graph with no category) are omitted; callers fall back to
 * node.shortLabel / label as before, so the key simply stays absent there.
 *
 * @param {Array<{ id: string, category?: string }>} nodes
 * @returns {Object<string, string>}
 */
export function buildShortCodeMap(nodes) {
  const codes = {};
  const catSeq = {};
  for (const node of nodes ?? []) {
    const letter = categoryLetter(node?.category);
    if (!letter || !node?.id) continue;
    catSeq[letter] = (catSeq[letter] || 0) + 1;
    codes[node.id] = `${letter}${catSeq[letter]}`;
  }
  return codes;
}
