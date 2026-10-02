import assert from 'node:assert/strict';
import test from 'node:test';
import {
	abstractSearchText,
	filterPeople,
	filterPresentations,
	normalize
} from '../src/lib/utils/filter';
import type { PaperListing, Participant } from '../src/lib/types/index';
import masakhane from '../src/lib/data/presentations/masakhane-4d-framework';
import { parseSearchIndex } from '../src/lib/utils/search-index';

test('the downloaded index must contain string maps for both directories', () => {
	const index = parseSearchIndex({
		people: { person: 'a biography' },
		papers: { paper: 'an abstract' }
	});
	assert.equal(index.people.get('person'), 'a biography');
	assert.equal(index.papers.get('paper'), 'an abstract');
	for (const invalid of [
		null,
		'<html>Not found</html>',
		{},
		{ people: [] as string[], papers: {} },
		{ people: {}, papers: null },
		{ people: { person: 123 }, papers: {} }
	]) {
		assert.throws(() => parseSearchIndex(invalid), /Invalid search index/);
	}
});

test('search finds visible phrases across Markdown formatting in an actual abstract', () => {
	const text = abstractSearchText(masakhane.abstract);
	assert.ok(text.includes(normalize('ECHO focuses')));
	assert.ok(text.includes(normalize('Lingua Africa explores')));
	assert.ok(text.includes(normalize('Discover focuses')));
});

test('search normalizes whitespace and both supplied abstract languages', () => {
	const text = abstractSearchText({
		en: 'A **digital**\narchive.\n\nKnowledge *across* borders.',
		fr: 'Une [étude](https://example.org) des\n\narchives africaines.'
	});
	for (const query of [' digital   archive ', 'knowledge across borders', 'ETUDE des archives']) {
		assert.ok(text.includes(normalize(query)), query);
	}
	assert.equal(abstractSearchText(undefined), '');
});

test('full-text matches respect combined paper and participant filters', () => {
	const paper: PaperListing = {
		id: masakhane.id,
		title: masakhane.title,
		language: masakhane.language,
		authors: [],
		countries: ['ZA', 'NG']
	};
	const person: Participant = {
		id: 'author',
		name: 'Researcher',
		country: 'ZA',
		affiliation: { en: 'University', fr: 'Université' }
	};
	const paperText = new Map([[paper.id, abstractSearchText(masakhane.abstract)]]);
	const peopleText = new Map([[person.id, paperText.get(paper.id)!]]);
	const filters = { query: 'ECHO focuses', country: 'ZA', language: 'en' } as const;
	assert.equal(filterPresentations([paper], filters, paperText).length, 1);
	assert.equal(filterPresentations([paper], { ...filters, country: 'DE' }, paperText).length, 0);
	assert.equal(filterPeople([person], filters, () => [paper], peopleText).length, 1);
	assert.equal(filterPeople([person], filters, () => [], peopleText).length, 0);
});
