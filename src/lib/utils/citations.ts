import type { PersonRef, Presentation, ProgrammeDay, SiteConfig } from '#lib/types/index.ts';
import { localizedAbsoluteUrl, type SupportedLocale } from './localized-paths';
import { eventId, personId } from './structured-data';

export interface PresentationCitation {
	id: string;
	title: string;
	authors: Pick<PersonRef, 'id' | 'name' | 'affiliation'>[];
	language: Presentation['language'];
	/** The presentation's scheduled day, not a claimed publication date. */
	date?: string;
	year: string;
	url: string;
	event: { title: string; url: string; start: string; end: string; location: string };
}

/** Resolve citations from the same byline, programme and canonical site data as the page. */
export function createPresentationCitation(
	presentation: Presentation,
	people: readonly Pick<PersonRef, 'id' | 'name' | 'affiliation'>[],
	days: readonly ProgrammeDay[],
	site: SiteConfig
): PresentationCitation {
	const byId = new Map(people.map((person) => [person.id, person]));
	const authors = presentation.authors.map((id) => {
		const author = byId.get(id);
		if (!author) throw new Error(`Missing citation author ${id} for ${presentation.id}`);
		return { id: author.id, name: author.name, affiliation: author.affiliation };
	});
	const date = days.find((day) =>
		day.sessions.some((session) => session.presentationIds?.includes(presentation.id))
	)?.date;

	return {
		id: presentation.id,
		title: presentation.title,
		authors,
		language: presentation.language,
		...(date ? { date } : {}),
		year: (date ?? site.dates.start).slice(0, 4),
		// Both language versions export the same record and stable citation URL.
		url: localizedAbsoluteUrl(site.url, `/papers/${presentation.id}`, 'en'),
		event: {
			title: site.title.en,
			url: site.url,
			start: site.dates.start,
			end: site.dates.end,
			location: site.location
		}
	};
}

/** Prevent newlines in data from becoming extra RIS tags or BibTeX fields. */
function oneLine(value: string): string {
	return value.replace(/\s+/g, ' ').trim();
}

function bibtexText(value: string): string {
	const escapes: Record<string, string> = {
		'\\': '\\textbackslash{}',
		'{': '\\{',
		'}': '\\}',
		'&': '\\&',
		'%': '\\%',
		$: '\\$',
		'#': '\\#',
		_: '\\_',
		'~': '\\textasciitilde{}',
		'^': '\\textasciicircum{}'
	};
	return oneLine(value).replace(/[\\{}&%$#_~^]/g, (character) => escapes[character]);
}

/**
 * These are workshop presentations, not published proceedings. Standard
 * BibTeX has no presentation type, so use @unpublished with an explicit note.
 * Names are stored as display names in the registry: brace each whole name
 * rather than guessing family names, particles or culturally specific order.
 * Keep Unicode for modern BibTeX/BibLaTeX importers and protect title casing.
 */
export function presentationBibtex(citation: PresentationCitation): string {
	const note = `Workshop presentation at ${citation.event.title}, ${citation.event.location}, ${citation.date ?? `${citation.event.start}–${citation.event.end}`}`;
	const fields = [
		`author = {${citation.authors.map((author) => `{${bibtexText(author.name)}}`).join(' and ')}}`,
		`title = {{${bibtexText(citation.title)}}}`,
		`year = {${citation.year}}`,
		`note = {${bibtexText(note)}}`,
		`url = {${citation.url}}`,
		`language = {${citation.language === 'fr' ? 'French' : 'English'}}`
	];
	return `@unpublished{stias-${citation.year}-${citation.id},\n  ${fields.join(',\n  ')}\n}\n`;
}

/**
 * RIS SLIDE is imported as a presentation by Zotero, with T2 as meetingName
 * and M3 as presentationType. AU preserves the credited author order, without
 * asserting that every co-author presented. Zotero imports names without a
 * comma into a literal, single-field creator name; other RIS clients may vary.
 * https://github.com/zotero/translators/blob/master/RIS.js
 */
export function presentationRis(citation: PresentationCitation): string {
	const fields: [string, string][] = [
		['TY', 'SLIDE'],
		['TI', citation.title],
		...citation.authors.map((author): [string, string] => ['AU', author.name]),
		['T2', citation.event.title],
		['M3', 'Workshop presentation'],
		['PY', citation.year],
		...(citation.date ? ([['DA', citation.date.replaceAll('-', '/')]] as [string, string][]) : []),
		['CY', citation.event.location],
		['LA', citation.language === 'fr' ? 'French' : 'English'],
		['UR', citation.url],
		['ER', '']
	];
	return fields.map(([tag, value]) => `${tag}  - ${oneLine(value)}\r\n`).join('');
}

/** Describe the presentation without asserting a journal, proceedings or publication date. */
export function presentationSchema(
	citation: PresentationCitation,
	abstract?: string,
	locale: SupportedLocale = 'en',
	/**
	 * Whether an author has a page on the site. Those who do share the `@id`
	 * of their profile page's Person, which joins the byline to the profile in
	 * the graph; credited co-authors have no page and stay anonymous nodes.
	 */
	hasPage: (id: string) => boolean = () => false
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		'@id': `${citation.url}#presentation`,
		name: citation.title,
		genre: 'Workshop presentation',
		...(abstract ? { abstract } : {}),
		inLanguage: citation.language,
		url: citation.url,
		author: citation.authors.map((author) => ({
			'@type': 'Person',
			...(hasPage(author.id) ? { '@id': personId(citation.event.url, author.id) } : {}),
			name: author.name,
			...(author.affiliation
				? { affiliation: { '@type': 'Organization', name: author.affiliation[locale] } }
				: {})
		})),
		// Event.workFeatured relates an event to a presentation; isPartOf expects
		// a CreativeWork, so an Event must not be nested there as a publication.
		'@reverse': { workFeatured: { '@id': eventId(citation.event.url) } }
	};
}

export interface MetaTag {
	name: string;
	content: string;
}

/**
 * Highwire Press `citation_*` tags, which Google Scholar and Zotero read off
 * the page itself, and their Dublin Core counterparts. Built from the same
 * citation object as the BibTeX and RIS so the three cannot disagree.
 *
 * Deliberately absent: `citation_pdf_url` (there is no PDF — slides are
 * external links, and Scholar penalises a PDF URL that serves HTML) and any
 * journal, volume or DOI field (these are presentations, not proceedings).
 * The date is the scheduled day, as in the RIS `DA`; the year alone when the
 * paper was never placed in the programme.
 */
export function presentationMetaTags(
	citation: PresentationCitation,
	locale: SupportedLocale
): MetaTag[] {
	// The abstract page actually being read — `citation.url` is the stable
	// English address, which is right for an export but not for "this page".
	const pageUrl = localizedAbsoluteUrl(citation.event.url, `/papers/${citation.id}`, locale);
	return [
		{ name: 'citation_title', content: oneLine(citation.title) },
		// Highwire pairs an institution with the author tag before it.
		...citation.authors.flatMap((author) => [
			{ name: 'citation_author', content: author.name },
			...(author.affiliation
				? [{ name: 'citation_author_institution', content: author.affiliation[locale] }]
				: [])
		]),
		{ name: 'citation_conference_title', content: citation.event.title },
		{
			name: 'citation_publication_date',
			content: citation.date ? citation.date.replaceAll('-', '/') : citation.year
		},
		{ name: 'citation_language', content: citation.language },
		{ name: 'citation_abstract_html_url', content: pageUrl },
		{ name: 'DC.title', content: oneLine(citation.title) },
		...citation.authors.map((author) => ({ name: 'DC.creator', content: author.name })),
		{ name: 'DC.date', content: citation.date ?? citation.year },
		{ name: 'DC.language', content: citation.language }
	];
}
