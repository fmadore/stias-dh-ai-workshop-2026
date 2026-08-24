import AxeBuilder from '@axe-core/playwright';
import { devices, expect, test } from '@playwright/test';

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

test('the programme day bar stays one row at the narrowest supported width', async ({ page }) => {
	// --day-bar-height is a declared constant that days and sessions consume as
	// scroll-margin-top. At 320px the four pills used to wrap to a second row and
	// the bar rendered 113px against a token that still said 61px, so jumping to
	// a day landed its heading 36px *behind* the bar. French is the wider locale
	// and the one that fails first.
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
	await page.waitForTimeout(600);
	await expect(page).toHaveURL(/#day-/);
	const clearance = await page.evaluate(() => {
		const nav = document.querySelector('nav[aria-label="Aller au jour"]')!;
		const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
		if (!target) throw new Error(`no element for ${location.hash}`);
		return target.getBoundingClientRect().top - nav.getBoundingClientRect().bottom;
	});
	expect(clearance).toBeGreaterThan(0);
});

test('the session permalink is a real target on touch', async ({ browser }) => {
	// It was `opacity: 0` until `group-hover` on a 12x12 box: invisible on the
	// device the programme is read on, half of WCAG 2.5.8's 24x24 minimum, and
	// 1.44:1 against the dark card. Nothing in lint, svelte-check or axe sees
	// any of those three.
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

test('the map stylesheet stays off the critical path until the map is wanted', async ({ page }) => {
	// Imported statically, maplibre-gl.css was hoisted into the route stylesheet:
	// 83,143 of 89,906 bytes, render-blocking on /participants for every visitor
	// including those who never scroll to the map. The renderer was already lazy;
	// its stylesheet was not.
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

	// The three addresses are static markup: the two cards below the map, and
	// the chip row that drives it. They are the fallback when the renderer never
	// arrives, so they must be there before anything is loaded.
	await expect(page.getByRole('button', { name: 'Roosenwijn Guest House' })).toBeAttached();
	await expect(page.getByRole('button', { name: 'De Haas Luxury Living' })).toBeAttached();
	await expect(page.getByText('750 m from STIAS')).toBeVisible();

	await page.locator('.venue-map').scrollIntoViewIfNeeded();
	await expect(page.locator('.venue-marker')).toHaveCount(3, { timeout: 15_000 });
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

test('the at-a-glance figures lead to what they count', async ({ page }) => {
	// The three most clickable-looking objects on the home page were inert <dd>
	// elements. Nothing else sees this: lint and svelte-check have no opinion on
	// a number that should be a link, axe does not flag text for not being one,
	// and check-links drops the fragment, so a missing #affiliations id would
	// leave the countries figure pointing at the top of a page 15 screens long.
	await page.goto(`${BASE}/`);
	const figures = page.locator('main dl a');
	await expect(figures).toHaveCount(3);
	await expect(figures.nth(0)).toHaveAttribute('href', `${BASE}/papers`);
	await expect(figures.nth(1)).toHaveAttribute('href', `${BASE}/participants`);
	await expect(figures.nth(2)).toHaveAttribute('href', `${BASE}/participants#affiliations`);

	// Wait for the destination document, not just the click: without this the
	// evaluate below can run against the home page still being torn down, which
	// fails as "no #affiliations" on a slow machine and passes on a fast one.
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
	// `.prose p { margin-block: 0 }` (0,1,1) outranked `.prose > * + *` (0,1,0)
	// two lines above it, so every abstract on the site rendered as one
	// unbroken column: 66 lines with no paragraph break on the longest. It
	// looked like a reset and reset nothing — Tailwind's preflight already
	// zeroes `*`. No tool sees a paragraph gap that is zero.
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
	// One 43-word sentence used to carry both, with the half a traveller has to
	// budget for sitting after a "However,". The two lists and the archival
	// sentence now come from one source; `tests/logistics.test.ts` guards that
	// the sentence still composes, and this guards that the page still splits.
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

test('nothing tweens or travels when the reader has asked for less motion', async ({ browser }) => {
	// DESIGN.md promises motion is "fully surrendered under prefers-reduced-motion",
	// and the promise was kept by a register: every transition had to remember to
	// enrol. Two never did, one enrolled and lost to Svelte's scoped specificity,
	// and twelve were measured surviving on /programme alone. The register is a
	// floor now — and this is what stops it becoming a register again.
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

	// The skip link is not asserted through `:focus-visible`. It is the first
	// thing a keyboard user meets and it does travel, but whether the pseudo-class
	// matches a synthetic Tab is a browser heuristic: it matched on every local
	// run and did not on CI's headless Linux Chromium, which made this a flaky
	// guard rather than a failing one. Nothing is lost — the sweep above covers
	// `.skip-link` like any other element, and it was the first survivor it
	// listed when this test was checked against the pre-fix tree. An instant
	// reposition with no tween is not motion; a re-introduced tween is, and that
	// is what the sweep catches.

	await context.close();
});

test('a figure means the same thing on every page that prints it', async ({ page }) => {
	// The home page counted the countries of paper *authors* and linked that
	// figure at the map of *people*, which is a different set — Point Sud's
	// co-director is in Bamako and presents nothing. So the home page said 16
	// and the page one click away said 17. Nothing sees a number that is true
	// about the wrong population: both come from real helpers over real data,
	// and each page is self-consistent on its own.
	await page.goto(`${BASE}/`);
	const homeCountries = await page
		.locator('main dl a[href$="#affiliations"] dd, main dl a[href$="#affiliations"]')
		.first()
		.innerText();

	await page.goto(`${BASE}/participants`);
	const header = page.locator('header.bg-cream-dark');
	await expect(header).toContainText(`${homeCountries.trim()} countries`);

	// The header enumerates the page's three groups; the filter counts all of
	// them. The Point Sud section was left out of the header when `harden`
	// widened the filter to cover it, so the row summed to 37 while the control
	// below it said 39.
	const groups = await header.locator('.meta-item').allInnerTexts();
	const summed = groups
		.map((text) => Number(text.match(/^\d+/)?.[0] ?? 0))
		.filter((value, index) => index < groups.length - 1)
		.reduce((total, value) => total + value, 0);
	const total = Number((await page.getByText(/of \d+ people/).innerText()).match(/of (\d+)/)![1]);
	expect(summed).toBe(total);
});

test('the wordmark says the whole thing on a phone, at the header height', async ({ page }) => {
	// `truncate` clipped the qualifier below 414px in English and 480px in
	// French — every phone — and what it cut was the year: "AFRICAN STUDIES ·
	// STIA…". An ellipsis is a rendering, not an error: no tool reports one,
	// and the header's own height is what makes the fix non-obvious, since
	// --nav-height feeds main's padding, scroll-padding and the day bar.
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

test("a person's links are real targets, and they sit on one line across a row", async ({
	page
}) => {
	// `a.link-arrow` carries the documented 2.75rem floor; the ORCID link beside
	// it never had one, so two links doing the same job in the same row measured
	// 44px and 20px. And every level between the card and that row stopped at
	// its content, so the links floated wherever the bio ended — 195px apart on
	// two cards the grid had already stretched to the same height.
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
	// ScrollReveal answered "is it on screen now" when the question is "has the
	// reader reached it". Anything a jump skipped was never intersecting and
	// never would be again, so it stayed at opacity 0 for good: a reload with
	// scroll restoration hid all nine sections of the call for papers, and the
	// End key hid the whole of /about. Separately, its 0.15 threshold is a
	// fraction of the ELEMENT, so at 320px the /about abstract — 4905px tall in
	// English, 5703px in French — could not reach it on any scroll at all.
	//
	// Nothing sees either one. The content is in the DOM and reads correctly to
	// assistive technology; it is only invisible. And every check anyone runs
	// scrolls from the top, which is the one path that always worked.
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

// Both themes. The dark half is not redundant: `--ink-subtle` measured 4.65:1
// on the page background and 3.93:1 on a raised card, so it passed everywhere
// most muted text lives and failed on /programme's session cards — thirteen AA
// failures that a light-only scan could never have reported.
for (const colorScheme of ['light', 'dark'] as const) {
	for (const route of ['/', '/fr', '/programme', '/participants', '/call-for-papers', '/venue']) {
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
