import { expect, test, BASE } from './fixtures';

test('explicit English URLs and locale switches work for French browsers without storage', async ({
	browser
}) => {
	const context = await browser.newContext({ locale: 'fr-FR' });
	await context.addInitScript(() => {
		Object.defineProperty(window, 'sessionStorage', {
			get() {
				throw new DOMException('Storage blocked', 'SecurityError');
			}
		});
	});
	try {
		const page = await context.newPage();
		await page.goto(`${BASE}/programme`);
		await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
		await expect(page).toHaveURL(`${BASE}/programme`);
		await page.locator('header a[hreflang="fr"]').click();
		await expect(page).toHaveURL(`${BASE}/fr/programme`);
		await page.locator('header a[hreflang="en"]').click();
		await expect(page).toHaveURL(`${BASE}/programme`);
		await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	} finally {
		await context.close();
	}
});

test('a cold French 404 localizes the entire shell and preserves its language when recovering', async ({
	page
}) => {
	await page.goto(`${BASE}/fr/no-such-page`);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
	const navigation = page.getByRole('navigation', { name: 'Navigation principale' });
	await expect(navigation).toBeVisible();
	await expect(navigation.getByRole('link', { name: 'Accueil', exact: true })).toHaveAttribute(
		'href',
		`${BASE}/fr`
	);
	await expect(page.locator('footer a[href$="/fr/programme"]')).toBeVisible();
	await expect(page.locator('header a[hreflang="en"]')).toHaveAttribute(
		'href',
		`${BASE}/no-such-page`
	);
	await expect(page.locator('header a[href*="/fr/fr/"]')).toHaveCount(0);
	await navigation.getByRole('link', { name: 'Accueil', exact: true }).click();
	await expect(page).toHaveURL(`${BASE}/fr`);
	await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
});

test('search phrases match the visible text across Markdown emphasis', async ({ page }) => {
	await page.goto(`${BASE}/papers?q=ECHO+focuses`);
	await expect(page.locator('.filter-count')).toHaveText('1 of 25 papers');
	await expect(page.locator('.paper-title-link')).toHaveAttribute(
		'href',
		`${BASE}/papers/masakhane-4d-framework`
	);
	await page.goto(`${BASE}/participants?q=Lingua+Africa+explores`);
	await expect(page.locator('.filter-count')).toHaveText('2 of 39 people');
});

test('slow full-text search announces partial results until the index arrives', async ({
	page
}) => {
	await page.goto(`${BASE}/papers`);
	await page.waitForLoadState('networkidle');
	let releaseDownload!: () => void;
	const download = new Promise<void>((resolve) => {
		releaseDownload = resolve;
	});
	await page.route('**/search-index.json', async (route) => {
		await download;
		await route.continue();
	});
	try {
		await page.getByRole('searchbox', { name: 'Search' }).fill('ECHO focuses');
		await expect(page.locator('.search-status')).toContainText('Loading full search');
		await expect(page.getByText('No papers match these filters.', { exact: true })).toHaveCount(0);
	} finally {
		releaseDownload();
	}
	await expect(page.locator('.filter-count')).toHaveText('1 of 25 papers');
	await expect(page.locator('.search-status')).toHaveCount(0);
});

test('failed full-text search explains its limits and can be retried without losing filters', async ({
	page
}) => {
	await page.goto(`${BASE}/papers`);
	await page.waitForLoadState('networkidle');
	await page.route('**/search-index.json', (route) => route.abort());
	await page.getByRole('searchbox', { name: 'Search' }).fill('ECHO focuses');
	await expect(page.locator('.search-status')).toContainText('Full search is unavailable');
	await expect(page.getByText('No papers match these filters.', { exact: true })).toHaveCount(0);
	await page.unroute('**/search-index.json');
	await page.getByRole('button', { name: 'Retry full search', exact: true }).click();
	await expect(page.locator('.filter-count')).toHaveText('1 of 25 papers');
	await expect(page.getByRole('searchbox')).toHaveValue('ECHO focuses');
	await expect(page.locator('.search-status')).toHaveCount(0);
});
