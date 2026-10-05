import type { Locale } from '$lib/paraglide/runtime';
import type {
	MappedAffiliation,
	PaperListing,
	PaperSummary,
	ParticipantListing,
	Resource,
	ResourceListing,
	ResourceListingSection,
	SessionCast
} from '$lib/types';
import { affiliationLocations } from '$lib/data/affiliations';
import { programme } from '$lib/data/programme';
import { resourceSections } from '$lib/data/resources';
import { organizers } from '$lib/data/organizers';
import { pointSud } from '$lib/data/point-sud';
import { participants } from '$lib/data/participants';
import { getPeople, getPerson, personRef } from '$lib/data/people';
import {
	presentations,
	getParticipantPresentations,
	getPresentation,
	getPresentationAuthors
} from '$lib/data/presentations';
import { uniquePersonCountries } from '$lib/utils/filter';
import { resolveAbstract } from '$lib/utils/i18n';
import { abstractToPlainText, truncate } from '$lib/utils/text';

/**
 * The content registries, reduced at prerender to what a page renders.
 *
 * Server-only on purpose (`$lib/server` cannot be imported by client code).
 * The people and presentations registries carry every bio and every abstract —
 * one 123 KB chunk, 37 KB gzipped — and a component that imported them to
 * print a count or a byline shipped all of it. Directory search now fetches a
 * static text index on demand; these registries stay on the build side.
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

/**
 * How much of an abstract a paper card carries. The card clamps it to three
 * lines, and the most any card was measured to show in them is 308 characters
 * (one column, 767px wide, either locale). The margin keeps the clamp — and
 * its ellipsis — engaged at any width; the rest of the abstract no longer
 * travels in the page, where it sat inside every card and again in the data.
 */
const EXCERPT_LENGTH = 480;

/** The papers directory, sorted by title, with excerpts in the page's locale. */
export function paperListings(locale: Locale): PaperListing[] {
	return presentations
		.map((paper) => {
			const authors = getPresentationAuthors(paper);
			const abstract = resolveAbstract(paper, locale);
			return {
				...paperSummary(paper),
				authors: authors.map((author) => personRef(author)),
				// Co-authors declare no country, so a paper is filed under the
				// countries of the authors who are actually coming.
				countries: Array.from(
					new Set(authors.flatMap((author) => (author.country ? [author.country] : [])))
				),
				...(abstract
					? {
							excerpt: {
								text: truncate(abstractToPlainText(abstract.text), EXCERPT_LENGTH),
								lang: abstract.lang
							}
						}
					: {})
			};
		})
		.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));
}

/**
 * The participants directory: the attendees without their bios, everyone's
 * papers by person id, and the campuses for the map.
 */
export function directoryListings(): {
	participants: ParticipantListing[];
	papersByPerson: Record<string, PaperSummary[]>;
	affiliations: MappedAffiliation[];
} {
	// One summary object per paper, shared by all its authors: the page data is
	// serialised with devalue, which writes a repeated reference once.
	const summaries = new Map(presentations.map((paper) => [paper.id, paperSummary(paper)]));
	const papersByPerson: Record<string, PaperSummary[]> = {};
	for (const person of [...organizers, ...pointSud, ...participants]) {
		const papers = getParticipantPresentations(person);
		if (papers.length > 0)
			papersByPerson[person.id] = papers.map((paper) => summaries.get(paper.id)!);
	}
	return {
		participants: participants.map(
			({ bio: _bio, bioLanguage: _bioLanguage, ...listing }) => listing
		),
		papersByPerson,
		affiliations: affiliationLocations
			.map(({ personIds, ...location }) => ({
				...location,
				people: getPeople(personIds).map((person) => personRef(person, { withAffiliation: false }))
			}))
			.filter((location) => location.people.length > 0)
	};
}

function resourceListing({ authors = [], ...resource }: Resource): ResourceListing {
	return {
		...resource,
		authors: getPeople(authors).map((person) => personRef(person, { withAffiliation: false }))
	};
}

/**
 * The resources page: presenters' slides, then the reading list.
 *
 * Slides are not kept in resources.ts but on the paper they belong to, so a
 * deck is added in one place and shows on the paper's page too. They are
 * listed in the programme's running order.
 */
export function resourcesPage(): {
	slideDecks: ResourceListing[];
	sections: ResourceListingSection[];
} {
	const runningOrder = programme.flatMap((day) =>
		day.sessions.flatMap((session) => session.presentationIds ?? [])
	);
	const rank = (id: string) => {
		const index = runningOrder.indexOf(id);
		return index === -1 ? runningOrder.length : index;
	};

	return {
		slideDecks: presentations
			.filter((paper) => paper.slides)
			.sort((a, b) => rank(a.id) - rank(b.id))
			.map((paper) =>
				resourceListing({
					id: `slides-${paper.id}`,
					title: paper.title,
					lang: paper.language,
					url: paper.slides!,
					authors: paper.authors,
					paper: paper.id
				})
			),
		sections: resourceSections.map((section) => ({
			...section,
			resources: section.resources.map(resourceListing)
		}))
	};
}
