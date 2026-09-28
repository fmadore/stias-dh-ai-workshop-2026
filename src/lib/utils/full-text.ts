import { organizers } from '$lib/data/organizers';
import { pointSud } from '$lib/data/point-sud';
import { participants } from '$lib/data/participants';
import { presentations, getParticipantPresentations } from '$lib/data/presentations';
import { abstractVariants } from './i18n';
import { normalize, type FullText } from './filter';

/**
 * Every abstract and every bio, normalised for search. This module is the
 * directories' only route to the registries in the browser, and it is only
 * ever loaded with `import()` (see `search-text.svelte.ts`), so the pages
 * themselves never ship it: most visitors never search.
 *
 * Both languages of anything bilingual are included, so a reader typing a
 * French word reaches a translated abstract or bio from the English page too.
 */
export const paperText: FullText = new Map(
	presentations.map((paper) => [paper.id, normalize(abstractVariants(paper.abstract).join(' '))])
);

/** A person's bio, plus the abstracts of every paper they are on. */
export const personText: FullText = new Map(
	[...organizers, ...pointSud, ...participants].map((person) => [
		person.id,
		[
			normalize([person.bio?.en ?? '', person.bio?.fr ?? ''].join(' ')),
			...getParticipantPresentations(person).map((paper) => paperText.get(paper.id) ?? '')
		].join(' ')
	])
);
