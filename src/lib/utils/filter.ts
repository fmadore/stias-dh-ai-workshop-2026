import type { Participant, Presentation } from '$lib/types';
import { getParticipantPresentations, getPresentationAuthors } from '$lib/data/presentations';

/** Search/filter state shared by the participants and papers pages. */
export interface FilterOptions {
	query: string;
	country: string | null;
	language: 'en' | 'fr' | null;
}

/** Case- and diacritic-insensitive normalisation for search matching. */
function normalize(input: string): string {
	return input
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '');
}

function sortedCountries(countries: Iterable<string>): string[] {
	return Array.from(new Set(countries)).sort((a, b) => a.localeCompare(b));
}

export function filterParticipants(
	participants: Participant[],
	{ query, country, language }: FilterOptions
): Participant[] {
	const q = normalize(query.trim());

	return participants.filter((p) => {
		if (country && p.country !== country) return false;

		const papers = getParticipantPresentations(p);

		if (language && !papers.some((pp) => pp.language === language)) return false;

		if (!q) return true;

		const haystack = normalize(
			[
				p.name,
				p.affiliation.en,
				p.affiliation.fr,
				p.country,
				p.bio?.en ?? '',
				p.bio?.fr ?? '',
				...papers.flatMap((pp) => [pp.title, pp.abstract ?? ''])
			].join(' ')
		);

		return haystack.includes(q);
	});
}

export function uniqueParticipantCountries(participants: Participant[]): string[] {
	return sortedCountries(participants.map((p) => p.country));
}

export function filterPresentations(
	presentations: Presentation[],
	{ query, country, language }: FilterOptions
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
	return sortedCountries(
		presentations.flatMap((p) => getPresentationAuthors(p).map((a) => a.country))
	);
}
