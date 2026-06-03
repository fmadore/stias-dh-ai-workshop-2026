import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import { presentations, getPresentation, getPresentationAuthors } from '$lib/data/presentations';

export const prerender = true;

export const entries: EntryGenerator = () => {
	const langs = ['', 'fr'];
	return presentations.flatMap((p) => langs.map((lang) => ({ lang, slug: p.id })));
};

export const load: PageLoad = ({ params }) => {
	const presentation = getPresentation(params.slug);
	if (!presentation) {
		error(404, 'Paper not found');
	}

	const authors = getPresentationAuthors(presentation);

	return { presentation, authors };
};
