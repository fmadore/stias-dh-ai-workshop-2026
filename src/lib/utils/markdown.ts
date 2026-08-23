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
 * It stays a `<p>`, and keeps the author's `<strong>`: the transform adds a
 * styling hook, it does not rewrite the markup. Promoting it to `<h3>` would
 * file these under the preceding "Presented by" heading, which is not what
 * they belong to — the abstract has no heading of its own to sit beneath.
 */
const LONE_BOLD_PARAGRAPH = /<p>(<strong>(?:(?!<\/strong>)[\s\S])*<\/strong>)<\/p>/g;

export function renderAbstract(markdown: string): string {
	const html = marked.parse(markdown, { async: false }) as string;
	return html.replace(LONE_BOLD_PARAGRAPH, '<p class="prose-subhead">$1</p>');
}
