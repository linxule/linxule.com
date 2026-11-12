import { createRequire } from "node:module";
import { expect, test } from "@playwright/test";

const sharp = createRequire(import.meta.url)("sharp");

// Nothing may sit between the reader and the ink. On 2026-11-12 the paper
// layer was found painted over the text on about half the page types (a 6.6:1
// ink rendered at 3.2:1), and every check had compared declared tokens, not
// pixels. This compares pixels: the same text, rendered with the paper and with
// the paper removed, must have the same ink.
const INKS = { ink: "rgb(26, 26, 26)", "ink-light": "rgb(85, 85, 85)", "ink-faint": "rgb(102, 102, 102)" };
const PAGES = [
  ["/", "title"],
  ["/writing/epistemic-voids-03-mechanism-literalism/", "body"],
  ["/writing/", "body"],
  ["/thinking/", "workshop"],
  ["/cv/", "body"],
];
// Removes every way paper has been laid on this site, old and new.
const NO_PAPER = ":root{--paper-sheet:none !important} body::before,body::after{display:none !important}";

test.beforeEach(async ({ page }) => {
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("https://fonts.gstatic.com/**", route => route.abort());
  await page.route("**/_vercel/insights/**", route => route.abort());
});

// The first visible, unclipped text of each ink, below the spine.
function sampleText(inks) {
  const spine = document.querySelector(".spine")?.getBoundingClientRect().bottom ?? 0;
  const found = {};
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.textContent.trim().length < 4) continue;
    const el = node.parentElement;
    const style = getComputedStyle(el);
    const ink = Object.keys(inks).find(name => inks[name] === style.color);
    if (!ink || found[ink] || style.visibility !== "visible") continue;
    let opaque = true;
    for (let e = el; e; e = e.parentElement) if (getComputedStyle(e).opacity !== "1") opaque = false;
    if (!opaque) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const r = range.getBoundingClientRect();
    if (r.width < 24 || r.height < 8 || r.top < spine + 4 || r.bottom > innerHeight - 4 || r.left < 0 || r.right > innerWidth) continue;
    found[ink] = { x: Math.floor(r.left), y: Math.floor(r.top), width: Math.ceil(r.width), height: Math.ceil(r.height), text: node.textContent.trim().slice(0, 40) };
  }
  return found;
}

async function luminance(buffer) {
  const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const L = new Float64Array(info.width * info.height);
  for (let i = 0; i < L.length; i++) L[i] = 0.2126 * data[i * 3] + 0.7152 * data[i * 3 + 1] + 0.0722 * data[i * 3 + 2];
  return L;
}

test("the paper is under the ink: text renders the same with and without it", async ({ page }) => {
  const sampled = new Set();
  for (const [path, stock] of PAGES) {
    await page.goto(path);
    await page.waitForFunction(() => !document.documentElement.classList.contains("fonts-loading"));
    await page.addStyleTag({ content: "html{scroll-behavior:auto !important} *{animation:none !important;transition:none !important} .bloom-cursor{display:none !important}" });

    // The paper this page declares is there, and loaded.
    const sheet = await page.evaluate(() => getComputedStyle(document.body).backgroundImage);
    expect(sheet, path).toContain(`/assets/paper/${stock}.avif`);
    await page.evaluate(async (url) => { const img = new Image(); img.src = url; await img.decode(); }, sheet.slice(5, -2));

    const samples = await page.evaluate(sampleText, INKS);
    expect(Object.keys(samples).length, `${path}: no ink sampled`).toBeGreaterThan(0);
    const withPaper = {};
    for (const [ink, clip] of Object.entries(samples)) withPaper[ink] = await page.screenshot({ clip });
    const tag = await page.addStyleTag({ content: NO_PAPER });
    for (const [ink, clip] of Object.entries(samples)) {
      const bare = await luminance(await page.screenshot({ clip }));
      const papered = await luminance(withPaper[ink]);
      // Glyph cores: well clear of the paper in the bare render.
      const paperLum = Math.max(...bare);
      const darkest = Math.min(...bare);
      let cores = 0, worst = 0;
      for (let i = 0; i < bare.length; i++) {
        if (bare[i] > darkest + (paperLum - darkest) * 0.25) continue;
        cores++;
        worst = Math.max(worst, Math.abs(papered[i] - bare[i]));
      }
      const where = `${path} ${ink} "${clip.text}"`;
      expect(cores, where).toBeGreaterThan(10);
      expect(Math.abs(Math.min(...papered) - darkest), `${where}: darkest ink pixel`).toBeLessThanOrEqual(2);
      expect(worst, `${where}: ink pixel changed by the paper`).toBeLessThanOrEqual(6);
      sampled.add(ink);
    }
    await tag.evaluate(node => node.remove());
  }
  expect([...sampled].sort()).toEqual(Object.keys(INKS).sort());
});

test("the paper is the page background: it scrolls with the ink", async ({ page }) => {
  await page.goto("/writing/epistemic-voids-03-mechanism-literalism/");
  await page.waitForFunction(() => !document.documentElement.classList.contains("fonts-loading"));
  const style = await page.evaluate(() => {
    const b = getComputedStyle(document.body);
    const before = getComputedStyle(document.body, "::before");
    return { attachment: b.backgroundAttachment, image: b.backgroundImage, beforeContent: before.content };
  });
  expect(style.attachment).toBe("scroll");
  expect(style.image).toContain("/assets/paper/body.avif");
  expect(style.beforeContent).toBe("none");
});
