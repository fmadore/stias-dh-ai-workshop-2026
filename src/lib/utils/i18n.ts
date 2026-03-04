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
