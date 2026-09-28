import type { FullText } from './filter';

let loaded = $state.raw<{ people: FullText; papers: FullText }>();
let requested = false;

/** The bios and abstracts directory search can match, once they have arrived. */
export const fullText = {
	get current() {
		return loaded;
	}
};

/**
 * Fetch the full text the first time someone reaches for the search box —
 * focus, or a query already in the URL — rather than on every visit. It is
 * 37 KB gzipped, most of the directories' weight, and most visitors never
 * search. Until it lands, and if it never does (offline), queries still match
 * names, affiliations, countries and titles.
 */
export function loadFullText(): void {
	if (requested) return;
	requested = true;
	import('./full-text').then(
		(module) => {
			loaded = { people: module.personText, papers: module.paperText };
		},
		() => {
			// Let the next focus try again.
			requested = false;
		}
	);
}
