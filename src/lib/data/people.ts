import type { Organizer } from '$lib/types';
import { organizers } from './organizers';
import { pointSud } from './point-sud';
import { participants } from './participants';

/**
 * A unified, read-only view over organizers, Point Sud representatives and
 * participants so that any part of the site (schedule, paper authorship, …)
 * can resolve a person by id without caring which list they live in.
 */
export type PersonGroup = 'organizer' | 'point-sud' | 'participant';

export type Person = Pick<
	Organizer,
	'id' | 'name' | 'affiliation' | 'country' | 'website' | 'orcid' | 'online'
> & {
	image?: string;
	group: PersonGroup;
};

export const people: Person[] = [
	...organizers.map((o): Person => ({ ...o, group: 'organizer' })),
	...pointSud.map((p): Person => ({ ...p, group: 'point-sud' })),
	...participants.map((p): Person => ({ ...p, group: 'participant' }))
];

const byId = new Map(people.map((p) => [p.id, p]));

export function getPerson(id: string): Person | undefined {
	return byId.get(id);
}

export function getPeople(ids: readonly string[] = []): Person[] {
	return ids.map((id) => byId.get(id)).filter((p): p is Person => p !== undefined);
}
