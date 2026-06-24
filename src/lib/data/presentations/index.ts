import type { Participant, Presentation } from '$lib/types';
import { participants } from '$lib/data/participants';
import { getPerson, type Person } from '$lib/data/people';

const modules = import.meta.glob<Presentation>(['./*.ts', '!./index.ts'], {
	eager: true,
	import: 'default'
});

export const presentations: Presentation[] = Object.values(modules);

const byId = new Map(presentations.map((p) => [p.id, p]));

export function getPresentation(id: string): Presentation | undefined {
	return byId.get(id);
}

export function getParticipantPresentationIds(participant: Participant): string[] {
	if (!participant.presentationId) return [];
	return Array.isArray(participant.presentationId)
		? participant.presentationId
		: [participant.presentationId];
}

export function getParticipantPresentations(participant: Participant): Presentation[] {
	return getParticipantPresentationIds(participant)
		.map((id) => byId.get(id))
		.filter((p): p is Presentation => p !== undefined);
}

/**
 * Resolve the people who present a paper, ordered by the presentation's
 * `authors` list when present and falling back to whoever links to it via
 * `presentationId`. Authors may be participants or organizers, so resolution
 * goes through the unified people registry. Shared by the paper pages, the
 * paper filter, and the schedule.
 */
export function getPresentationAuthors(presentation: Presentation): Person[] {
	const linkedIds = participants
		.filter((p) => getParticipantPresentationIds(p).includes(presentation.id))
		.map((p) => p.id);
	const order = presentation.authors ?? linkedIds;
	const ids = [...order, ...linkedIds.filter((id) => !order.includes(id))];
	return ids.map((id) => getPerson(id)).filter((p): p is Person => p !== undefined);
}
