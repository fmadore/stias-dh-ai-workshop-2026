import { base } from '$app/paths';
import { getLocale, baseLocale } from '$lib/paraglide/runtime';
import type { LocalizedString } from '$lib/types';

export function t(str: LocalizedString): string {
	const locale = getLocale();
	return str[locale as keyof LocalizedString] ?? str.en;
}

export function localePath(path: string): string {
	const locale = getLocale();
	const prefix = locale === baseLocale ? '' : `/${locale}`;
	return `${base}${prefix}${path}`;
}

/**
 * Prerender entries for the optional `[[lang]]` segment — every localized
 * page re-exports this so both `/…` and `/fr/…` are generated.
 */
export const langEntries = () => [{ lang: '' }, { lang: 'fr' }];
