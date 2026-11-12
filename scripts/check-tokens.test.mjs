import { describe, expect, test } from "bun:test";
import { accidentsIn, lintSource, neutraliseCss, rootTokens, tokenScope } from "./check-tokens.mjs";

const ROOT = `:root {
  --paper: #f4f1eb; --ink: #1a1a1a; --ink-faint: #666; --ink-ghost: #c8c8c8;
  --accident: #4ee1d4; --bloom: #8b7089; --measure: 38rem;
  --size-whisper: 0.6rem; --size-label: 0.7rem; --size-note: 0.8rem; --size-quiet: 0.9rem;
  --tracking-quiet: 0.1em; --tracking-label: 0.15em;
}`;
const defined = rootTokens(ROOT);
const style = (css) => `<div>\n<style>\n${css}\n</style>\n</div>`;
const rules = (text, file = "t.njk") => lintSource(text, file, { defined }).problems.map((p) => p.rule);
const lines = (text, file = "t.njk") => lintSource(text, file, { defined }).problems.map((p) => `${p.rule}@${p.line}`);

describe("rootTokens", () => {
  test("reads :root custom properties", () => {
    expect(defined.has("size-note")).toBe(true);
    expect(defined.has("size-glyph")).toBe(false);
  });
});

describe("T1 size", () => {
  test("sub-1rem literal fails, in a style block and in style=\"\"", () => {
    expect(rules(style(".a { font-size: 0.85rem; }"))).toEqual(["T1"]);
    expect(rules('<span style="font-size: .75rem">x</span>')).toEqual(["T1"]);
    expect(rules(".a { font-size: 0.7rem !important; }", "main.css")).toEqual(["T1"]);
  });
  test("clamp with a sub-1rem bound fails", () => {
    expect(rules(style(".a { font-size: clamp(0.55rem, 1vw, 0.75rem); }"))).toEqual(["T1"]);
    expect(rules(style(".a { font-size: clamp(var(--size-whisper), 1vw, var(--size-label)); }"))).toEqual([]);
  });
  test("em, px, %, tokens and ≥1rem pass", () => {
    expect(rules(style(".a { font-size: 0.85em; } .b { font-size: 12px; } .c { font-size: 90%; }"))).toEqual([]);
    expect(rules(style(".a { font-size: 1rem; } .b { font-size: 1.1rem; } .c { font-size: var(--size-note); }"))).toEqual([]);
  });
  test("JS-set sizes", () => {
    expect(rules("<script>el.style.fontSize = '0.8rem';</script>")).toEqual(["T1"]);
    expect(rules("<script>el.style.fontSize = 'var(--size-note)';</script>")).toEqual([]);
  });
  test("commented-out values are ignored", () => {
    expect(rules(style("/* was font-size: 0.8rem */ .a { font-size: var(--size-note); }"))).toEqual([]);
  });
});

describe("T2 tracking", () => {
  test("raw positive value fails", () => {
    expect(rules(style(".a { letter-spacing: 0.12em; }"))).toEqual(["T2"]);
    expect(rules('<b style="letter-spacing:2px">x</b>')).toEqual(["T2"]);
  });
  test("token, 0, normal, negative pass", () => {
    expect(rules(style(".a { letter-spacing: var(--tracking-label); } .b { letter-spacing: 0; } .c { letter-spacing: normal; } .d { letter-spacing: -0.01em; }"))).toEqual([]);
  });
});

describe("T3 defined", () => {
  test("removed and misspelled tokens fail", () => {
    expect(rules(style(".a { font-size: var(--size-meta); }"))).toEqual(["T3"]);
    expect(rules(style(".a { color: var(--ink-fiant); }"))).toEqual(["T3"]);
  });
  test("ungoverned prefixes are not checked", () => {
    expect(rules(style(".a { width: var(--card-w); }"))).toEqual([]);
  });
  test("a local definition in the same file is allowed", () => {
    expect(rules(style(".a { --ink-wash: #eee; background: var(--ink-wash); }"))).toEqual([]);
  });
});

describe("T4 ghost", () => {
  test("ghost text colour without the ornament comment fails", () => {
    expect(rules(style(".a { color: var(--ink-ghost); }"))).toEqual(["T4"]);
  });
  test("with the ornament comment passes", () => {
    expect(rules(style(".a::before { color: var(--ink-ghost); /* ornament */ }"))).toEqual([]);
  });
  test("border-color, background-color and text-decoration-color are not text", () => {
    expect(rules(style(".a { border-color: var(--ink-ghost); background-color: var(--ink-ghost); text-decoration-color: var(--ink-ghost); }"))).toEqual([]);
    expect(rules(style(".a { border-bottom: 1px solid var(--ink-ghost); }"))).toEqual([]);
  });
});

describe("T5 earned colour", () => {
  test("grayscale at top level fails", () => {
    expect(rules(style(".a img { filter: grayscale(30%); }"))).toEqual(["T5"]);
    expect(rules(".a img { filter: grayscale(1); }", "main.css")).toEqual(["T5"]);
  });
  test("inside @media (hover: hover) passes", () => {
    expect(rules(style("@media (hover: hover) {\n  .a img { filter: grayscale(30%); }\n}\n.a:hover img { filter: grayscale(0%); }"))).toEqual([]);
  });
  test("inside a width query fails", () => {
    expect(lines(style("@media (max-width: 768px) {\n  .a img { filter: grayscale(30%); }\n}"))).toEqual(["T5@4"]);
  });
  test("nested hover query inside another at-rule passes; a sibling block after it fails", () => {
    const css = "@supports (display: grid) {\n  @media (hover: hover) and (pointer: fine) {\n    .a { filter: grayscale(1); }\n  }\n  .b { filter: grayscale(1); }\n}";
    expect(lines(style(css))).toEqual(["T5@7"]);
  });
  test("not (hover: hover) and any-hover do not count", () => {
    expect(rules(style("@media not (hover: hover) { .a { filter: grayscale(1); } }"))).toEqual(["T5"]);
    expect(rules(style("@media (any-hover: hover) { .a { filter: grayscale(1); } }"))).toEqual(["T5"]);
  });
  test("grayscale(0), grayscale(0%) and filter: none pass anywhere", () => {
    expect(rules(style(".a { filter: grayscale(0); } .b { filter: grayscale(0%); } .c { filter: none; }"))).toEqual([]);
  });
  test("Nunjucks tags inside a style block do not unbalance the scanner", () => {
    const css = "{% if hero %}\n@media (hover: hover) {\n  .a { filter: grayscale(20%); --x: \"{{ hero | safe }}\"; }\n}\n{% endif %}\n.b { filter: grayscale(20%); }";
    expect(lines(style(css))).toEqual(["T5@8"]);
  });
  test("braces in strings and comments are ignored", () => {
    const css = '@media (hover: hover) {\n  .a::after { content: "}"; } /* } */\n  .a { filter: grayscale(1); }\n}';
    expect(rules(style(css))).toEqual([]);
  });
  test("inline style grayscale cannot be gated", () => {
    expect(rules('<img style="filter: grayscale(1)">')).toEqual(["T5"]);
  });
});

describe("T6 typeface", () => {
  test("a template naming a face fails, in a style block, the font shorthand and style=\"\"", () => {
    expect(rules(style(".a { font-family: 'IBM Plex Mono', monospace; }"))).toEqual(["T6"]);
    expect(rules(style('.a { font-family: "Cormorant Garamond", Georgia, serif !important; }'))).toEqual(["T6"]);
    expect(rules(style(".a { font: var(--size-label) 'IBM Plex Mono', monospace; }"))).toEqual(["T6"]);
    expect(rules('<span style="font-family: \'IBM Plex Mono\', monospace">x</span>')).toEqual(["T6"]);
    expect(rules(style(".a { font-family: Cormorant Garamond, serif; }"))).toEqual(["T6"]); // unquoted
  });
  test("a custom property naming a face fails unless it is a --font-* token in main.css", () => {
    expect(rules(style("main { --pagefind-ui-font: 'Cormorant Garamond', Georgia, serif; }"))).toEqual(["T6"]);
    expect(rules(style(":root { --font-mono: 'IBM Plex Mono', monospace; }"))).toEqual(["T6"]); // templates never redefine
    expect(rules(":root { --font-serif: 'Cormorant Garamond', 'Cormorant Fallback', Georgia, serif; --font-mono: 'IBM Plex Mono', 'Plex Fallback', monospace; }\nhtml.cjk { --font-serif: 'Cormorant Garamond', 'Noto Serif SC', Georgia, serif; }", "src/assets/css/main.css")).toEqual([]);
    expect(rules(":root { --pagefind-ui-font: 'Cormorant Garamond', serif; }", "src/assets/css/main.css")).toEqual(["T6"]);
    expect(rules(":root { --font-display: 'Cormorant Garamond', Georgia, serif; }", "src/assets/css/main.css")).toEqual([]); // a later voice needs no lint change
  });
  test("@font-face rules may name faces", () => {
    expect(rules("@font-face { font-family: 'Cormorant Garamond'; font-style: normal; src: url('/assets/fonts/x.woff2') format('woff2'); }\n@font-face { font-family: 'Plex Fallback'; src: local('Menlo'); }", "src/assets/css/main.css")).toEqual([]);
  });
  test("variables, generic families and non-declaration strings pass", () => {
    expect(rules(style(".a { font-family: var(--font-mono); } .b { font: var(--size-label) var(--font-serif); } .c { font-family: monospace; }"))).toEqual([]);
    expect(rules("<script>document.fonts.load('400 1em \"Cormorant Garamond\"');</script>")).toEqual([]);
    expect(rules(style("/* was font-family: 'IBM Plex Mono', monospace; */ .a { color: red; }"))).toEqual([]);
  });
  test("JS fontFamily assignments", () => {
    expect(rules("<script>el.style.fontFamily = \"'IBM Plex Mono', monospace\";</script>")).toEqual(["T6"]);
    expect(rules("<script>el.style.fontFamily = 'var(--font-mono)';</script>")).toEqual([]);
  });
  test("scope leaves slide decks and the TSM sub-app alone", () => {
    const scope = tokenScope(".").map((f) => f.replace(/\\/g, "/"));
    expect(scope.length).toBeGreaterThan(0);
    expect(scope.filter((f) => f.includes("src/assets/slides/") || f.includes("src/tsm/"))).toEqual([]);
  });
});

describe("neutraliseCss", () => {
  test("preserves offsets and newlines", () => {
    const src = 'a { b: "x{y"; } /* {\n} */ {% if z %}';
    const out = neutraliseCss(src);
    expect(out.length).toBe(src.length);
    expect(out.split("\n").length).toBe(2);
    expect((out.match(/[{}]/g) || []).join("")).toBe("{}");
  });
});

describe("A1 one accident per work", () => {
  test("one title-level accident", () => {
    expect(accidentsIn("---\ntitle: X\naccident: true\n---\nBody").count).toBe(1);
  });
  test("one accident in a prompt array", () => {
    const md = '---\nprompt:\n  - "a"\n  - text: "b"\n    accident: true\n---\n';
    expect(accidentsIn(md).count).toBe(1);
  });
  test("an array accident plus a body span is two", () => {
    const md = '---\ncontextExcerpt:\n  - text: "b"\n    accident: true\n---\nSee <span class="accident">this</span>.';
    const res = accidentsIn(md);
    expect(res.count).toBe(2);
    expect(res.where[1]).toContain('"this"');
  });
  test("a span inside a front-matter string counts", () => {
    const md = '---\naccident: true\ncontextAfter: \'x <span class="accident">y</span>\'\n---\n';
    expect(accidentsIn(md).count).toBe(2);
  });
  test("accident: false does not count", () => {
    expect(accidentsIn("---\naccident: false\n---\n").count).toBe(0);
  });
  test("the same phrase marked twice is one accident, echoed", () => {
    const md = '---\ncontextExcerpt:\n  - text: "The garden grows itself."\n    accident: true\ncontextAfter: \'Nothing was filmed. <span class="accident">The garden grows itself.</span>\'\n---\n';
    const res = accidentsIn(md);
    expect(res.count).toBe(1);
    expect(res.echoed).toBe(true);
    expect(res.accidents[0].where.length).toBe(2);
  });
  test("two different phrases are two accidents", () => {
    const md = '---\nprompt:\n  - text: "first wrong thing"\n    accident: true\n---\nAnd <span class="accident">second wrong thing</span>.';
    const res = accidentsIn(md);
    expect(res.count).toBe(2);
    expect(res.echoed).toBe(false);
  });
  test("case, whitespace, quotes, entities and trailing punctuation do not make a new accident", () => {
    const md = "---\nprompt:\n  - text: \"I can't touch.\"\n    accident: true\n---\n<span class=\"accident\">  i  can&rsquo;t\n<em>touch</em>  </span> and <span class='line accident'>“I can't touch”!</span>";
    const res = accidentsIn(md);
    expect(res.count).toBe(1);
    expect(res.accidents[0].where.length).toBe(3);
  });
  test("a title-level accident plus a body span is two distinct accidents", () => {
    const md = '---\ntitle: "Mechanism Literalism"\naccident: true\n---\nText <span class="accident">Mechanism Literalism</span>.';
    const res = accidentsIn(md);
    expect(res.count).toBe(2);
    expect(res.accidents[0].text).toBe(null);
  });
});
