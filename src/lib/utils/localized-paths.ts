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
