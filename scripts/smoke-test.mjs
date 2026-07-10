/**
 * Post-build smoke test. Guards the properties that fail silently:
 *  - French pages are actually prerendered with French content. (The
 *    Paraglide `globalVariable` strategy relies on sequential prerendering;
 *    if that assumption ever breaks, pages would render in English with a
 *    green build.)
 *  - Message compilation produced real strings (a failed inlang plugin load
 *    once compiled every message away silently).
 *  - The sitemap covers every paper.
 * Runs automatically after `npm run build` (postbuild).
 */
import { readFile, readdir } from 'node:fs/promises';

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
for (const page of ['about', 'programme', 'participants', 'papers', 'call-for-papers', 'venue']) {
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

if (failures > 0) {
	console.error(`\nsmoke-test: ${failures} problem(s) found`);
	process.exit(1);
}
console.log('smoke-test: OK');
