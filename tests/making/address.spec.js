import { expect, test } from "@playwright/test";

// Every page of the two scroll books has an address. On 2026-11-12 only three
// of /making's 64 spreads could be linked to (#portraits, #artifacts, #tools);
// a portrait and an artifact share two slugs, so ids are the data-book-target
// ("artifact:unfinished-light"). These check that a link names one spread,
// opens it, follows the book as it turns, and lands where it points on a phone.

const STORAGE_KEY = "making-scroll-target";

test.beforeEach(async ({ page }) => {
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("https://fonts.gstatic.com/**", route => route.abort());
  await page.route("**/_vercel/insights/**", route => route.abort());
});

const isBookMode = ({ width, height }) => width >= 901 && height >= 700;

// Arrive from another page, so the fragment is a fresh load, not a same-document jump.
async function arrive(page, path) {
  await page.goto("/thinking/");
  await page.goto(path);
  await page.waitForLoadState("load");
}

function bookOffsetOf(page, id) {
  return page.evaluate(id => {
    const book = document.getElementById("making-book") || document.getElementById("writing-book");
    return { scrollTop: Math.round(book.scrollTop), offsetTop: Math.round(document.getElementById(id).offsetTop) };
  }, id);
}

async function expectBookAt(page, id) {
  await expect.poll(async () => {
    const { scrollTop, offsetTop } = await bookOffsetOf(page, id);
    return Math.abs(scrollTop - offsetTop);
  }, { message: `book should rest on ${id}` }).toBeLessThanOrEqual(1);
}

test("every spread has a unique id equal to its target", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "the markup is the same at every size");
  for (const path of ["/making/", "/writing/series/loom/"]) {
    await page.goto(path);
    const report = await page.evaluate(() => {
      const spreads = [...document.querySelectorAll("#making-book > section, #writing-book > section")];
      const ids = [...document.querySelectorAll("[id]")].map(e => e.id);
      return {
        spreads: spreads.length,
        missing: spreads.filter(s => !s.id || s.id !== s.dataset.bookTarget).map(s => s.dataset.spread),
        duplicates: ids.filter((id, i) => ids.indexOf(id) !== i),
        resolves: spreads.every(s => document.getElementById(s.id) === s),
      };
    });
    expect(report.spreads, path).toBeGreaterThan(3);
    expect(report.missing, path).toEqual([]);
    expect(report.duplicates, path).toEqual([]);
    expect(report.resolves, path).toBe(true);
  }
});

test("a deep link wins over the saved place; a reload keeps the newer place", async ({ page }, testInfo) => {
  test.skip(!isBookMode(testInfo.project.use.viewport), "the saved place is a book-mode feature");
  await page.goto("/making/");
  const [portrait, artifact] = await page.evaluate(() => [
    document.querySelectorAll('#making-book > section[id^="portrait:"]')[5].id,
    document.querySelectorAll('#making-book > section[id^="artifact:"]')[3].id,
  ]);
  await page.evaluate(key => sessionStorage.setItem(key, "tools"), STORAGE_KEY);

  await arrive(page, `/making/#${portrait}`);
  await expectBookAt(page, portrait);
  await expect.poll(() => page.evaluate(key => sessionStorage.getItem(key), STORAGE_KEY)).toBe(portrait);

  // Turn to another spread, then reload at once, before or after the address
  // catches up: either way the reader comes back to where the book was left.
  await page.evaluate(id => {
    document.getElementById("making-book").scrollTo({ top: document.getElementById(id).offsetTop, behavior: "instant" });
  }, artifact);
  await expect.poll(() => page.evaluate(key => sessionStorage.getItem(key), STORAGE_KEY)).toBe(artifact);
  await page.reload();
  await page.waitForLoadState("load");
  await expectBookAt(page, artifact);
});

test("the address follows the book without adding history", async ({ page }, testInfo) => {
  test.skip(!["desktop", "book-entry"].includes(testInfo.project.name), "one wide and one minimal book");
  await page.goto("/thinking/");
  await page.goto("/making/");
  const before = await page.evaluate(() => history.length);
  const ids = await page.evaluate(() => [...document.querySelectorAll("#making-book > section")].map(s => s.id));
  for (const id of [ids[2], ids[30], ids.at(-1)]) {
    await page.evaluate(id => {
      document.getElementById("making-book").scrollTo({ top: document.getElementById(id).offsetTop, behavior: "instant" });
    }, id);
    await expect.poll(() => page.evaluate(() => decodeURIComponent(location.hash))).toBe(`#${id}`);
  }
  await page.evaluate(() => document.getElementById("making-book").scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => location.hash)).toBe("");
  expect(await page.evaluate(() => history.length)).toBe(before);

  await page.goBack();
  await expect(page).toHaveURL(/\/thinking\/?$/);
});

test("the series book takes deep links and keeps its address", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "one book-mode size is enough for the series book");
  await page.goto("/writing/series/loom/");
  const ids = await page.evaluate(() => [...document.querySelectorAll("#writing-book > section")].map(s => s.id));
  await arrive(page, `/writing/series/loom/#${ids[3]}`);
  await expectBookAt(page, ids[3]);
  const before = await page.evaluate(() => history.length);
  await page.evaluate(id => {
    document.getElementById("writing-book").scrollTo({ top: document.getElementById(id).offsetTop, behavior: "instant" });
  }, ids[6]);
  await expect.poll(() => page.evaluate(() => decodeURIComponent(location.hash))).toBe(`#${ids[6]}`);
  expect(await page.evaluate(() => history.length)).toBe(before);
});

// In normal flow a portrait plate's <picture> used to shrink to the zero width
// of its not-yet-loaded lazy image, so every spread above a deep link was short
// by its images and the page grew under the reader after the jump.
async function expectLandsOn(page, hashes) {
  const zero = await page.evaluate(() =>
    [...document.querySelectorAll("#making-book img")].filter(i => !i.complete && i.getBoundingClientRect().height < 1).length);
  expect(zero, "unloaded specimens with no reserved size").toBe(0);
  for (const hash of hashes) {
    await arrive(page, `/making/#${hash}`);
    await page.waitForTimeout(1500);
    const top = await page.evaluate(id => document.getElementById(id).getBoundingClientRect().top, hash);
    expect(Math.abs(top), `#${hash} should sit at the top after images above it load`).toBeLessThanOrEqual(2);
  }
}

test("a deep link in normal flow lands on its spread", async ({ page }, testInfo) => {
  test.skip(isBookMode(testInfo.project.use.viewport), "book mode scrolls the book, not the page");
  await page.goto("/making/");
  const deep = await page.evaluate(() => document.querySelectorAll('#making-book > section[id^="artifact:"]')[10].id);
  await expectLandsOn(page, ["artifacts", deep]);
});

test("a deep link on a phone lands on its spread", async ({ browser, baseURL }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "runs once, in its own phone context");
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, baseURL });
  const page = await context.newPage();
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("https://fonts.gstatic.com/**", route => route.abort());
  await page.route("**/_vercel/insights/**", route => route.abort());
  await page.goto("/making/");
  const deep = await page.evaluate(() => document.querySelectorAll('#making-book > section[id^="artifact:"]')[10].id);
  await expectLandsOn(page, ["artifacts", deep]);
  await context.close();
});

test("the opening spread lists the book's parts", async ({ page }, testInfo) => {
  await page.goto("/making/");
  const contents = page.locator("#portraits .book-contents");
  await expect(contents).toBeVisible();
  const report = await page.evaluate(() => {
    const nav = document.querySelector("#portraits .book-contents");
    const links = [...nav.querySelectorAll("a")].map(a => a.getAttribute("href"));
    const counts = [...nav.querySelectorAll(".c-count")].map(c => c.textContent.trim());
    const book = document.getElementById("making-book");
    const home = nav.closest("#making-book > section");
    return {
      links,
      unresolved: links.filter(h => h.startsWith("#") && !document.getElementById(h.slice(1))),
      // A link to the spread the reader is already on does nothing in book mode.
      toItsOwnSpread: links.filter(h => h.startsWith("#") && document.getElementById(h.slice(1)) === home),
      firstPortrait: book.querySelector(':scope > section[id^="portrait:"]').id,
      counts,
      portraits: book.querySelectorAll(':scope > section[id^="portrait:"]').length,
      artifacts: book.querySelectorAll(':scope > section[id^="artifact:"]').length,
    };
  });
  expect(report.toItsOwnSpread).toEqual([]);
  expect(report.links[0]).toBe(`#${report.firstPortrait}`);
  expect(report.links).toContain("#artifacts");
  expect(report.links).toContain("#tools");
  expect(report.unresolved).toEqual([]);
  expect(report.counts.slice(0, 2)).toEqual([String(report.portraits), String(report.artifacts)]);

  const box = name => page.locator(`#portraits ${name}`).first().boundingBox();
  const own = await contents.boundingBox();
  const viewport = testInfo.project.use.viewport;
  expect(own.x).toBeGreaterThanOrEqual(0);
  expect(own.x + own.width).toBeLessThanOrEqual(viewport.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);

  if (isBookMode(viewport)) {
    const overlaps = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
    for (const other of [".page-title", ".poem-shape", ".filter-chips", ".header-links", ".section-label"]) {
      expect(overlaps(own, await box(other)), `contents overlaps ${other}`).toBe(false);
    }
    expect(own.y).toBeGreaterThanOrEqual(0);
    expect(own.y + own.height).toBeLessThanOrEqual(viewport.height);
    // The two tracked mono labels, PORTRAITS and CONTENTS, sit level.
    const [left, right] = await Promise.all([box(".section-label"), box(".contents-label")]);
    expect(Math.abs(left.y - right.y), "CONTENTS level with PORTRAITS").toBeLessThanOrEqual(1);
    expect(Math.abs(left.height - right.height)).toBeLessThanOrEqual(1);
  } else {
    expect(own.y, "contents sits under the poem").toBeGreaterThanOrEqual((await box(".poem-shape")).y + (await box(".poem-shape")).height);
    expect(own.y + own.height, "and above the chips").toBeLessThanOrEqual((await box(".filter-chips")).y);
  }

  // Keyboard focus gets the site's own ring, the same as a filter chip's.
  const ring = async selector => {
    const link = page.locator(selector).first();
    await link.focus();
    await page.keyboard.press("Shift");
    return link.evaluate(e => { const s = getComputedStyle(e); return `${s.outlineStyle} ${s.outlineWidth} ${s.outlineOffset}`; });
  };
  expect(await ring("#portraits .book-contents a.c-part")).toBe(await ring("#portraits .filter-chip"));
});

test("the contents works without scripts", async ({ browser, baseURL }, testInfo) => {
  test.skip(!["desktop", "mobile-boundary"].includes(testInfo.project.name), "one book-mode and one flow size");
  const context = await browser.newContext({ viewport: testInfo.project.use.viewport, javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("https://fonts.gstatic.com/**", route => route.abort());
  await page.goto("/making/");
  await page.locator("#portraits .book-contents a.c-part", { hasText: "Artifacts" }).click();
  await expect.poll(() => page.evaluate(() => Math.abs(document.getElementById("artifacts").getBoundingClientRect().top))).toBeLessThanOrEqual(2);
  await context.close();
});
