import { expect, test } from '@playwright/test';

test('each stacked portrait opens its own image and keeps its download reachable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.use.viewport.width > 768, 'Stacked portrait layout');
  await page.goto('/making/portraits/portraits-2026-10-13-pure-verb-topology-of-an-instant/');
  const specimens = page.locator('.specimen');
  await expect(specimens).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    const specimen = specimens.nth(i);
    const alt = await specimen.locator('img').getAttribute('alt');
    await specimen.locator('.specimen-lightbox-trigger').click();
    await expect(page.locator('#lightbox')).toHaveAttribute('aria-hidden', 'false');
    await expect(page.locator('#lightbox img')).toHaveAttribute('alt', alt);
    await page.locator('#lightbox img').evaluate(image => image.decode());
    await page.getByRole('button', { name: 'Close lightbox' }).click();
    const download = specimen.getByRole('link', { name: 'Download original' });
    await download.scrollIntoViewIfNeeded();
    // Wait for the lightbox close animation before checking the hit target.
    await download.click({ trial: true });
  }
});

test('tablet (769–1000px) collapses layout-drift into a non-overlapping grid without desktop specificity leak', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Run once from desktop project at tablet width');
  await page.setViewportSize({ width: 850, height: 900 });
  await page.goto('/making/portraits/portraits-2026-06-09-something-in-the-glass/');

  const layout = await page.evaluate(() => {
    const field = document.querySelector('.specimens-field');
    const specimens = [...document.querySelectorAll('.specimens-field .specimen')];
    const rects = specimens.map(el => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, position: getComputedStyle(el).position };
    });
    return {
      fieldDisplay: getComputedStyle(field).display,
      rects,
    };
  });

  expect(layout.fieldDisplay).toBe('grid');
  expect(layout.rects.length).toBeGreaterThanOrEqual(4);
  for (const r of layout.rects) {
    expect(r.position).toBe('relative');
  }
  for (let i = 0; i < layout.rects.length; i++) {
    for (let j = i + 1; j < layout.rects.length; j++) {
      const a = layout.rects[i];
      const b = layout.rects[j];
      const overlaps = a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
      expect(overlaps, `specimen ${i} overlaps specimen ${j} at 850px`).toBe(false);
    }
  }
});
