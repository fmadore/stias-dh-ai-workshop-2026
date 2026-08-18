import type { Presentation } from '$lib/types';
import { getPeople, type Person } from '$lib/data/people';

const modules = import.meta.glob<Presentation>(['./*.ts', '!./index.ts'], {
	eager: true,
	import: 'default'
});

export const presentations: Presentation[] = Object.values(modules);

const byId = new Map(presentations.map((p) => [p.id, p]));

export function getPresentation(id: string): Presentation | undefined {
	return byId.get(id);
}

/**
 * A person's papers, derived from each presentation's `authors` list. Takes
 * anything carrying an id: authors may be participants or organisers, and the
 * directory filter runs over both.
 */
export function getParticipantPresentations(person: { id: string }): Presentation[] {
	return presentations.filter((p) => p.authors.includes(person.id));
}

/**
 * Resolve the people who present a paper, in the order of its `authors`
 * list. Authors may be participants or organizers, so resolution goes
 * through the unified people registry. Shared by the paper pages, the
 * paper filter, and the schedule.
 */
export function getPresentationAuthors(presentation: Presentation): Person[] {
	return getPeople(presentation.authors);
}
