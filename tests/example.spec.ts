import { test, expect } from '@playwright/test';

// ============================================================================
// Landing Page Tests
// ============================================================================

test.describe('Landing Page', () => {
  test('has correct title and meta description', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CarbonIQ|Carbon Compass/);
  });

  test('displays hero heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { name: /Track Your Carbon/i });
    await expect(heading).toBeVisible();
  });

  test('has navigation with all links', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: /Main navigation/i });
    await expect(nav).toBeVisible();

    await expect(page.getByRole('menuitem', { name: /Home/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /Assessment/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /Dashboard/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /AI Coach/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /Progress/i })).toBeVisible();
  });

  test('can navigate to assessment via CTA button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Calculate My Impact/i }).click();
    await expect(page).toHaveURL(/.*assessment/);
  });

  test('has skip-to-content link', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test('has footer with correct landmark', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
  });

  test('has main content landmark', async ({ page }) => {
    await page.goto('/');
    const main = page.getByRole('main');
    await expect(main).toBeVisible();
  });
});
