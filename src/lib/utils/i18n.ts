import { base } from '$app/paths';
import { getLocale, baseLocale } from '$lib/paraglide/runtime';
import type { LocalizedString, Presentation } from '$lib/types';
import { localizedPath, type SupportedLocale } from './localized-paths';

export function t(str: LocalizedString): string {
	const locale = getLocale();
	return str[locale as keyof LocalizedString] ?? str.en;
}

export function localePath(path: string): string {
	return localizedPath(path, getLocale() as SupportedLocale, base, baseLocale as SupportedLocale);
}

/**
 * An abstract together with the language it is actually written in — the pair
 * has to travel together, because the two answers come apart. Nearly every
 * abstract is one string in its author's own language and reads the same on
 * both locales; one supplied in both halves follows the reader instead, and
 * then `presentation.language` is the wrong `lang` to render it under, since
 * that field describes the talk and a translated abstract does not change it.
 */
export function resolveAbstract(
	presentation: Pick<Presentation, 'abstract' | 'language'>,
	locale: SupportedLocale = getLocale() as SupportedLocale
): { text: string; lang: SupportedLocale } | undefined {
	const { abstract } = presentation;
	if (!abstract) return undefined;
	if (typeof abstract === 'string') return { text: abstract, lang: presentation.language };
	return { text: abstract[locale] ?? abstract.en, lang: locale };
}

/**
 * Every text an abstract carries, for search haystacks: a reader typing a
 * French word should reach a bilingual abstract from the English page too.
 */
export function abstractVariants(abstract: Presentation['abstract']): string[] {
	if (!abstract) return [];
	return typeof abstract === 'string' ? [abstract] : [abstract.en, abstract.fr];
}

/**
 * Prerender entries for the optional `[[lang]]` segment — every localized
 * page re-exports this so both `/…` and `/fr/…` are generated.
 */
export const langEntries = () => [{ lang: '' }, { lang: 'fr' }];
