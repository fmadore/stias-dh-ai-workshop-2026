/**
 * Markdown rendering for paper abstracts. Kept separate from the plain-text
 * helpers in `text.ts` so `marked` is only pulled into build-time code
 * (the paper page renders abstracts in its server load), never into
 * client bundles.
 */
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

export function renderAbstract(markdown: string): string {
	return marked.parse(markdown, { async: false }) as string;
}
