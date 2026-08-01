/** Validate every generated internal link against GitHub Pages' static-file routing model. */
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const BUILD_DIR = path.resolve('build');
const DEPLOY_BASE = '/stias-dh-ai-workshop-2026';
const SITE_ORIGIN = 'https://fmadore.github.io';
const failures = new Map();

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((entry) => {
			const target = path.join(directory, entry.name);
			return entry.isDirectory() ? walk(target) : [target];
		})
	);
	return nested.flat();
}

async function exists(file) {
	try {
		await access(file);
		return true;
	} catch {
		return false;
	}
}

function publicPath(value) {
	if (/^(?:mailto:|tel:|javascript:|data:|#)/i.test(value)) return null;
	let url;
	try {
		url = new URL(value, `${SITE_ORIGIN}${DEPLOY_BASE}/`);
	} catch {
		return null;
	}
	if (url.origin !== SITE_ORIGIN || !url.pathname.startsWith(DEPLOY_BASE)) return null;
	return decodeURIComponent(url.pathname.slice(DEPLOY_BASE.length) || '/');
}

async function resolves(route) {
	if (route === '/') return exists(path.join(BUILD_DIR, 'index.html'));
	const relative = route.replace(/^\//, '');
	if (route.endsWith('/')) return exists(path.join(BUILD_DIR, relative, 'index.html'));
	if (path.extname(relative)) return exists(path.join(BUILD_DIR, relative));
	return (
		(await exists(path.join(BUILD_DIR, `${relative}.html`))) ||
		exists(path.join(BUILD_DIR, relative, 'index.html'))
	);
}

function references(source) {
	const values = [];
	for (const match of source.matchAll(/\b(?:href|src)=(?:"([^"]+)"|'([^']+)')/gi))
		values.push(match[1] ?? match[2]);
	for (const match of source.matchAll(
		/https:\/\/fmadore\.github\.io\/stias-dh-ai-workshop-2026[^"<>\s\\]*/g
	))
		values.push(match[0]);
	return new Set(values);
}

const files = await walk(BUILD_DIR);
for (const file of files.filter((candidate) => /\.(?:html|xml)$/.test(candidate))) {
	const source = await readFile(file, 'utf8');
	for (const reference of references(source)) {
		const route = publicPath(reference);
		if (route && !(await resolves(route))) {
			const key = `${reference} -> ${path.relative(BUILD_DIR, file)}`;
			failures.set(key, true);
		}
	}
}

if (failures.size) {
	for (const failure of failures.keys()) console.error(`✗ ${failure}`);
	console.error(`\ncheck-links: ${failures.size} broken generated reference(s)`);
	process.exit(1);
}

console.log(
	`check-links: OK (${files.filter((file) => file.endsWith('.html')).length} HTML files)`
);
