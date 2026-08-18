import type { CountryCode, LocalizedString, Presentation } from '$lib/types';
import { getParticipantPresentations, getPresentationAuthors } from '$lib/data/presentations';
import { countrySearchTerms } from './country';

/** Search/filter state shared by the participants and papers pages. */
export interface FilterOptions {
	query: string;
	country: CountryCode | null;
	language: 'en' | 'fr' | null;
}

/** Case- and diacritic-insensitive normalisation for search matching. */
function normalize(input: string): string {
	return input
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '');
}

/**
 * Codes only — display order is the FilterBar's job, since it depends on the
 * locale the names are rendered in (see `sortCountriesByName`).
 */
function uniqueCountries(countries: Iterable<CountryCode>): CountryCode[] {
	return Array.from(new Set(countries));
}

/**
 * The minimum a person needs to be searchable in the directory. Deliberately
 * structural rather than `Participant`: the same predicate has to run over
 * organisers and Point Sud representatives, who are separate types with the
 * same searchable surface. The filter used to narrow only the participants
 * array while those two sections rendered unfiltered above it, so searching a
 * convenor's name reported "1 of 33" while the convenor sat, unmatched, on
 * screen.
 */
export interface FilterablePerson {
	id: string;
	name: string;
	affiliation: LocalizedString;
	country: CountryCode;
	bio?: LocalizedString;
}

export function filterPeople<T extends FilterablePerson>(
	people: T[],
	{ query, country, language }: FilterOptions
): T[] {
	const q = normalize(query.trim());

	return people.filter((p) => {
		if (country && p.country !== country) return false;

		// Resolved by id, so it works for anyone in the registry, not only for
		// people who live in the participants list.
		const papers = getParticipantPresentations(p);

		if (language && !papers.some((pp) => pp.language === language)) return false;

		if (!q) return true;

		const haystack = normalize(
			[
				p.name,
				p.affiliation.en,
				p.affiliation.fr,
				...countrySearchTerms(p.country),
				p.bio?.en ?? '',
				p.bio?.fr ?? '',
				...papers.flatMap((pp) => [pp.title, pp.abstract ?? ''])
			].join(' ')
		);

		return haystack.includes(q);
	});
}

export function uniquePersonCountries(people: FilterablePerson[]): CountryCode[] {
	return uniqueCountries(people.map((p) => p.country));
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

export function uniquePaperCountries(presentations: Presentation[]): CountryCode[] {
	return uniqueCountries(
		presentations.flatMap((p) => getPresentationAuthors(p).map((a) => a.country))
	);
}
