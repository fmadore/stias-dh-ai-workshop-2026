export type SupportedLocale = 'en' | 'fr';

/** Ensure every internal route is represented by one leading slash. */
export function normalizeRoutePath(path: string): string {
	if (!path || path === '/') return '/';
	return `/${path.replace(/^\/+|\/+$/g, '')}`;
}

/**
 * Build the exact path emitted by adapter-static and served by GitHub Pages.
 * The French homepage is `fr.html`, so its public URL is `/fr` (not `/fr/`).
 */
export function localizedPath(
	path: string,
	locale: SupportedLocale,
	base = '',
	baseLocale: SupportedLocale = 'en'
): string {
	const route = normalizeRoutePath(path);
	const prefix = locale === baseLocale ? '' : `/${locale}`;

	if (route === '/') {
		return prefix ? `${base}${prefix}` : `${base}/`;
	}

	return `${base}${prefix}${route}`;
}

/** Remove the deployment base and current locale prefix from a browser pathname. */
export function unlocalizedPath(
	pathname: string,
	locale: SupportedLocale,
	base = '',
	baseLocale: SupportedLocale = 'en'
): string {
	let route = base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
	route = normalizeRoutePath(route);

	if (locale !== baseLocale && (route === `/${locale}` || route.startsWith(`/${locale}/`))) {
		route = route.slice(locale.length + 1) || '/';
	}

	return normalizeRoutePath(route);
}

/**
 * The locale a URL belongs to, read from its own path rather than from a
 * matched route parameter. The error page needs this: it renders when no route
 * matched, so `params.lang` is undefined and the locale global still holds
 * whatever the last render set. On a static host there is one 404 document for
 * the whole site, entirely client-rendered, so a visitor landing on a bad
 * French URL was answered in English.
 */
export function localeFromPath(
	pathname: string,
	base = '',
	baseLocale: SupportedLocale = 'en'
): SupportedLocale {
	const route = normalizeRoutePath(
		base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname
	);

	for (const locale of ['en', 'fr'] as const) {
		if (locale === baseLocale) continue;
		if (route === `/${locale}` || route.startsWith(`/${locale}/`)) return locale;
	}

	return baseLocale;
}

export function switchLocalePath(
	pathname: string,
	currentLocale: SupportedLocale,
	newLocale: SupportedLocale,
	base = '',
	baseLocale: SupportedLocale = 'en'
): string {
	return localizedPath(
		unlocalizedPath(pathname, currentLocale, base, baseLocale),
		newLocale,
		base,
		baseLocale
	);
}

export function localizedAbsoluteUrl(
	siteUrl: string,
	path: string,
	locale: SupportedLocale,
	baseLocale: SupportedLocale = 'en'
): string {
	return `${siteUrl.replace(/\/$/, '')}${localizedPath(path, locale, '', baseLocale)}`;
}
