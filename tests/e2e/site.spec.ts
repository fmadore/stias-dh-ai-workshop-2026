import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const BASE = '/stias-dh-ai-workshop-2026';

test('locale switching uses the canonical French homepage', async ({ page }) => {
	await page.goto(`${BASE}/`);
	await page
		.getByRole('navigation', { name: 'Language' })
		.getByRole('link', { name: 'FR' })
		.click();

	await expect(page).toHaveURL(new RegExp(`${BASE}/fr$`));
	await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://fmadore.github.io/stias-dh-ai-workshop-2026/fr'
	);
	await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible();
});

test('mobile navigation, theme and participant filtering remain functional', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(`${BASE}/participants`);

	const menuButton = page.locator('button[aria-controls="mobile-navigation"]');
	await menuButton.click();
	await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
	await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();

	await page.getByRole('button', { name: 'Toggle dark mode' }).click();
	await expect(page.locator('html')).toHaveClass(/dark/);

	// By label, not by placeholder: the field carries a real <label> now, and
	// the placeholder is the kind of copy that gets reworded.
	await page.getByRole('searchbox', { name: 'Search' }).fill('Tajuddeen');
	// The total is deliberately loose — this test is about the filter narrowing
	// to one result, and check-data.ts already guards the directory count.
	// Located by class: the affiliation map carries a live region of its own, so
	// role=status alone is ambiguous on this page.
	await expect(page.locator('.filter-count')).toContainText(/1 of \d+ people/);
	await expect(page.getByRole('link', { name: 'Tajuddeen Gwadabe' })).toBeVisible();
});

test('CFP downloads are static, reachable assets', async ({ page, request }) => {
	await page.goto(`${BASE}/call-for-papers`);
	const pdf = page.getByRole('link', { name: 'PDF' }).first();
	const text = page.getByRole('link', { name: 'Text' }).first();

	for (const link of [pdf, text]) {
		await expect(link).toHaveAttribute('download', '');
		const href = await link.getAttribute('href');
		expect(href).toBeTruthy();
		const response = await request.get(`http://127.0.0.1:4317${href}`);
		expect(response.ok()).toBeTruthy();
		expect((await response.body()).byteLength).toBeGreaterThan(500);
	}
});

test('the directory filter reports every group it narrows', async ({ page }) => {
	await page.goto(`${BASE}/participants`);
	const status = page.locator('.filter-count');
	// 33 participants + 4 organisers + 2 Point Sud: the filter spans all three,
	// so the count has to as well. It used to read "of 33" while seven people
	// stayed on screen unfiltered.
	await expect(status).toContainText(/39 of 39 people/);

	await page.getByRole('searchbox', { name: 'Search' }).fill('Madore');
	await expect(status).toContainText(/of 39 people/);
	// Frédérick Madore is an organiser, and searching his name must find him.
	await expect(page.getByRole('link', { name: 'Frédérick Madore' }).first()).toBeVisible();
});

test('language switching survives without JavaScript', async ({ page }) => {
	await page.goto(`${BASE}/programme`);
	const fr = page.getByRole('navigation', { name: 'Language' }).getByRole('link', { name: 'FR' });
	await expect(fr).toHaveAttribute('href', `${BASE}/fr/programme`);
	await expect(fr).toHaveAttribute('hreflang', 'fr');
});

test('a bad French URL is answered in French', async ({ page }) => {
	// One 404 document serves the whole static site and renders on the client,
	// so the locale has to come from the path rather than a matched route.
	await page.goto(`${BASE}/fr/no-such-page`);
	await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
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

for (const route of ['/', '/fr', '/programme', '/participants', '/call-for-papers']) {
	test(`accessibility: ${route} has no automated violations`, async ({ page }) => {
		// Scan settled styles and exercise the site's reduced-motion alternative;
		// otherwise axe can sample text midway through an opacity transition.
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto(`${BASE}${route}`);
		const results = await new AxeBuilder({ page }).analyze();
		const summary = results.violations.map((violation) => ({
			route,
			id: violation.id,
			nodes: violation.nodes.map((node) => ({
				target: node.target,
				failure: node.failureSummary
			}))
		}));
		expect(summary).toEqual([]);
	});
}
