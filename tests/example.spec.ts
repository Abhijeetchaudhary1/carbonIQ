import { test, expect } from '@playwright/test';

test('has title and main heading', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/CarbonIQ|Carbon Compass/);

  // Expect the main hero heading to be visible
  const heading = page.getByRole('heading', { name: /Track Your Carbon Footprint/i });
  await expect(heading).toBeVisible();
});

test('can navigate to assessment page', async ({ page }) => {
  await page.goto('/');

  // Click the get started button.
  await page.getByRole('link', { name: /Calculate My Impact/i }).click();

  // Expects page to have a heading or some text about Assessment.
  await expect(page).toHaveURL(/.*assessment/);
});
