import type { PaperSummary, SessionCast } from '$lib/types';
import { programme } from '$lib/data/programme';
import { organizers } from '$lib/data/organizers';
import { pointSud } from '$lib/data/point-sud';
import { participants } from '$lib/data/participants';
import { getPeople, getPerson, personRef } from '$lib/data/people';
import { presentations, getPresentation, getPresentationAuthors } from '$lib/data/presentations';
import { uniquePersonCountries } from '$lib/utils/filter';

/**
 * The content registries, reduced at prerender to what a page renders.
 *
 * Server-only on purpose (`$lib/server` cannot be imported by client code).
 * The people and presentations registries carry every bio and every abstract —
 * one 123 KB chunk, 37 KB gzipped — and a component that imported them to
 * print a count or a byline shipped all of it. Only the two directories, whose
 * search runs over bios and abstracts, still need the whole thing.
 */

export function paperSummary({ id, title, language }: PaperSummary): PaperSummary {
	return { id, title, language };
}

/** The home page's figures. */
export function glanceStats() {
	return {
		papers: presentations.length,
		participants: participants.length,
		// Counted over people, not papers. This figure links to the affiliation
		// map, which plots where the 39 people work — and paper countries are a
		// different set: Mali is here only because Point Sud's representative
		// is, and he presents nothing. Counting papers made this read 16 while
		// the page it points at said 17.
		countries: uniquePersonCountries([...organizers, ...pointSud, ...participants]).length
	};
}

/**
 * The programme's ids resolved into the names and titles it prints, by session
 * id. A session that names nobody and no paper — a break, a meal — is left out
 * rather than serialised as an empty record into the page.
 */
export function sessionCasts(): Record<string, SessionCast> {
	const casts: Record<string, SessionCast> = {};
	for (const day of programme) {
		for (const session of day.sessions) {
			if (!session.speakers?.length && !session.chair && !session.presentationIds?.length) continue;
			const chair = session.chair ? getPerson(session.chair) : undefined;
			casts[session.id] = {
				// A keynote's speaker line carries affiliations; bylines do not.
				speakers: getPeople(session.speakers).map((person) => personRef(person)),
				...(chair ? { chair: personRef(chair, { withAffiliation: false }) } : {}),
				papers: (session.presentationIds ?? []).flatMap((id) => {
					const paper = getPresentation(id);
					if (!paper) return [];
					return [
						{
							...paperSummary(paper),
							authors: getPresentationAuthors(paper).map((author) =>
								personRef(author, { withAffiliation: false })
							)
						}
					];
				})
			};
		}
	}
	return casts;
}
