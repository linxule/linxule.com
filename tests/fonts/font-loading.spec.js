import { expect, test } from "@playwright/test";

// The text face is self-hosted: declared in main.css, preloaded by base.njk.
const TEXT_FACE = "**/assets/fonts/eb-garamond-roman-400-latin.*.woff2";
const MAIN_CSS = "**/assets/css/main.css*";

async function captureRequest(page, pattern) {
  let capture;
  const requested = new Promise(resolve => { capture = resolve; });
  // Leave the request pending until the test continues or aborts its route.
  await page.route(pattern, route => { capture(route); });
  return { requested };
}

async function pauseClockBeforeNavigation(page) {
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-01-01T00:01:00Z"));
}

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "font loading is independent of viewport");
  await page.route("**/_vercel/insights/**", route => route.abort());
  // Google Fonts now carries only the upright Chinese serif, which /writing/ does not set.
  await page.route("https://fonts.googleapis.com/**", route => route.fulfill({ contentType: "text/css", body: "" }));
});

test("font cloak waits for a delayed stylesheet and the font used by the page", async ({ page }) => {
  await pauseClockBeforeNavigation(page);
  const cssRequest = await captureRequest(page, MAIN_CSS);
  const fontRequest = await captureRequest(page, TEXT_FACE);
  await page.goto("/writing/", { waitUntil: "commit" });

  const css = await cssRequest.requested;
  await page.clock.runFor(300);
  // A resolved FontFaceSet before main.css arrives does not mean the eventual
  // body font has loaded: the faces are declared there. Keep the page cloaked.
  await expect(page.locator("html")).toHaveClass(/fonts-loading/);

  await css.continue();
  await page.waitForLoadState("domcontentloaded");
  const font = await fontRequest.requested; // usually already asked for by the preload
  await expect.poll(() => page.evaluate(() => document.fonts.status)).toBe("loading");
  await page.clock.runFor(900);
  await expect(page.locator("body")).toHaveCSS("visibility", "hidden");

  await font.continue();
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => [...document.fonts].some(face =>
    face.family.replace(/["']/g, "") === "EB Garamond" && face.style === "normal" && face.status === "loaded",
  ))).toBe(true);
  // No time advances here: successful loading, rather than the 1500ms
  // fallback, must reveal the document.
  await expect(page.locator("html")).not.toHaveClass(/fonts-loading/);
  await expect(page.getByRole("heading", { name: "writing", exact: true })).toBeVisible();
});

test("font cloak reveals at its fallback when a used font request hangs", async ({ page }) => {
  await pauseClockBeforeNavigation(page);
  const fontRequest = await captureRequest(page, TEXT_FACE);
  await page.goto("/writing/", { waitUntil: "domcontentloaded" });
  const font = await fontRequest.requested;

  await page.clock.runFor(1200);
  await expect(page.locator("body")).toHaveCSS("visibility", "hidden");
  await page.clock.runFor(300);
  await expect(page.locator("html")).not.toHaveClass(/fonts-loading/);
  await expect(page.getByRole("heading", { name: "writing", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.fonts.status)).toBe("loading");
  await font.abort();
});

test("the first screen's faces are preloaded, and a preload is the request the face uses", async ({ page }) => {
  const fonts = [];
  page.on("request", request => { if (request.resourceType() === "font") fonts.push(new URL(request.url()).pathname); });
  await page.goto("/writing/");
  await page.evaluate(() => document.fonts.ready);
  const preloads = await page.$$eval('link[rel="preload"][as="font"]', links => links.map(link => new URL(link.href).pathname));
  expect(preloads.some(p => /eb-garamond-roman-400-latin\./.test(p))).toBe(true);
  expect(preloads.some(p => /ibm-plex-mono-400-latin1\./.test(p))).toBe(true);
  // Each preloaded file is fetched once: without matching crossorigin the face would fetch it again.
  for (const p of preloads) expect(fonts.filter(f => f === p).length, p).toBe(1);
});

test.describe("with JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("page content remains visible without executing the font cloak", async ({ page }) => {
    await page.goto("/writing/");
    await expect(page.locator("html")).not.toHaveClass(/fonts-loading/);
    await expect(page.getByRole("heading", { name: "writing", exact: true })).toBeVisible();
    await expect(page.locator(".entry-link").first()).toBeVisible();
  });
});
