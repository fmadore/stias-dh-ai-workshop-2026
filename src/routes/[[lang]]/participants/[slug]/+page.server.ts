import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { participants } from '$lib/data/participants';
import { organizers } from '$lib/data/organizers';
import { pointSud } from '$lib/data/point-sud';
import { getPerson } from '$lib/data/people';
import { getParticipantPresentations } from '$lib/data/presentations';
import { paperSummary } from '$lib/server/views';
import { langEntries } from '$lib/utils/i18n';
import { getPlacements } from '$lib/utils/placement';

export const prerender = true;

/**
 * Organizers get a page too — Frédérick Madore authors a paper but lives in
 * organizers.ts, so an author link that only covered participants would 404.
 * Point Sud's representatives are listed on the directory page, so their cards
 * need a destination as well.
 */
const everyone = [...organizers, ...pointSud, ...participants];

export const entries: EntryGenerator = () =>
	everyone.flatMap((person) => langEntries().map(({ lang }) => ({ lang, slug: person.id })));

// Server-only loading keeps the complete people registries out of this detail route's client bundle.
export const load: PageServerLoad = ({ params }) => {
	const person = everyone.find((candidate) => candidate.id === params.slug);
	if (!person) {
		error(404, 'Participant not found');
	}

	const titled = [...organizers, ...pointSud].find((candidate) => candidate.id === person.id);
	// Labels in the locale of the page being written: server loads run before
	// the layout load sets the Paraglide global (see `getPlacements`).
	const placements = getPlacements(params.lang === 'fr' ? 'fr' : 'en');

	return {
		person,
		group: getPerson(person.id)?.group ?? 'participant',
		// Surfaced here rather than narrowed in the template: `'role' in person`
		// on the union widens the value to unknown.
		role: titled?.role,
		presentationItems: getParticipantPresentations(person).map((presentation) => ({
			presentation: paperSummary(presentation),
			placement: placements.get(presentation.id)
		}))
	};
};
