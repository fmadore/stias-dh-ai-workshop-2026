/** Referential and structural validation over the actual typed content modules. */
import { access, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { organizers } from '../src/lib/data/organizers.ts';
import { affiliationLocations } from '../src/lib/data/affiliations.ts';
import { pointSud } from '../src/lib/data/point-sud.ts';
import { coAuthors } from '../src/lib/data/co-authors.ts';
import { programme } from '../src/lib/data/programme.ts';
import { sponsors } from '../src/lib/data/sponsors.ts';
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

async function loadDefaultModules<T>(
	directory: string
): Promise<Array<{ file: string; value: T }>> {
	const files = (await readdir(directory)).filter(
		(file) => file.endsWith('.ts') && file !== 'index.ts'
	);
	return Promise.all(
		files.map(async (file) => {
			const module = (await import(pathToFileURL(path.resolve(directory, file)).href)) as {
				default?: T;
			};
			if (!module.default) throw new Error(`${directory}/${file}: missing default export`);
			return { file, value: module.default };
		})
	);
}

function uniqueById<T extends { id: string }>(items: T[], kind: string): Map<string, T> {
	const byId = new Map<string, T>();
	for (const item of items) {
		if (!item.id.trim()) fail(`${kind}: empty id`);
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
	if (!presentation.authors.length) fail(`presentation ${presentation.id}: empty authors list`);
	for (const author of presentation.authors) {
		if (!peopleById.has(author))
			fail(`presentation ${presentation.id}: unknown author '${author}'`);
	}
}

const sessionIds = new Set<string>();
const scheduledPresentations = new Map<string, number>();
for (const day of programme) {
	for (const session of day.sessions) {
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

for (const sponsor of sponsors) await expectStaticFile(sponsor.logo, `sponsor ${sponsor.id}`);

if (failures) {
	console.error(`\ncheck-data: ${failures} problem(s) found`);
	process.exit(1);
}

if (untranslatedBios.length)
	console.warn(
		`check-data: ${untranslatedBios.length} bio(s) still duplicate one language into both fields — they are marked with lang, but neither locale reads them in its own language`
	);

console.log(
	`check-data: OK (${participants.length} participants, ${organizers.length} organizers, ${pointSud.length} Point Sud representatives, ${coAuthors.length} co-authors, ${presentations.length} presentations, ${sessionIds.size} sessions)`
);
