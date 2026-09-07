import { expect, test, BASE } from './fixtures';

test('a failed map request leaves a readable venue fallback', async ({ page }) => {
	await page.route('https://tiles.openfreemap.org/styles/*', (route) => route.abort());
	await page.goto(`${BASE}/venue`);
	await page.locator('.venue-map').scrollIntoViewIfNeeded();
	await expect(page.locator('.map-error[role="status"]')).toBeVisible({ timeout: 20_000 });
	await expect(page.locator('.map-loading')).toBeHidden();
	await expect(page.getByText('14 Van Riebeeck Street, 7600 Stellenbosch')).toBeVisible();
});

test('the directory and its map degrade without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto(`${BASE}/participants`);

	// The map cannot arrive, so its prerendered loading state must not pretend
	// otherwise; the affiliation list beside it is static and still works.
	await expect(page.locator('.map-loading')).toBeHidden();
	await expect(page.locator('.affiliation-list li')).not.toHaveCount(0);
	await expect(page.getByRole('heading', { name: 'Organisers', exact: true })).toBeVisible();
	await context.close();
});

test('the map stylesheet stays off the critical path until the map is wanted', async ({ page }) => {
	const sheets = () =>
		page.evaluate(() =>
			[...document.querySelectorAll('link[rel="stylesheet"]')].map(
				(l) => (l as HTMLLinkElement).href
			)
		);

	await page.goto(`${BASE}/participants`);
	expect((await sheets()).filter((href) => href.includes('maplibre'))).toHaveLength(0);

	// It must still arrive when the map does — the lazy path has to actually
	// carry it, or the map renders unstyled.
	await page.locator('.affiliation-map').scrollIntoViewIfNeeded();
	await expect
		.poll(async () => (await sheets()).filter((href) => href.includes('maplibre')).length, {
			timeout: 15_000
		})
		.toBe(1);
});

test('the venue map places the venue and both guest houses', async ({ page }) => {
	await page.goto(`${BASE}/venue`);

	await expect(page.getByRole('button', { name: 'Roosenwijn Guest House' })).toBeAttached();
	await expect(page.getByRole('button', { name: 'De Haas Luxury Living' })).toBeAttached();
	await expect(page.getByText('750 m from STIAS')).toBeVisible();

	await page.locator('.venue-map').scrollIntoViewIfNeeded();
	await expect(page.locator('.venue-marker')).toHaveCount(3, { timeout: 15_000 });
	await expect(page.locator('.map-loading')).toBeHidden();
	// The venue is the reference point the distances are measured from, and reads
	// differently from the two guest houses.
	await expect(page.locator('.venue-marker.is-venue')).toHaveCount(1);
	await expect(page.locator('.venue-marker.is-stay')).toHaveCount(2);

	await page.getByRole('button', { name: 'Show Roosenwijn Guest House on the map' }).click();
	const popup = page.locator('.venue-popup');
	await expect(popup.getByRole('heading', { name: 'Roosenwijn Guest House' })).toBeVisible();
	await expect(popup.getByRole('link', { name: 'Visit website' })).toHaveAttribute(
		'href',
		'https://www.roosenwijn.co.za'
	);
});

test('the venue map degrades without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto(`${BASE}/venue`);

	// Same contract as the affiliation map: no spinner promising a map that
	// cannot arrive, and every address still readable as text.
	await expect(page.locator('.map-loading')).toBeHidden();
	await expect(page.getByText('14 Van Riebeeck Street, 7600 Stellenbosch')).toBeVisible();
	await expect(page.getByText('Die Laan 2, 7600 Stellenbosch')).toBeVisible();
	await context.close();
});
