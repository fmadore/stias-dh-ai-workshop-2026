import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { presentations, getPresentation, getPresentationAuthors } from '$lib/data/presentations';
import { renderAbstract } from '$lib/utils/markdown';
import { abstractToPlainText, truncate } from '$lib/utils/text';

export const prerender = true;

export const entries: EntryGenerator = () => {
	const langs = ['', 'fr'];
	return presentations.flatMap((p) => langs.map((lang) => ({ lang, slug: p.id })));
};

// A server load (rather than a universal one) keeps `marked` out of the
// client bundle: abstracts are rendered to HTML once, at prerender time.
export const load: PageServerLoad = ({ params }) => {
	const presentation = getPresentation(params.slug);
	if (!presentation) {
		error(404, 'Paper not found');
	}

	const authors = getPresentationAuthors(presentation);
	const abstractText = presentation.abstract ? abstractToPlainText(presentation.abstract) : '';

	return {
		presentation,
		authors,
		abstractHtml: presentation.abstract ? renderAbstract(presentation.abstract) : '',
		description: abstractText ? truncate(abstractText) : presentation.title,
		abstractText
	};
};
