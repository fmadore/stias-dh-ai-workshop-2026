import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, type PDFFont, type PDFImage, type PDFPage, rgb } from 'pdf-lib';
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { cfpInfo } from '../src/lib/data/cfp.ts';
import { contactEmails } from '../src/lib/data/contacts.ts';
import { organizers } from '../src/lib/data/organizers.ts';
import { siteConfig } from '../src/lib/data/site-config.ts';
import { sponsors } from '../src/lib/data/sponsors.ts';
import { thematicAxes } from '../src/lib/data/thematic-axes.ts';
import { venueInfo } from '../src/lib/data/venue.ts';
import { joinLogisticsList } from '../src/lib/utils/logistics.ts';
import type { LocalizedString } from '../src/lib/types/index.ts';

type Locale = 'en' | 'fr';
type Messages = Record<string, string>;

interface Labels {
	cfpLabel: string;
	title: string;
	heroSubtitle: string;
	heroDates: string;
	heroLocation: string;
	rationaleLabel: string;
	rationale: string;
	convenorsLabel: string;
	convenors: Array<{ name: string; affiliation: string }>;
	thematicAxesLabel: string;
	thematicAxesIntro: string;
	axes: Array<{ number: number; title: string; description: string }>;
	workshopFormatLabel: string;
	workshopFormat: string;
	guidelinesLabel: string;
	guidelines: string;
	contactText: string;
	contacts: Array<{ name: string; email: string }>;
	publicationLabel: string;
	publication: string;
	selectionLabel: string;
	selectionCriteria: string;
	fundingLabel: string;
	fundingText: string;
	keyDatesLabel: string;
	keyDates: Array<{ label: string; value: string }>;
	supportedByLabel: string;
	siteUrl: string;
}

const OUTPUT_DIR = path.resolve('static/downloads');
const FONT_DIR = path.resolve('scripts/assets/fonts');
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const TEAL = rgb(13 / 255, 115 / 255, 119 / 255);
const GOLD = rgb(212 / 255, 168 / 255, 67 / 255);
const INK = rgb(30 / 255, 30 / 255, 30 / 255);
const BODY = rgb(60 / 255, 60 / 255, 60 / 255);
const MUTED = rgb(112 / 255, 112 / 255, 112 / 255);

function localize(value: LocalizedString, locale: Locale): string {
	return value[locale] ?? value.en;
}

function formatDate(isoDate: string, locale: Locale): string {
	return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}

function formatDateRange(startIso: string, endIso: string, locale: Locale): string {
	const start = new Date(`${startIso}T00:00:00Z`);
	const end = new Date(`${endIso}T00:00:00Z`);
	const intlLocale = locale === 'fr' ? 'fr-FR' : 'en-GB';
	if (
		start.getUTCMonth() === end.getUTCMonth() &&
		start.getUTCFullYear() === end.getUTCFullYear()
	) {
		const month = start.toLocaleDateString(intlLocale, { month: 'long', timeZone: 'UTC' });
		return `${start.getUTCDate()}–${end.getUTCDate()} ${month} ${start.getUTCFullYear()}`;
	}
	return `${formatDate(startIso, locale)} – ${formatDate(endIso, locale)}`;
}

async function loadLabels(locale: Locale): Promise<Labels> {
	const messages = JSON.parse(
		await readFile(path.resolve(`messages/${locale}.json`), 'utf8')
	) as Messages;
	const message = (key: string) => {
		const value = messages[key];
		if (!value) throw new Error(`Missing ${locale} message: ${key}`);
		return value;
	};

	return {
		cfpLabel: message('section_cfp'),
		title: localize(siteConfig.title, locale),
		heroSubtitle: message('hero_subtitle'),
		heroDates: message('hero_dates'),
		heroLocation: message('hero_location'),
		rationaleLabel: message('cfp_rationale_label'),
		rationale: localize(cfpInfo.rationale, locale),
		convenorsLabel: message('cfp_convenors_label'),
		convenors: organizers.map((organizer) => ({
			name: organizer.name,
			affiliation: localize(organizer.affiliation, locale)
		})),
		thematicAxesLabel: message('section_thematic_axes'),
		thematicAxesIntro: message('thematic_axes_reference'),
		axes: thematicAxes.map((axis) => ({
			number: axis.number,
			title: localize(axis.title, locale),
			description: localize(axis.description, locale)
		})),
		workshopFormatLabel: message('workshop_format_label'),
		workshopFormat: localize(cfpInfo.workshopFormat, locale),
		guidelinesLabel: message('guidelines'),
		guidelines: localize(cfpInfo.guidelines, locale),
		contactText: message('cfp_contact_text'),
		contacts: organizers
			.filter((organizer) => contactEmails[organizer.id])
			.map((organizer) => ({ name: organizer.name, email: contactEmails[organizer.id] })),
		publicationLabel: message('cfp_publication_label'),
		publication: localize(cfpInfo.publication, locale),
		selectionLabel: message('cfp_selection_label'),
		selectionCriteria: localize(cfpInfo.selectionCriteria, locale),
		fundingLabel: message('cfp_funding_label'),
		// Composed from the same two lists the venue page renders, so the PDF,
		// the call-for-papers page and the venue page cannot say three things.
		fundingText: [
			message('logistics_covered_sentence').replace(
				'{items}',
				joinLogisticsList(venueInfo.logisticsCovered, locale)
			),
			message('logistics_not_covered_sentence').replace(
				'{items}',
				joinLogisticsList(venueInfo.logisticsNotCovered, locale)
			)
		].join(' '),
		keyDatesLabel: message('key_dates'),
		keyDates: [
			{ label: message('submission_deadline'), value: formatDate(cfpInfo.deadline, locale) },
			{ label: message('notification_date'), value: formatDate(cfpInfo.notificationDate, locale) },
			{
				label: message('full_papers_deadline'),
				value: formatDate(cfpInfo.fullPapersDeadline, locale)
			},
			{
				label: message('workshop_dates'),
				value: formatDateRange(siteConfig.dates.start, siteConfig.dates.end, locale)
			}
		],
		supportedByLabel: message('footer_supported_by'),
		siteUrl: siteConfig.url
	};
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
	const paragraphs = text.split(/\n+/);
	const lines: string[] = [];
	for (const paragraph of paragraphs) {
		const words = paragraph.trim().split(/\s+/).filter(Boolean);
		let line = '';
		for (const word of words) {
			const candidate = line ? `${line} ${word}` : word;
			if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) {
				lines.push(line);
				line = word;
			} else {
				line = candidate;
			}
		}
		if (line) lines.push(line);
	}
	return lines;
}

async function loadLogos(pdf: PDFDocument): Promise<Array<{ image: PDFImage; ratio: number }>> {
	const loaded = await Promise.all(
		sponsors.map(async (sponsor) => {
			try {
				const source = await readFile(path.join('static', sponsor.logo.replace(/^\//, '')));
				const pipeline = sharp(source).png();
				const metadata = await pipeline.metadata();
				const png = await pipeline.toBuffer();
				return {
					image: await pdf.embedPng(png),
					ratio: (metadata.width ?? 2) / (metadata.height ?? 1)
				};
			} catch (error) {
				console.warn(`Skipping PDF logo ${sponsor.logo}:`, error);
				return null;
			}
		})
	);
	return loaded.filter((logo): logo is { image: PDFImage; ratio: number } => logo !== null);
}

async function createPdf(labels: Labels, locale: Locale): Promise<Uint8Array> {
	const pdf = await PDFDocument.create();
	pdf.registerFontkit(fontkit);
	pdf.setTitle(labels.title);
	pdf.setSubject(labels.cfpLabel);
	pdf.setAuthor('STIAS DH & AI Workshop 2026');
	pdf.setLanguage(locale);

	const [regularBytes, semiboldBytes] = await Promise.all([
		readFile(path.join(FONT_DIR, 'Outfit-Regular.ttf')),
		readFile(path.join(FONT_DIR, 'Outfit-SemiBold.ttf'))
	]);
	const regular = await pdf.embedFont(regularBytes, { subset: true });
	const semibold = await pdf.embedFont(semiboldBytes, { subset: true });
	const logos = await loadLogos(pdf);

	let page: PDFPage;
	let y = 0;
	const addPage = () => {
		page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
		y = PAGE_HEIGHT - MARGIN;
	};
	addPage();

	const ensureSpace = (needed: number) => {
		if (y - needed < 58) addPage();
	};
	const drawLines = (
		text: string,
		font: PDFFont,
		size: number,
		lineHeight: number,
		color = BODY,
		x = MARGIN,
		width = CONTENT_WIDTH
	) => {
		for (const line of wrapText(text, font, size, width)) {
			ensureSpace(lineHeight + 2);
			page.drawText(line, { x, y, size, font, color });
			y -= lineHeight;
		}
	};
	const heading = (text: string) => {
		ensureSpace(34);
		y -= 6;
		page.drawText(text, { x: MARGIN, y, size: 13, font: semibold, color: TEAL });
		const width = Math.min(semibold.widthOfTextAtSize(text, 13), CONTENT_WIDTH);
		page.drawLine({
			start: { x: MARGIN, y: y - 4 },
			end: { x: MARGIN + width, y: y - 4 },
			thickness: 1,
			color: GOLD
		});
		y -= 22;
	};
	const paragraph = (text: string) => {
		drawLines(text, regular, 9.5, 13.2);
		y -= 11;
	};

	// Branded first-page header.
	page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 220, width: PAGE_WIDTH, height: 220, color: TEAL });
	page.drawText(labels.cfpLabel.toUpperCase(), {
		x: MARGIN,
		y: PAGE_HEIGHT - 55,
		size: 18,
		font: semibold,
		color: rgb(1, 1, 1)
	});
	page.drawLine({
		start: { x: MARGIN, y: PAGE_HEIGHT - 66 },
		end: { x: MARGIN + 120, y: PAGE_HEIGHT - 66 },
		thickness: 2,
		color: GOLD
	});
	let titleY = PAGE_HEIGHT - 98;
	for (const line of wrapText(labels.title, semibold, 20, CONTENT_WIDTH)) {
		page.drawText(line, { x: MARGIN, y: titleY, size: 20, font: semibold, color: rgb(1, 1, 1) });
		titleY -= 25;
	}
	page.drawText(labels.heroSubtitle, {
		x: MARGIN,
		y: PAGE_HEIGHT - 190,
		size: 9.5,
		font: regular,
		color: rgb(0.87, 0.96, 0.96)
	});
	page.drawText(`${labels.heroDates}  ·  ${labels.heroLocation}`, {
		x: MARGIN,
		y: PAGE_HEIGHT - 207,
		size: 9.5,
		font: semibold,
		color: rgb(1, 1, 1)
	});
	y = PAGE_HEIGHT - 250;

	heading(labels.rationaleLabel);
	paragraph(labels.rationale);
	heading(labels.convenorsLabel);
	for (const convenor of labels.convenors) {
		ensureSpace(18);
		page.drawCircle({ x: MARGIN + 3, y: y + 3, size: 2, color: GOLD });
		drawLines(
			`${convenor.name}, ${convenor.affiliation}`,
			regular,
			9.5,
			13,
			BODY,
			MARGIN + 13,
			CONTENT_WIDTH - 13
		);
	}
	y -= 8;

	heading(labels.thematicAxesLabel);
	paragraph(labels.thematicAxesIntro);
	for (const axis of labels.axes) {
		ensureSpace(55);
		page.drawCircle({ x: MARGIN + 10, y: y + 3, size: 9, color: GOLD });
		const numberWidth = semibold.widthOfTextAtSize(String(axis.number), 10);
		page.drawText(String(axis.number), {
			x: MARGIN + 10 - numberWidth / 2,
			y,
			size: 10,
			font: semibold,
			color: rgb(1, 1, 1)
		});
		drawLines(axis.title, semibold, 10, 14, INK, MARGIN + 28, CONTENT_WIDTH - 28);
		y -= 3;
		drawLines(axis.description, regular, 9.2, 12.8, BODY, MARGIN + 28, CONTENT_WIDTH - 28);
		y -= 12;
	}

	for (const [title, text] of [
		[labels.workshopFormatLabel, labels.workshopFormat],
		[labels.guidelinesLabel, labels.guidelines]
	] as const) {
		heading(title);
		paragraph(text);
	}
	drawLines(labels.contactText, regular, 9.5, 13.2);
	y -= 4;
	for (const contact of labels.contacts) {
		drawLines(
			`${contact.name}: ${contact.email}`,
			semibold,
			9.3,
			13,
			TEAL,
			MARGIN + 13,
			CONTENT_WIDTH - 13
		);
	}
	y -= 8;

	for (const [title, text] of [
		[labels.publicationLabel, labels.publication],
		[labels.selectionLabel, labels.selectionCriteria],
		[labels.fundingLabel, labels.fundingText]
	] as const) {
		heading(title);
		paragraph(text);
	}

	heading(labels.keyDatesLabel);
	for (const item of labels.keyDates) {
		ensureSpace(34);
		page.drawCircle({ x: MARGIN + 4, y: y + 2, size: 2.5, color: GOLD });
		page.drawText(item.label.toUpperCase(), {
			x: MARGIN + 16,
			y: y + 7,
			size: 7.5,
			font: regular,
			color: MUTED
		});
		page.drawText(item.value, { x: MARGIN + 16, y: y - 7, size: 10, font: semibold, color: INK });
		y -= 35;
	}

	if (logos.length) {
		ensureSpace(65);
		y -= 6;
		page.drawText(labels.supportedByLabel.toUpperCase(), {
			x: MARGIN,
			y,
			size: 7.5,
			font: regular,
			color: MUTED
		});
		y -= 24;
		const gap = 10;
		const naturalWidths = logos.map((logo) => logo.ratio * 20);
		const scale = Math.min(
			1,
			(CONTENT_WIDTH - gap * (logos.length - 1)) /
				naturalWidths.reduce((sum, width) => sum + width, 0)
		);
		let x = MARGIN;
		for (let index = 0; index < logos.length; index++) {
			const width = naturalWidths[index] * scale;
			page.drawImage(logos[index].image, { x, y: y - 18 * scale, width, height: 18 * scale });
			x += width + gap;
		}
	}

	const pages = pdf.getPages();
	for (let index = 0; index < pages.length; index++) {
		const footerPage = pages[index];
		footerPage.drawLine({
			start: { x: MARGIN, y: 42 },
			end: { x: PAGE_WIDTH - MARGIN, y: 42 },
			thickness: 0.8,
			color: GOLD
		});
		footerPage.drawText(labels.siteUrl, {
			x: MARGIN,
			y: 27,
			size: 7.5,
			font: regular,
			color: MUTED
		});
		const pageNumber = `${index + 1} / ${pages.length}`;
		footerPage.drawText(pageNumber, {
			x: PAGE_WIDTH - MARGIN - regular.widthOfTextAtSize(pageNumber, 7.5),
			y: 27,
			size: 7.5,
			font: regular,
			color: MUTED
		});
	}

	return pdf.save();
}

function wrapPlainText(text: string, width = 72): string {
	const lines: string[] = [];
	let current = '';
	for (const word of text.split(/\s+/)) {
		if (current && `${current} ${word}`.length > width) {
			lines.push(current);
			current = word;
		} else {
			current = current ? `${current} ${word}` : word;
		}
	}
	if (current) lines.push(current);
	return lines.join('\n');
}

function createText(labels: Labels): string {
	const lines = [
		labels.cfpLabel.toUpperCase(),
		labels.heroSubtitle,
		labels.title,
		`${labels.heroDates} · ${labels.heroLocation}`
	];
	const section = (title: string, text: string) =>
		lines.push('', '─'.repeat(60), title.toUpperCase(), '', wrapPlainText(text));
	section(labels.rationaleLabel, labels.rationale);
	section(
		labels.convenorsLabel,
		labels.convenors.map((item) => `• ${item.name}, ${item.affiliation}`).join('\n')
	);
	section(
		labels.thematicAxesLabel,
		`${labels.thematicAxesIntro}\n\n${labels.axes.map((axis) => `${axis.number}. ${axis.title}\n${wrapPlainText(axis.description)}`).join('\n\n')}`
	);
	section(labels.workshopFormatLabel, labels.workshopFormat);
	section(
		labels.guidelinesLabel,
		`${labels.guidelines}\n\n${labels.contactText}\n${labels.contacts.map((contact) => `• ${contact.name}: ${contact.email}`).join('\n')}`
	);
	section(labels.publicationLabel, labels.publication);
	section(labels.selectionLabel, labels.selectionCriteria);
	section(labels.fundingLabel, labels.fundingText);
	section(
		labels.keyDatesLabel,
		labels.keyDates.map((item) => `• ${item.label}: ${item.value}`).join('\n')
	);
	lines.push('', labels.siteUrl, '');
	return lines.join('\n');
}

await mkdir(OUTPUT_DIR, { recursive: true });
for (const locale of ['en', 'fr'] as const) {
	const labels = await loadLabels(locale);
	const stem = locale === 'fr' ? 'Appel-a-contributions-STIAS-2026' : 'Call-for-Papers-STIAS-2026';
	await Promise.all([
		writeFile(path.join(OUTPUT_DIR, `${stem}.pdf`), await createPdf(labels, locale)),
		writeFile(path.join(OUTPUT_DIR, `${stem}.txt`), createText(labels), 'utf8')
	]);
}

console.log('downloads: generated bilingual CFP PDF and text files');
