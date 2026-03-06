import type { CfpPdfLabels } from './generate-cfp-pdf';

function wrapLine(text: string, width: number): string {
	const words = text.split(/\s+/);
	const lines: string[] = [];
	let current = '';

	for (const word of words) {
		if (current && current.length + 1 + word.length > width) {
			lines.push(current);
			current = word;
		} else {
			current = current ? `${current} ${word}` : word;
		}
	}
	if (current) lines.push(current);
	return lines.join('\n');
}

function sectionSeparator(): string {
	return '\n' + '─'.repeat(60) + '\n';
}

export function generateCfpText(labels: CfpPdfLabels): void {
	const W = 72;
	const lines: string[] = [];

	// Header
	lines.push('═'.repeat(W));
	lines.push(labels.cfpLabel.toUpperCase());
	lines.push('═'.repeat(W));
	lines.push('');
	lines.push(labels.heroSubtitle);
	lines.push('');
	lines.push(labels.title);
	lines.push('');
	lines.push(`${labels.heroDates}  ·  ${labels.heroLocation}`);

	// About the Workshop
	lines.push(sectionSeparator());
	lines.push(labels.rationaleLabel.toUpperCase());
	lines.push('');
	lines.push(wrapLine(labels.rationale, W));

	// Convenors
	lines.push(sectionSeparator());
	lines.push(labels.convenorsLabel.toUpperCase());
	lines.push('');
	for (const conv of labels.convenors) {
		lines.push(`  - ${conv.name}, ${conv.affiliation}`);
	}

	// Thematic Axes
	lines.push(sectionSeparator());
	lines.push(labels.thematicAxesLabel.toUpperCase());
	lines.push('');
	lines.push(wrapLine(labels.thematicAxesIntro, W));
	lines.push('');

	for (const axis of labels.axes) {
		lines.push(`${axis.number}. ${axis.title}`);
		lines.push('');
		lines.push(wrapLine(axis.description, W));
		lines.push('');
	}

	// Workshop Format
	lines.push(sectionSeparator());
	lines.push(labels.workshopFormatLabel.toUpperCase());
	lines.push('');
	lines.push(wrapLine(labels.workshopFormat, W));

	// Submission Guidelines
	lines.push(sectionSeparator());
	lines.push(labels.guidelinesLabel.toUpperCase());
	lines.push('');
	lines.push(wrapLine(labels.guidelines, W));
	lines.push('');
	lines.push(labels.contactText);
	lines.push('');
	for (const contact of labels.contacts) {
		lines.push(`  - ${contact.name}: ${contact.email}`);
	}

	// Publication
	lines.push(sectionSeparator());
	lines.push(labels.publicationLabel.toUpperCase());
	lines.push('');
	lines.push(wrapLine(labels.publication, W));

	// Selection Criteria
	lines.push(sectionSeparator());
	lines.push(labels.selectionLabel.toUpperCase());
	lines.push('');
	lines.push(wrapLine(labels.selectionCriteria, W));

	// Key Dates
	lines.push(sectionSeparator());
	lines.push(labels.keyDatesLabel.toUpperCase());
	lines.push('');
	for (const dateItem of labels.keyDates) {
		lines.push(`  - ${dateItem.label}: ${dateItem.value}`);
	}

	// Footer
	lines.push('');
	lines.push('═'.repeat(W));
	lines.push(labels.siteUrl);
	lines.push('═'.repeat(W));
	lines.push('');

	const text = lines.join('\n');
	const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = labels.filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
