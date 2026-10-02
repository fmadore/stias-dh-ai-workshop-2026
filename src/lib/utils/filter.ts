import type {
	CountryCode,
	LocalizedString,
	PaperListing,
	PaperSummary,
	Presentation
} from '$lib/types';
import { countrySearchTerms } from './country';
import { abstractToPlainText, abstractVariants } from './text';

/** Search/filter state shared by the participants and papers pages. */
export interface FilterOptions {
	query: string;
	country: CountryCode | null;
	language: 'en' | 'fr' | null;
}

/** Case- and diacritic-insensitive normalisation for search matching. */
export function normalize(input: string): string {
	return input
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Search what readers see, including phrases across Markdown boundaries. */
export function abstractSearchText(abstract: Presentation['abstract']): string {
	return normalize(abstractVariants(abstract).map(abstractToPlainText).join(' '));
}

/**
 * Bios or abstracts, normalised, by person or paper id — the heavy half of
 * search, which `full-text.ts` builds once it has been fetched. Until then a
 * query matches names, affiliations, countries and titles only.
 */
export type FullText = ReadonlyMap<string, string>;

/**
 * Each record's own searchable text, normalised once and kept. It used to be
 * re-joined and NFD-normalised for every record on every keystroke — bios and
 * abstracts included — to produce a string that never changes.
 */
const haystacks = new WeakMap<object, string>();

function haystack(record: object, fields: () => string[]): string {
	let text = haystacks.get(record);
	if (text === undefined) {
		text = normalize(fields().join(' '));
		haystacks.set(record, text);
	}
	return text;
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
}

export function filterPeople<T extends FilterablePerson>(
	people: T[],
	{ query, country, language }: FilterOptions,
	/** A person's papers by id, so organisers match on what they present too. */
	papersOf: (personId: string) => readonly PaperSummary[],
	fullText?: FullText
): T[] {
	const q = normalize(query.trim());

	return people.filter((p) => {
		if (country && p.country !== country) return false;

		const papers = papersOf(p.id);

		if (language && !papers.some((pp) => pp.language === language)) return false;

		if (!q) return true;

		const own = haystack(p, () => [
			p.name,
			p.affiliation.en,
			p.affiliation.fr,
			...countrySearchTerms(p.country),
			...papers.map((pp) => pp.title)
		]);

		return own.includes(q) || (fullText?.get(p.id)?.includes(q) ?? false);
	});
}

export function uniquePersonCountries(people: FilterablePerson[]): CountryCode[] {
	return uniqueCountries(people.map((p) => p.country));
}

export function filterPresentations(
	papers: PaperListing[],
	{ query, country, language }: FilterOptions,
	fullText?: FullText
): PaperListing[] {
	const q = normalize(query.trim());

	return papers.filter((p) => {
		if (language && p.language !== language) return false;

		if (country && !p.countries.includes(country)) return false;

		if (!q) return true;

		const own = haystack(p, () => [
			p.title,
			...p.authors.flatMap((a) => [a.name, a.affiliation?.en ?? '', a.affiliation?.fr ?? ''])
		]);

		return own.includes(q) || (fullText?.get(p.id)?.includes(q) ?? false);
	});
}

export function uniquePaperCountries(papers: PaperListing[]): CountryCode[] {
	return uniqueCountries(papers.flatMap((p) => p.countries));
}
