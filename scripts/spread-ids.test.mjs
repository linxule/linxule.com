import { describe, expect, test } from "bun:test";
import { checkSpreadIds, checkUniqueIds, isBookPage, isSitePage } from "./lib/spread-ids.mjs";
import { addDefinitionIds } from "../eleventy/transforms.js";

const making = (...sections) => `<html><body><div class="making-book" id="making-book">${sections.join("")}</div></body></html>`;
const spread = (target, id = target, cls = "spread") =>
  `<section class="${cls}" data-spread="1"${target ? ` data-book-target="${target}"` : ""}${id ? ` id="${id}"` : ""}></section>`;

describe("spread ids", () => {
  test("pages without a book are not checked", () => {
    expect(isBookPage("<main><section class='spread'></section></main>")).toBe(false);
    expect(checkSpreadIds("<main id='a'></main><p id='a'></p>")).toEqual([]);
  });

  test("a book whose spreads carry their targets as ids passes", () => {
    const html = making(
      spread("portraits", "portraits", "spread header-spread"),
      spread("portrait:unfinished-light"),
      spread("artifact:unfinished-light"),
      `<section class="back-matter" id="tools" data-book-target="tools"><section class="tools-section"></section></section>`,
    );
    expect(checkSpreadIds(html)).toEqual([]);
  });

  test("bare slugs shared by a portrait and an artifact fail", () => {
    const html = making(spread("portrait:unfinished-light", "unfinished-light"), spread("artifact:unfinished-light", "unfinished-light"));
    const problems = checkSpreadIds(html, "making/index.html");
    expect(problems.some((p) => p.includes('id "unfinished-light" appears 2 times'))).toBe(true);
    expect(problems.some((p) => p.includes("differs from its data-book-target"))).toBe(true);
  });

  test("a spread without an id fails", () => {
    const problems = checkSpreadIds(making(spread("portrait:the-echo", null)));
    expect(problems).toEqual(["[spread-ids] page: spread portrait:the-echo has no id, so it cannot be linked to"]);
  });

  test("a series spread with neither target nor id fails twice", () => {
    const html = `<div class="writing-book" id="writing-book"><section class="essay-spread" data-spread="1"></section></div>`;
    expect(checkSpreadIds(html)).toHaveLength(2);
  });

  test("an id elsewhere on the page that repeats a spread id fails", () => {
    const html = making(spread("artifacts", "artifacts", "spread header-spread")) + `<h2 id="artifacts">Artifacts</h2>`;
    expect(checkSpreadIds(html)).toEqual(['[spread-ids] page: id "artifacts" appears 2 times']);
  });

  test("ids inside scripts and comments are ignored", () => {
    const html = making(spread("portraits")) + `<script>el.innerHTML = '<div id="portraits">'</script><!-- <p id="portraits"> -->`;
    expect(checkSpreadIds(html)).toEqual([]);
  });
});

describe("unique ids on any page", () => {
  test("a page with no repeated id passes, book or not", () => {
    expect(checkUniqueIds(`<main id="a"><h2 id="b"></h2></main>`)).toEqual([]);
  });

  test("a repeated id fails and names the page, the id and the count", () => {
    const html = `<blockquote id="dfn-key-insight"></blockquote><p id="x"></p><blockquote id="dfn-key-insight"></blockquote>`;
    expect(checkUniqueIds(html, "writing/loom-i/index.html")).toEqual([
      '[unique-ids] writing/loom-i/index.html: id "dfn-key-insight" appears 2 times',
    ]);
  });

  test("data-id and ids inside scripts or comments are not counted", () => {
    const html = `<p id="a" data-id="a"></p><i data-id="a"></i><script>s = '<p id="a">'</script><!-- <p id="a"> -->`;
    expect(checkUniqueIds(html)).toEqual([]);
  });
});

describe("which pages are the site's own", () => {
  test("a page that loads the site stylesheet is", () => {
    expect(isSitePage(`<head><link rel="stylesheet" href="/assets/css/main.css?v=1.2.3"></head>`)).toBe(true);
  });

  test("an artifact or deck copied in whole is not, whatever its ids", () => {
    const artifact = `<head><style>body{margin:0}</style></head><canvas id="c"></canvas><canvas id="c"></canvas>`;
    expect(isSitePage(artifact)).toBe(false);
    expect(isSitePage(`<head><link rel="stylesheet" href="styles/main.css"></head>`)).toBe(false);
  });
});

describe("definition ids", () => {
  const callout = (term, rest = ":") => `<blockquote>\n<p><strong>${term}</strong>${rest} text</p>\n</blockquote>`;
  const ids = (html) => [...html.matchAll(/<blockquote id="([^"]+)" class="concept-definition">/g)].map((m) => m[1]);

  test("a term gets dfn-<slug>, with or without a qualifier", () => {
    const html = addDefinitionIds(callout("Token Duality") + callout("LOOM", " (n.):"));
    expect(ids(html)).toEqual(["dfn-token-duality", "dfn-loom"]);
  });

  test("a term repeated on one page keeps the bare id first, then -2, -3", () => {
    const html = addDefinitionIds([1, 2, 3].map(() => callout("Quick Application")).join("<p>between</p>"));
    expect(ids(html)).toEqual(["dfn-quick-application", "dfn-quick-application-2", "dfn-quick-application-3"]);
    expect(checkUniqueIds(html)).toEqual([]);
  });

  test("a numbered copy never takes an id a later term owns by name", () => {
    const html = addDefinitionIds(callout("Key Insight") + callout("Key Insight 2") + callout("Key Insight"));
    expect(new Set(ids(html)).size).toBe(3);
    expect(ids(html)[0]).toBe("dfn-key-insight");
  });

  test("each page starts its own count", () => {
    expect(ids(addDefinitionIds(callout("Key Insight")))).toEqual(["dfn-key-insight"]);
    expect(ids(addDefinitionIds(callout("Key Insight")))).toEqual(["dfn-key-insight"]);
  });

  test("a blockquote that does not open with a bold term and a colon is left alone", () => {
    const plain = `<blockquote>\n<p>Just a quotation.</p>\n</blockquote>`;
    expect(addDefinitionIds(plain)).toBe(plain);
  });
});
