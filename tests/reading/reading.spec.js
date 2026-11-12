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

test("bare domains and email addresses retain their existing links", () => {
  const html = renderMarkdown("Visit claude.ai or mail name@example.org.");
  expect(html).toContain('<a href="http://claude.ai">claude.ai</a>');
  expect(html).toContain('<a href="mailto:name@example.org">name@example.org</a>');
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

// Notes are placed by least squares around their references, 12px apart and
// never more than 120px above one. How far a note ends up from its reference
// depends on where the lines break, so on the typeface (this suite aborts the
// web fonts), and a pixel limit tuned on one face fails on another. These are
// the promises that hold in any face:
// - no note overlaps the one before it or sits more than 120px above its reference;
// - a note sits below its reference only when the note before it forces it
//   there, so it is exactly one gap under that note;
// - a run of touching notes centres on its references: its mean offset is not
//   above zero, unless a note in it is held at the 120px limit or the run is
//   pinned to the top of the article.
// The old push-down placement passes the first two and fails the third: every
// crowded run sat entirely at or below its references.
const NOTE_GAP = 12;
const MAX_RISE = 120;

const readNotes = page => page.locator(".article-body .margin-note").evaluateAll(elements => {
  const article = document.querySelector(".article-body").getBoundingClientRect();
  return elements.map(note => {
    const box = note.getBoundingClientRect();
    const reference = document.querySelector(`.article-body .fn-ref[href="#${note.id}"]`).getBoundingClientRect();
    return { id: note.id, top: box.top, bottom: box.bottom, fromTop: box.top - article.top, offset: box.top - reference.top };
  });
});

// Notes are placed at once and again on every resize, so measure after the
// fonts have settled and the observer has had a frame to answer the last swap.
async function settled(page) {
  await expect(page.locator(".article-body .margin-note:not(.positioned)")).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready.then(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)))));
}

function expectBeside(notes) {
  expect(notes.length).toBeGreaterThan(20);
  const overlaps = notes.slice(1).filter((note, index) => note.top < notes[index].bottom - epsilon);
  expect(overlaps.map(note => note.id)).toEqual([]);
  expect(Math.min(...notes.map(note => note.offset))).toBeGreaterThanOrEqual(-MAX_RISE - epsilon);

  const touching = notes.map((note, index) => index > 0 && note.top - notes[index - 1].bottom <= NOTE_GAP + epsilon);
  const unforced = notes.filter((note, index) => note.offset > epsilon && !touching[index]);
  expect(unforced.map(note => note.id), "below their reference with nothing above forcing them").toEqual([]);

  const runs = [];
  notes.forEach((note, index) => (touching[index] ? runs.at(-1).push(note) : runs.push([note])));
  expect(runs.some(run => run.length > 1), "the essay still has a crowded run to test").toBe(true);
  const sunk = runs.filter(run => run.length > 1
    && run[0].fromTop > epsilon
    && run.every(note => note.offset > -MAX_RISE + epsilon)
    && run.reduce((sum, note) => sum + note.offset, 0) / run.length > epsilon);
  expect(sunk.map(run => `${run[0].id}..${run.at(-1).id}`), "runs sitting below their references on average").toEqual([]);
}

for (const width of [1280, 1440]) {
  test(`margin notes stay beside their references without overlapping at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(articlePath);
    await settled(page);
    expectBeside(await readNotes(page));
  });
}

// A late font swap, an image without reserved height or an opened <details>
// moves every reference below it after the notes were placed. Without
// re-placement each note would sit 300px above its reference here.
test("margin notes follow their references when the article grows after load", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(articlePath);
  await settled(page);
  const before = await readNotes(page);
  await page.evaluate(() => {
    const block = document.createElement("div");
    block.style.height = "300px";
    const first = document.querySelector(".article-body .fn-ref").closest(".article-body > *");
    first.before(block);
  });
  await expect.poll(async () => (await readNotes(page))[0].top - before[0].top).toBeGreaterThan(300 - MAX_RISE);
  expectBeside(await readNotes(page));
});

// A lone column is centred; a column with margin notes keeps room for them.
// The centring is one rule in writing.njk. Deleting it from the live
// stylesheet and comparing every element's box shows what it changes: nothing
// on an essay with notes, and nothing on either kind at 1100px and below.
const notelessPath = "/writing/epistemic-voids-03-mechanism-literalism/";

const layout = page => page.evaluate(() => [...document.body.querySelectorAll("*")].map(element => {
  const box = element.getBoundingClientRect();
  return `${element.tagName} ${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.width.toFixed(1)} ${box.height.toFixed(1)}`;
}).join("\n"));

const dropCentring = page => page.evaluate(() => {
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; } // a cross-origin font sheet
    for (const group of rules) {
      const inner = group.cssRules ? [...group.cssRules] : [];
      const index = inner.findIndex(rule => rule.selectorText?.includes(":has(.margin-note)"));
      if (index >= 0) { group.deleteRule(index); return true; }
    }
  }
  return false;
});

async function changedByCentring(page) {
  await settled(page);
  const withRule = await layout(page);
  expect(await dropCentring(page), "the centring rule is in the page").toBe(true);
  await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
  return withRule !== (await layout(page));
}

for (const width of [1280, 1440, 1920]) {
  test(`an essay without notes is centred in the window at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(notelessPath);
    await expect(page.locator(".article-body .margin-note")).toHaveCount(0);
    await settled(page);
    const column = await page.evaluate(() => {
      const box = document.querySelector("article").getBoundingClientRect();
      return { left: box.left, right: document.documentElement.clientWidth - box.right };
    });
    expect(Math.abs(column.left - column.right), `margins ${column.left} and ${column.right}`).toBeLessThanOrEqual(1);
  });

  test(`an essay with notes keeps its layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(articlePath);
    expect(await changedByCentring(page)).toBe(false);
  });
}

for (const width of [390, 820, 1024, 1100]) {
  test(`centring changes nothing at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [articlePath, notelessPath]) {
      await page.goto(path);
      expect(await changedByCentring(page), path).toBe(false);
    }
  });
}

// An image narrower than the figure measure is centred on the text column; a
// full-width one keeps the figure bleed. seam-01 has both, each followed by an
// italic caption in the image's own paragraph, which must sit below its image.
// Phones keep the inline flow, where every image starts at the bleed.
const imagePath = "/writing/seam-01-the-seventy-percent/";

const readImages = page => page.evaluate(async () => {
  const body = document.querySelector(".article-body");
  const images = [...body.querySelectorAll("img")].filter(image => !image.closest("blockquote"));
  images.forEach(image => { image.loading = "eager"; });
  await Promise.all(images.map(image => image.decode().catch(() => {})));
  const column = body.getBoundingClientRect();
  // --bleed is a calc() of other tokens; a probe resolves it to pixels.
  const probe = body.appendChild(document.createElement("div"));
  probe.style.width = "var(--bleed)";
  const bleed = probe.getBoundingClientRect().width;
  probe.remove();
  if (!(bleed > 0)) throw new Error(`--bleed resolved to ${bleed}`);
  return { bleed, columnWidth: column.width, images: images.map(image => {
    const box = image.getBoundingClientRect();
    const caption = image.closest("p")?.querySelector(":scope > em");
    return {
      width: box.width, left: box.left - column.left, right: column.right - box.right,
      bottom: box.bottom, captionTop: caption ? caption.getClientRects()[0].top : null,
    };
  }) };
});

for (const width of [820, 1280]) {
  test(`a narrow image is centred on the text column at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(imagePath);
    const { bleed, columnWidth, images } = await readImages(page);
    const narrow = images.filter(image => image.width < columnWidth + 2 * bleed - 1);
    const wide = images.filter(image => !narrow.includes(image));
    expect(narrow.length, "seam-01 has a narrow image").toBeGreaterThan(0);
    expect(wide.length, "seam-01 has a full-width image").toBeGreaterThan(0);
    for (const image of narrow) expect(Math.abs(image.left - image.right)).toBeLessThanOrEqual(1);
    for (const image of wide) expect(Math.abs(image.left + bleed)).toBeLessThanOrEqual(1);
    for (const image of images.filter(image => image.captionTop !== null)) {
      expect(image.captionTop, "the caption starts below its image").toBeGreaterThanOrEqual(image.bottom);
    }
  });
}

test("images keep the inline flow on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(imagePath);
  const { bleed, images } = await readImages(page);
  for (const image of images) expect(Math.abs(image.left + bleed)).toBeLessThanOrEqual(1);
});

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
