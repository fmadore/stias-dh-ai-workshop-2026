import { base } from '$app/paths';
import { getLocale, baseLocale } from '$lib/paraglide/runtime';
import type { LocalizedString } from '$lib/types';
import { localizedPath, type SupportedLocale } from './localized-paths';

export function t(str: LocalizedString): string {
	const locale = getLocale();
	return str[locale as keyof LocalizedString] ?? str.en;
}

export function localePath(path: string): string {
	return localizedPath(path, getLocale() as SupportedLocale, base, baseLocale as SupportedLocale);
}

/**
 * Prerender entries for the optional `[[lang]]` segment — every localized
 * page re-exports this so both `/…` and `/fr/…` are generated.
 */
export const langEntries = () => [{ lang: '' }, { lang: 'fr' }];
