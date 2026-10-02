import { expect, test, BASE } from './fixtures';

test('static reading content stays visible when application scripts fail to load', async ({
	page
}) => {
	await page.route('**/_app/immutable/**/*.js', (route) => route.abort());
	for (const route of ['/about', '/fr/about', '/call-for-papers', '/fr/call-for-papers']) {
		await page.goto(`${BASE}${route}`);
		const sections = page.locator('.scroll-reveal');
		expect(await sections.count()).toBeGreaterThan(0);
		for (const section of await sections.all()) {
			await expect(section).toHaveCSS('opacity', '1');
		}
	}
});

test('reading content stays visible when the animation observer fails to initialize', async ({
	page
}) => {
	await page.addInitScript(() => {
		const NativeObserver = window.IntersectionObserver;
		window.IntersectionObserver = class extends NativeObserver {
			constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
				// SvelteKit requires its own observer for route preloading. Fail only
				// the optional reveal effect, leaving framework capabilities intact.
				if (options?.rootMargin === '100000px 0px 0px 0px') {
					throw new Error('Animation observer unavailable');
				}
				super(callback, options);
			}
		};
	});
	await page.emulateMedia({ colorScheme: 'light' });
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto(`${BASE}/about`);
	// Exercise a hydrated control before checking the observer's fallback.
	await page.getByRole('button', { name: 'Toggle dark mode' }).click();
	await expect(page.locator('html')).toHaveClass(/dark/);
	for (const section of await page.locator('.scroll-reveal').all()) {
		await expect(section).toHaveCSS('opacity', '1');
	}
	expect(errors).toEqual([]);
});

test('printing participants includes the complete affiliation list', async ({ page }) => {
	await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
	await page.goto(`${BASE}/participants`);
	const list = page.locator('.affiliation-list');
	await expect(list).toHaveCSS('max-height', 'none');
	await expect(list).toHaveCSS('overflow-y', 'visible');
	await expect(page.locator('.affiliation-shell')).toHaveCSS('overflow', 'visible');
	const geometry = await list.evaluate((element) => {
		const last = element.querySelector('li:last-child')!;
		return {
			count: element.querySelectorAll('li').length,
			listBottom: element.getBoundingClientRect().bottom,
			lastBottom: last.getBoundingClientRect().bottom
		};
	});
	expect(geometry.count).toBeGreaterThan(1);
	expect(geometry.lastBottom).toBeLessThanOrEqual(geometry.listBottom + 1);
	await expect(page.locator('.affiliation-panel-header button')).toBeHidden();
});

for (const kind of ['venue', 'affiliation'] as const) {
	test(`${kind} map keeps a selection made before its style loads`, async ({ page }) => {
		let releaseStyle!: () => void;
		const styleGate = new Promise<void>((resolve) => (releaseStyle = resolve));
		await page.route('https://tiles.openfreemap.org/styles/*', async (route) => {
			await styleGate;
			await route.fulfill({
				json: {
					version: 8,
					sources: {},
					layers: [{ id: 'background', type: 'background' }]
				}
			});
		});
		try {
			const styleRequested = page.waitForRequest('https://tiles.openfreemap.org/styles/*');
			await page.goto(`${BASE}/${kind === 'venue' ? 'venue' : 'participants'}`);
			await page.locator(`.${kind}-map`).scrollIntoViewIfNeeded();
			await styleRequested;
			const button =
				kind === 'venue'
					? page.getByRole('button', { name: 'Roosenwijn Guest House', exact: true })
					: page.locator('.affiliation-list button').first();
			const name =
				kind === 'venue'
					? 'Roosenwijn Guest House'
					: await button.locator('.affiliation-name').innerText();
			await button.click();
			await expect(button).toHaveAttribute('aria-pressed', 'true');
			releaseStyle();
			await expect(page.locator(`.${kind}-popup`).getByRole('heading', { name })).toBeVisible();
			await expect(button).toHaveAttribute('aria-pressed', 'true');
		} finally {
			releaseStyle();
		}
	});
}

test('directory portraits do not repeat adjacent names to assistive technology', async ({
	page
}) => {
	await page.goto(`${BASE}/participants`);
	const portraits = page.locator('main article.card img');
	expect(await portraits.count()).toBeGreaterThan(0);
	for (const portrait of await portraits.all()) {
		await expect(portrait).toHaveAttribute('alt', '');
	}
});

test('a reused participant portrait recovers after a different image failed', async ({ page }) => {
	await page.route('**/images/organizers/frederick-madore.webp', (route) => route.abort());
	await page.goto(`${BASE}/participants/madore`);
	await expect(page.getByRole('img', { name: 'Frédérick Madore', exact: true })).toHaveJSProperty(
		'tagName',
		'SPAN'
	);
	// Navigate directly between detail routes so Svelte reuses the page and
	// Avatar instance. A document reload would conceal the stale failure state.
	await page.evaluate((href) => {
		document.documentElement.dataset.avatarNavigationProbe = 'preserved';
		const link = document.createElement('a');
		link.href = href;
		document.body.append(link);
		link.click();
		link.remove();
	}, `${BASE}/participants/tajuddeen-gwadabe`);
	await expect(page).toHaveURL(`${BASE}/participants/tajuddeen-gwadabe`);
	await expect(page.locator('html')).toHaveAttribute('data-avatar-navigation-probe', 'preserved');
	const portrait = page.getByRole('img', { name: 'Tajuddeen Gwadabe', exact: true });
	await expect(portrait).toHaveJSProperty('tagName', 'IMG');
	await expect
		.poll(() => portrait.evaluate((image) => (image as HTMLImageElement).naturalWidth))
		.toBeGreaterThan(0);
});
