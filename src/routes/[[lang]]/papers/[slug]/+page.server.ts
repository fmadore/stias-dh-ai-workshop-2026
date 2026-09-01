import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { presentations, getPresentation, getPresentationAuthors } from '$lib/data/presentations';
import { renderAbstract } from '$lib/utils/markdown';
import { resolveAbstract } from '$lib/utils/i18n';
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
	// This route prerenders once per locale, so the locale comes off the route
	// parameter rather than the paraglide global: a bilingual abstract has to
	// resolve to the half belonging to the document being written, and the
	// `description` and the schema's `abstract` derive from whichever half that
	// is. `params.lang` is '' on the English pass.
	const abstract = resolveAbstract(presentation, params.lang === 'fr' ? 'fr' : 'en');
	const abstractText = abstract ? abstractToPlainText(abstract.text) : '';

	return {
		presentation,
		authors,
		abstractHtml: abstract ? renderAbstract(abstract.text) : '',
		abstractLang: abstract?.lang ?? presentation.language,
		description: abstractText ? truncate(abstractText) : presentation.title,
		abstractText
	};
};
