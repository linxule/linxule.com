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
