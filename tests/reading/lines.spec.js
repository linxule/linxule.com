import { expect, test } from "@playwright/test";

// No block of text ends on a single dangling word. On 2026-11-12, at phone
// width, 144 of 585 wrapped blocks across 14 pages did (a quarter); with
// `text-wrap: pretty` on body, 7 did in Chromium and none in WebKit. This
// counts them as rendered, with the site's rule and with the rule switched
// off, so it measures what the rule does to today's text, whatever that is.
const PAGES = ["/concepts/", "/thinking/", "/writing/", "/writing/epistemic-voids-03-mechanism-literalism/"];
const NO_RULE = "*{text-wrap:wrap !important}";

test.use({ viewport: { width: 393, height: 852 } });

test.beforeEach(async ({ page }) => {
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("https://fonts.gstatic.com/**", route => route.abort());
  await page.route("**/_vercel/insights/**", route => route.abort());
});

// Every block that directly holds text, split at forced breaks; a segment of
// three or more words that wraps and whose last line holds one word is a stub.
function countStubs() {
  const inline = el => /^inline|^contents$/.test(getComputedStyle(el).display);
  const blockOf = node => { let el = node.parentElement; while (el && inline(el)) el = el.parentElement; return el; };
  const segments = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === 1) {
      if (node.tagName === "BR") { const b = blockOf(node); if (b && segments.has(b)) segments.get(b).push([]); }
      continue;
    }
    if (!node.textContent.trim() || node.parentElement.closest("script,style,noscript,svg,pre,code,.sr-only,[hidden],iframe")) continue;
    const block = blockOf(node);
    if (!block) continue;
    if (!segments.has(block)) segments.set(block, [[]]);
    const current = segments.get(block).at(-1);
    for (const m of node.textContent.matchAll(/\S+/g)) current.push([node, m.index, m.index + m[0].length]);
  }
  let wrapped = 0, stubs = 0;
  const range = document.createRange();
  for (const [block, list] of segments) {
    const style = getComputedStyle(block);
    if (!block.getClientRects().length || style.visibility === "hidden" || style.whiteSpace !== "normal") continue;
    for (const words of list) {
      if (words.length < 3) continue;
      const lines = [];
      for (const [node, start, end] of words) {
        range.setStart(node, start); range.setEnd(node, end);
        const r = range.getClientRects()[0];
        if (!r || !r.width) continue;
        const mid = r.top + r.height / 2;
        const line = lines.find(l => Math.abs(l.mid - mid) < r.height * 0.6);
        if (line) line.words++; else lines.push({ mid, words: 1 });
      }
      if (lines.length < 2) continue;
      wrapped++;
      if (lines.at(-1).words === 1) stubs++;
    }
  }
  return { wrapped, stubs };
}

test("no block ends on a dangling word", async ({ page }) => {
  await page.goto("/");
  test.skip(!(await page.evaluate(() => CSS.supports("text-wrap", "pretty"))), "this engine has no text-wrap: pretty");
  let wrapped = 0, withRule = 0, withoutRule = 0;
  for (const url of PAGES) {
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    const set = await page.evaluate(countStubs);
    const off = await page.addStyleTag({ content: NO_RULE });
    const plain = await page.evaluate(countStubs);
    await off.evaluate(el => el.remove());
    wrapped += set.wrapped; withRule += set.stubs; withoutRule += plain.stubs;
  }
  expect(wrapped, "the pages still hold wrapped text to measure").toBeGreaterThan(80);
  expect(withoutRule, "ordinary wrapping leaves stubs on these pages, so the rule has work to do").toBeGreaterThan(10);
  // Long last words (a URL, "chromodynamics") are not stubs to the browser and may stay.
  expect(withRule, `${withRule} of ${wrapped} wrapped blocks end on one word (${withoutRule} without the rule)`).toBeLessThanOrEqual(Math.max(2, Math.floor(withoutRule / 5)));
});

test("a title's lines are balanced", async ({ page }) => {
  await page.goto("/writing/epistemic-voids-03-mechanism-literalism/");
  test.skip(!(await page.evaluate(() => CSS.supports("text-wrap", "balance"))), "this engine has no text-wrap: balance");
  await page.evaluate(() => document.fonts.ready);
  const lines = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const range = document.createRange();
    range.selectNodeContents(h1);
    const rows = [];
    for (const r of range.getClientRects()) {
      const row = rows.find(x => Math.abs(x.top - r.top) < r.height / 2);
      if (row) { row.left = Math.min(row.left, r.left); row.right = Math.max(row.right, r.right); } else rows.push({ top: r.top, left: r.left, right: r.right });
    }
    return rows.map(r => r.right - r.left);
  });
  test.skip(lines.length < 2, "the title fits on one line at this width");
  expect(Math.min(...lines) / Math.max(...lines), `title line widths ${lines.map(Math.round).join(", ")}`).toBeGreaterThan(0.5);
});

// The home page opens on five authored lines that step to the right. Until
// 2026-11-12 a 400px cap on the block wrapped the third and fourth lines once
// the type passed 28px (every desktop from about 1100px up), and each
// turnover fell back to the left edge: seven lines, the stair broken.
test("the home opening keeps its five lines", async ({ page }) => {
  for (const width of [360, 393, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const opening = await page.evaluate(() => {
      const block = document.querySelector(".core-question");
      const range = document.createRange();
      const lines = [...block.querySelectorAll(".line")].map(line => {
        range.selectNodeContents(line);
        const tops = new Set([...range.getClientRects()].map(r => Math.round(r.top)));
        return { rows: tops.size, left: Math.round(range.getBoundingClientRect().left) };
      });
      return { lines, right: block.getBoundingClientRect().right, field: block.parentElement.getBoundingClientRect().right };
    });
    expect(opening.lines, `${width}px: five authored lines`).toHaveLength(5);
    expect(opening.lines.map(l => l.rows), `${width}px: each authored line is one rendered line`).toEqual([1, 1, 1, 1, 1]);
    const [a, b, c, d, e] = opening.lines.map(l => l.left);
    expect(a < b && b < c && c < d, `${width}px: lines two to four step right (${a}, ${b}, ${c}, ${d})`).toBe(true);
    expect(e, `${width}px: the last line returns to the first line's edge`).toBe(a);
    expect(opening.right, `${width}px: the block stays inside its field`).toBeLessThanOrEqual(opening.field + 0.5);
  }
});
