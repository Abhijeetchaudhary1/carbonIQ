import { test, expect } from '@playwright/test';

// ============================================================================
// Dashboard Page Tests
// ============================================================================

test.describe('Dashboard Page', () => {
  test('loads dashboard page without errors', async ({ page }) => {
    // Dashboard may redirect to /assessment if no data — that's fine
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    const url = page.url();
    // Either stays on dashboard (if data exists) or redirects to assessment
    expect(url).toMatch(/dashboard|assessment/);
  });

  test('shows content after completing assessment', async ({ page }) => {
    // Go through the assessment flow
    await page.goto('/assessment');

    // Navigate through all 5 steps
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
    }

    // Submit assessment
    await page.getByRole('button', { name: /Calculate My Impact/i }).click();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Now dashboard should show data
    const heading = page.getByRole('heading', { name: /Your Carbon Dashboard/i });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });
});

// ============================================================================
// Coach Page Tests
// ============================================================================

test.describe('Coach Page', () => {
  test('displays coach page', async ({ page }) => {
    await page.goto('/coach');
    await page.waitForTimeout(1000);

    const pageContent = await page.textContent('body');
    expect(pageContent?.length).toBeGreaterThan(50);
  });

  test('shows content after assessment completion', async ({ page }) => {
    // Complete assessment first
    await page.goto('/assessment');
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
    }
    await page.getByRole('button', { name: /Calculate My Impact/i }).click();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Navigate to coach
    await page.goto('/coach');
    await page.waitForTimeout(1000);

    const pageContent = await page.textContent('body');
    expect(pageContent?.length).toBeGreaterThan(100);
  });
});

// ============================================================================
// Progress Page Tests
// ============================================================================

test.describe('Progress Page', () => {
  test('displays progress page', async ({ page }) => {
    await page.goto('/progress');
    await page.waitForTimeout(1000);

    const pageContent = await page.textContent('body');
    expect(pageContent?.length).toBeGreaterThan(50);
  });

  test('shows content after assessment completion', async ({ page }) => {
    // Complete assessment first
    await page.goto('/assessment');
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
    }
    await page.getByRole('button', { name: /Calculate My Impact/i }).click();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Navigate to progress
    await page.goto('/progress');
    await page.waitForTimeout(1000);

    const pageContent = await page.textContent('body');
    expect(pageContent?.length).toBeGreaterThan(100);
  });
});
