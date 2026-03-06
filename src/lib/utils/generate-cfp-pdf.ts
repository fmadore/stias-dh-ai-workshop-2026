import type jsPDF from 'jspdf';

export interface CfpPdfLabels {
	cfpLabel: string;
	title: string;
	heroSubtitle: string;
	heroDates: string;
	heroLocation: string;
	rationaleLabel: string;
	rationale: string;
	convenorsLabel: string;
	convenors: { name: string; affiliation: string }[];
	thematicAxesLabel: string;
	thematicAxesIntro: string;
	axes: { number: number; title: string; description: string }[];
	workshopFormatLabel: string;
	workshopFormat: string;
	guidelinesLabel: string;
	guidelines: string;
	contactText: string;
	contacts: { name: string; email: string }[];
	publicationLabel: string;
	publication: string;
	selectionLabel: string;
	selectionCriteria: string;
	keyDatesLabel: string;
	keyDates: { label: string; value: string }[];
	supportedByLabel: string;
	siteUrl: string;
	filename: string;
}

const TEAL = [13, 115, 119] as const;
const GOLD = [212, 168, 67] as const;
const DARK = [30, 30, 30] as const;
const BODY = [60, 60, 60] as const;
const LIGHT_GRAY = [120, 120, 120] as const;

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_L = 20;
const MARGIN_R = 20;
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R;
const FOOTER_H = 18;
const BOTTOM_LIMIT = PAGE_H - FOOTER_H - 5;

function addFooter(doc: jsPDF, pageNum: number, totalPages: number, siteUrl: string) {
	doc.setDrawColor(...GOLD);
	doc.setLineWidth(0.5);
	doc.line(MARGIN_L, PAGE_H - FOOTER_H, PAGE_W - MARGIN_R, PAGE_H - FOOTER_H);

	doc.setFont('Outfit', 'normal');
	doc.setFontSize(8);
	doc.setTextColor(...LIGHT_GRAY);
	doc.text(siteUrl, MARGIN_L, PAGE_H - 10);
	doc.text(`${pageNum} / ${totalPages}`, PAGE_W - MARGIN_R, PAGE_H - 10, { align: 'right' });
}

function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
	if (y + needed > BOTTOM_LIMIT) {
		doc.addPage();
		return 25;
	}
	return y;
}

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
	return doc.splitTextToSize(text, maxWidth) as string[];
}

async function loadImageAsDataUrl(url: string): Promise<string> {
	const response = await fetch(url);
	const blob = await response.blob();

	if (blob.type === 'image/svg+xml') {
		// Convert SVG to PNG via canvas
		const svgText = await blob.text();
		const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
		const svgUrl = URL.createObjectURL(svgBlob);

		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				canvas.width = img.naturalWidth || 200;
				canvas.height = img.naturalHeight || 100;
				const ctx = canvas.getContext('2d')!;
				ctx.drawImage(img, 0, 0);
				URL.revokeObjectURL(svgUrl);
				resolve(canvas.toDataURL('image/png'));
			};
			img.onerror = () => {
				URL.revokeObjectURL(svgUrl);
				reject(new Error(`Failed to load SVG: ${url}`));
			};
			img.src = svgUrl;
		});
	}

	// For PNG/JPEG, convert directly to data URL
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

export async function generateCfpPdf(labels: CfpPdfLabels, basePath: string): Promise<void> {
	const { jsPDF } = await import('jspdf');

	const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

	// Load fonts and logos in parallel
	const logoFiles = [
		{ path: '/images/logos/point-sud-logo.svg', alt: 'Point Sud' },
		{ path: '/images/logos/STIAS.png', alt: 'STIAS' },
		{ path: '/images/logos/uni-bayreuth-africa-multiple-logo.jpeg', alt: 'Africa Multiple' },
		{ path: "/images/logos/King's_College_London_logo.svg", alt: "King's College London" },
		{ path: '/images/logos/SADiLaR-1024x487.png', alt: 'SADiLaR' }
	];

	const [regularBuf, semiBoldBuf, ...logoResults] = await Promise.all([
		fetch(`${basePath}/fonts/Outfit-Regular.ttf`).then((r) => r.arrayBuffer()),
		fetch(`${basePath}/fonts/Outfit-SemiBold.ttf`).then((r) => r.arrayBuffer()),
		...logoFiles.map((logo) => loadImageAsDataUrl(`${basePath}${logo.path}`).catch(() => null))
	]);

	const logos = logoResults.filter((r): r is string => r !== null);

	const toBase64 = (buf: ArrayBuffer) => {
		const bytes = new Uint8Array(buf);
		let binary = '';
		for (let i = 0; i < bytes.length; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return btoa(binary);
	};

	doc.addFileToVFS('Outfit-Regular.ttf', toBase64(regularBuf));
	doc.addFont('Outfit-Regular.ttf', 'Outfit', 'normal');
	doc.addFileToVFS('Outfit-SemiBold.ttf', toBase64(semiBoldBuf));
	doc.addFont('Outfit-SemiBold.ttf', 'Outfit', 'bold');

	doc.setFont('Outfit', 'normal');

	// ── Page 1: Header ──
	// Teal header bar (taller to fit CFP label)
	const headerH = 78;
	doc.setFillColor(...TEAL);
	doc.rect(0, 0, PAGE_W, headerH, 'F');

	// "CALL FOR PAPERS" label at the top
	doc.setFont('Outfit', 'bold');
	doc.setFontSize(20);
	doc.setTextColor(255, 255, 255);
	doc.text(labels.cfpLabel.toUpperCase(), PAGE_W / 2, 16, { align: 'center' });

	// Gold separator line
	doc.setDrawColor(...GOLD);
	doc.setLineWidth(0.5);
	doc.line(PAGE_W / 2 - 30, 20, PAGE_W / 2 + 30, 20);

	// DFG subtitle
	doc.setFont('Outfit', 'normal');
	doc.setFontSize(9);
	doc.setTextColor(255, 255, 255);
	doc.text(labels.heroSubtitle.toUpperCase(), PAGE_W / 2, 27, { align: 'center' });

	// Workshop title
	doc.setFont('Outfit', 'bold');
	doc.setFontSize(14);
	const titleLines = wrapText(doc, labels.title, CONTENT_W - 10);
	const titleStartY = 35;
	titleLines.forEach((line, i) => {
		doc.text(line, PAGE_W / 2, titleStartY + i * 6, { align: 'center' });
	});

	// Dates + Location
	doc.setFont('Outfit', 'normal');
	doc.setFontSize(10);
	const infoY = titleStartY + titleLines.length * 6 + 6;
	doc.text(`${labels.heroDates}  ·  ${labels.heroLocation}`, PAGE_W / 2, infoY, {
		align: 'center'
	});

	// Gold accent line under header
	doc.setDrawColor(...GOLD);
	doc.setLineWidth(1);
	doc.line(MARGIN_L, headerH + 2, PAGE_W - MARGIN_R, headerH + 2);

	let y = headerH + 12;

	// ── Section helper ──
	function sectionHeading(title: string): number {
		y = checkPageBreak(doc, y, 20);
		doc.setFont('Outfit', 'bold');
		doc.setFontSize(13);
		doc.setTextColor(...TEAL);
		doc.text(title, MARGIN_L, y);
		// Gold underline
		doc.setDrawColor(...GOLD);
		doc.setLineWidth(0.3);
		const titleWidth = doc.getTextWidth(title);
		doc.line(MARGIN_L, y + 1.5, MARGIN_L + titleWidth, y + 1.5);
		y += 8;
		return y;
	}

	function bodyText(text: string): number {
		doc.setFont('Outfit', 'normal');
		doc.setFontSize(10);
		doc.setTextColor(...BODY);
		const lines = wrapText(doc, text, CONTENT_W);
		const lineHeight = 4.5;

		for (const line of lines) {
			y = checkPageBreak(doc, y, lineHeight + 2);
			doc.text(line, MARGIN_L, y);
			y += lineHeight;
		}
		y += 4;
		return y;
	}

	// ── 1. About the Workshop ──
	sectionHeading(labels.rationaleLabel);
	bodyText(labels.rationale);

	// ── 2. Convenors ──
	sectionHeading(labels.convenorsLabel);
	doc.setFontSize(10);
	for (const conv of labels.convenors) {
		y = checkPageBreak(doc, y, 8);
		doc.setFont('Outfit', 'bold');
		doc.setTextColor(...DARK);
		doc.text(`•  ${conv.name}`, MARGIN_L + 2, y);
		doc.setFont('Outfit', 'normal');
		doc.setTextColor(...BODY);
		const nameWidth = doc.getTextWidth(`•  ${conv.name}`);
		doc.text(`, ${conv.affiliation}`, MARGIN_L + 2 + nameWidth, y);
		y += 6;
	}
	y += 4;

	// ── 3. Thematic Axes ──
	sectionHeading(labels.thematicAxesLabel);
	doc.setFont('Outfit', 'normal');
	doc.setFontSize(10);
	doc.setTextColor(...BODY);
	const introLines = wrapText(doc, labels.thematicAxesIntro, CONTENT_W);
	for (const line of introLines) {
		y = checkPageBreak(doc, y, 6);
		doc.text(line, MARGIN_L, y);
		y += 4.5;
	}
	y += 3;

	for (const axis of labels.axes) {
		y = checkPageBreak(doc, y, 20);

		// Numbered circle
		doc.setFillColor(...GOLD);
		doc.circle(MARGIN_L + 4, y - 1.5, 3.5, 'F');
		doc.setFont('Outfit', 'bold');
		doc.setFontSize(10);
		doc.setTextColor(255, 255, 255);
		doc.text(String(axis.number), MARGIN_L + 4, y - 0.5, { align: 'center' });

		// Axis title
		doc.setFont('Outfit', 'bold');
		doc.setFontSize(10);
		doc.setTextColor(...DARK);
		const axisTitle = wrapText(doc, axis.title, CONTENT_W - 14);
		axisTitle.forEach((line, i) => {
			doc.text(line, MARGIN_L + 12, y + i * 4.5 - 1);
		});
		y += axisTitle.length * 4.5 + 2;

		// Axis description
		doc.setFont('Outfit', 'normal');
		doc.setFontSize(9.5);
		doc.setTextColor(...BODY);
		const descLines = wrapText(doc, axis.description, CONTENT_W - 12);
		for (const line of descLines) {
			y = checkPageBreak(doc, y, 6);
			doc.text(line, MARGIN_L + 12, y);
			y += 4.2;
		}
		y += 5;
	}

	// ── 4. Workshop Format & Language Policy ──
	sectionHeading(labels.workshopFormatLabel);
	bodyText(labels.workshopFormat);

	// ── 5. Submission Guidelines ──
	sectionHeading(labels.guidelinesLabel);
	bodyText(labels.guidelines);

	// Contact info
	y = checkPageBreak(doc, y, 6 + labels.contacts.length * 6);
	doc.setFont('Outfit', 'normal');
	doc.setFontSize(10);
	doc.setTextColor(...BODY);
	doc.text(labels.contactText, MARGIN_L, y);
	y += 6;

	for (const contact of labels.contacts) {
		y = checkPageBreak(doc, y, 6);
		doc.setFont('Outfit', 'bold');
		doc.setTextColor(...DARK);
		doc.text(`•  ${contact.name}: `, MARGIN_L + 2, y);
		const prefixW = doc.getTextWidth(`•  ${contact.name}: `);
		doc.setFont('Outfit', 'normal');
		doc.setTextColor(...TEAL);
		doc.text(contact.email, MARGIN_L + 2 + prefixW, y);
		y += 6;
	}
	y += 4;

	// ── 6. Publication ──
	sectionHeading(labels.publicationLabel);
	bodyText(labels.publication);

	// ── 7. Selection Criteria & Inclusivity ──
	sectionHeading(labels.selectionLabel);
	bodyText(labels.selectionCriteria);

	// ── 7. Key Dates ──
	sectionHeading(labels.keyDatesLabel);
	for (const dateItem of labels.keyDates) {
		y = checkPageBreak(doc, y, 12);

		// Gold dot
		doc.setFillColor(...GOLD);
		doc.circle(MARGIN_L + 3, y - 1, 1.5, 'F');

		doc.setFont('Outfit', 'normal');
		doc.setFontSize(9);
		doc.setTextColor(...LIGHT_GRAY);
		doc.text(dateItem.label.toUpperCase(), MARGIN_L + 9, y - 1);

		doc.setFont('Outfit', 'bold');
		doc.setFontSize(11);
		doc.setTextColor(...DARK);
		doc.text(dateItem.value, MARGIN_L + 9, y + 4);
		y += 12;
	}

	// ── Logos section on last page ──
	if (logos.length > 0) {
		// Ensure enough space for logos (need ~30mm)
		y = checkPageBreak(doc, y, 35);
		y += 5;

		// "Supported by" label
		doc.setFont('Outfit', 'normal');
		doc.setFontSize(8);
		doc.setTextColor(...LIGHT_GRAY);
		doc.text(labels.supportedByLabel.toUpperCase(), PAGE_W / 2, y, { align: 'center' });
		y += 6;

		// Draw logos centered in a row
		const logoH = 10;
		const logoSpacing = 6;
		// Calculate total width to center them
		const totalLogosWidth = logos.length * 28 + (logos.length - 1) * logoSpacing;
		let logoX = (PAGE_W - totalLogosWidth) / 2;

		for (const logoDataUrl of logos) {
			try {
				doc.addImage(logoDataUrl, 'PNG', logoX, y, 28, logoH);
			} catch {
				// Skip logos that fail to embed
			}
			logoX += 28 + logoSpacing;
		}
	}

	// ── Add footers to all pages ──
	const totalPages = doc.getNumberOfPages();
	for (let i = 1; i <= totalPages; i++) {
		doc.setPage(i);
		addFooter(doc, i, totalPages, labels.siteUrl);
	}

	doc.save(labels.filename);
}
