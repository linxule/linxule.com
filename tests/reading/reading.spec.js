import { expect, test } from "@playwright/test";
import configureEleventy from "../../eleventy.config.js";

const articlePath = "/writing/ghost-in-the-machine/";
const epsilon = 1.5;

// Render edge cases with the site's actual Markdown rules, without rebuilding
// the gallery or inventing the footnote markup this regression should verify.
function renderMarkdown(source, env = {}) {
  let markdown;
  const noop = () => {};
  configureEleventy({
    setLibrary(name, library) { if (name === "md") markdown = library; },
    addPassthroughCopy: noop,
    addCollection: noop,
    addFilter: noop,
    addAsyncFilter: noop,
    addShortcode: noop,
    addAsyncShortcode: noop,
    addTransform: noop,
    on: noop,
  });
  return markdown.render(source, env);
}

async function expectProseWithinViewport(page, selector = ".article-body > p") {
  const geometry = await page.locator(selector).evaluateAll(paragraphs => {
    const clipped = [];
    let textFragments = 0;
    for (const paragraph of paragraphs) {
      const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        if (!walker.currentNode.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(walker.currentNode);
        for (const rect of range.getClientRects()) {
          textFragments += 1;
          if (rect.left < -1.5 || rect.right > innerWidth + 1.5) {
            clipped.push({ text: walker.currentNode.textContent.slice(0, 60), left: rect.left, right: rect.right });
          }
        }
      }
    }
    return { textFragments, clipped: clipped.slice(0, 8) };
  });
  expect(geometry.textFragments).toBeGreaterThan(0);
  expect(geometry.clipped).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("https://fonts.gstatic.com/**", route => route.abort());
  await page.route("**/_vercel/insights/**", route => route.abort());
});

for (const width of [320, 390]) {
  test(`article prose fits a ${width}px phone while its table scrolls independently`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(articlePath);
    await expect(page.locator(".article-body")).toBeVisible();
    const article = await page.locator(".article-container > article").boundingBox();
    expect(article.x).toBeGreaterThanOrEqual(-epsilon);
    expect(article.x + article.width).toBeLessThanOrEqual(width + epsilon);
    await expectProseWithinViewport(page);

    const table = page.locator(".article-body table").first();
    const state = await table.evaluate(element => {
      const scroller = element.closest(".table-scroll") || element;
      const before = document.querySelector(".article-body > p").getBoundingClientRect();
      scroller.scrollLeft = 80;
      const after = document.querySelector(".article-body > p").getBoundingClientRect();
      const rect = scroller.getBoundingClientRect();
      return {
        clientWidth: scroller.clientWidth, scrollWidth: scroller.scrollWidth,
        scrollLeft: scroller.scrollLeft, pageScrollX: scrollX,
        left: rect.left, right: rect.right,
        paragraphShift: after.left - before.left,
      };
    });
    expect(state.scrollWidth).toBeGreaterThan(state.clientWidth);
    expect(state.scrollLeft).toBeGreaterThan(0);
    expect(state.pageScrollX).toBe(0);
    expect(state.left).toBeGreaterThanOrEqual(-epsilon);
    expect(state.right).toBeLessThanOrEqual(width + epsilon);
    expect(state.paragraphShift).toBe(0);
  });

  test(`long code and inline links stay readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const longUrl = `https://example.com/${"unbroken-path-segment".repeat(20)}`;
    const fixture = renderMarkdown([
      `<p id="long-inline-link"><a href="${longUrl}">${longUrl}</a></p>`,
      "", "```text", `command ${"unbroken_argument_".repeat(40)}`, "```",
    ].join("\n"));
    await page.route(`**${articlePath}`, async route => {
      const response = await route.fetch();
      const body = (await response.text()).replace(
        '<div class="article-body">',
        `<div class="article-body"><section id="reading-width-fixture">${fixture}</section>`,
      );
      await route.fulfill({ response, body });
    });
    await page.goto(articlePath);
    await expectProseWithinViewport(page, "#long-inline-link");
    const code = page.locator("#reading-width-fixture pre");
    const state = await code.evaluate(element => {
      element.scrollLeft = 100;
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left, right: rect.right,
        scrollWidth: element.scrollWidth, clientWidth: element.clientWidth,
        scrollLeft: element.scrollLeft, pageScrollX: scrollX,
      };
    });
    expect(state.left).toBeGreaterThanOrEqual(-epsilon);
    expect(state.right).toBeLessThanOrEqual(width + epsilon);
    expect(state.scrollWidth).toBeGreaterThan(state.clientWidth);
    expect(state.scrollLeft).toBeGreaterThan(0);
    expect(state.pageScrollX).toBe(0);
  });
}

for (const width of [390, 1100, 1440]) {
  test(`footnotes preserve the reading journey at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(articlePath);
    const reference = page.locator(".article-body .fn-ref").first();
    const referenceId = await reference.getAttribute("id");
    const noteId = (await reference.getAttribute("href")).slice(1);
    expect(referenceId).toBeTruthy();
    const note = page.locator(`[id="${noteId}"]`);
    const back = note.locator(`.fn-backref[href="#${referenceId}"]`);
    await expect(back).toHaveAttribute("aria-label", /^Return to reference 1(?: \(1\))?$/);

    if (width <= 1100) {
      await reference.click();
      await expect(page).toHaveURL(new RegExp(`#${noteId}$`));
      await expect(back).toBeVisible();
      await expect(back).toContainText("return to text");
      await back.click();
      await expect(page).toHaveURL(new RegExp(`#${referenceId}$`));
      await expect(reference).toBeFocused();
      await expect(reference).toBeInViewport();
    } else {
      await expect(back).toBeHidden();
      await expect(note).toHaveClass(/positioned/);
      const geometry = await note.evaluate(element => ({
        position: getComputedStyle(element).position,
        left: element.getBoundingClientRect().left,
        bodyRight: document.querySelector(".article-body").getBoundingClientRect().right,
      }));
      expect(geometry.position).toBe("absolute");
      expect(geometry.left).toBeGreaterThan(geometry.bodyRight);
    }
  });
}

test("repeated footnotes return to the selected reference", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const fixture = renderMarkdown([
    "First passage.[^shared]", "", "Second passage.[^shared]", "",
    "[^shared]: One note shared by both passages.",
  ].join("\n"), { docId: "reading-fixture" });
  await page.route(`**${articlePath}`, async route => {
    const response = await route.fetch();
    const body = (await response.text()).replace(
      '<div class="article-body">',
      `<div class="article-body">${fixture}</div><div hidden>`,
    );
    await route.fulfill({ response, body });
  });
  await page.goto(articlePath);
  const references = page.locator(".article-body .fn-ref");
  await expect(references).toHaveCount(2);
  await expect(page.locator(".article-body .margin-note")).toHaveCount(1);
  const ids = await references.evaluateAll(elements => elements.map(element => element.id));
  expect(ids.every(Boolean)).toBe(true);
  expect(new Set(ids).size).toBe(2);
  const targets = await references.evaluateAll(elements => elements.map(element => element.getAttribute("href")));
  expect(targets[0]).toBe(targets[1]);

  for (let index = 0; index < 2; index += 1) {
    const reference = references.nth(index);
    await reference.click();
    const back = page.locator(`.article-body .fn-backref[href="#${ids[index]}"]`);
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute("aria-label", `Return to reference 1 (${index + 1})`);
    await expect(back).toContainText(`return to text ${index + 1}`);
    await back.click();
    expect(new URL(page.url()).hash).toBe(`#${ids[index]}`);
    await expect(reference).toBeFocused();
    await expect(reference).toBeInViewport();
  }
});
