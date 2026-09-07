import { expect, test, BASE } from './fixtures';

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

	const menuButton = page.locator('summary[aria-controls="mobile-navigation"]');
	await menuButton.click();
	await expect(page.locator('details.mobile-menu')).toHaveAttribute('open', '');
	await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();

	await page.getByRole('button', { name: 'Toggle dark mode' }).click();
	await expect(page.locator('html')).toHaveClass(/dark/);

	// By label, not by placeholder: the field carries a real <label> now, and
	// the placeholder is the kind of copy that gets reworded.
	await page.getByRole('searchbox', { name: 'Search' }).fill('Tajuddeen');
	await expect(page.locator('.filter-count')).toContainText(/1 of \d+ people/);
	await expect(page.getByRole('link', { name: 'Tajuddeen Gwadabe' })).toBeVisible();
});

test('language switching survives without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto(`${BASE}/programme`);
	const fr = page.getByRole('navigation', { name: 'Language' }).getByRole('link', { name: 'FR' });
	await expect(fr).toHaveAttribute('href', `${BASE}/fr/programme`);
	await expect(fr).toHaveAttribute('hreflang', 'fr');
	await fr.click();
	await expect(page).toHaveURL(new RegExp(`${BASE}/fr/programme$`));
	await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
	await context.close();
});

test('a bad French URL is answered in French', async ({ page }) => {
	// One 404 document serves the whole static site and renders on the client,
	// so the locale has to come from the path rather than a matched route.
	await page.goto(`${BASE}/fr/no-such-page`);
	await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
});

test('the wordmark says the whole thing on a phone, at the header height', async ({ page }) => {
	for (const width of [320, 375, 414]) {
		await page.setViewportSize({ width, height: 720 });
		await page.goto(`${BASE}/programme`);
		const measured = await page.evaluate(() => {
			const qualifier = document.querySelector<HTMLElement>('header a span[class*="line-clamp"]');
			if (!qualifier) throw new Error('no brand qualifier to measure');
			const token = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
			const probe = document.createElement('div');
			probe.style.cssText = `position:absolute;visibility:hidden;height:${token}`;
			document.body.appendChild(probe);
			const navHeight = probe.getBoundingClientRect().height;
			probe.remove();
			return {
				clippedVertically: qualifier.scrollHeight > qualifier.clientHeight + 1,
				clippedHorizontally: qualifier.scrollWidth > qualifier.clientWidth + 1,
				headerHeight: document.querySelector('header')!.getBoundingClientRect().height,
				navHeight
			};
		});
		expect(measured.clippedVertically, `qualifier clipped at ${width}px`).toBe(false);
		expect(measured.clippedHorizontally, `qualifier clipped at ${width}px`).toBe(false);
		expect(measured.headerHeight, `header height moved at ${width}px`).toBeCloseTo(
			measured.navHeight,
			0
		);
	}
});
