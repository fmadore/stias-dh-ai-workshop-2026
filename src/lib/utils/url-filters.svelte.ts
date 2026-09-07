import { onMount } from 'svelte';
import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import { page } from '$app/state';
import { replaceState } from '$app/navigation';
import type { CountryCode } from '$lib/types';
import { parseFilters, filterUrl, type UrlFilters } from './filter-params';

/** Static HTML contains the full directory; URL filters apply after hydration. */
export function createUrlFilters(countries: CountryCode[]) {
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});
	const filters = $derived(
		parseFilters(
			new SvelteURLSearchParams(mounted ? (page.state.directorySearch ?? page.url.search) : ''),
			countries
		)
	);
	function update(values: Partial<UrlFilters>) {
		const url = filterUrl(new SvelteURL(window.location.href), { ...filters, ...values });
		// SvelteKit shallow routing updates page.state, not page.url.
		replaceState(url, { ...page.state, directorySearch: url.search });
	}
	return {
		get query() {
			return filters.query;
		},
		set query(query: string) {
			update({ query });
		},
		get country() {
			return filters.country;
		},
		set country(country: CountryCode | null) {
			update({ country });
		},
		get language() {
			return filters.language;
		},
		set language(language: 'en' | 'fr' | null) {
			update({ language });
		},
		get grouping() {
			return filters.grouping;
		},
		set grouping(grouping: UrlFilters['grouping']) {
			update({ grouping });
		},
		reset() {
			update({ query: '', country: null, language: null });
		}
	};
}
