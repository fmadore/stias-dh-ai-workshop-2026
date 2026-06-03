import type { Presentation } from '$lib/types';
import { getPresentationAuthors } from '$lib/data/presentations';

export interface PaperFilterOptions {
	query: string;
	country: string | null;
	language: 'en' | 'fr' | null;
}

function normalize(input: string): string {
	return input
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '');
}

export function filterPresentations(
	presentations: Presentation[],
	{ query, country, language }: PaperFilterOptions
): Presentation[] {
	const q = normalize(query.trim());

	return presentations.filter((p) => {
		if (language && p.language !== language) return false;

		const authors = getPresentationAuthors(p);

		if (country && !authors.some((a) => a.country === country)) return false;

		if (!q) return true;

		const haystack = normalize(
			[
				p.title,
				p.abstract ?? '',
				...authors.flatMap((a) => [a.name, a.affiliation.en, a.affiliation.fr])
			].join(' ')
		);

		return haystack.includes(q);
	});
}

export function uniquePaperCountries(presentations: Presentation[]): string[] {
	const countries = new Set<string>();
	for (const p of presentations) {
		for (const a of getPresentationAuthors(p)) {
			countries.add(a.country);
		}
	}
	return Array.from(countries).sort((a, b) => a.localeCompare(b));
}
