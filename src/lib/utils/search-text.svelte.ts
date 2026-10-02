import { base } from '$app/paths';
import { parseSearchIndex, type SearchIndex } from './search-index';

export type SearchStatus = 'idle' | 'loading' | 'ready' | 'error';

let loaded = $state.raw<SearchIndex>();
let status = $state<SearchStatus>('idle');
let requested = false;
let inFlight = false;

/** The bios and abstracts directory search can match, once they have arrived. */
export const fullText = {
	get current() {
		return loaded;
	},
	get status() {
		return status;
	}
};

/**
 * Fetch the full text the first time someone reaches for the search box —
 * focus, or a query already in the URL — rather than on every visit. The index
 * is static JSON, so retrying a failed download does not reuse a browser's
 * cached module-import failure. Until it arrives, queries still match names,
 * affiliations, countries and titles.
 */
export function loadFullText(): void {
	if (requested) return;
	requested = true;
	inFlight = true;
	status = 'loading';
	fetch(`${base}/search-index.json`, { headers: { Accept: 'application/json' } })
		.then(async (response) => {
			if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
			return parseSearchIndex(await response.json());
		})
		.then(
			(index) => {
				loaded = index;
				status = 'ready';
				inFlight = false;
			},
			() => {
				status = 'error';
				inFlight = false;
			}
		);
}

/** Retry only on request, so a failed download cannot trigger an effect loop. */
export function retryFullText(): void {
	if (inFlight || loaded) return;
	requested = false;
	loadFullText();
}
