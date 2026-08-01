/** Referential and structural validation over the actual typed content modules. */
import { access, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { organizers } from '../src/lib/data/organizers.ts';
import { programme } from '../src/lib/data/programme.ts';
import { sponsors } from '../src/lib/data/sponsors.ts';
import type { Participant, Presentation } from '../src/lib/types/index.ts';

let failures = 0;
const fail = (message: string) => {
	failures++;
	console.error(`✗ ${message}`);
};

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
const people = [...organizers, ...participants];
const peopleById = uniqueById(people, 'person');
const presentationsById = uniqueById(presentations, 'presentation');

for (const person of people) {
	if (!/^[A-Z]{2}$/.test(person.country))
		fail(`person ${person.id}: invalid ISO country code '${person.country}'`);
	if (!person.affiliation.en.trim() || !person.affiliation.fr.trim())
		fail(`person ${person.id}: incomplete affiliation`);
	if (person.image) await expectStaticFile(person.image, `person ${person.id}`);
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

console.log(
	`check-data: OK (${participants.length} participants, ${organizers.length} organizers, ${presentations.length} presentations, ${sessionIds.size} sessions)`
);
