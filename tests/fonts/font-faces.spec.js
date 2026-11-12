import { expect, test } from "@playwright/test";

// Which face actually draws the text, as Chromium reports it (CDP CSS.getPlatformFontsForNode: the fonts used for
// a node's own text). Google Fonts is aborted, as in every suite: that is the "Google absent" case the guard faces
// in main.css exist for. Without them, upright hanzi would be drawn by the Kai italic, and upright small text (and
// the upright strong in a margin note) by the 8-point italic.

const PORTRAIT = "/making/portraits/portraits-2026-10-13-pure-verb-topology-of-an-instant/";
const NOTE_ESSAY = "/writing/post-agi-organizations-iii-what-collaboration-becomes/";
const SUPERIOR = "/making/artifacts/artifact-2026-07-27-ten-thousand-things-begetting/";
const KAI = /WenKai/;
const SMALL = /^EBGaramond08-/;

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "faces do not depend on viewport");
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("https://fonts.gstatic.com/**", route => route.abort());
  await page.route("**/_vercel/insights/**", route => route.abort());
});

async function open(page, url) {
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
}

// Marks every element under main whose own text matches `pattern` (and, if given, whose font-style is `style`).
async function mark(page, pattern, style) {
  return page.evaluate(([source, style]) => {
    const re = new RegExp(source, "u");
    let n = 0;
    for (const el of document.querySelectorAll("main *")) {
      const own = [...el.childNodes].filter(node => node.nodeType === 3).map(node => node.data).join("");
      if (!re.test(own) || (style && getComputedStyle(el).fontStyle !== style)) continue;
      el.setAttribute("data-face-probe", ""); n++;
    }
    return n;
  }, [pattern.source, style]);
}

async function facesOf(page, selector) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector });
  const faces = [];
  for (const nodeId of nodeIds) faces.push(...(await cdp.send("CSS.getPlatformFontsForNode", { nodeId })).fonts);
  await cdp.detach();
  return { nodes: nodeIds.length, names: faces.map(face => face.postScriptName), faces };
}

test("without Google Fonts, upright hanzi are not drawn by the Kai italic; italic hanzi are", async ({ page }) => {
  await open(page, "/cv-zh/");
  expect(await mark(page, /[㐀-鿿]/, "normal")).toBeGreaterThan(10);
  const upright = await facesOf(page, "[data-face-probe]");
  expect(upright.names.filter(name => KAI.test(name))).toEqual([]);

  await open(page, PORTRAIT);
  expect(await mark(page, /[㐀-鿿]/, "italic")).toBeGreaterThan(0);
  const italic = await facesOf(page, "[data-face-probe]");
  expect(italic.names.some(name => KAI.test(name))).toBe(true);
});

test("the 8-point cut draws only italic 400: upright small text and the upright strong in a note take the text roman", async ({ page }) => {
  const roman500 = [];
  page.on("request", request => { if (/eb-garamond-roman-500-latin\./.test(request.url())) roman500.push(request.url()); });
  await open(page, NOTE_ESSAY);
  expect((await facesOf(page, ".margin-note")).names.some(name => SMALL.test(name))).toBe(true);
  const strong = await facesOf(page, ".margin-note strong");
  expect(strong.nodes).toBeGreaterThan(0);
  expect(strong.names.filter(name => SMALL.test(name))).toEqual([]);
  expect(strong.names).toContain("EBGaramond-Regular");
  expect(roman500.length).toBeGreaterThan(0); // the strong's face: EB Garamond roman 500 (emphasis in an italic note is roman)

  await open(page, "/builds/");
  const groupNote = await facesOf(page, ".group-note");
  expect(groupNote.nodes).toBeGreaterThan(0);
  expect(groupNote.names.filter(name => SMALL.test(name))).toEqual([]);
  expect(groupNote.names).toContain("EBGaramond-Regular");
});

test("a superior figure in italic text is drawn by a site face, not a system one", async ({ page }) => {
  await open(page, SUPERIOR);
  expect(await mark(page, /²/u, "italic")).toBeGreaterThan(0);
  const { faces } = await facesOf(page, "[data-face-probe]");
  expect(faces.filter(face => !face.isCustomFont).map(face => face.familyName)).toEqual([]);
});
