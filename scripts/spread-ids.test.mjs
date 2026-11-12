import { describe, expect, test } from "bun:test";
import { checkSpreadIds, isBookPage } from "./lib/spread-ids.mjs";

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
