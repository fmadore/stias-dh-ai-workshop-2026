import { expect, test, BASE } from './fixtures';

test('each locale identifies only the active section, including detail routes', async ({
	page
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	for (const locale of ['', '/fr']) {
		for (const route of [
			'',
			'/programme',
			'/papers/frugal-infrastructures',
			'/participants/tajuddeen-gwadabe'
		]) {
			await page.goto(`${BASE}${locale}${route || (locale ? '' : '/')}`);
			const nav = page.locator('header nav').first();
			await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
			const section = route.split('/')[1];
			await expect(nav.locator('[aria-current="page"]')).toHaveAttribute(
				'href',
				`${BASE}${locale}${section ? `/${section}` : locale ? '' : '/'}`
			);
		}
	}
});

test('mobile navigation works without scripts', async ({ browser }) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 390, height: 844 }
	});
	const page = await context.newPage();
	await page.goto(`${BASE}/programme`);
	await page.locator('summary[aria-controls="mobile-navigation"]').click();
	await page
		.locator('#mobile-navigation')
		.getByRole('link', { name: 'Papers', exact: true })
		.click();
	await expect(page).toHaveURL(`${BASE}/papers`);
	await expect(page.getByRole('heading', { name: 'Papers', exact: true })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Toggle dark mode' })).toBeHidden();
	await context.close();
});

test('the mobile menu scrolls on short screens and Escape returns focus', async ({ page }) => {
	await page.setViewportSize({ width: 844, height: 390 });
	await page.goto(`${BASE}/fr/programme`);
	const toggle = page.locator('summary[aria-controls="mobile-navigation"]');
	await toggle.click();
	const nav = page.locator('#mobile-navigation');
	await expect(nav).toBeVisible();
	const box = (await nav.boundingBox())!;
	expect(box.y + box.height).toBeLessThanOrEqual(390);
	await nav.getByRole('link').last().scrollIntoViewIfNeeded();
	await page.keyboard.press('Escape');
	await expect(nav).toBeHidden();
	await expect(toggle).toBeFocused();
	await toggle.click();
	await page.setViewportSize({ width: 1440, height: 900 });
	await expect(page.locator('details.mobile-menu')).not.toHaveAttribute('open');
	await page.setViewportSize({ width: 390, height: 844 });
	await expect(nav).toBeHidden();
});

test('theme and navigation survive unavailable storage', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.addInitScript(() => {
		for (const kind of ['localStorage', 'sessionStorage']) {
			Object.defineProperty(window, kind, {
				get() {
					throw new DOMException('Storage blocked', 'SecurityError');
				}
			});
		}
	});
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto(`${BASE}/programme`);
	await expect(page.locator('html')).toHaveClass(/dark/);
	const theme = page.getByRole('button', { name: 'Toggle dark mode' });
	await expect(theme).toHaveAttribute('aria-pressed', 'true');
	await theme.click();
	await expect(page.locator('html')).not.toHaveClass(/dark/);
	await page.emulateMedia({ colorScheme: 'light' });
	await page.emulateMedia({ colorScheme: 'dark' });
	await expect(theme).toHaveAttribute('aria-pressed', 'false');
	expect(errors).toEqual([]);
});

test('paper filters survive reload, locale switching and clearing', async ({ page }) => {
	await page.goto(`${BASE}/papers`);
	const historyLength = await page.evaluate(() => history.length);
	await page.getByRole('searchbox', { name: 'Search' }).fill('frugal');
	await expect(page.locator('.filter-count')).toHaveText('1 of 25 papers');
	await expect(page).toHaveURL(/\?q=frugal$/);
	expect(await page.evaluate(() => history.length)).toBe(historyLength);
	await page.locator('.paper-title-link').click();
	await expect(page).toHaveURL(new RegExp(`${BASE}/papers/frugal-infrastructures$`));
	await page.goBack();
	await expect(page.getByRole('searchbox')).toHaveValue('frugal');
	await expect(page.locator('.filter-count')).toHaveText('1 of 25 papers');
	await page.reload();
	await expect(page.getByRole('searchbox')).toHaveValue('frugal');
	await page.getByRole('navigation', { name: 'Language' }).getByRole('link').click();
	await expect(page).toHaveURL(new RegExp(`${BASE}/fr/papers\\?q=frugal$`));
	await expect(page.getByRole('searchbox')).toHaveValue('frugal');
	await page.locator('.filter-reset').click();
	await expect(page).toHaveURL(new RegExp(`${BASE}/fr/papers$`));
	await expect(page.locator('.paper-title-link')).toHaveCount(25);
});

test('directory filters and grouping restore from a shared URL', async ({ page }) => {
	await page.goto(`${BASE}/participants?q=Tajuddeen&group=country`);
	await expect(page.getByRole('searchbox')).toHaveValue('Tajuddeen');
	await expect(page.locator('.filter-count')).toContainText('1 of 39');
	await expect(page.getByRole('radio', { name: 'By country', exact: true })).toHaveAttribute(
		'aria-checked',
		'true'
	);
	await page.goto(`${BASE}/participants?country=invalid&language=invalid`);
	await expect(page.locator('.filter-count')).toContainText('39 of 39');
});

test('workshop status updates at opening and closing without reloading', async ({ page }) => {
	await page.clock.install({ time: new Date('2026-09-21T06:59:00Z') });
	await page.goto(`${BASE}/`);
	const hero = page.locator('main section').first();
	await expect(hero).toContainText('Today');
	await page.clock.fastForward(60_000);
	await expect(hero).toContainText('underway');
	await page.clock.setSystemTime(new Date('2026-09-24T15:59:00Z'));
	await page.evaluate(() => window.dispatchEvent(new Event('pageshow')));
	await page.clock.fastForward(60_000);
	await expect(hero).toContainText('concluded');
});

test('the programme advances its day at venue midnight and clears it after closing', async ({
	page
}) => {
	await page.clock.install({ time: new Date('2026-09-21T21:59:00Z') });
	await page.goto(`${BASE}/programme`);
	await expect(page.locator('.day-pill.is-today')).toHaveAttribute('href', '#day-2026-09-21');
	await page.clock.fastForward(60_000);
	await expect(page.locator('.day-pill.is-today')).toHaveAttribute('href', '#day-2026-09-22');
	await page.clock.setSystemTime(new Date('2026-09-24T16:00:00Z'));
	await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
	await expect(page.locator('.day-pill.is-today')).toHaveCount(0);
});

test('static pages publish dates without stale live status', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto(`${BASE}/`);
	await expect(page.locator('main section').first()).not.toContainText(
		/days remaining|Today|underway|concluded/
	);
	await page.goto(`${BASE}/programme`);
	await expect(page.locator('.day-pill.is-today')).toHaveCount(0);
	await expect(page.getByText('Teraco CT2, Brackenfell', { exact: true })).toBeVisible();
	await context.close();
});

for (const colorScheme of ['light', 'dark'] as const) {
	test(`printed schedules and abstracts remain readable (${colorScheme})`, async ({
		page
	}, testInfo) => {
		await page.emulateMedia({ colorScheme, media: 'print', reducedMotion: 'reduce' });
		for (const route of ['programme', 'papers/frugal-infrastructures']) {
			await page.goto(`${BASE}/${route}`);
			await expect(page.locator('h1')).toHaveCSS('color', 'rgb(29, 26, 22)');
			await expect(page.locator('main h2').first()).toHaveCSS('color', 'rgb(29, 26, 22)');
			await expect(page.locator('.programme-day-nav')).not.toBeVisible();
			for (const printBackground of [false, true]) {
				await page.pdf({
					path: testInfo.outputPath(`${route.replaceAll('/', '-')}-${printBackground}.pdf`),
					format: 'A4',
					printBackground
				});
			}
		}
	});
}
