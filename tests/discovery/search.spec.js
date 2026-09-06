import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', route => route.abort());
  await page.route('https://fonts.gstatic.com/**', route => route.abort());
  await page.route('**/_vercel/insights/**', route => route.abort());
});

test('a filtered search survives a result round trip and a reload', async ({ page }) => {
  await page.goto('/search/');
  const input = page.locator('.pagefind-ui__search-input');
  await input.fill('agency');
  const writing = page.locator('input[type="checkbox"][name="type"][value="writing"]');
  await expect(writing).toBeAttached();
  // Pagefind collapses its filter panel on phones.
  const panel = page.locator('.pagefind-ui__filter-block').filter({ has: writing });
  if (!(await writing.isVisible())) await panel.locator('summary').click();
  await writing.check();
  await expect.poll(() => new URL(page.url()).searchParams.get('q')).toBe('agency');
  await expect.poll(() => new URL(page.url()).searchParams.getAll('filter.type')).toEqual(['writing']);
  const result = page.locator('.pagefind-ui__result-link[href^="/writing/"]').first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(/\/writing\//);
  await page.goBack();
  await expect(input).toHaveValue('agency');
  await expect(writing).toBeChecked();
  await expect(result).toBeVisible();
  await page.reload();
  await expect(input).toHaveValue('agency');
  await expect(writing).toBeChecked();
  await expect(result).toBeVisible();
});

test('shared searches restore multiple filters and use the site highlight palette', async ({ page }) => {
  await page.goto('/search/?q=agency&filter.type=writing&filter.type=paper');
  await expect(page.locator('.pagefind-ui__search-input')).toHaveValue('agency');
  for (const type of ['writing', 'paper']) {
    await expect(page.locator(`input[name="type"][value="${type}"]`)).toBeChecked();
  }
  // Pagefind combines selected types with AND. Restore both faithfully, then
  // remove paper to inspect a result (a page cannot be both types).
  const paper = page.locator('input[name="type"][value="paper"]');
  if (!(await paper.isVisible())) {
    await page.locator('.pagefind-ui__filter-block').filter({ has: paper }).locator('summary').click();
  }
  await paper.uncheck();
  await expect.poll(() => new URL(page.url()).searchParams.getAll('filter.type')).toEqual(['writing']);
  const highlight = page.locator('#search mark').first();
  await expect(highlight).toBeVisible();
  const colors = await highlight.evaluate(element => {
    const style = getComputedStyle(element);
    return { foreground: style.color, background: style.backgroundColor };
  });
  expect(colors.foreground).toBe('rgb(26, 26, 26)');
  expect(colors.background).not.toBe('rgb(255, 255, 0)');
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(pageWidth).toBeLessThanOrEqual(page.viewportSize().width);
  await highlight.scrollIntoViewIfNeeded();
  await page.screenshot({ path: test.info().outputPath('search.png'), fullPage: false });
});

test('clearing search updates its URL and remains cleared on reload', async ({ page }) => {
  await page.goto('/search/?q=agency');
  await expect(page.locator('.pagefind-ui__result-link').first()).toBeVisible();
  await page.locator('.pagefind-ui__search-clear').click();
  await expect(page.locator('.pagefind-ui__search-input')).toHaveValue('');
  await expect.poll(() => new URL(page.url()).searchParams.has('q')).toBe(false);
  await page.reload();
  await expect(page.locator('.pagefind-ui__search-input')).toHaveValue('');
  await page.locator('.pagefind-ui__search-input').fill('agency');
  await page.locator('.pagefind-ui__search-input').press('Escape');
  await expect.poll(() => new URL(page.url()).searchParams.has('q')).toBe(false);
});

test('browse links remain available if the search UI cannot load', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/pagefind/pagefind-ui.js', route => route.abort());
  await page.goto('/search/');
  await expect(page.locator('#search-fallback')).toBeVisible();
  await page.locator('.search-fallback a[href="/papers/"]').click();
  await expect(page).toHaveURL(/\/papers\/$/);
  expect(errors).toEqual([]);
});

test('search has readable navigation without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  try {
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    await page.goto('/search/');
    await expect(page.locator('#search-fallback')).toBeVisible();
    await page.locator('.search-fallback a[href="/making/"]').click();
    await expect(page).toHaveURL(/\/making\/$/);
  } finally {
    await context.close();
  }
});
