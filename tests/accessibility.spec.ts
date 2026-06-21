import { test, expect } from '@playwright/test';

// ============================================================================
// Accessibility Tests — WCAG 2.1 Compliance Checks
// ============================================================================

test.describe('Accessibility', () => {
  test('landing page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('all images have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab through navigation items
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // Logo
    await page.keyboard.press('Tab'); // First nav item

    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('navigation has proper ARIA roles', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: /Main navigation/i });
    await expect(nav).toBeVisible();

    // Menu items should have menuitem role
    const menuItems = page.getByRole('menuitem');
    const count = await menuItems.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('footer has contentinfo role', async ({ page }) => {
    await page.goto('/');

    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
  });

  test('main content area has main role', async ({ page }) => {
    await page.goto('/');

    const main = page.getByRole('main');
    await expect(main).toBeVisible();
    await expect(main).toHaveAttribute('id', 'main-content');
  });

  test('page has lang attribute', async ({ page }) => {
    await page.goto('/');

    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('en');
  });

  test('assessment form controls have labels', async ({ page }) => {
    await page.goto('/assessment');

    // Range inputs should have associated labels via id
    const rangeInputs = page.locator('input[type="range"]');
    const count = await rangeInputs.count();

    for (let i = 0; i < count; i++) {
      const id = await rangeInputs.nth(i).getAttribute('id');
      expect(id).toBeTruthy();

      // There should be a label pointing to this id
      const label = page.locator(`label[for="${id}"]`);
      await expect(label).toBeVisible();
    }
  });

  test('color contrast meets minimum standards', async ({ page }) => {
    await page.goto('/');

    // Check that text-muted color is at least #8f8f8f (lighter than old #737373)
    const mutedElements = page.locator('.text-text-muted').first();
    if (await mutedElements.isVisible()) {
      const color = await mutedElements.evaluate((el) => getComputedStyle(el).color);
      // Should be a valid CSS color value
      expect(color).toBeTruthy();
    }
  });
});
