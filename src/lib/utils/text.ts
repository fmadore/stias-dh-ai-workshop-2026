/** Plain-text helpers shared by cards and SEO descriptions (no heavy deps). */

export function getInitials(name: string): string {
	return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

/** Strip the small Markdown subset used in abstracts (bold, italic, links). */
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
