import { error } from '@sveltejs/kit';
import type { EntryGenerator, RequestHandler } from './$types';
import { presentations, getPresentation, getPresentationAuthors } from '$lib/data/presentations';
import { programme } from '$lib/data/programme';
import { siteConfig } from '$lib/data/site-config';
import {
	createPresentationCitation,
	presentationBibtex,
	presentationRis
} from '$lib/utils/citations';

export const prerender = true;

export const entries: EntryGenerator = () =>
	presentations.flatMap(({ id }) => ['bib', 'ris'].map((format) => ({ slug: id, format })));

export const GET: RequestHandler = ({ params }) => {
	const presentation = getPresentation(params.slug);
	if (!presentation || !['bib', 'ris'].includes(params.format)) error(404, 'Citation not found');
	const citation = createPresentationCitation(
		presentation,
		getPresentationAuthors(presentation),
		programme,
		siteConfig
	);
	const bibtex = params.format === 'bib';
	return new Response(bibtex ? presentationBibtex(citation) : presentationRis(citation), {
		headers: {
			'content-type': `${bibtex ? 'application/x-bibtex' : 'application/x-research-info-systems'}; charset=utf-8`,
			'content-disposition': `attachment; filename="${presentation.id}.${params.format}"`
		}
	});
};
