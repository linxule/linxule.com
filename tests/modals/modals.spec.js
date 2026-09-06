import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', route => route.abort());
  await page.route('https://fonts.gstatic.com/**', route => route.abort());
  await page.route('https://media.linxule.com/**', route => route.abort());
  await page.route('https://www.youtube.com/**', route => route.abort());
  await page.route('**/_vercel/insights/**', route => route.abort());
});

async function expectTabReturnsToClose(page, close, key = 'Tab') {
  let returned = false;
  for (let step = 0; step < 20; step++) {
    await page.keyboard.press(key);
    returned = await close.evaluate(button => document.activeElement === button);
    if (returned) break;
  }
  expect(returned, `${key} leaves the guest and returns to the host close control`).toBe(true);
}

test('slides open with focus, isolate the background, and retain deck keyboard controls', async ({ page }) => {
  await page.goto('/talks/thinking-through-ai-01/');
  const trigger = page.locator('[data-slides-fullscreen]');
  const overlay = page.locator('#slides-lightbox');
  const close = overlay.getByRole('button', { name: 'Close slides' });
  await page.evaluate(() => { document.body.style.overflow = 'auto'; });
  await trigger.click();
  await expect(close).toBeFocused();
  await expect(overlay).toHaveAttribute('aria-hidden', 'false');
  expect(await page.locator('[data-slides-figure]').evaluate(figure => Boolean(figure.closest('[inert]')))).toBe(true);
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  await page.locator('.spine-name').evaluate(link => link.focus());
  await expect(close).toBeFocused();

  const deck = overlay.frameLocator('iframe').locator('deck-stage');
  await expect(deck).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(overlay.locator('iframe')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(overlay.locator('iframe')).toBeFocused();
  const before = await deck.evaluate(stage => stage._index);
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => deck.evaluate(stage => stage._index)).toBe(before + 1);
  await page.keyboard.press('Escape');
  await expect(overlay).toHaveAttribute('aria-hidden', 'true');
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('auto');
  expect(await page.locator('[data-slides-figure]').evaluate(figure => Boolean(figure.closest('[inert]')))).toBe(false);
});

test('slide guest Tab traversal returns to close on repeated opens', async ({ page }) => {
  await page.goto('/talks/thinking-through-ai-01/');
  const overlay = page.locator('#slides-lightbox');
  const close = overlay.getByRole('button', { name: 'Close slides' });
  for (let run = 0; run < 2; run++) {
    await page.locator('[data-slides-fullscreen]').click();
    await expect(close).toBeFocused();
    await expect(overlay.frameLocator('iframe').locator('deck-stage')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(overlay.locator('iframe')).toBeFocused();
    await expectTabReturnsToClose(page, close);
    await close.press('Enter');
    await expect(overlay).toHaveAttribute('aria-hidden', 'true');
  }
});

test('opaque script-free video keeps its sandbox and has a keyboard exit', async ({ page }) => {
  await page.goto('/making/artifacts/artifact-2026-08-13-still-thinking/');
  const artifact = page.locator('#artifact-display');
  const control = page.locator('#fullscreen-btn');
  const frame = artifact.locator('iframe');
  const video = artifact.frameLocator('iframe').locator('video');
  await expect(video).toBeVisible();
  await expect(frame).toHaveAttribute('sandbox', '');
  expect(await frame.evaluate(iframe => iframe.contentDocument)).toBeNull();
  await page.evaluate(() => { document.body.style.overflow = 'auto'; });
  await control.click();
  await expect(control).toBeFocused();
  await expect(artifact).toHaveAttribute('role', 'dialog');
  await expect(artifact).toHaveAttribute('aria-modal', 'true');
  await expect(page.locator('#artifact-keyboard-hint')).toBeVisible();
  await page.keyboard.press('Shift+Tab');
  await expect(control).toBeFocused();
  // The script-free player is still a guest document when media is unavailable
  // and none of its native controls are focusable.
  await frame.focus();
  await expect(frame).toBeFocused();
  // Keys in this opaque document cannot bubble to the host. The browser's
  // sequential focus navigation crosses that boundary without any new grants.
  await expectTabReturnsToClose(page, control);
  await frame.focus();
  await expectTabReturnsToClose(page, control, 'Shift+Tab');
  await control.press('Enter');
  await expect(control).toHaveAttribute('aria-expanded', 'false');
  await expect(control).toBeFocused();
  await expect(artifact).not.toHaveAttribute('role', 'dialog');
  await expect(frame).toHaveAttribute('sandbox', '');
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('auto');
});

test('image gallery traps focus, returns to its plate, and preserves existing inert state', async ({ page }) => {
  await page.goto('/making/artifacts/artifact-2026-08-08-hortus-machinarum/');
  const plate = page.locator('.artifact-gallery-item').first();
  const overlay = page.locator('#artifact-gallery-fullscreen');
  const close = overlay.getByRole('button', { name: 'Close expanded view' });
  await page.evaluate(() => {
    document.body.style.overflow = 'auto';
    document.querySelector('.spine-name').inert = true;
  });
  await plate.press('Enter');
  await expect(close).toBeFocused();
  await expect(page.locator('#gallery-keyboard-hint')).toBeHidden();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(overlay).toHaveAttribute('aria-hidden', 'true');
  await expect(plate).toBeFocused();
  await expect(page.locator('.spine-name')).toHaveJSProperty('inert', true);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('auto');
});
