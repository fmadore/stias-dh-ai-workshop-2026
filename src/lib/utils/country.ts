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
