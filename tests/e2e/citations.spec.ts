import { expect, test, BASE } from './fixtures';

test('both paper locales offer static citations that retain the complete byline', async ({
	page,
	request
}) => {
	const slug = 'recoding-yoruba-epistemologies';
	for (const [locale, heading, bibtexLabel, risLabel] of [
		['', 'Cite this presentation', 'Download BibTeX', 'Download RIS'],
		[
			'/fr',
			'Citer cette communication',
			'Télécharger le fichier BibTeX',
			'Télécharger le fichier RIS'
		]
	]) {
		await page.goto(`${BASE}${locale}/papers/${slug}`);
		await expect(page.getByRole('heading', { name: heading })).toBeVisible();
		for (const [label, extension, firstLine] of [
			[bibtexLabel, 'bib', '@unpublished{'],
			[risLabel, 'ris', 'TY  - SLIDE']
		]) {
			const link = page.getByRole('link', { name: label });
			await expect(link).toHaveAttribute('download', '');
			await expect(link).toHaveAttribute('href', `${BASE}/citations/${slug}.${extension}`);
			const response = await request.get(`http://127.0.0.1:4317${await link.getAttribute('href')}`);
			expect(response.ok()).toBeTruthy();
			const content = await response.text();
			expect(content.startsWith(firstLine)).toBeTruthy();
			expect(content).toContain('Yorùbá');
			for (const name of [
				'Hammed Olalekan Lawal',
				'Alawiye Basheer Adisa',
				'Elizabeth Olanike Adekoya',
				'Adebanjo Oreoluwa Baderin'
			])
				expect(content).toContain(name);
			expect(content).toContain(`https://fmadore.github.io${BASE}/papers/${slug}`);
		}
	}
});

test('paper metadata describes a presentation and links the canonical workshop', async ({
	page
}) => {
	await page.goto(`${BASE}/fr/papers/mcp-servers-african-glams`);
	const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
	const schema = schemas
		.map((text) => JSON.parse(text))
		.find((item) => item.genre === 'Workshop presentation');
	expect(schema['@type']).toBe('CreativeWork');
	expect(schema['@reverse'].workFeatured['@id']).toBe(`https://fmadore.github.io${BASE}#event`);
	expect(schema.author.map((author: { name: string }) => author.name)).toEqual([
		'Frédérick Madore'
	]);
	expect(schema).not.toHaveProperty('datePublished');
	expect(schemas.join('')).not.toContain('ScholarlyArticle');
	await expect(page.locator('link[rel="alternate"][type="application/x-bibtex"]')).toHaveAttribute(
		'href',
		`${BASE}/citations/mcp-servers-african-glams.bib`
	);
});
