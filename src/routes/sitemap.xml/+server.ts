import type { RequestHandler } from './$types';
import { presentations } from '$lib/data/presentations';
import { siteConfig } from '$lib/data/site-config';

export const prerender = true;

interface Entry {
	path: string;
	priority: number;
	trailingSlash?: boolean;
}

const staticEntries: Entry[] = [
	{ path: '/', priority: 1.0, trailingSlash: true },
	{ path: '/about', priority: 0.8 },
	{ path: '/programme', priority: 0.8 },
	{ path: '/participants', priority: 0.8 },
	{ path: '/papers', priority: 0.8 },
	{ path: '/venue', priority: 0.7 },
	{ path: '/call-for-papers', priority: 0.9 }
];

const escapeXml = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: RequestHandler = () => {
	const base = siteConfig.url.replace(/\/$/, '');

	const paperEntries: Entry[] = presentations.map((p) => ({
		path: `/papers/${p.id}`,
		priority: 0.6
	}));

	const all = [...staticEntries, ...paperEntries];

	const buildPair = (e: Entry) => {
		const suffix = e.trailingSlash ? '/' : '';
		const enLoc = e.path === '/' ? `${base}/` : `${base}${e.path}${suffix}`;
		const frLoc = e.path === '/' ? `${base}/fr/` : `${base}/fr${e.path}${suffix}`;
		const enAlt = enLoc;
		const frAlt = frLoc;
		const block = (loc: string) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enAlt)}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${escapeXml(frAlt)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(enAlt)}" />
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
