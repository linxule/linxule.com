import { expect, test } from "@playwright/test";

const articlePath = "/writing/ai-whispers-01-context-setting-primers/";

test.beforeEach(async ({ page }) => {
  // Browser regressions should not depend on third-party fonts or analytics.
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  await page.route("https://fonts.gstatic.com/**", route => route.abort());
  await page.route("**/_vercel/insights/**", route => route.abort());
});

test("external links retain their semantic relationships", async ({ page }) => {
  await page.goto(articlePath);
  const license = page.locator('.article-license a');
  await expect(license).toHaveAttribute("target", "_blank");
  const relationships = await license.evaluate(link => [...link.relList]);
  expect(relationships).toEqual(expect.arrayContaining(["license", "noopener", "noreferrer"]));
});

test("external link classification compares URL origins", async ({ page, baseURL }) => {
  const { hostname, origin } = new URL(baseURL);
  await page.route(`**${articlePath}`, async route => {
    const response = await route.fetch();
    const body = (await response.text()).replace("<body>", `<body>
      <nav aria-label="Link classification fixture">
        <a id="external-query" href="https://example.com/?source=${hostname}" rel="author">External query</a>
        <a id="external-port" href="http://${hostname}:1/">Different port</a>
        <a id="protocol-relative" href="//example.com/">Protocol relative</a>
        <a id="same-origin" href="${origin}/writing/">Same origin</a>
      </nav>`);
    await route.fulfill({ response, body });
  });
  await page.goto(articlePath);
  for (const id of ["external-query", "external-port", "protocol-relative"]) {
    await expect(page.locator(`#${id}`)).toHaveAttribute("target", "_blank");
  }
  expect(await page.locator("#external-query").evaluate(link => [...link.relList]))
    .toEqual(expect.arrayContaining(["author", "noopener", "noreferrer"]));
  await expect(page.locator("#same-origin")).not.toHaveAttribute("target", "_blank");
});

test("unavailable session storage does not break reading or navigation", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      get() { throw new DOMException("Storage is unavailable", "SecurityError"); },
    });
  });
  await page.goto(articlePath);
  await expect(page.locator(".article-body")).toBeVisible();
  await page.locator('.article-footer a[href="/writing/"]').click();
  await expect(page).toHaveURL(/\/writing\/$/);
  expect(errors).toEqual([]);
});

test("returning from an article restores and consumes the writing index position", async ({ page }) => {
  await page.goto("/writing/");
  const articleLink = page.locator(`.entry-link[href="${articlePath}"]`);
  await articleLink.evaluate(link => link.scrollIntoView({ block: "center", behavior: "instant" }));
  const position = await page.evaluate(() => window.scrollY);
  expect(position).toBeGreaterThan(100);

  await articleLink.click();
  await expect(page).toHaveURL(new RegExp(`${articlePath}$`));
  const savedPosition = await page.evaluate(() => Number(sessionStorage.getItem("scrollPos_/writing/")));
  expect(Math.abs(savedPosition - position)).toBeLessThanOrEqual(2);

  await page.locator('.article-footer a[href="/writing/"]').click();
  await expect(page).toHaveURL(/\/writing\/$/);
  await expect.poll(async () => Math.abs(await page.evaluate(() => window.scrollY) - position))
    .toBeLessThanOrEqual(2);
  expect(await page.evaluate(() => sessionStorage.getItem("scrollPos_/writing/"))).toBeNull();
});

test("article lightbox contains keyboard focus and restores the reading state", async ({ page }) => {
  await page.goto(articlePath);
  const image = page.locator(".article-body img").first();
  const lightbox = page.locator("#article-lightbox");
  const close = lightbox.getByRole("button", { name: "Close lightbox" });
  // Largest generated WebP, not the original named by data-full-src.
  const expectedSource = await image.evaluate((img) => {
    const srcset = img.closest("picture")?.querySelector('source[type="image/webp"]')?.srcset || img.srcset;
    if (!srcset) return img.dataset.fullSrc || img.src;
    return srcset.split(",").map((c) => c.trim().split(/\s+/))
      .sort((a, b) => parseInt(b[1]) - parseInt(a[1]))[0][0];
  });
  await page.evaluate(() => { document.body.style.overflow = "auto"; });
  await image.focus();
  await image.press("Enter");
  await expect(lightbox).toHaveAttribute("aria-hidden", "false");
  await expect(lightbox.locator("img")).toHaveAttribute("src", expectedSource);
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(close).toBeFocused();
  await page.locator(".spine-name").evaluate(link => link.focus());
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(lightbox).toHaveAttribute("aria-hidden", "true");
  await expect(image).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("auto");
  await page.locator(".spine-name").evaluate(link => link.focus());
  await expect(page.locator(".spine-name")).toBeFocused();
});

test("article images inside links preserve normal link navigation", async ({ page }) => {
  await page.route(`**${articlePath}`, async route => {
    const response = await route.fetch();
    const body = (await response.text()).replace("<body>", `<body>
      <div class="article-body">
        <a id="linked-image" href="/writing/" aria-label="Linked illustration">
          <img width="40" height="40" alt="Linked illustration" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3C/svg%3E">
        </a>
      </div>`);
    await route.fulfill({ response, body });
  });
  await page.goto(articlePath);
  await expect(page.locator("#linked-image img")).not.toHaveAttribute("role", "button");
  await expect(page.locator("#linked-image img")).not.toHaveAttribute("tabindex", "0");
  await page.locator("#linked-image").focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/writing\/$/);
});

test("Pagefind search loads its index and opens a matching article", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/search/");
  await page.locator("#search .pagefind-ui__search-input").fill("Polanyi");
  const result = page.locator('#search .pagefind-ui__result-link[href="/writing/loom-xvii-the-polanyi-inversion/"]');
  await expect(result).toBeVisible();
  await expect(result).toContainText("The Polanyi Inversion");
  await result.click();
  await expect(page).toHaveURL(/\/writing\/loom-xvii-the-polanyi-inversion\/$/);
  await expect(page.locator(".article-title")).toHaveText("LOOM XVII: The Polanyi Inversion");
  expect(errors).toEqual([]);
});
