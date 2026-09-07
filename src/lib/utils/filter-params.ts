import type { CountryCode } from '$lib/types';
import type { FilterOptions } from './filter';

export type DirectoryGrouping = 'none' | 'alpha' | 'country';
export interface UrlFilters extends FilterOptions {
	grouping: DirectoryGrouping;
}

export function parseFilters(params: URLSearchParams, countries: CountryCode[]): UrlFilters {
	const country = params.get('country') as CountryCode | null;
	const language = params.get('language');
	const grouping = params.get('group');
	return {
		query: (params.get('q') ?? '').slice(0, 200),
		country: country && countries.includes(country) ? country : null,
		language: language === 'en' || language === 'fr' ? language : null,
		grouping: grouping === 'alpha' || grouping === 'country' ? grouping : 'none'
	};
}

/** Preserve unrelated query parameters and fragments, and omit empty defaults. */
export function filterUrl(url: URL, filters: UrlFilters): URL {
	const next = new URL(url);
	const values = {
		q: filters.query.slice(0, 200),
		country: filters.country,
		language: filters.language,
		group: filters.grouping === 'none' ? null : filters.grouping
	};
	for (const [key, value] of Object.entries(values)) {
		if (value) next.searchParams.set(key, value);
		else next.searchParams.delete(key);
	}
	return next;
}
