/**
 * Markdown rendering for paper abstracts. Kept separate from the plain-text
 * helpers in `text.ts` so `marked` is only pulled into build-time code
 * (the paper page renders abstracts in its server load), never into
 * client bundles.
 */
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

/**
 * A paragraph whose entire content is one bold run is a section heading the
 * author wrote in the only syntax to hand. One abstract does this five times.
 * Tagged here rather than in CSS because the distinction cannot be selected:
 * `p:has(> strong:only-child)` also matches a paragraph that merely *opens*
 * with a bold phrase, which two other abstracts do mid-sentence.
 *
 * It becomes an `<h3>`, and keeps the author's `<strong>`: the transform adds
 * structure and a styling hook, it does not rewrite the author's emphasis.
 * This was a `<p>` until the paper page gained an "Abstract" heading of its
 * own — without one, an `<h3>` here would have filed these under the preceding
 * "Presented by", which is not what they belong to. With `<h2>Abstract</h2>`
 * above the article they sit where they read: h1 → h2 → h3, no level skipped,
 * and five section headings that were invisible to the document outline are
 * now in it.
 */
const LONE_BOLD_PARAGRAPH = /<p>(<strong>(?:(?!<\/strong>)[\s\S])*<\/strong>)<\/p>/g;

export function renderAbstract(markdown: string): string {
	const html = marked.parse(markdown, { async: false }) as string;
	return html.replace(LONE_BOLD_PARAGRAPH, '<h3 class="prose-subhead">$1</h3>');
}
