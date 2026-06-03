import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

export function renderAbstract(markdown: string): string {
	return marked.parse(markdown, { async: false }) as string;
}

export function abstractToPlainText(markdown: string): string {
	return markdown
		.replace(/\*\*([^*]+)\*\*/g, '$1')
		.replace(/\*([^*]+)\*/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/\s+/g, ' ')
		.trim();
}

export function truncate(text: string, maxLen = 160): string {
	if (text.length <= maxLen) return text;
	const cut = text.slice(0, maxLen);
	const lastSpace = cut.lastIndexOf(' ');
	return (lastSpace > maxLen * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}
