import { base } from '$app/paths';
import { error, redirect } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { presentations, getPresentation, getPresentationAuthors } from '$lib/data/presentations';
import { personRef } from '$lib/data/people';
import { paperRedirects } from '$lib/data/redirects';
import { paperSummary } from '$lib/server/views';
import { langEntries, resolveAbstract } from '$lib/utils/i18n';
import { localizedPath } from '$lib/utils/localized-paths';
import { renderAbstract } from '$lib/utils/markdown';
import { getPlacements } from '$lib/utils/placement';
import { abstractToPlainText, truncate } from '$lib/utils/text';

export const prerender = true;

export const entries: EntryGenerator = () => {
	// Retired ids prerender too, so that each one becomes a redirect page
	// rather than a 404 on a host that cannot rewrite.
	const slugs = [...presentations.map((p) => p.id), ...Object.keys(paperRedirects)];
	return slugs.flatMap((slug) => langEntries().map(({ lang }) => ({ lang, slug })));
};

// A server load (rather than a universal one) keeps `marked` out of the
// client bundle: abstracts are rendered to HTML once, at prerender time. It
// also resolves everything else the page shows, so the route never imports
// the registries — and it hands over the rendered abstract only, where it
// used to serialise the markdown source alongside it, and every author's bio.
export const load: PageServerLoad = ({ params }) => {
	const presentation = getPresentation(params.slug);
	const locale = params.lang === 'fr' ? 'fr' : 'en';
	if (!presentation) {
		const current = paperRedirects[params.slug];
		if (current) {
			// Prerendering turns this into a small page that forwards the
			// reader, keeping the locale they arrived in.
			redirect(308, localizedPath(`/papers/${current}`, locale, base));
		}
		error(404, 'Paper not found');
	}

	// This route prerenders once per locale, so the locale comes off the route
	// parameter rather than the paraglide global: server loads run before the
	// layout load that sets it. A bilingual abstract has to resolve to the half
	// belonging to the document being written, and the `description` and the
	// schema's `abstract` derive from whichever half that is; the placement
	// labels are UI copy in the same locale. `params.lang` is '' on the English
	// pass.
	const abstract = resolveAbstract(presentation, locale);
	const abstractText = abstract ? abstractToPlainText(abstract.text) : '';
	const placement = getPlacements(locale).get(presentation.id);

	return {
		presentation: paperSummary(presentation),
		authors: getPresentationAuthors(presentation).map((author) => personRef(author)),
		abstractHtml: abstract ? renderAbstract(abstract.text) : '',
		abstractLang: abstract?.lang ?? presentation.language,
		description: abstractText ? truncate(abstractText) : presentation.title,
		abstractText,
		// An abstract page used to have exactly one exit: "Back to papers". The
		// programme already knows its session and the other papers in it.
		placement: placement && {
			sessionLabel: placement.sessionLabel,
			slotLabel: placement.slotLabel,
			anchor: placement.anchor
		},
		siblings: (placement?.siblingIds ?? []).flatMap((id) => {
			const sibling = getPresentation(id);
			return sibling ? [paperSummary(sibling)] : [];
		})
	};
};
