import type { RequestHandler } from './$types';
import { presentations } from '#lib/data/presentations/index.ts';
import { people } from '#lib/data/people.ts';
import { programmeLastUpdated } from '#lib/data/programme.ts';
import { resourcesLastUpdated } from '#lib/data/resources.ts';
import { siteConfig } from '#lib/data/site-config.ts';
import { localizedAbsoluteUrl } from '#lib/utils/localized-paths.ts';

export const prerender = true;

interface Entry {
	path: string;
	priority: number;
	/**
	 * ISO date of the last real change, only where the data records one. A
	 * build date on every URL would claim the whole site changed on each
	 * deploy, and search engines learn to ignore a `<lastmod>` that lies.
	 */
	lastmod?: string;
}

// The workshop is over, so the site is an archive: what it produced (the
// papers, the resources) ranks above how to take part, and the call for
// papers — closed — is kept only as a record.
const staticEntries: Entry[] = [
	{ path: '/', priority: 1.0 },
	{ path: '/papers', priority: 0.9 },
	{ path: '/resources', priority: 0.9, lastmod: resourcesLastUpdated },
	{ path: '/programme', priority: 0.8, lastmod: programmeLastUpdated },
	{ path: '/participants', priority: 0.8 },
	{ path: '/about', priority: 0.7 },
	{ path: '/venue', priority: 0.5 },
	{ path: '/call-for-papers', priority: 0.4 }
];

const escapeXml = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: RequestHandler = () => {
	const paperEntries: Entry[] = presentations.map((p) => ({
		path: `/papers/${p.id}`,
		priority: 0.7
	}));

	// Every organiser and participant has a citable page of their own. Credited
	// co-authors do not — they are names on a byline, with no page to index.
	const personEntries: Entry[] = people
		.filter((person) => person.group !== 'co-author')
		.map((person) => ({
			path: `/participants/${person.id}`,
			priority: 0.5
		}));

	const all = [...staticEntries, ...paperEntries, ...personEntries];

	const buildPair = (e: Entry) => {
		const enLoc = localizedAbsoluteUrl(siteConfig.url, e.path, 'en');
		const frLoc = localizedAbsoluteUrl(siteConfig.url, e.path, 'fr');
		// Straight after <loc>, where the sitemap schema orders it.
		const lastmod = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : '';
		const block = (loc: string) => `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod}
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enLoc)}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${escapeXml(frLoc)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(enLoc)}" />
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`;
		return [block(enLoc), block(frLoc)].join('\n');
	};

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${all.map(buildPair).join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
};
