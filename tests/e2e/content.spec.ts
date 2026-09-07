import { expect, test, BASE } from './fixtures';

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
	await expect(status).toContainText(/39 of 39 people/);

	await page.getByRole('searchbox', { name: 'Search' }).fill('Madore');
	await expect(status).toContainText(/of 39 people/);
	// Frédérick Madore is an organiser, and searching his name must find him.
	await expect(page.getByRole('link', { name: 'Frédérick Madore' }).first()).toBeVisible();
});

test('the at-a-glance figures lead to what they count', async ({ page }) => {
	await page.goto(`${BASE}/`);
	const figures = page.locator('main dl a');
	await expect(figures).toHaveCount(3);
	await expect(figures.nth(0)).toHaveAttribute('href', `${BASE}/papers`);
	await expect(figures.nth(1)).toHaveAttribute('href', `${BASE}/participants`);
	await expect(figures.nth(2)).toHaveAttribute('href', `${BASE}/participants#affiliations`);

	await figures.nth(2).click();
	await page.waitForURL(/\/participants#affiliations$/);
	await expect(page.locator('#affiliations')).toBeVisible();
	const clearance = await page.evaluate(() => {
		const target = document.getElementById('affiliations');
		if (!target) throw new Error('no #affiliations section to land on');
		const header = document.querySelector('header')!;
		return target.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
	});
	expect(clearance).toBeGreaterThan(0);
});

test('an abstract has intervals between its blocks, and its subheads bind downward', async ({
	page
}) => {
	await page.goto(`${BASE}/papers/frugal-infrastructures`);
	const geometry = await page.evaluate(() => {
		const blocks = [...document.querySelectorAll('article.prose > *')];
		const rect = (el: Element) => el.getBoundingClientRect();
		return {
			count: blocks.length,
			subheads: blocks.filter((b) => b.classList.contains('prose-subhead')).length,
			// Gap above each block, paired with what kind of block follows it.
			gaps: blocks.slice(1).map((b, i) => ({
				subhead: b.classList.contains('prose-subhead'),
				gap: Math.round(rect(b).top - rect(blocks[i]).bottom)
			}))
		};
	});

	expect(geometry.count).toBeGreaterThan(1);
	expect(geometry.subheads).toBe(5);
	for (const { gap } of geometry.gaps) expect(gap).toBeGreaterThan(0);

	// A subhead belongs to the section it opens: further from the text above
	// than from the text below, or it reads as a bold sentence in the middle.
	const above = Math.min(...geometry.gaps.filter((g) => g.subhead).map((g) => g.gap));
	const between = Math.max(...geometry.gaps.filter((g) => !g.subhead).map((g) => g.gap));
	expect(above).toBeGreaterThan(between);
});

test('the venue page separates what is paid for from what is not', async ({ page }) => {
	await page.goto(`${BASE}/venue`);
	const lists = page.locator('.logistics-list');
	await expect(lists).toHaveCount(2);
	await expect(lists.nth(0).getByRole('listitem')).toHaveCount(5);
	await expect(lists.nth(1).getByRole('listitem')).toHaveCount(3);
	await expect(page.getByRole('heading', { name: 'Not covered' })).toBeVisible();

	// Three links called "Visit website" went to three different places. The
	// accessible name has to name which; axe does not flag a duplicated one.
	const names = await page
		.locator('main a')
		.evaluateAll((links) =>
			links.map((a) => a.getAttribute('aria-label') || a.textContent?.trim())
		);
	expect(new Set(names).size).toBe(names.length);
});

test('a figure means the same thing on every page that prints it', async ({ page }) => {
	await page.goto(`${BASE}/`);
	const homeCountries = await page
		.locator('main dl a[href$="#affiliations"] dd, main dl a[href$="#affiliations"]')
		.first()
		.innerText();

	await page.goto(`${BASE}/participants`);
	const header = page.locator('header.bg-cream-dark');
	await expect(header).toContainText(`${homeCountries.trim()} countries`);

	const groups = await header.locator('.meta-item').allInnerTexts();
	const summed = groups
		.map((text) => Number(text.match(/^\d+/)?.[0] ?? 0))
		.filter((value, index) => index < groups.length - 1)
		.reduce((total, value) => total + value, 0);
	const total = Number((await page.getByText(/of \d+ people/).innerText()).match(/of (\d+)/)![1]);
	expect(summed).toBe(total);
});

test("a person's links are real targets, and they sit on one line across a row", async ({
	page
}) => {
	await page.goto(`${BASE}/participants`);
	const cards = page.locator('article.card').filter({ has: page.locator('a[href*="orcid.org"]') });
	const geometry = await cards.evaluateAll((nodes) =>
		nodes.slice(0, 2).map((card) => {
			const row = card.querySelector('a[href*="orcid.org"]')!.parentElement!;
			return {
				bottomGap: card.getBoundingClientRect().bottom - row.getBoundingClientRect().bottom,
				heights: [...row.querySelectorAll('a')].map((link) => link.getBoundingClientRect().height)
			};
		})
	);
	expect(geometry.length).toBe(2);
	for (const card of geometry) {
		for (const height of card.heights) expect(height).toBeGreaterThanOrEqual(44);
	}
	// Same row of the grid, so the link rows land on one line.
	expect(geometry[0].bottomGap).toBeCloseTo(geometry[1].bottomGap, 0);
});

test('what the reader scrolled past is visible, however they got there', async ({ page }) => {
	const stillHidden = () =>
		page.evaluate(
			() =>
				[...document.querySelectorAll('.scroll-reveal')].filter(
					(el) => Number(getComputedStyle(el).opacity) < 0.99
				).length
		);

	await page.goto(`${BASE}/call-for-papers`);
	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
	await expect.poll(stillHidden, { message: 'jumped to the bottom' }).toBe(0);

	await page.goto(`${BASE}/about`);
	await page.keyboard.press('End');
	await expect.poll(stillHidden, { message: 'End key' }).toBe(0);

	// A section taller than ~6.7 viewports, which is what /about is at 320px.
	await page.setViewportSize({ width: 320, height: 640 });
	for (const route of ['/about', '/fr/about']) {
		await page.goto(`${BASE}${route}`);
		const height = await page.evaluate(() => document.body.scrollHeight);
		for (let y = 0; y < height; y += 320) {
			await page.evaluate((to) => window.scrollTo(0, to), y);
		}
		await expect.poll(stillHidden, { message: `${route} at 320px` }).toBe(0);
	}
});

test("an abstract's own section headings are in the document outline", async ({ page }) => {
	for (const [route, abstractHeading] of [
		[`${BASE}/papers/frugal-infrastructures`, 'Abstract'],
		[`${BASE}/fr/papers/frugal-infrastructures`, 'Résumé']
	]) {
		await page.goto(route);
		const outline = await page.evaluate(() =>
			[...document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6')].map(
				(h) => ({
					level: Number(h.tagName[1]),
					text: h.textContent!.trim(),
					subhead: h.classList.contains('prose-subhead')
				})
			)
		);

		// The heading is UI copy, so it follows the page's locale…
		expect(outline.filter((h) => h.text === abstractHeading)).toHaveLength(1);
		// …and the author's five are below it, one level down.
		const subheads = outline.filter((h) => h.subhead);
		expect(subheads).toHaveLength(5);
		for (const subhead of subheads) expect(subhead.level).toBe(3);

		// One h1, and no level skipped anywhere on the route.
		expect(outline.filter((h) => h.level === 1)).toHaveLength(1);
		for (let i = 1; i < outline.length; i++) {
			expect(outline[i].level - outline[i - 1].level).toBeLessThanOrEqual(1);
		}
	}
});
