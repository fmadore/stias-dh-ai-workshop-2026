import { test, expect } from '@playwright/test';
import { BASE } from './fixtures';

test('live map provider loads its style', async ({ page }) => {
	test.skip(!process.env.LIVE_MAPS, 'Opt-in external network integration; run with LIVE_MAPS=1.');
	await page.goto(`${BASE}/venue`);
	await page.locator('.venue-map').scrollIntoViewIfNeeded();
	await expect(page.locator('.venue-marker')).toHaveCount(3);
	await expect(page.locator('.map-loading')).toBeHidden({ timeout: 20_000 });
	await expect(page.locator('.map-error')).not.toBeVisible();
});
