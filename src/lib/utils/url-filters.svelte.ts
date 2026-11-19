import { onMount } from 'svelte';
import { page } from '$app/state';
import { goto } from '$app/navigation';
import type { CountryCode } from '#lib/types/index.ts';
import { parseFilters, filterUrl, type UrlFilters } from './filter-params';

/**
 * Static HTML contains the full directory; URL filters apply after hydration.
 * `countries` is a getter because the list comes from the page's load data.
 */
export function createUrlFilters(countries: () => CountryCode[]) {
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});
	// A shallow goto() lands a microtask or more later, and a reset sets three
	// fields in a row: without this, the second and third would rebuild the URL
	// from the filters the first had just cleared, and put them back.
	let pendingSearch = $state<string | null>(null);
	// Plain URLSearchParams and URL, not their svelte/reactivity twins: each is
	// read once, here, and discarded. The reactivity comes from page.url and
	// pendingSearch, which the derived already tracks; a reactive wrapper
	// around a throwaway value only adds signals nobody subscribes to.
	const filters = $derived(
		parseFilters(
			// eslint-disable-next-line svelte/prefer-svelte-reactivity -- read once, never mutated; see above
			new URLSearchParams(
				// Shallow routing leaves page.url on the URL that was rendered; the
				// address bar's is page.shallow.url.
				mounted ? (pendingSearch ?? (page.shallow?.url ?? page.url).search) : ''
			),
			countries()
		)
	);
	function update(values: Partial<UrlFilters>) {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity -- a one-off value handed to goto()
		const url = filterUrl(new URL(window.location.href), { ...filters, ...values });
		const search = url.search;
		pendingSearch = search;
		goto(url, { shallow: true, replace: true }).finally(() => {
			if (pendingSearch === search) pendingSearch = null;
		});
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
