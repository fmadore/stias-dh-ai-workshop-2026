import { getLocale } from '$lib/paraglide/runtime';
import type { LocalizedString } from '$lib/types';

export function t(str: LocalizedString): string {
	const locale = getLocale();
	return str[locale as keyof LocalizedString] ?? str.en;
}
