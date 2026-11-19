/**
 * The shared vocabulary of the site's JSON-LD graph: the `@id`s that let a
 * paper's author, an organiser of the Event and the person on their profile
 * page be recognised as one entity rather than three namesakes, and the small
 * node builders more than one page needs. No Paraglide import, so the unit
 * runner can load it as plain TypeScript; callers pass the locale.
 */
import type { SiteConfig } from '#lib/types/index.ts';
import { localizedAbsoluteUrl, type SupportedLocale } from './localized-paths';

/**
 * The budget for a generated meta description (a paper's abstract, a
 * person's bio). Search results show about 160 characters, and `truncate()`
 * appends an ellipsis after its cut, so 159 keeps the whole within 160.
 */
export const META_DESCRIPTION_LENGTH = 159;

const root = (siteUrl: string) => siteUrl.replace(/\/$/, '');

/** The workshop itself — see #lib/data/event-schema.ts. */
export const eventId = (siteUrl: string) => `${root(siteUrl)}#event`;

/** The site as a whole, which every page's WebPage `isPartOf`. */
export const websiteId = (siteUrl: string) => `${root(siteUrl)}#website`;

/**
 * A person with a page of their own. Anchored on the English URL in both
 * locales, as citations are: an identifier names the person, not a rendering
 * of their page, and the French page describing someone else would split the
 * graph in two. Co-authors have no page and so get no `@id` — giving them one
 * would point at a 404.
 */
export const personId = (siteUrl: string, slug: string) =>
	`${localizedAbsoluteUrl(siteUrl, `/participants/${slug}`, 'en')}#person`;

/** The WebSite node, emitted once, on the home page, beside the Event. */
export function websiteSchema(site: SiteConfig, locale: SupportedLocale) {
	const other: SupportedLocale = locale === 'en' ? 'fr' : 'en';
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': websiteId(site.url),
		name: site.shortTitle[locale],
		alternateName: [site.shortTitle[other], site.title[locale]],
		url: site.url,
		inLanguage: ['en', 'fr'],
		// `about`, not `publisher`: schema.org ranges publisher over Organization
		// and Person, and the site is an archive *of* the Event, not issued by it.
		about: { '@id': eventId(site.url) }
	};
}

export interface Crumb {
	name: string;
	/** Absolute URL, in the page's own locale. */
	url: string;
}

/**
 * Home → section → item. The last crumb is the page itself; Google accepts
 * an `item` on it, and keeping one makes every ListItem the same shape.
 */
export function breadcrumbSchema(crumbs: readonly Crumb[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			item: crumb.url
		}))
	};
}

/** Breadcrumbs for a detail page under one of the site's directories. */
export function detailBreadcrumbs(
	siteUrl: string,
	locale: SupportedLocale,
	home: string,
	section: { name: string; path: string },
	item: { name: string; path: string }
) {
	return breadcrumbSchema([
		{ name: home, url: localizedAbsoluteUrl(siteUrl, '/', locale) },
		{ name: section.name, url: localizedAbsoluteUrl(siteUrl, section.path, locale) },
		{ name: item.name, url: localizedAbsoluteUrl(siteUrl, item.path, locale) }
	]);
}
