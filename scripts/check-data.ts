/** Referential and structural validation over the actual typed content modules. */
import { access } from 'node:fs/promises';
import path from 'node:path';
import { loadDefaultModules } from './lib/load-modules.ts';
import { isSlug, moduleIdentityErrors, presentationAuthorErrors } from './lib/validate-content.ts';
import { isCalendarDate, programmeTimingErrors } from '../src/lib/utils/schedule-validation.ts';
import { organizers } from '../src/lib/data/organizers.ts';
import { affiliationLocations } from '../src/lib/data/affiliations.ts';
import { pointSud } from '../src/lib/data/point-sud.ts';
import { coAuthors } from '../src/lib/data/co-authors.ts';
import { programme, programmeLastUpdated } from '../src/lib/data/programme.ts';
import { sponsors } from '../src/lib/data/sponsors.ts';
import { paperRedirects } from '../src/lib/data/redirects.ts';
import { resourceSections } from '../src/lib/data/resources.ts';
import type { Participant, Presentation } from '../src/lib/types/index.ts';

let failures = 0;
const fail = (message: string) => {
	failures++;
	console.error(`✗ ${message}`);
};

/** Ids whose bio duplicates one language into both fields, awaiting translation. */
const untranslatedBios: string[] = [];

/**
 * Cheap language sniff, only ever used to decide whether an untranslated bio
 * needs an explicit `bioLanguage`. English is the assumed default, so this only
 * has to be confident enough to catch prose that plainly is not English.
 */
const FRENCH_MARKERS =
	/\b(le|la|les|des|du|une|dans|est|qui|pour|sur|avec|ses|aux|elle|son|sa|au|et|de)\b/gi;
const ENGLISH_MARKERS =
	/\b(the|of|and|in|is|for|with|his|her|at|she|their|on|a|an|to|research)\b/gi;
const isProbablyEnglish = (text: string) =>
	(text.match(ENGLISH_MARKERS) ?? []).length >= (text.match(FRENCH_MARKERS) ?? []).length;

function uniqueById<T extends { id: string }>(items: T[], kind: string): Map<string, T> {
	const byId = new Map<string, T>();
	for (const item of items) {
		if (!isSlug(item.id)) fail(`${kind}: invalid URL slug '${item.id}'`);
		if (byId.has(item.id)) fail(`${kind}: duplicate id '${item.id}'`);
		byId.set(item.id, item);
	}
	return byId;
}

async function expectStaticFile(reference: string, owner: string) {
	try {
		await access(path.join('static', reference.replace(/^\//, '')));
	} catch {
		fail(`${owner}: missing static file ${reference}`);
	}
}

const participantModules = await loadDefaultModules<Participant>('src/lib/data/participants');
const presentationModules = await loadDefaultModules<Presentation>('src/lib/data/presentations');
for (const error of [
	...moduleIdentityErrors(participantModules, 'participant'),
	...moduleIdentityErrors(presentationModules, 'presentation'),
	...programmeTimingErrors(programme)
])
	fail(error);
if (!isCalendarDate(programmeLastUpdated)) fail('programme: invalid last-updated date');
const participants = participantModules.map(({ value }) => value);
const presentations = presentationModules.map(({ value }) => value);
// Attendees are held to the full record; co-authors are names only, so they
// join the id space (papers cite them) without joining the checks below.
const people = [...organizers, ...pointSud, ...participants];
const peopleById = uniqueById([...people, ...coAuthors], 'person');
const presentationsById = uniqueById(presentations, 'presentation');
uniqueById(affiliationLocations, 'affiliation');

const mappedPersonIds = new Set<string>();
for (const affiliation of affiliationLocations) {
	if (!affiliation.name.en.trim() || !affiliation.name.fr.trim())
		fail(`affiliation ${affiliation.id}: incomplete name`);
	if (!affiliation.city.en.trim() || !affiliation.city.fr.trim())
		fail(`affiliation ${affiliation.id}: incomplete city`);
	if (
		!Number.isFinite(affiliation.coordinates.lat) ||
		!Number.isFinite(affiliation.coordinates.lng) ||
		Math.abs(affiliation.coordinates.lat) > 90 ||
		Math.abs(affiliation.coordinates.lng) > 180
	)
		fail(`affiliation ${affiliation.id}: invalid coordinates`);
	if (!affiliation.personIds.length) fail(`affiliation ${affiliation.id}: empty person list`);

	for (const personId of affiliation.personIds) {
		if (!peopleById.has(personId))
			fail(`affiliation ${affiliation.id}: unknown person '${personId}'`);
		// The map plots where the people coming to Stellenbosch work. We know no
		// campus for a co-author, and pinning one would invent a fact.
		if (coAuthors.some((coAuthor) => coAuthor.id === personId))
			fail(`affiliation ${affiliation.id}: '${personId}' is a co-author and has no campus`);
		if (mappedPersonIds.has(personId))
			fail(`affiliation ${affiliation.id}: person '${personId}' is mapped twice`);
		mappedPersonIds.add(personId);
	}
}

for (const coAuthor of coAuthors) {
	if (!coAuthor.name.trim()) fail(`co-author ${coAuthor.id}: empty name`);
	// A co-author who turns out to be attending belongs in a list that carries an
	// affiliation and a page, not in this one.
	if (presentations.every((presentation) => !presentation.authors.includes(coAuthor.id)))
		fail(`co-author ${coAuthor.id}: credited on no paper`);
}

for (const person of people) {
	if (!/^[A-Z]{2}$/.test(person.country))
		fail(`person ${person.id}: invalid ISO country code '${person.country}'`);
	if (!person.affiliation.en.trim() || !person.affiliation.fr.trim())
		fail(`person ${person.id}: incomplete affiliation`);
	if (person.image) await expectStaticFile(person.image, `person ${person.id}`);
	// An untranslated bio is served to readers of both locales, so it has to say
	// which language it is actually in or a screen reader mispronounces it.
	// Warn rather than fail: most bios are still awaiting translation.
	if (person.bio && person.bio.en === person.bio.fr) {
		untranslatedBios.push(person.id);
		if (!person.bioLanguage && !isProbablyEnglish(person.bio.en))
			fail(`person ${person.id}: bio is not English and has no bioLanguage`);
	}
}

for (const presentation of presentations) {
	for (const error of presentationAuthorErrors(presentation, peopleById)) fail(error);
	if (presentation.slides && !presentation.slides.startsWith('https://'))
		fail(`presentation ${presentation.id}: slides '${presentation.slides}' is not an https URL`);
}

const sessionIds = new Set<string>();
const scheduledPresentations = new Map<string, number>();
for (const day of programme) {
	for (const session of day.sessions) {
		if (!isSlug(session.id)) fail(`programme: invalid session slug '${session.id}'`);
		if (sessionIds.has(session.id)) fail(`programme: duplicate session id '${session.id}'`);
		sessionIds.add(session.id);
		for (const personId of [
			...(session.speakers ?? []),
			...(session.chair ? [session.chair] : [])
		]) {
			if (!peopleById.has(personId)) fail(`programme ${session.id}: unknown person '${personId}'`);
		}
		for (const presentationId of session.presentationIds ?? []) {
			if (!presentationsById.has(presentationId))
				fail(`programme ${session.id}: unknown presentation '${presentationId}'`);
			scheduledPresentations.set(
				presentationId,
				(scheduledPresentations.get(presentationId) ?? 0) + 1
			);
		}
	}
}

for (const presentation of presentations) {
	const appearances = scheduledPresentations.get(presentation.id) ?? 0;
	if (appearances !== 1)
		fail(`presentation ${presentation.id}: scheduled ${appearances} times (expected once)`);
}

// A retired paper id must forward to one that exists, and must not shadow a
// live paper — the redirect route would then answer instead of the paper.
for (const [legacy, current] of Object.entries(paperRedirects)) {
	if (!isSlug(legacy) || !isSlug(current)) fail(`redirect '${legacy}': invalid URL slug`);
	if (presentationsById.has(legacy))
		fail(`redirect '${legacy}': shadows a live paper of the same id`);
	if (!presentationsById.has(current))
		fail(`redirect '${legacy}': points at unknown paper '${current}'`);
}

for (const sponsor of sponsors) await expectStaticFile(sponsor.logo, `sponsor ${sponsor.id}`);

// Resources are links out, so what can be checked here is their shape: ids
// unique (each section's is a page anchor, and `slides` is taken by the
// section listed from papers), every URL absolute and https, every author
// someone in the registry, and dates that parse and run forwards. A meeting
// is the entry with a place, and is listed by its dates.
uniqueById(resourceSections, 'resource section');
if (resourceSections.some((section) => section.id === 'slides'))
	fail(`resource section: 'slides' is the id of the section listed from papers`);
const resources = resourceSections.flatMap((section) => section.resources);
uniqueById(resources, 'resource');
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DAY_OR_MONTH = /^\d{4}-\d{2}(-\d{2})?$/;
for (const resource of resources) {
	for (const url of [resource.url, ...(resource.links ?? []).map((link) => link.url)]) {
		if (!url.startsWith('https://')) fail(`resource ${resource.id}: '${url}' is not an https URL`);
	}
	for (const author of resource.authors ?? []) {
		if (!peopleById.has(author)) fail(`resource ${resource.id}: unknown author '${author}'`);
	}
	// Optional on the type only for the slide decks the page lists from papers.
	if (!resource.description) fail(`resource ${resource.id}: missing description`);
	if (resource.paper && !presentationsById.has(resource.paper))
		fail(`resource ${resource.id}: unknown paper '${resource.paper}'`);
	if (resource.date && !ISO_DAY_OR_MONTH.test(resource.date))
		fail(`resource ${resource.id}: date '${resource.date}' is not YYYY-MM-DD or YYYY-MM`);
	if (resource.endDate) {
		if (!resource.date || !ISO_DAY.test(resource.date) || !ISO_DAY.test(resource.endDate))
			fail(`resource ${resource.id}: a date range needs two full YYYY-MM-DD dates`);
		else if (resource.endDate < resource.date)
			fail(`resource ${resource.id}: ends before it starts`);
	}
	if (resource.place && !resource.date) fail(`resource ${resource.id}: a meeting needs its dates`);
}

if (failures) {
	console.error(`\ncheck-data: ${failures} problem(s) found`);
	process.exit(1);
}

if (untranslatedBios.length)
	console.warn(
		`check-data: ${untranslatedBios.length} bio(s) still duplicate one language into both fields — they are marked with lang, but neither locale reads them in its own language`
	);

console.log(
	`check-data: OK (${participants.length} participants, ${organizers.length} organizers, ${pointSud.length} Point Sud representatives, ${coAuthors.length} co-authors, ${presentations.length} presentations, ${Object.keys(paperRedirects).length} paper redirect(s), ${sessionIds.size} sessions, ${resources.length} resources)`
);
