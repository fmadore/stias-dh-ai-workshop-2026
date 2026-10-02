/** Validate every generated internal link against GitHub Pages' static-file routing model. */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const BUILD_DIR = path.resolve(process.argv[2] ?? 'build');
const DEPLOY_BASE = '/stias-dh-ai-workshop-2026';
const SITE_ORIGIN = 'https://fmadore.github.io';
// Same-origin links to another site need an explicit exception. Keep them
// absolute: a bare "/" is almost always a forgotten project deployment base.
const EXTERNAL_OWNER_URLS = new Set(['https://fmadore.github.io/']);
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

function decodeEntities(value) {
	return value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
		const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' };
		if (named[entity]) return named[entity];
		const hex = entity.toLowerCase().startsWith('&#x');
		const code = parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10);
		return Number.isFinite(code) && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
	});
}

function publicUrl(value, sourceUrl) {
	try {
		const url = new URL(decodeEntities(value), sourceUrl);
		if (url.origin !== SITE_ORIGIN) return null;
		return url;
	} catch {
		return null;
	}
}

function resolveFile(route, files) {
	const relative = route.replace(/^\//, '');
	const candidates =
		route === '/'
			? ['index.html']
			: route.endsWith('/')
				? [`${relative}index.html`]
				: path.extname(relative)
					? [relative]
					: [`${relative}.html`, `${relative}/index.html`];
	return candidates.map((file) => path.resolve(BUILD_DIR, file)).find((file) => files.has(file));
}

function references(source, filename) {
	const values = [];
	const urlProperties = new Set(['url', 'contentUrl', 'embedUrl', 'thumbnailUrl', 'image']);
	function structuredReferences(value, key = '') {
		if (typeof value === 'string' && urlProperties.has(key)) values.push(value);
		else if (Array.isArray(value)) {
			for (const item of value) structuredReferences(item, key);
		} else if (value && typeof value === 'object') {
			for (const [property, item] of Object.entries(value)) {
				// An entity identifier is not a navigation link or a promised DOM anchor.
				if (property !== '@id') structuredReferences(item, property);
			}
		}
	}
	const markup = source.replace(
		/<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
		(_script, attributes, body) => {
			if (/\btype=(?:"application\/ld\+json"|'application\/ld\+json')/i.test(attributes)) {
				try {
					structuredReferences(JSON.parse(body));
				} catch {
					failures.set(`${filename} (invalid JSON-LD)`, true);
				}
			}
			// Svelte's hydration payload also contains these identifiers and source
			// text. Only its actual script src is a link, not every string in its code.
			return `<script${attributes}></script>`;
		}
	);
	for (const match of markup.matchAll(/\b(?:href|src)=(?:"([^"]+)"|'([^']+)')/gi))
		values.push(match[1] ?? match[2]);
	for (const match of markup.matchAll(
		/https:\/\/fmadore\.github\.io\/stias-dh-ai-workshop-2026[^"<>\s\\]*/g
	))
		values.push(match[0]);
	return new Set(values);
}

const files = await walk(BUILD_DIR);
const fileSet = new Set(files);
const documents = new Map(
	await Promise.all(
		files
			.filter((file) => /\.(?:html|xml)$/.test(file))
			.map(async (file) => [file, await readFile(file, 'utf8')])
	)
);
const ids = new Map(
	[...documents].map(([file, html]) => [
		file,
		new Set(
			[...html.matchAll(/\bid=(?:"([^"]+)"|'([^']+)')/g)].map((match) =>
				decodeEntities(match[1] ?? match[2])
			)
		)
	])
);
for (const [file, source] of documents) {
	const relative = path.relative(BUILD_DIR, file).split(path.sep).join('/');
	const route = relative.replace(/(?:^|\/)index\.html$/, '/').replace(/\.html$/, '');
	const sourceUrl = `${SITE_ORIGIN}${DEPLOY_BASE}/${route.replace(/^\//, '')}`;
	for (const reference of references(source, relative)) {
		const url = publicUrl(reference, sourceUrl);
		if (!url) continue;
		if (url.pathname !== DEPLOY_BASE && !url.pathname.startsWith(`${DEPLOY_BASE}/`)) {
			if (
				reference.startsWith(`${SITE_ORIGIN}/`) &&
				EXTERNAL_OWNER_URLS.has(`${url.origin}${url.pathname}`)
			)
				continue;
			failures.set(`${reference} -> ${relative} (missing deployment base ${DEPLOY_BASE})`, true);
			continue;
		}
		try {
			const target = resolveFile(
				decodeURIComponent(url.pathname.slice(DEPLOY_BASE.length) || '/'),
				fileSet
			);
			const fragment = decodeURIComponent(url.hash.slice(1)).split(':~:')[0];
			if (!target || (fragment && target.endsWith('.html') && !ids.get(target)?.has(fragment))) {
				failures.set(`${reference} -> ${relative}`, true);
			}
		} catch {
			failures.set(`${reference} -> ${relative} (invalid URL encoding)`, true);
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
