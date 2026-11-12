import { expect, test } from "@playwright/test";

// Hover is not the only way in. On 2026-11-12 a keyboard reader reached a
// portrait plate's controls while the plate stayed dimmed (effective opacity
// 0.4) and the download link stayed invisible (opacity 0); on touch screens the
// bloom glow parked wherever the finger landed, and the search clear button was
// an invisible Tab stop. These check what a reader without a mouse gets.
const PORTRAIT = "/making/portraits/portraits-2026-10-13-pure-verb-topology-of-an-instant/";
const STILL = "html{scroll-behavior:auto !important} *{animation:none !important;transition:none !important}";

test.beforeEach(async ({ page }) => {
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("https://fonts.gstatic.com/**", route => route.abort());
  await page.route("**/_vercel/insights/**", route => route.abort());
});

async function settle(page, path) {
  await page.goto(path);
  await page.waitForFunction(() => !document.documentElement.classList.contains("fonts-loading"));
  await page.addStyleTag({ content: STILL });
}

function plateState() {
  const plate = document.querySelector("[data-plate]");
  const img = plate.querySelector("img");
  const a = getComputedStyle(plate), b = getComputedStyle(img);
  return { plate: `${a.filter} ${a.opacity}`, img: `${b.filter} ${b.opacity}` };
}

function focusedOpacity() {
  let o = 1;
  for (let e = document.activeElement; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
  return o;
}

test("a plate reached by keyboard looks as it does under the pointer", async ({ page }) => {
  await settle(page, PORTRAIT);
  const stops = [];
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press("Tab");
    const inPlate = await page.evaluate(() => {
      const plate = document.activeElement?.closest(".specimen");
      if (!plate) return false;
      const marked = document.querySelector("[data-plate]");
      if (marked && marked !== plate) return "next";
      plate.setAttribute("data-plate", "");
      return true;
    });
    if (inPlate === "next" || (!inPlate && stops.length)) break;
    if (!inPlate) continue;
    stops.push({
      control: await page.evaluate(() => document.activeElement.className),
      state: await page.evaluate(plateState),
      opacity: await page.evaluate(focusedOpacity),
    });
  }
  expect(stops.length, "no control inside a plate took focus").toBeGreaterThan(0);

  await page.evaluate(() => document.activeElement.blur());
  await page.mouse.move(0, 0);
  const rest = await page.evaluate(plateState);
  await page.locator("[data-plate]").hover();
  const hover = await page.evaluate(plateState);
  expect(hover, "hover no longer changes the plate; this test needs a new reference").not.toEqual(rest);

  for (const stop of stops) {
    expect(stop.state, `${stop.control}: plate under focus`).toEqual(hover);
    expect(stop.opacity, `${stop.control}: the focused control is faded`).toBeGreaterThanOrEqual(0.9);
  }
});

test("the download link is a 24px target and its arrow does not move", async ({ page }) => {
  await settle(page, PORTRAIT);
  const link = await page.evaluate(() => {
    const a = document.querySelector(".specimen-download");
    const plate = a.closest(".specimen").getBoundingClientRect();
    const box = a.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(a);
    const glyph = range.getBoundingClientRect();
    return { width: box.width, height: box.height, left: glyph.left - plate.left, bottom: plate.bottom - glyph.bottom };
  });
  expect(link.width).toBeGreaterThanOrEqual(24);
  expect(link.height).toBeGreaterThanOrEqual(24);
  // Where the arrow sat before the hit area grew: 0.5rem from the plate's left and
  // about 10px up. The height of the glyph's box depends on the typeface (10.0 in
  // Plex, 11.3 in the fallback this suite runs in), so allow 2px either way; padding
  // that moved the arrow would move it by 4px or more.
  expect(link.left).toBeCloseTo(8, 0);
  expect(link.bottom).toBeGreaterThan(8);
  expect(link.bottom).toBeLessThan(12);
});

test("an empty search field has no invisible clear button in the Tab order", async ({ page }) => {
  await settle(page, "/search/");
  const input = page.locator(".pagefind-ui__search-input");
  await input.focus();
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.activeElement.matches(".pagefind-ui__search-clear"))).toBe(false);

  await input.fill("loom");
  await input.focus();
  await page.keyboard.press("Tab");
  const clear = await page.evaluate(() => {
    const e = document.activeElement;
    return { isClear: e.matches(".pagefind-ui__search-clear"), opacity: getComputedStyle(e).opacity };
  });
  expect(clear).toEqual({ isClear: true, opacity: "1" });

  // Clearing hides the button, so focus has to go back to the field.
  await page.keyboard.press("Enter");
  await expect(input).toHaveValue("");
  await expect(input).toBeFocused();
});

test("the accident keeps its colour; a linked one signals with the bloom underline", async ({ page }) => {
  await settle(page, "/");
  const line = page.locator(".core-question .line.accident").first();
  const colour = () => line.evaluate(e => getComputedStyle(e).color);
  const atRest = await colour();
  await line.hover();
  expect(await colour()).toBe(atRest);

  await settle(page, "/making/");
  const link = page.locator("a.accident").first();
  await link.focus();
  await page.keyboard.press("Shift");
  const focused = await link.evaluate(e => {
    const s = getComputedStyle(e);
    const bloom = getComputedStyle(document.documentElement).getPropertyValue("--bloom").trim();
    const probe = document.createElement("span");
    probe.style.color = bloom;
    document.body.append(probe);
    const bloomRgb = getComputedStyle(probe).color;
    probe.remove();
    return { line: s.textDecorationLine, colour: s.textDecorationColor, bloomRgb, text: s.color };
  });
  expect(focused.line).toBe("underline");
  expect(focused.colour).toBe(focused.bloomRgb);
  expect(focused.text).toBe(atRest);
});

test("on a touch screen the glow stays away and plate numbers are shown", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, baseURL });
  const page = await context.newPage();
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("https://fonts.gstatic.com/**", route => route.abort());
  await page.route("**/_vercel/insights/**", route => route.abort());

  await settle(page, "/thinking/");
  await page.evaluate(() => document.addEventListener("click", event => event.preventDefault(), true));
  await page.touchscreen.tap(195, 420);
  expect(await page.evaluate(() => getComputedStyle(document.querySelector(".bloom-cursor")).opacity)).toBe("0");

  await settle(page, "/making/");
  const shown = await page.evaluate(() => [...document.querySelectorAll(".specimen-num")].map(n => getComputedStyle(n).opacity));
  expect(shown.length).toBeGreaterThan(0);
  expect(new Set(shown)).toEqual(new Set(["1"]));
  await context.close();
});
