import type { LocalizedString } from '$lib/types';
import { organizers } from './organizers';
import { participants } from './participants';

/**
 * A unified, read-only view over organizers and participants so that any part of
 * the site (schedule, paper authorship, …) can resolve a person by id without
 * caring which list they live in.
 */
export interface Person {
	id: string;
	name: string;
	affiliation: LocalizedString;
	country: string;
	image?: string;
	website?: string;
	orcid?: string;
	isOrganizer: boolean;
}

type PersonSource = {
	id: string;
	name: string;
	affiliation: LocalizedString;
	country: string;
	image?: string;
	website?: string;
	orcid?: string;
};

function toPerson(p: PersonSource, isOrganizer: boolean): Person {
	return {
		id: p.id,
		name: p.name,
		affiliation: p.affiliation,
		country: p.country,
		image: p.image,
		website: p.website,
		orcid: p.orcid,
		isOrganizer
	};
}

export const people: Person[] = [
	...organizers.map((o) => toPerson(o, true)),
	...participants.map((p) => toPerson(p, false))
];

const byId = new Map(people.map((p) => [p.id, p]));

export function getPerson(id: string): Person | undefined {
	return byId.get(id);
}

export function getPeople(ids: readonly string[] = []): Person[] {
	return ids.map((id) => byId.get(id)).filter((p): p is Person => p !== undefined);
}
