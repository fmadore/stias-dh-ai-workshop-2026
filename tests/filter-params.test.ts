import assert from 'node:assert/strict';
import test from 'node:test';
import { parseFilters, filterUrl } from '../src/lib/utils/filter-params';

test('filter URLs validate countries, languages and grouping', () => {
	assert.deepEqual(
		parseFilters(new URLSearchParams('q=Madore&country=ZA&language=fr&group=country'), ['ZA']),
		{
			query: 'Madore',
			country: 'ZA',
			language: 'fr',
			grouping: 'country'
		}
	);
	assert.deepEqual(parseFilters(new URLSearchParams('country=XX&language=xx&group=bad'), ['ZA']), {
		query: '',
		country: null,
		language: null,
		grouping: 'none'
	});
});

test('filter URLs preserve accents, unrelated parameters and fragments without empty defaults', () => {
	const url = new URL('https://example.org/papers?ref=colleague#results');
	const state = {
		query: 'Frédérick & AI',
		country: null,
		language: null,
		grouping: 'none'
	} as const;
	const encoded = filterUrl(url, state);
	assert.deepEqual(parseFilters(encoded.searchParams, []), state);
	assert.equal(encoded.searchParams.get('ref'), 'colleague');
	assert.equal(encoded.hash, '#results');
	assert.equal(filterUrl(encoded, { ...state, query: '' }).search, '?ref=colleague');
});
