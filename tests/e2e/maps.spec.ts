import { expect, test, BASE } from './fixtures';

test('a failed map request leaves a readable venue fallback', async ({ page }) => {
	await page.route('https://tiles.openfreemap.org/styles/*', (route) => route.abort());
	await page.goto(`${BASE}/venue`);
	await page.locator('.venue-map').scrollIntoViewIfNeeded();
	// MapLibre reports the failed style request as an `error` event, and the
	// fallback answers it at once. The fifteen-second timer behind it is only a
	// backstop for requests that never answer, so this must not need it.
	await expect(page.locator('.map-error[role="status"]')).toBeVisible({ timeout: 5_000 });
	await expect(page.locator('.map-loading')).toBeHidden();
	await expect(page.getByText('14 Van Riebeeck Street, 7600 Stellenbosch')).toBeVisible();
});

test('a style the server refuses shows the affiliation fallback without waiting', async ({
	page
}) => {
	await page.route('https://tiles.openfreemap.org/styles/*', (route) =>
		route.fulfill({ status: 404, body: 'Not found' })
	);
	await page.goto(`${BASE}/participants`);
	await page.locator('.affiliation-map').scrollIntoViewIfNeeded();
	await expect(page.locator('.map-error[role="status"]')).toBeVisible({ timeout: 5_000 });
	await expect(page.locator('.map-loading')).toBeHidden();
	await expect(page.locator('.affiliation-list li')).not.toHaveCount(0);
});

test('a failing tile does not replace a working map with the fallback', async ({ page }) => {
	// A style whose one raster source answers every tile with a server error.
	// MapLibre reports each as an `error` event, some of them before `load`;
	// the map around the gaps still works, so they must not count as the map
	// failing. (A 404 would not test this: MapLibre takes it to mean "no tile
	// here", reports nothing and falls back to parent tiles.)
	await page.route('https://tiles.openfreemap.org/styles/*', (route) =>
		route.fulfill({
			json: {
				version: 8,
				sources: {
					gaps: {
						type: 'raster',
						tiles: ['https://tiles.openfreemap.org/test-gaps/{z}/{x}/{y}.png'],
						tileSize: 256
					}
				},
				layers: [
					{ id: 'background', type: 'background', paint: { 'background-color': '#f6f1e5' } },
					{ id: 'gaps', type: 'raster', source: 'gaps' }
				]
			}
		})
	);
	let tileRequests = 0;
	await page.route('https://tiles.openfreemap.org/test-gaps/**', (route) => {
		tileRequests += 1;
		return route.fulfill({ status: 500, body: 'Server error' });
	});
	await page.goto(`${BASE}/venue`);
	await page.locator('.venue-map').scrollIntoViewIfNeeded();
	await expect(page.locator('.venue-marker')).toHaveCount(4, { timeout: 15_000 });
	await expect(page.locator('.map-loading')).toBeHidden({ timeout: 10_000 });
	expect(tileRequests).toBeGreaterThan(0);
	await expect(page.locator('.map-error')).toBeHidden();
});

test('the map canvas is the one named region, in the page language', async ({ page }) => {
	await page.goto(`${BASE}/fr/venue`);
	await page.locator('.venue-map').scrollIntoViewIfNeeded();
	await expect(page.locator('.map-loading')).toBeHidden({ timeout: 15_000 });

	// MapLibre names its canvas region from its locale table, which says "Map"
	// unless told otherwise; the frame around it used to be a second region.
	const label = 'Carte interactive du lieu et des maisons d’hôtes';
	await expect(page.locator('.venue-map canvas')).toHaveAttribute('aria-label', label);
	await expect(page.getByRole('region', { name: label, exact: true })).toHaveCount(1);
	await expect(page.getByRole('region', { name: 'Map', exact: true })).toHaveCount(0);
	await expect(page.locator('.map-frame')).not.toHaveAttribute('role', /.+/);
});

test('a popup opened from the list takes focus and gives it back', async ({ page }) => {
	await page.goto(`${BASE}/participants`);
	await page.locator('.affiliation-map').scrollIntoViewIfNeeded();
	await expect(page.locator('.map-loading')).toBeHidden({ timeout: 15_000 });

	// The popup sits before the list in the DOM; without this a keyboard reader
	// would have to Shift+Tab back across the map to reach its links.
	const entry = page.locator('.affiliation-list button').first();
	await entry.focus();
	await page.keyboard.press('Enter');
	await expect(page.locator('.affiliation-popup a').first()).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(page.locator('.affiliation-popup')).toHaveCount(0);
	await expect(entry).toBeFocused();
	await expect(entry).toHaveAttribute('aria-pressed', 'false');

	// A marker click opens the same popup without pulling focus into it.
	await page.locator('.affiliation-marker').first().click();
	await expect(page.locator('.affiliation-popup')).toBeVisible();
	expect(
		await page.evaluate(() => Boolean(document.activeElement?.closest('.maplibregl-popup')))
	).toBe(false);
});

/** The widest gap between any two pins, in CSS pixels — a proxy for the zoom. */
async function markerSpread(page: import('@playwright/test').Page): Promise<number> {
	return page.locator('.affiliation-marker').evaluateAll((markers) => {
		const points = markers.map((marker) => {
			const box = marker.getBoundingClientRect();
			return [box.x + box.width / 2, box.y + box.height / 2];
		});
		let widest = 0;
		for (const [ax, ay] of points) {
			for (const [bx, by] of points) widest = Math.max(widest, Math.hypot(ax - bx, ay - by));
		}
		return widest;
	});
}

test.describe('resizing the window', () => {
	test.use({ reducedMotion: 'reduce' });

	async function openAffiliationMap(page: import('@playwright/test').Page) {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto(`${BASE}/participants`);
		await page.locator('.affiliation-map').scrollIntoViewIfNeeded();
		await expect(page.locator('.map-loading')).toBeHidden({ timeout: 15_000 });
		await expect(page.locator('.affiliation-marker').first()).toBeVisible();
	}

	test('keeps a view the reader zoomed to themselves', async ({ page }) => {
		await openAffiliationMap(page);
		const fitted = await markerSpread(page);

		await page.getByRole('button', { name: 'Zoom in' }).click();
		await expect.poll(() => markerSpread(page)).toBeGreaterThan(fitted * 1.5);
		const zoomed = await markerSpread(page);

		// A narrower window — the container's width changes, which used to
		// refit every pin and throw the reader's zoom away.
		await page.setViewportSize({ width: 760, height: 800 });
		await page.waitForTimeout(600);
		expect(Math.abs((await markerSpread(page)) - zoomed)).toBeLessThan(2);

		// "Show all" is the reader asking for the framed view back, and with it
		// the refitting that keeps that view framed.
		await page.getByRole('button', { name: 'Show all locations' }).click();
		const reframed = await markerSpread(page);
		expect(reframed).toBeLessThan(zoomed);
		await page.setViewportSize({ width: 1280, height: 800 });
		await expect.poll(() => markerSpread(page)).toBeGreaterThan(reframed + 10);
	});
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

test('the venue map places the venue and all three guest houses', async ({ page }) => {
	await page.goto(`${BASE}/venue`);

	await expect(page.getByRole('button', { name: 'Roosenwijn Guest House' })).toBeAttached();
	await expect(page.getByRole('button', { name: 'De Haas at Villa Grande' })).toBeAttached();
	await expect(page.getByRole('button', { name: 'De Haas at Die Laan 40' })).toBeAttached();
	await expect(page.getByText('750 m from STIAS')).toBeVisible();

	await page.locator('.venue-map').scrollIntoViewIfNeeded();
	await expect(page.locator('.venue-marker')).toHaveCount(4, { timeout: 15_000 });
	await expect(page.locator('.map-loading')).toBeHidden();
	// The venue is the reference point the distances are measured from, and reads
	// differently from the three guest houses.
	await expect(page.locator('.venue-marker.is-venue')).toHaveCount(1);
	await expect(page.locator('.venue-marker.is-stay')).toHaveCount(3);

	await page.getByRole('button', { name: 'Show Roosenwijn Guest House on the map' }).click();
	const popup = page.locator('.venue-popup');
	await expect(popup.getByRole('heading', { name: 'Roosenwijn Guest House' })).toBeVisible();
	// The popup carries the address only: the distance belongs to the card below,
	// where it is not competing with a pin the reader can already see.
	await expect(popup.getByText('from STIAS')).toHaveCount(0);
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
	await expect(page.getByText('Die Laan 40, 7600 Stellenbosch')).toBeVisible();
	await expect(page.getByText('1 Keerom Street, 7600 Stellenbosch')).toBeVisible();
	await context.close();
});
