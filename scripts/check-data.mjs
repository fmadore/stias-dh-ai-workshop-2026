/**
 * Referential-integrity check for the content data files. Cross-reference
 * bugs (a typo'd author id, a programme session pointing at a deleted paper)
 * fail silently at runtime — people or papers just vanish from the page —
 * so this script fails the build instead. Runs via `npm run build`
 * (postbuild) and in CI.
 *
 * The data files are TypeScript modules, so ids are extracted with regexes;
 * the files follow a fixed shape (see src/lib/data/README pattern) which
 * keeps this reliable.
 */
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';

let failures = 0;
const fail = (msg) => {
	failures++;
	console.error(`✗ ${msg}`);
};

async function collectIds(dir) {
	const ids = new Map(); // id -> file
	for (const file of await readdir(dir)) {
		if (!file.endsWith('.ts') || file === 'index.ts') continue;
		const src = await readFile(path.join(dir, file), 'utf8');
		const m = src.match(/\n\tid: '([^']+)'/);
		if (!m) {
			fail(`${dir}/${file}: no id found`);
			continue;
		}
		if (ids.has(m[1])) fail(`duplicate id ${m[1]}`);
		ids.set(m[1], { file, src });
	}
	return ids;
}

const participants = await collectIds('src/lib/data/participants');
const presentations = await collectIds('src/lib/data/presentations');

const organizersSrc = await readFile('src/lib/data/organizers.ts', 'utf8');
const organizerIds = new Set([...organizersSrc.matchAll(/\n\t\tid: '([^']+)'/g)].map((m) => m[1]));

const peopleIds = new Set([...participants.keys(), ...organizerIds]);

// 1. Every presentation has at least one author, and all authors resolve.
for (const [id, { file, src }] of presentations) {
	const authorsMatch = src.match(/\n\tauthors: \[([^\]]*)\]/);
	if (!authorsMatch) {
		fail(`presentation ${id} (${file}) has no authors list`);
		continue;
	}
	const authors = [...authorsMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
	if (authors.length === 0) fail(`presentation ${id} has an empty authors list`);
	for (const a of authors) {
		if (!peopleIds.has(a)) fail(`presentation ${id}: unknown author '${a}'`);
	}
}

// 2. Programme references resolve (speakers, chair, presentationIds).
const programmeSrc = await readFile('src/lib/data/programme.ts', 'utf8');
for (const m of programmeSrc.matchAll(/(speakers|chair|presentationIds): (\[[^\]]*\]|'[^']+')/g)) {
	const [, key, value] = m;
	const ids = [...value.matchAll(/'([^']+)'/g)].map((x) => x[1]);
	for (const id of ids) {
		const pool = key === 'presentationIds' ? presentations : { has: (i) => peopleIds.has(i) };
		if (!pool.has(id)) fail(`programme.ts: ${key} references unknown id '${id}'`);
	}
}

// 3. Every referenced image exists in static/.
for (const [id, { src }] of [...participants]) {
	const img = src.match(/\n\timage: '([^']+)'/);
	if (!img) continue;
	try {
		await access(path.join('static', img[1]));
	} catch {
		fail(`participant ${id}: image ${img[1]} not found in static/`);
	}
}
for (const m of organizersSrc.matchAll(/\n\t\timage: '([^']+)'/g)) {
	try {
		await access(path.join('static', m[1]));
	} catch {
		fail(`organizers.ts: image ${m[1]} not found in static/`);
	}
}

if (failures > 0) {
	console.error(`\ncheck-data: ${failures} problem(s) found`);
	process.exit(1);
}
console.log(
	`check-data: OK (${participants.size} participants, ${organizerIds.size} organizers, ${presentations.size} presentations)`
);
