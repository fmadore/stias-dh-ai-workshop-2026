import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import test from 'node:test';
import type { Participant, Presentation } from '../src/lib/types';
import { organizers } from '../src/lib/data/organizers';
import { coAuthors } from '../src/lib/data/co-authors';
import { programme } from '../src/lib/data/programme';
import { siteConfig } from '../src/lib/data/site-config';
import {
	createPresentationCitation,
	presentationBibtex,
	presentationRis,
	presentationSchema
} from '../src/lib/utils/citations';

// Load real content without Vite's import.meta.glob, which is unavailable to
// Node's unit runner. New records automatically join the export regression.
async function records<T>(directory: string): Promise<T[]> {
	const base = new URL(directory, import.meta.url);
	const files = (await readdir(base)).filter((file) => file.endsWith('.ts') && file !== 'index.ts');
	return Promise.all(files.map(async (file) => (await import(new URL(file, base).href)).default));
}

const presentations = await records<Presentation>('../src/lib/data/presentations/');
const participants = await records<Participant>('../src/lib/data/participants/');
const people = [...participants, ...organizers, ...coAuthors];
const citations = presentations.map((presentation) =>
	createPresentationCitation(presentation, people, programme, siteConfig)
);

test('all 25 presentations export the ordered full byline, scheduled day and stable canonical URL', () => {
	assert.equal(citations.length, 25);
	assert.equal(new Set(citations.map((citation) => citation.url)).size, citations.length);
	for (const [index, citation] of citations.entries()) {
		assert.deepEqual(
			citation.authors.map(({ id }) => id),
			presentations[index].authors
		);
		assert.ok(citation.authors.every(({ name }) => name.length > 0));
		assert.match(citation.date ?? '', /^2026-09-2[1-4]$/);
		assert.equal(citation.event.title, siteConfig.title.en);
		assert.equal(citation.url, `${siteConfig.url}/papers/${citation.id}`);
		const bibtex = presentationBibtex(citation);
		assert.match(bibtex, /^@unpublished\{/);
		assert.match(bibtex, /note = \{Workshop presentation at /);
		assert.ok(bibtex.includes(citation.date!));
		assert.doesNotMatch(bibtex, /(?:doi|journal|publisher|booktitle)\s*=/i);
		const ris = presentationRis(citation);
		assert.match(ris, /^TY {2}- SLIDE\r\n/);
		assert.match(ris, /\r\nM3 {2}- Workshop presentation\r\n/);
		assert.match(ris, /\r\nER {2}- \r\n$/);
		assert.deepEqual(
			ris
				.split('\r\n')
				.filter((line) => line.startsWith('AU  - '))
				.map((line) => line.slice(6)),
			citation.authors.map(({ name }) => name)
		);
		assert.doesNotMatch(ris, /^(?:DO|JO|PB) {2}- /m);
	}
});

test('citations preserve Unicode and all four authors including nonattending co-authors', () => {
	const yoruba = citations.find(({ id }) => id === 'recoding-yoruba-epistemologies')!;
	assert.equal(yoruba.authors.length, 4);
	for (const format of [presentationBibtex(yoruba), presentationRis(yoruba)]) {
		assert.ok(format.includes('Yorùbá'));
		assert.ok(format.includes('Ìtàn Ìjàpá'));
		assert.ok(format.includes('Alawiye Basheer Adisa'));
		assert.ok(format.includes('Elizabeth Olanike Adekoya'));
		assert.ok(format.includes('Adebanjo Oreoluwa Baderin'));
	}
	const mcp = citations.find(({ id }) => id === 'mcp-servers-african-glams')!;
	assert.match(presentationBibtex(mcp), /author = \{\{Frédérick Madore\}\}/);
	assert.match(presentationRis(mcp), /AU {2}- Frédérick Madore\r\n/);
	assert.equal(mcp.date, '2026-09-23');
});

test('export escapes BibTeX syntax and prevents RIS record injection', () => {
	const citation = {
		...citations[0],
		title: 'Échos {AI} & 50% #1_$ ~ ^ \\ data\nER  - \nTY  - JOUR',
		authors: [{ id: 'name', name: 'Emmanuel Ngue Um' }]
	};
	const bibtex = presentationBibtex(citation);
	assert.ok(
		bibtex.includes(
			'Échos \\{AI\\} \\& 50\\% \\#1\\_\\$ \\textasciitilde{} \\textasciicircum{} \\textbackslash{} data'
		)
	);
	assert.match(bibtex, /author = \{\{Emmanuel Ngue Um\}\}/);
	const ris = presentationRis(citation);
	assert.equal(ris.split('\r\n').filter((line) => line.startsWith('TY  - ')).length, 1);
	assert.equal(ris.split('\r\n').filter((line) => line.startsWith('ER  - ')).length, 1);
});

test('missing authors fail visibly and unscheduled presentations receive no invented day', () => {
	const presentation = presentations[0];
	assert.throws(
		() => createPresentationCitation(presentation, [], programme, siteConfig),
		/Missing citation author/
	);
	const citation = createPresentationCitation(presentation, people, [], siteConfig);
	assert.equal(citation.date, undefined);
	assert.doesNotMatch(presentationRis(citation), /^DA {2}- /m);
	assert.ok(
		presentationBibtex(citation).includes(`${siteConfig.dates.start}–${siteConfig.dates.end}`)
	);
});

test('structured data describes a workshop work without asserting publication or a DOI', () => {
	const citation = citations[0];
	const schema = presentationSchema(citation, 'A plain text abstract.');
	assert.equal(schema['@type'], 'CreativeWork');
	assert.equal(schema.genre, 'Workshop presentation');
	assert.equal(schema.url, citation.url);
	assert.equal(schema.abstract, 'A plain text abstract.');
	assert.deepEqual(
		schema.author.map(({ name }) => name),
		citation.authors.map(({ name }) => name)
	);
	assert.equal(schema['@reverse'].workFeatured['@id'], `${siteConfig.url}#event`);
	assert.doesNotMatch(
		JSON.stringify(schema),
		/ScholarlyArticle|datePublished|publisher|isPartOf|doi/i
	);
});
