import type { Participant, Presentation } from '$lib/types';
import { participants } from '$lib/data/participants';

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
 * Resolve the authors of a presentation, ordered by the presentation's `authors`
 * list when present and falling back to any participant that links to it via
 * `presentationId`. Shared by the paper detail page and the paper listing cards.
 */
export function getPresentationAuthors(presentation: Presentation): Participant[] {
	const linked = participants.filter((p) =>
		getParticipantPresentationIds(p).includes(presentation.id)
	);
	if (!presentation.authors) return linked;

	const byParticipantId = new Map(linked.map((p) => [p.id, p]));
	return [
		...presentation.authors
			.map((id) => byParticipantId.get(id))
			.filter((p): p is Participant => p !== undefined),
		...linked.filter((p) => !presentation.authors!.includes(p.id))
	];
}
