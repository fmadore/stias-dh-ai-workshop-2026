/** Wrap prose without flattening the paragraphs and list items supplied by the author. */
export function wrapPlainText(text: string, width = 72): string {
	return text
		.split(/\r?\n/)
		.map((paragraph) => {
			const lines: string[] = [];
			let current = '';
			for (const word of paragraph.trim().split(/\s+/).filter(Boolean)) {
				if (current && `${current} ${word}`.length > width) {
					lines.push(current);
					current = word;
				} else current = current ? `${current} ${word}` : word;
			}
			if (current) lines.push(current);
			return lines.join('\n');
		})
		.join('\n');
}
