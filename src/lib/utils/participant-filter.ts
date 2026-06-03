import type { Participant } from '$lib/types';
import { getParticipantPresentations } from '$lib/data/presentations';

export interface ParticipantFilterOptions {
	query: string;
	country: string | null;
	language: 'en' | 'fr' | null;
}

function normalize(input: string): string {
	return input
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '');
}

export function filterParticipants(
	participants: Participant[],
	{ query, country, language }: ParticipantFilterOptions
): Participant[] {
	const q = normalize(query.trim());

	return participants.filter((p) => {
		if (country && p.country !== country) return false;

		const papers = getParticipantPresentations(p);

		if (language && !papers.some((pp) => pp.language === language)) return false;

		if (!q) return true;

		const haystack = normalize(
			[
				p.name,
				p.affiliation.en,
				p.affiliation.fr,
				p.country,
				p.bio ?? '',
				...papers.flatMap((pp) => [pp.title, pp.abstract ?? ''])
			].join(' ')
		);

		return haystack.includes(q);
	});
}

export function uniqueCountries(participants: Participant[]): string[] {
	return Array.from(new Set(participants.map((p) => p.country))).sort((a, b) => a.localeCompare(b));
}
