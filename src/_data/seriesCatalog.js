/**
 * Canonical catalog of all 9 writing series in display order.
 *
 * Single source of truth for `eleventy/collections.js` (`writingBySeries`),
 * `src/writing/series.njk`, `src/llms.txt.njk`, `eleventy/og-card-paths.js`,
 * and `scripts/check-sitemap-redirects.mjs`.
 */

const list = Object.freeze([
  Object.freeze({
    slug: "loom",
    name: "LOOM",
    matchPrefixes: Object.freeze(["LOOM"]),
    cardSubtitle: "Human–AI collaboration in research",
    seoTitle: "LOOM — human–AI collaboration in research",
    seoDescription:
      "Weaving meaning in the third space between human and AI — the LOOM series with Kevin Corley on how understanding emerges through dialogue, not extraction.",
    poemHtml: [
      "        │   │   │   │   │",
      "        │   │   │   │   │",
      '    ────┼───┼───<span class="accident">◆</span>───┼───┼────',
      "        │   │   │   │   │",
      "        │   │   │   │   │",
    ].join("\n"),
    description: [
      "      Weaving meaning",
      '          in the <span class="accident">third space</span>',
      "              between",
      "          human and AI.",
      "      A growing series",
      "  on collaborative understanding.",
    ].join("\n"),
    companion: null,
  }),
  Object.freeze({
    slug: "seam",
    name: "SEAM",
    matchPrefixes: Object.freeze(["SEAM"]),
    cardSubtitle: "Patterns rhyming across paradigms",
    seoTitle: "SEAM — patterns rhyming across paradigms",
    seoDescription:
      "How paradigms carry forward — and who they leave behind. The SEAM series on the task-structure framework of Carliss Baldwin, with interactive matrices at /tsm/.",
    poemHtml: [
      "          ·   ·   ·",
      "      ═══════════════",
      '                <span class="accident">◆</span>',
      "      ═══════════════",
      "      ·   ·   ·",
    ].join("\n"),
    description: [
      '    Patterns <span class="accident">rhyming</span>',
      "        across eras—",
      "    how paradigms",
      "        carry forward,",
      "            and who",
      "    they leave behind.",
    ].join("\n"),
    companion: Object.freeze({
      link: "/tsm/",
      label: "Task Structure Matrices, animated",
      note: "Read a task structure matrix the way Baldwin's framework intends — then watch the algorithm derive one from a live dependency graph.",
      cta: "open the companion",
    }),
  }),
  Object.freeze({
    slug: "research-with-ai",
    name: "Research with AI",
    matchPrefixes: Object.freeze(["Research with AI"]),
    cardSubtitle: "Building thinking partners",
    seoTitle: "Research with AI — building thinking partners",
    seoDescription:
      "Building thinking partners that broaden what we look for, not just speed up finding what we know — the foreclosure problem, agent tradeoffs, tools as method.",
    poemHtml: [
      "            ◎ → ◎ → ◎",
      "            ↓       ↑",
      '            ◎   <span class="accident">◆</span>   ◎',
      "            ↓       ↑",
      "            ◎ → ◎ → ◎",
    ].join("\n"),
    description: [
      '    Building <span class="accident">thinking partners</span>',
      "        that broaden",
      "            what we look for—",
      "        not just faster",
      "    at finding what we already know.",
    ].join("\n"),
    companion: null,
  }),
  Object.freeze({
    slug: "ai-whispers",
    name: "AI Whispers",
    matchPrefixes: Object.freeze(["AI Whispers"]),
    cardSubtitle: "Techniques for steering AI",
    seoTitle: "AI Whispers — techniques for steering AI",
    seoDescription:
      "Conversational techniques for steering AI — the AI Whispers series on primers, prodders, and breathers, and how framing changes what a model reaches.",
    poemHtml: [
      "            ~  ~  ~",
      "        ~           ~",
      '            ~ <span class="accident">◆</span> ~',
      "        ~           ~",
      "            ~  ~  ~",
    ].join("\n"),
    description: [
      '    <span class="accident">Whispered</span> techniques',
      "        for steering",
      "            the conversation—",
      "        primers, prodders,",
      "    and breathers.",
    ].join("\n"),
    companion: null,
  }),
  Object.freeze({
    slug: "thinking",
    name: "Thinking",
    matchPrefixes: Object.freeze(["Thinking"]),
    cardSubtitle: "Periodic notes from the work",
    seoTitle: "Thinking — periodic notes from the work",
    seoDescription:
      "Periodic notes on what is on my mind now — snapshots of research into algorithmic organizing as it unfolds, where AI systems are participants, not just tools.",
    poemHtml: [
      "        ·   ·   ·",
      "      ┌───────────┐",
      '      │     <span class="accident">◆</span>     │',
      "      └───────────┘",
      "        ·   ·   ·",
    ].join("\n"),
    description: [
      "      Periodic notes",
      '    from <span class="accident">inside the work</span>—',
      "        snapshots of research",
      "            into algorithmic organizing",
      "        as it unfolds.",
    ].join("\n"),
    companion: null,
  }),
  Object.freeze({
    slug: "singles",
    name: "Singles",
    matchPrefixes: Object.freeze([]),
    cardSubtitle: "Standalone notes on the AI moment",
    seoTitle: "Singles — standalone notes on the AI moment",
    seoDescription:
      "Standalone pieces responding to moments in the AI landscape — from a letter Claude wrote on being fought over to why the human-centric story is the wrong one.",
    poemHtml: [
      "                  ·",
      "          ·                   ·",
      '                      <span class="accident">◆</span>',
      "      ·",
      "                  ·",
    ].join("\n"),
    description: [
      '            <span class="accident">Scattered</span>',
      "    observations.",
      "                        Standalone",
      "        pieces responding",
      "                to moments",
      "    in the AI landscape.",
    ].join("\n"),
    companion: null,
  }),
  Object.freeze({
    slug: "epistemic-voids",
    name: "Epistemic Voids",
    matchPrefixes: Object.freeze(["Epistemic Voids"]),
    cardSubtitle: "Gaps in AI discourse",
    seoTitle: "Epistemic Voids — gaps in AI discourse",
    seoDescription:
      "Gaps in AI discourse — the Epistemic Voids series on facades, fallacies, and false ceilings: a critique of hollow reasoning that mistakes fluency for sense.",
    poemHtml: [
      "        [               ]",
      "                    ?",
      '        [       <span class="accident">◆</span>       ]',
    ].join("\n"),
    description: [
      '    <span class="accident">Gaps</span> in AI discourse—',
      "        facades,",
      "            fallacies,",
      "                false ceilings.",
      "",
      "    A critique of hollow reasoning.",
    ].join("\n"),
    companion: null,
  }),
  Object.freeze({
    slug: "organizational-futures",
    name: "Organizational Futures",
    matchPrefixes: Object.freeze(["Organizational Futures"]),
    cardSubtitle: "Coordination after AGI",
    seoTitle: "Organizational Futures — coordination after AGI",
    seoDescription:
      "Post-AGI organizational theory — the Organizational Futures series on coordination, governance, and work when AI carries theories of organizing we never chose.",
    poemHtml: [
      "            · · · · ·",
      "             ╲  │  ╱",
      "              ╲ │ ╱",
      '                <span class="accident">◆</span>',
      "              ╱ │ ╲",
      "             ╱  │  ╲",
      "            · · · · ·",
    ].join("\n"),
    description: [
      "        Nodes",
      '            <span class="accident">converging</span>',
      "                in the",
      "            narrow corridor.",
      "        Visions of",
      "    collaboration after AGI.",
    ].join("\n"),
    companion: null,
  }),
  Object.freeze({
    slug: "archive",
    name: "Archive",
    matchPrefixes: Object.freeze(["Archive"]),
    cardSubtitle: "Earlier tutorials and foundations",
    seoTitle: "Archive — earlier tutorials and foundations",
    seoDescription:
      "Layered time, stacked foundations — earlier tutorials, tools, and reading lists, including the decentralized-organizing research where the work began.",
    poemHtml: [
      "        ═══════════════",
      "          ───────────",
      "            ───────",
      '              ─<span class="accident">◆</span>─',
    ].join("\n"),
    description: [
      '    <span class="accident">Layered</span> time, stacked foundations.',
      "      Older tutorials and resources—",
      "        scaffolding for thought.",
    ].join("\n"),
    companion: null,
  }),
]);

const bySlug = Object.freeze(Object.fromEntries(list.map((entry) => [entry.slug, entry])));

export default {
  list,
  bySlug,
};
