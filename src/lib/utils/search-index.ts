import type { FullText } from './filter';

export interface SearchIndex {
	people: FullText;
	papers: FullText;
}

function isStringRecord(value: unknown): value is Record<string, string> {
	return (
		value !== null &&
		typeof value === 'object' &&
		!Array.isArray(value) &&
		Object.values(value).every((text) => typeof text === 'string')
	);
}

/** Reject error documents or malformed indexes before search consumes them. */
export function parseSearchIndex(value: unknown): SearchIndex {
	if (
		value === null ||
		typeof value !== 'object' ||
		!('people' in value) ||
		!('papers' in value) ||
		!isStringRecord(value.people) ||
		!isStringRecord(value.papers)
	) {
		throw new Error('Invalid search index');
	}
	return {
		people: new Map(Object.entries(value.people)),
		papers: new Map(Object.entries(value.papers))
	};
}
