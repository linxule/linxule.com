import { expect, test } from "@playwright/test";

// A page is never wider than the phone holding it. On 2026-11-12 /making was
// laid out 448px wide on a 390px phone (an unwrapped row of filter chips), so
// the spine's section marker and the last chips sat off the right edge and the
// whole page scrolled sideways. Nothing measured rendered width.
const PAGES = [
  "/", "/making/", "/making/prompter/claude/", "/making/creator/claude/",
  "/writing/", "/writing/epistemic-voids-03-mechanism-literalism/", "/writing/series/loom/",
  "/thinking/", "/concepts/", "/talks/", "/papers/", "/papers/interpretive-orchestration/",
  "/teaching/", "/cv/", "/builds/", "/search/",
];

test.beforeEach(async ({ page }) => {
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("https://fonts.gstatic.com/**", route => route.abort());
  await page.route("**/_vercel/insights/**", route => route.abort());
});

for (const width of [360, 390]) {
  test(`no page is wider than a ${width}px phone`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, viewport: { width, height: 844 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    const wide = [];
    for (const url of PAGES) {
      const response = await page.goto(url);
      expect(response.status(), url).toBeLessThan(400);
      const measured = await page.evaluate(() => ({
        screen: document.documentElement.clientWidth,
        laidOut: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      }));
      if (measured.laidOut > measured.screen + 1) wide.push(`${url} is ${measured.laidOut}px on a ${measured.screen}px screen`);
    }
    await context.close();
    expect(wide).toEqual([]);
  });
}
