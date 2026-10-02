import { base } from '$app/paths';
import { setLocale } from '$lib/paraglide/runtime';
import { localeFromPath } from '$lib/utils/localized-paths';
import type { LayoutLoad } from './$types';

export const prerender = true;

/**
 * The root layout also runs for unmatched URLs. Resolving the locale here
 * keeps the navigation, footer and error body in the same language.
 *
 * The Paraglide global is safe for this sequential static build. Keep locale
 * links as full navigations; use request-scoped locale resolution before
 * introducing concurrent server rendering.
 */
export const load: LayoutLoad = ({ url }) => {
	const lang = localeFromPath(url.pathname, base);
	setLocale(lang, { reload: false });
	return { lang };
};
