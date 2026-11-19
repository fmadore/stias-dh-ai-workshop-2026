/**
 * Post-build smoke test. Guards the properties that fail silently:
 *  - French pages are actually prerendered with French content. (The
 *    Paraglide `globalVariable` strategy relies on sequential prerendering;
 *    if that assumption ever breaks, pages would render in English with a
 *    green build.)
 *  - Message compilation produced real strings (a failed inlang plugin load
 *    once compiled every message away silently).
 *  - The sitemap covers every paper.
 *  - The web manifest icons and the robots.txt sitemap resolve to files.
 * Runs automatically after `npm run build` (postbuild).
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

let failures = 0;
const fail = (msg) => {
	failures++;
	console.error(`✗ ${msg}`);
};
const ok = (msg) => console.log(`✓ ${msg}`);

async function read(file) {
	try {
		return await readFile(file, 'utf8');
	} catch {
		fail(`missing build output: ${file}`);
		return '';
	}
}

// 1. English home page
const en = await read('build/index.html');
if (en) {
	if (!en.includes('lang="en"')) fail('index.html: <html lang="en"> missing');
	if (!en.includes('Digital Humanities and Artificial Intelligence'))
		fail('index.html: expected English title text missing');
	else ok('English home page contains English content');
}

// 2. French home page — prerendered, French, lang="fr"
const fr = await read('build/fr.html');
if (fr) {
	if (!fr.includes('lang="fr"')) fail('fr.html: <html lang="fr"> missing');
	if (!fr.includes('Humanités numériques')) fail('fr.html: expected French title text missing');
	else ok('French home page contains French content');
}

// 3. Key pages exist in both languages
for (const page of [
	'about',
	'programme',
	'participants',
	'papers',
	'call-for-papers',
	'venue',
	'resources'
]) {
	await read(`build/${page}.html`);
	await read(`build/fr/${page}.html`);
}
ok('all localized pages prerendered');

// 4. Sitemap lists every paper (both locales)
const sitemap = await read('build/sitemap.xml');
if (sitemap) {
	const papers = (await readdir('src/lib/data/presentations')).filter(
		(f) => f.endsWith('.ts') && f !== 'index.ts'
	);
	for (const f of papers) {
		const slug = f.replace(/\.ts$/, '');
		if (!sitemap.includes(`/papers/${slug}`)) fail(`sitemap.xml: missing /papers/${slug}`);
		if (!sitemap.includes(`/fr/papers/${slug}`)) fail(`sitemap.xml: missing /fr/papers/${slug}`);
	}
	ok(`sitemap covers ${papers.length} papers in both locales`);
}

// 5. Navigation labels were compiled (guards against silent message loss)
if (en && !en.includes('Call for Papers')) fail('index.html: nav label missing — i18n compile?');
if (fr && !fr.includes('Appel à contributions')) fail('fr.html: nav label missing — i18n compile?');

// 6. The manifest icons and the robots.txt sitemap point at files that exist.
// check-links only reads HTML and XML, so a stale path in either of these
// would ship unnoticed — and both are read by machines, never by a reviewer.
const SITE_ORIGIN = 'https://fmadore.github.io';
const DEPLOY_BASE = '/stias-dh-ai-workshop-2026';
async function deployedFileExists(reference, sourceFile) {
	let url;
	try {
		url = new URL(reference, `${SITE_ORIGIN}${DEPLOY_BASE}/${sourceFile}`);
	} catch {
		return false;
	}
	if (url.origin !== SITE_ORIGIN || !url.pathname.startsWith(`${DEPLOY_BASE}/`)) return false;
	try {
		const file = decodeURIComponent(url.pathname.slice(DEPLOY_BASE.length + 1));
		return (await stat(path.join('build', file))).isFile();
	} catch {
		return false;
	}
}
const manifest = await read('build/site.webmanifest');
if (manifest) {
	const icons = JSON.parse(manifest).icons ?? [];
	if (!icons.length) fail('site.webmanifest: no icons');
	for (const icon of icons) {
		if (!(await deployedFileExists(icon.src, 'site.webmanifest')))
			fail(`site.webmanifest: icon ${icon.src} does not resolve to a file in build/`);
	}
	ok(`site.webmanifest: ${icons.length} icons resolve`);
}
const robots = await read('build/robots.txt');
if (robots) {
	const sitemaps = [...robots.matchAll(/^Sitemap:\s*(\S+)/gim)].map((match) => match[1]);
	if (!sitemaps.length) fail('robots.txt: no Sitemap line');
	for (const reference of sitemaps) {
		if (!(await deployedFileExists(reference, 'robots.txt')))
			fail(`robots.txt: Sitemap ${reference} does not resolve to a file in build/`);
	}
	ok('robots.txt: sitemap resolves');
}

if (failures > 0) {
	console.error(`\nsmoke-test: ${failures} problem(s) found`);
	process.exit(1);
}
console.log('smoke-test: OK');
