import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const fontPath = fileURLToPath(new URL("../../scripts/og-fonts/CG-Medium.ttf", import.meta.url));
const fontURL = "https://fonts.gstatic.com/codex-font-test/cormorant.ttf";
const stylesheet = `
  @font-face {
    font-family: "Cormorant Garamond";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url("${fontURL}") format("truetype");
  }
`;

async function captureRequest(page, pattern) {
  let capture;
  const requested = new Promise(resolve => { capture = resolve; });
  // Leave the request pending until the test fulfills or aborts its route.
  await page.route(pattern, route => { capture(route); });
  return { requested };
}

async function fulfillStylesheet(route) {
  await route.fulfill({ contentType: "text/css", body: stylesheet });
}

async function fulfillFont(route) {
  await route.fulfill({
    contentType: "font/ttf",
    headers: { "access-control-allow-origin": "*" },
    path: fontPath,
  });
}

async function pauseClockBeforeNavigation(page) {
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-01-01T00:01:00Z"));
}

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "font loading is independent of viewport");
  await page.route("**/_vercel/insights/**", route => route.abort());
});

test("font cloak waits for delayed stylesheet and the font used by the page", async ({ page }) => {
  await pauseClockBeforeNavigation(page);
  const cssRequest = await captureRequest(page, "https://fonts.googleapis.com/**");
  const fontRequest = await captureRequest(page, fontURL);
  await page.goto("/writing/", { waitUntil: "commit" });

  const css = await cssRequest.requested;
  await page.clock.runFor(300);
  // A resolved FontFaceSet before the stylesheet arrives does not mean the
  // eventual body font has loaded. Keep the actual base template cloaked.
  await expect(page.locator("html")).toHaveClass(/fonts-loading/);

  await fulfillStylesheet(css);
  await page.waitForLoadState("domcontentloaded");
  const font = await fontRequest.requested;
  await expect.poll(() => page.evaluate(() => document.fonts.status)).toBe("loading");
  await page.clock.runFor(900);
  await expect(page.locator("body")).toHaveCSS("visibility", "hidden");

  await fulfillFont(font);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => [...document.fonts].some(face =>
    face.family.includes("Cormorant Garamond") && face.status === "loaded",
  ))).toBe(true);
  // No time advances here: successful loading, rather than the 1500ms
  // fallback, must reveal the document.
  await expect(page.locator("html")).not.toHaveClass(/fonts-loading/);
  await expect(page.getByRole("heading", { name: "writing", exact: true })).toBeVisible();
});

test("font cloak reveals at its fallback when a used font request hangs", async ({ page }) => {
  await pauseClockBeforeNavigation(page);
  await page.route("https://fonts.googleapis.com/**", fulfillStylesheet);
  const fontRequest = await captureRequest(page, fontURL);
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

test.describe("with JavaScript disabled", () => {
  test.use({ javaScriptEnabled: false });

  test("page content remains visible without executing the font cloak", async ({ page }) => {
    await page.route("https://fonts.googleapis.com/**", fulfillStylesheet);
    await page.route(fontURL, fulfillFont);
    await page.goto("/writing/");
    await expect(page.locator("html")).not.toHaveClass(/fonts-loading/);
    await expect(page.getByRole("heading", { name: "writing", exact: true })).toBeVisible();
    await expect(page.locator(".entry-link").first()).toBeVisible();
  });
});
