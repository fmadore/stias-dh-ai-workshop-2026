import { organizers } from '$lib/data/organizers';
import { pointSud } from '$lib/data/point-sud';
import { participants } from '$lib/data/participants';
import { presentations, getParticipantPresentations } from '$lib/data/presentations';
import { abstractSearchText, normalize, type FullText } from '$lib/utils/filter';

/**
 * Every abstract and every bio, normalised at build time for the static
 * search-index.json endpoint. Keeping the registry imports server-only prevents
 * directory search from downloading executable copies of all content modules.
 *
 * Both languages of anything bilingual are included, so a reader typing a
 * French word reaches a translated abstract or bio from the English page too.
 */
export const paperText: FullText = new Map(
	presentations.map((paper) => [paper.id, abstractSearchText(paper.abstract)])
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
