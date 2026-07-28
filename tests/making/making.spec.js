import { expect, test } from "@playwright/test";

const epsilon = 1.5;

async function makingState(page) {
  return page.evaluate(() => {
    const book = document.getElementById("making-book");
    const nav = document.getElementById("book-nav");
    const hint = document.getElementById("scroll-hint");
    return {
      bodyOverflow: getComputedStyle(document.body).overflow,
      bookHeight: book.getBoundingClientRect().height,
      bookOverflowY: getComputedStyle(book).overflowY,
      bookScrollHeight: book.scrollHeight,
      navDisplay: getComputedStyle(nav).display,
      hintDisplay: getComputedStyle(hint).display,
      viewportHeight: innerHeight,
    };
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/making/");
  await page.evaluate(() => {
    sessionStorage.removeItem("making-scroll-position");
    sessionStorage.removeItem("making-scroll-target");
  });
  await page.reload();
});

test("breakpoint contract matches the reading mode", async ({ page }, testInfo) => {
  const state = await makingState(page);
  const { width, height } = testInfo.project.use.viewport;
  const bookMode = width >= 901 && height >= 700;

  if (!bookMode) {
    expect(state.bodyOverflow).not.toBe("hidden");
    expect(state.bookOverflowY).toBe("visible");
    expect(state.bookHeight).toBeGreaterThan(state.viewportHeight);
    expect(state.navDisplay).toBe("none");
    expect(state.hintDisplay).toBe("none");
  } else {
    expect(state.bodyOverflow).toBe("hidden");
    expect(state.bookOverflowY).toBe("scroll");
    expect(Math.abs(state.bookHeight - state.viewportHeight)).toBeLessThanOrEqual(epsilon);
    expect(state.bookScrollHeight).toBeGreaterThan(state.bookHeight);
    expect(state.navDisplay).not.toBe("none");
  }
});

test("ordinary spreads do not clip their text or specimens", async ({ page }, testInfo) => {
  const { width, height } = testInfo.project.use.viewport;
  test.skip(width < 901 || height < 700, "normal-flow mode does not clip spreads");

  const failures = await page.evaluate((allowedError) => {
    const outside = (inner, outer) =>
      inner.top < outer.top - allowedError ||
      inner.bottom > outer.bottom + allowedError ||
      inner.left < outer.left - allowedError ||
      inner.right > outer.right + allowedError;

    return [...document.querySelectorAll(".spread")]
      .map((spread) => {
        const specimens = spread.querySelector(".spread-specimens");
        const specimenCount = specimens?.querySelectorAll(".specimen").length || 0;
        if (specimenCount > 4) return null;

        const spreadRect = spread.getBoundingClientRect();
        const specimensRect = specimens?.getBoundingClientRect();
        const children = [
          spread.querySelector(".spread-text"),
          specimens,
        ].filter(Boolean);
        const outsideSpread = children
          .filter((child) => outside(child.getBoundingClientRect(), spreadRect))
          .map((child) => child.className);
        const specimenItems = [...spread.querySelectorAll(".specimen")];
        const outsideSpecimens = specimensRect
          ? specimenItems
              .filter((item) => outside(item.getBoundingClientRect(), specimensRect))
              .map((item) => item.className)
          : [];
        const specimensOverflow =
          specimens &&
          (specimens.scrollHeight > specimens.clientHeight + allowedError ||
            specimens.scrollWidth > specimens.clientWidth + allowedError);
        if (!outsideSpread.length && !outsideSpecimens.length && !specimensOverflow) {
          return null;
        }

        return {
          title:
            spread.querySelector(".spread-title")?.textContent.trim() ||
            spread.id ||
            "header spread",
          specimenCount,
          outsideSpread,
          outsideSpecimens,
          specimensOverflow,
        };
      })
      .filter(Boolean);
  }, epsilon);

  expect(failures).toEqual([]);
});

test("portrait specimen columns honor both their cap and spread bounds", async ({
  page,
}, testInfo) => {
  const { width, height } = testInfo.project.use.viewport;
  test.skip(width < 901 || height < 700, "normal-flow mode removes the cap");

  const failures = await page.evaluate((allowedError) =>
    [...document.querySelectorAll('.spread[data-orientation="portrait"]')]
      .map((spread) => {
        const specimens = spread.querySelector(".spread-specimens");
        const spreadRect = spread.getBoundingClientRect();
        const rect = specimens.getBoundingClientRect();
        return {
          title: spread.querySelector(".spread-title")?.textContent.trim(),
          exceeds65vh: rect.height > innerHeight * 0.65 + allowedError,
          outsideSpread:
            rect.top < spreadRect.top - allowedError ||
            rect.bottom > spreadRect.bottom + allowedError,
        };
      })
      .filter((result) => result.exceeds65vh || result.outsideSpread),
  epsilon);

  expect(failures).toEqual([]);
});

test("self-chiseling four-image spread is fully visible in book mode", async ({
  page,
}, testInfo) => {
  const { width, height } = testInfo.project.use.viewport;
  test.skip(width < 901 || height < 700, "normal-flow mode does not clip spreads");

  const result = await page
    .locator(".spread", { has: page.getByRole("heading", { name: "self-chiseling" }) })
    .evaluate((spread, allowedError) => {
      const spreadRect = spread.getBoundingClientRect();
      const specimens = [...spread.querySelectorAll(".specimen")];
      return {
        count: specimens.length,
        outside: specimens
          .map((specimen) => specimen.getBoundingClientRect())
          .some(
            (rect) =>
              rect.top < spreadRect.top - allowedError ||
              rect.bottom > spreadRect.bottom + allowedError ||
              rect.left < spreadRect.left - allowedError ||
              rect.right > spreadRect.right + allowedError,
          ),
      };
    }, epsilon);

  expect(result).toEqual({ count: 4, outside: false });
});

test("detail-page lightbox infers the clicked image from its source", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "shared lightbox behavior");

  await page.goto(
    "/making/portraits/portraits-2026-06-30-self-chiseling/",
  );
  const trigger = page.locator(".specimen[data-src]").nth(2);
  const expectedSrc = await trigger.getAttribute("data-src");
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();

  await expect(page.locator("#lightbox")).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("#lightbox img")).toHaveAttribute("src", expectedSrc);
  await expect(page.locator(".lightbox-counter")).toHaveText("3 / 4");
});

test(">4-image spread exposes the complete gallery from its visible subset", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "reference desktop gallery behavior");

  const spread = page.locator(".spread", {
    has: page.getByRole("heading", { name: "the unfinished sentence" }),
  });
  const specimens = spread.locator(".specimen");
  await expect(specimens).toHaveCount(4);

  const more = spread.getByRole("button", { name: /View 6 more images/ });
  await more.scrollIntoViewIfNeeded();
  await expect(more).toBeInViewport();
  await more.click();

  await expect(page.locator("#lightbox")).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator(".lightbox-counter")).toHaveText("5 / 10");
  await page.getByRole("button", { name: "Next image" }).click();
  await expect(page.locator(".lightbox-counter")).toHaveText("6 / 10");
  await page.keyboard.press("Escape");
  await expect(more).toBeFocused();
});

test("lightbox preserves internal book scrolling and restores focus", async ({
  page,
}, testInfo) => {
  const { width, height } = testInfo.project.use.viewport;
  test.skip(width < 901 || height < 700, "book-mode containment regression");

  const trigger = page.locator('.spread[data-type="portrait"] .specimen[data-src]').first();
  await trigger.scrollIntoViewIfNeeded();
  const before = await page.locator("#making-book").evaluate((book) => book.scrollTop);
  await trigger.click();

  const lightbox = page.locator("#lightbox");
  await expect(lightbox).toHaveAttribute("aria-hidden", "false");
  const close = page.getByRole("button", { name: "Close lightbox" });
  const next = page.getByRole("button", { name: "Next image" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(next).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(lightbox).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toBeFocused();

  const after = await page.locator("#making-book").evaluate((book) => book.scrollTop);
  expect(Math.abs(after - before)).toBeLessThanOrEqual(epsilon);
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe(
    "hidden",
  );
});

test("semantic targets survive same-mode reload and are discarded across modes", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "cross-mode state test starts at 1440x900");

  const artifact = page.locator(
    '.spread[data-book-target^="artifact:"][data-type="artifact"]',
  ).first();
  const artifactTarget = await artifact.getAttribute("data-book-target");
  await artifact.scrollIntoViewIfNeeded();
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem("making-scroll-target")))
    .toBe(artifactTarget);
  await page.reload();
  await expect(artifact).toBeInViewport();

  await page.locator("#book-nav").getByRole("button", { name: "Tools" }).click();
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem("making-scroll-target")))
    .toBe("tools");
  await page.reload();
  await expect(page.locator("#tools")).toBeInViewport();

  await page.setViewportSize({ width: 900, height: 900 });
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => document.scrollingElement.scrollTop))
    .toBe(0);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  await expect(page.locator("#portraits")).toBeInViewport();
  expect(
    await page.evaluate(() => sessionStorage.getItem("making-scroll-target")),
  ).toBeNull();
});

test("section dots, hint, Tools/footer reachability, and Tools restoration work", async ({
  page,
}, testInfo) => {
  const { width, height } = testInfo.project.use.viewport;
  test.skip(width < 901 || height < 700, "normal flow hides book navigation");

  const book = page.locator("#making-book");
  const hint = page.locator("#scroll-hint");
  await expect(hint).not.toHaveClass(/hidden/);

  await page.locator("#book-nav").getByRole("button", { name: "Artifacts" }).click();
  const artifactsOffset = await page
    .locator("#artifacts")
    .evaluate((target) => target.offsetTop);
  await expect
    .poll(() => book.evaluate((node) => node.scrollTop))
    .toBe(artifactsOffset);
  await expect(
    page.locator("#book-nav").getByRole("button", { name: "Artifacts" }),
  ).toHaveClass(/active/);
  await expect(hint).toHaveClass(/hidden/);

  await page.locator("#book-nav").getByRole("button", { name: "Tools" }).click();
  await expect(
    page.locator("#book-nav").getByRole("button", { name: "Tools" }),
  ).toHaveClass(/active/);
  await expect(page.locator("#tools")).toBeInViewport();
  await expect(page.locator(".page-footer")).toBeInViewport();

  await page.reload();
  await expect(page.locator("#tools")).toBeInViewport();
  expect(await page.evaluate(() => document.scrollingElement.scrollTop)).toBe(0);
});

test("normal flow ignores a saved desktop target", async ({ page }, testInfo) => {
  const { width, height } = testInfo.project.use.viewport;
  test.skip(width >= 901 && height >= 700, "normal-flow restoration contract");

  await page.evaluate(() =>
    sessionStorage.setItem(
      "making-scroll-target",
      "portrait:portraits-2025-11-01-ghost-in-the-circle",
    ),
  );
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => document.scrollingElement.scrollTop))
    .toBe(0);
});
