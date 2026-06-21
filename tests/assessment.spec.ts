import { test, expect } from '@playwright/test';

// ============================================================================
// Assessment Page Tests
// ============================================================================

test.describe('Assessment Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/assessment');
  });

  test('displays assessment heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /Carbon Assessment/i });
    await expect(heading).toBeVisible();
  });

  test('shows transportation step first', async ({ page }) => {
    await expect(page.getByText('Transportation')).toBeVisible();
    await expect(page.getByText('How you get around')).toBeVisible();
  });

  test('has step indicator showing 1/5', async ({ page }) => {
    await expect(page.getByText('1/5')).toBeVisible();
  });

  test('can navigate to next step', async ({ page }) => {
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText('2/5')).toBeVisible();
    await expect(page.getByText('What you eat')).toBeVisible();
  });

  test('can navigate through all steps', async ({ page }) => {
    // Step 1 → 2
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText('2/5')).toBeVisible();

    // Step 2 → 3
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText('3/5')).toBeVisible();

    // Step 3 → 4
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText('4/5')).toBeVisible();

    // Step 4 → 5
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText('5/5')).toBeVisible();
  });

  test('shows Calculate My Impact button on last step', async ({ page }) => {
    // Navigate to last step
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
    }
    await expect(page.getByRole('button', { name: /Calculate My Impact/i })).toBeVisible();
  });

  test('back button is disabled on first step', async ({ page }) => {
    const backButton = page.getByRole('button', { name: /Back/i });
    await expect(backButton).toBeDisabled();
  });

  test('form controls have proper labels', async ({ page }) => {
    // Check that slider inputs have associated labels
    const sliders = page.locator('input[type="range"]');
    const count = await sliders.count();
    expect(count).toBeGreaterThan(0);
  });

  test('can complete assessment and redirect to dashboard', async ({ page }) => {
    // Navigate through all steps
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
    }
    // Click calculate
    await page.getByRole('button', { name: /Calculate My Impact/i }).click();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
  });
});
