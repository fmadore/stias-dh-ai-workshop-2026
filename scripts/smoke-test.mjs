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

// 6. Search metadata. Each of these failed silently once or could: an English
//    site name in every French <title>, scholarly tags that Scholar and Zotero
//    read but no reader sees, and JSON-LD that is one stray character from
//    being ignored wholesale.
const decode = (s) =>
	s
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replaceAll('&quot;', '"')
		.replaceAll('&#39;', "'")
		.replaceAll('&amp;', '&');
const titleOf = (html) => decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
const descriptionOf = (html) =>
	decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
const jsonLd = (html) =>
	[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
		(match) => match[1]
	);

// The French short title from src/lib/data/site-config.ts.
const frenchSiteName = 'HN & IA en études africaines';
const paper = 'mcp-servers-african-glams';
// An organiser, so certain to have both a page and an ORCID.
const orcidPerson = 'madore';

const sample = {
	'index.html': en,
	'fr.html': fr,
	[`papers/${paper}.html`]: await read(`build/papers/${paper}.html`),
	[`fr/papers/${paper}.html`]: await read(`build/fr/papers/${paper}.html`),
	[`participants/${orcidPerson}.html`]: await read(`build/participants/${orcidPerson}.html`),
	[`fr/participants/${orcidPerson}.html`]: await read(`build/fr/participants/${orcidPerson}.html`),
	'fr/about.html': await read('build/fr/about.html')
};

for (const [file, html] of Object.entries(sample)) {
	if (!html) continue;
	if (file.startsWith('fr') && !titleOf(html).includes(frenchSiteName))
		fail(`${file}: <title> lacks the French site name — got "${titleOf(html)}"`);
	const blocks = jsonLd(html);
	if (blocks.length === 0) fail(`${file}: no JSON-LD`);
	for (const block of blocks) {
		try {
			JSON.parse(block);
		} catch (error) {
			fail(`${file}: JSON-LD does not parse (${error.message})`);
		}
	}
}
ok('sampled pages have localised titles and well-formed JSON-LD');

for (const file of [`papers/${paper}.html`, `fr/papers/${paper}.html`]) {
	if (sample[file] && !/<meta name="citation_title" content="[^"]+"/.test(sample[file]))
		fail(`${file}: citation_title meta tag missing`);
	if (sample[file]?.includes('citation_pdf_url'))
		fail(`${file}: citation_pdf_url present, but no paper has a PDF`);
}
ok('paper pages carry scholarly meta tags');

const profile = sample[`participants/${orcidPerson}.html`];
if (profile && !/"sameAs":\[[^\]]*"https:\/\/orcid\.org\/\d{4}-/.test(profile))
	fail(`participants/${orcidPerson}.html: no orcid.org sameAs in the Person JSON-LD`);
else ok('profile pages link ORCID through sameAs');

// 7. Meta description lengths. Search results show about 160 characters; much
//    under 70 wastes the snippet. Paper and participant descriptions are cut
//    to fit (META_DESCRIPTION_LENGTH), so only the ceiling applies to them.
async function htmlFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((entry) =>
			entry.isDirectory()
				? htmlFiles(`${dir}/${entry.name}`)
				: entry.name.endsWith('.html')
					? [`${dir}/${entry.name}`]
					: []
		)
	);
	return nested.flat();
}
let described = 0;
for (const file of await htmlFiles('build')) {
	const html = await readFile(file, 'utf8');
	// Redirect stubs and the client-rendered 404 carry no description.
	const description = descriptionOf(html);
	if (!description) continue;
	described++;
	const detail = /\/(papers|participants)\/[^/]+\.html$/.test(file);
	if (description.length > 160) fail(`${file}: description is ${description.length} characters`);
	else if (!detail && description.length < 70)
		fail(`${file}: description is only ${description.length} characters`);
}
ok(`${described} meta descriptions within length`);

if (failures > 0) {
	console.error(`\nsmoke-test: ${failures} problem(s) found`);
	process.exit(1);
}
console.log('smoke-test: OK');
