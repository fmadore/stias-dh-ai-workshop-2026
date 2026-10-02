import { test, expect } from '@playwright/test';
import { BASE } from './fixtures';

test('live map provider loads its style', async ({ page }) => {
	// This file belongs only to the opt-in live-maps project. Unlike fixtures.ts,
	// the base Playwright test makes real requests to the external provider.
	await page.goto(`${BASE}/venue`);
	await page.locator('.venue-map').scrollIntoViewIfNeeded();
	await expect(page.locator('.venue-marker')).toHaveCount(4, { timeout: 20_000 });
	await expect(page.locator('.venue-marker.is-venue')).toHaveCount(1);
	await expect(page.locator('.venue-marker.is-stay')).toHaveCount(3);
	await expect(page.locator('.map-loading')).toBeHidden({ timeout: 20_000 });
	await expect(page.locator('.map-error')).not.toBeVisible();
});
