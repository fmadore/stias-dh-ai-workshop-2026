import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import { participants } from '$lib/data/participants';
import { organizers } from '$lib/data/organizers';

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

export const load: PageLoad = ({ params }) => {
	const person = everyone.find((candidate) => candidate.id === params.slug);
	if (!person) {
		error(404, 'Participant not found');
	}

	const organizer = organizers.find((candidate) => candidate.id === person.id);

	return {
		person,
		isOrganizer: organizer !== undefined,
		// Surfaced here rather than narrowed in the template: `'role' in person`
		// on the union widens the value to unknown.
		role: organizer?.role
	};
};
