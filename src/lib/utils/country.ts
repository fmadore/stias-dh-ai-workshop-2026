import type { CountryCode } from '$lib/types';

export type CountryLocale = 'en' | 'fr';

const displayNames = new Map<CountryLocale, Intl.DisplayNames>();

export function countryName(code: CountryCode, locale: CountryLocale): string {
	let formatter = displayNames.get(locale);
	if (!formatter) {
		formatter = new Intl.DisplayNames([locale], { type: 'region' });
		displayNames.set(locale, formatter);
	}
	return formatter.of(code) ?? code;
}

export function countrySearchTerms(code: CountryCode): string[] {
	return [countryName(code, 'en'), countryName(code, 'fr')];
}

const collators = new Map<CountryLocale, Intl.Collator>();

/**
 * Alphabetical by the name the reader actually sees. Sorting the ISO codes
 * instead puts Germany (DE) before Gambia (GM) and Chad (TD) second-to-last —
 * the codes have no relation to either alphabet.
 */
export function sortCountriesByName(
	codes: Iterable<CountryCode>,
	locale: CountryLocale
): CountryCode[] {
	let collator = collators.get(locale);
	if (!collator) {
		collator = new Intl.Collator(locale, { sensitivity: 'base' });
		collators.set(locale, collator);
	}
	return Array.from(codes).sort((a, b) =>
		collator.compare(countryName(a, locale), countryName(b, locale))
	);
}
