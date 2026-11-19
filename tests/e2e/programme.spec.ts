import { expect, test, BASE } from './fixtures';
import { devices } from '@playwright/test';

test('the programme day bar stays one row at the narrowest supported width', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 812 });
	await page.goto(`${BASE}/fr/programme`);

	const bar = page.getByRole('navigation', { name: 'Aller au jour' });
	const tokenPx = await page.evaluate(() => {
		const root = document.documentElement;
		const rem = parseFloat(getComputedStyle(root).fontSize);
		return parseFloat(getComputedStyle(root).getPropertyValue('--day-bar-height')) * rem;
	});
	expect(Math.abs((await bar.boundingBox())!.height - tokenPx)).toBeLessThan(1);

	// One row: every pill shares a top edge.
	const tops = await page
		.locator('.day-pill')
		.evaluateAll((pills) => [
			...new Set(pills.map((p) => Math.round(p.getBoundingClientRect().top)))
		]);
	expect(tops).toHaveLength(1);

	// And the anchor the token exists for lands below the bar, not behind it.
	await page.locator('.day-pill').nth(2).click();
	await expect(page).toHaveURL(/#day-/);
	// The hash changes at once but the smooth scroll animates, and measuring
	// mid-flight proves nothing. Wait until the page has moved and then held
	// still across two frames rather than guessing how long the animation runs.
	await expect
		.poll(() =>
			page.evaluate(
				() =>
					new Promise<boolean>((resolve) => {
						const start = window.scrollY;
						requestAnimationFrame(() =>
							requestAnimationFrame(() => resolve(start > 0 && window.scrollY === start))
						);
					})
			)
		)
		.toBe(true);
	const clearance = await page.evaluate(() => {
		const nav = document.querySelector('nav[aria-label="Aller au jour"]')!;
		const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
		if (!target) throw new Error(`no element for ${location.hash}`);
		return target.getBoundingClientRect().top - nav.getBoundingClientRect().bottom;
	});
	expect(clearance).toBeGreaterThan(0);
});

test('the programme downloads are served with the types browsers expect', async ({
	page,
	request
}) => {
	await page.goto(`${BASE}/programme`);
	for (const [name, contentType, signature] of [
		[/\(PDF\)/, /^application\/pdf\b/, '%PDF-'],
		[/\(\.ics\)/, /^text\/calendar\b/, 'BEGIN:VCALENDAR']
	] as const) {
		const link = page.getByRole('link', { name });
		await expect(link).toHaveAttribute('download', '');
		const href = await link.getAttribute('href');
		expect(href).toBeTruthy();
		const response = await request.get(new URL(href!, page.url()).href);
		expect(response.status(), name).toBe(200);
		expect(response.headers()['content-type'], name).toMatch(contentType);
		expect((await response.body()).subarray(0, signature.length).toString('latin1')).toBe(
			signature
		);
	}
});

test('the session permalink is a real target on touch', async ({ browser }) => {
	const context = await browser.newContext({ ...devices['Pixel 7'] });
	const page = await context.newPage();
	await page.goto(`${BASE}/programme`);

	// Located by accessible name, not by class: the name predates this fix, so
	// the guard fails on the defect rather than on a missing selector.
	const anchor = page.getByRole('link', { name: 'Link to this session' }).first();
	const box = (await anchor.boundingBox())!;
	expect(box.width).toBeGreaterThanOrEqual(24);
	expect(box.height).toBeGreaterThanOrEqual(24);
	expect(await anchor.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
	await context.close();
});
