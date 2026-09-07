import AxeBuilder from '@axe-core/playwright';
import { expect, test, BASE } from './fixtures';

test('nothing tweens or travels when the reader has asked for less motion', async ({ browser }) => {
	const context = await browser.newContext({ reducedMotion: 'reduce' });
	const page = await context.newPage();

	for (const route of ['/', '/programme', '/participants', '/call-for-papers', '/venue']) {
		await page.goto(`${BASE}${route}`);
		const tweening = await page.evaluate(() =>
			[...document.querySelectorAll('*')]
				.filter((el) =>
					getComputedStyle(el)
						.transitionDuration.split(',')
						.some((d) => parseFloat(d) * (d.includes('ms') ? 1 : 1000) > 1)
				)
				.map((el) => el.tagName + '.' + String(el.className).slice(0, 40))
				.slice(0, 8)
		);
		expect(tweening, `transitions still running on ${route}`).toEqual([]);
	}

	// The floor removes the tween; it cannot remove the distance, because
	// `transform` is not only used for motion. So the lifts are checked directly.
	await page.goto(`${BASE}/papers`);
	const card = page.locator('.card-hover').first();
	const before = await card.evaluate((el) => getComputedStyle(el).transform);
	await card.hover();
	expect(await card.evaluate((el) => getComputedStyle(el).transform)).toBe(before);

	await context.close();
});

test('a link that inherits its colour still looks like a link at rest', async ({ page }) => {
	const resting = (selector: string) =>
		page.evaluate((sel) => {
			const el = document.querySelector(sel);
			if (!el) return null;
			const style = getComputedStyle(el);
			let node: Element | null = el;
			let surface = 'rgb(255, 255, 255)';
			while (node) {
				const bg = getComputedStyle(node).backgroundColor;
				const parts = bg.match(/[\d.]+/g)?.map(Number) ?? [];
				if (parts.length === 3 || parts[3] === 1) {
					surface = bg;
					break;
				}
				node = node.parentElement;
			}
			const canvas = document.createElement('canvas');
			canvas.width = canvas.height = 8;
			const ctx = canvas.getContext('2d')!;
			const paint = (colour: string, under?: string) => {
				ctx.clearRect(0, 0, 8, 8);
				if (under) {
					ctx.fillStyle = under;
					ctx.fillRect(0, 0, 8, 8);
				}
				ctx.fillStyle = colour;
				ctx.fillRect(0, 0, 8, 8);
				const [r, g, b] = ctx.getImageData(4, 4, 1, 1).data;
				return [r, g, b];
			};
			const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
			const luminance = ([r, g, b]: number[]) =>
				0.2126 * channel(r / 255) + 0.7152 * channel(g / 255) + 0.0722 * channel(b / 255);
			const a = luminance(paint(style.textDecorationColor, surface));
			const b = luminance(paint(surface));
			return {
				line: style.textDecorationLine,
				ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
			};
		}, selector);

	for (const colorScheme of ['light', 'dark'] as const) {
		await page.emulateMedia({ colorScheme });

		await page.goto(`${BASE}/papers`);
		const title = await resting('.paper-title-link');
		expect(title!.line, `card title, ${colorScheme}`).toBe('underline');
		expect(title!.ratio, `card title, ${colorScheme}`).toBeGreaterThanOrEqual(3);

		await page.goto(`${BASE}/papers/frugal-infrastructures`);
		const author = await resting('.author-name');
		expect(author!.line, `author name, ${colorScheme}`).toBe('underline');
		expect(author!.ratio, `author name, ${colorScheme}`).toBeGreaterThanOrEqual(3);

		// The affiliation under the name is part of the same anchor and must stay
		// unruled: two underlines in one link read as two links.
		const affiliation = await page.evaluate(
			() => getComputedStyle(document.querySelectorAll('.author-link span')[1]).textDecorationLine
		);
		expect(affiliation, `affiliation, ${colorScheme}`).toBe('none');
	}
});

for (const colorScheme of ['light', 'dark'] as const) {
	for (const route of [
		'/',
		'/fr',
		'/programme',
		'/participants',
		'/call-for-papers',
		'/venue',
		'/about',
		'/papers',
		'/fr/programme',
		'/fr/participants',
		'/fr/papers',
		'/fr/venue',
		'/fr/about',
		'/fr/call-for-papers',
		'/papers/frugal-infrastructures',
		'/fr/papers/frugal-infrastructures',
		'/participants/tajuddeen-gwadabe',
		'/fr/participants/tajuddeen-gwadabe'
	]) {
		test(`accessibility: ${route} has no automated violations (${colorScheme})`, async ({
			page
		}) => {
			// Scan settled styles and exercise the site's reduced-motion alternative;
			// otherwise axe can sample text midway through an opacity transition.
			await page.emulateMedia({ reducedMotion: 'reduce', colorScheme });
			await page.goto(`${BASE}${route}`);
			const results = await new AxeBuilder({ page }).analyze();
			const summary = results.violations.map((violation) => ({
				route,
				colorScheme,
				id: violation.id,
				nodes: violation.nodes.map((node) => ({
					target: node.target,
					failure: node.failureSummary
				}))
			}));
			expect(summary).toEqual([]);
		});
	}
}
