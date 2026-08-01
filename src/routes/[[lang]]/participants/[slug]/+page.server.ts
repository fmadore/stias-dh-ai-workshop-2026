import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { participants } from '$lib/data/participants';
import { organizers } from '$lib/data/organizers';
import { getParticipantPresentations } from '$lib/data/presentations';
import { programme } from '$lib/data/programme';

export const prerender = true;

/**
 * Organizers get a page too — Frédérick Madore authors a paper but lives in
 * organizers.ts, so an author link that only covered participants would 404.
 */
const everyone = [...organizers, ...participants];

export const entries: EntryGenerator = () => {
	const langs = ['', 'fr'];
	return everyone.flatMap((person) => langs.map((lang) => ({ lang, slug: person.id })));
};

// Server-only loading keeps the complete people registries out of this detail route's client bundle.
export const load: PageServerLoad = ({ params }) => {
	const person = everyone.find((candidate) => candidate.id === params.slug);
	if (!person) {
		error(404, 'Participant not found');
	}

	const organizer = organizers.find((candidate) => candidate.id === person.id);
	const presentations = getParticipantPresentations(person);
	let panelNumber = 0;
	const placementByPresentation = new Map<
		string,
		{ sessionId: string; sessionType: string; panelNumber?: number; date: string; time: string }
	>();
	for (const day of programme) {
		for (const session of day.sessions) {
			if (session.type === 'panel') panelNumber++;
			for (const presentationId of session.presentationIds ?? []) {
				placementByPresentation.set(presentationId, {
					sessionId: session.id,
					sessionType: session.type,
					panelNumber: session.type === 'panel' ? panelNumber : undefined,
					date: day.date,
					time: session.time
				});
			}
		}
	}

	return {
		person,
		isOrganizer: organizer !== undefined,
		// Surfaced here rather than narrowed in the template: `'role' in person`
		// on the union widens the value to unknown.
		role: organizer?.role,
		presentationItems: presentations.map((presentation) => ({
			presentation,
			placement: placementByPresentation.get(presentation.id)
		}))
	};
};
