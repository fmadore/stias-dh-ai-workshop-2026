/**
 * Build one iCalendar file per locale from the programme data.
 *
 * Only working sessions are written: panels, keynotes, discussions and
 * plenaries. Coffee breaks, lunches, the two dinners and the two excursions
 * (`break` and `social`) are deliberately left out — nobody needs a calendar
 * entry for lunch, and eighteen of them would bury the twenty-five papers. So
 * is anything marked `inPersonOnly`: this calendar is what someone following
 * the workshop remotely puts in their diary, so a slot they cannot join does
 * not belong in it.
 *
 * Times in `programme.ts` are South African local time (UTC+2 year round, no
 * DST), and are emitted as UTC instants so every calendar shows the session at
 * the right moment in the reader's own zone without a VTIMEZONE to trust.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { programme, programmeLastUpdated } from '../src/lib/data/programme.ts';
import { organizers } from '../src/lib/data/organizers.ts';
import { pointSud } from '../src/lib/data/point-sud.ts';
import { coAuthors } from '../src/lib/data/co-authors.ts';
import { onlineAccess, onlineAccessPublished } from '../src/lib/data/online-access.ts';
import { siteConfig } from '../src/lib/data/site-config.ts';
import { venueInfo, venueStreet } from '../src/lib/data/venue.ts';
import type {
	LocalizedString,
	Participant,
	Presentation,
	Session
} from '../src/lib/types/index.ts';

type Locale = 'en' | 'fr';
type Messages = Record<string, string>;

const OUTPUT_DIR = path.resolve('static/downloads');
const SAST_OFFSET_MINUTES = 120;

/** The programme's own directory loaders use `import.meta.glob`, which is Vite's. */
async function loadDefaultModules<T>(directory: string): Promise<T[]> {
	const files = (await readdir(directory)).filter(
		(file) => file.endsWith('.ts') && file !== 'index.ts'
	);
	return Promise.all(
		files.map(async (file) => {
			const module = (await import(pathToFileURL(path.resolve(directory, file)).href)) as {
				default: T;
			};
			return module.default;
		})
	);
}

const participants = await loadDefaultModules<Participant>('src/lib/data/participants');
const presentations = await loadDefaultModules<Presentation>('src/lib/data/presentations');
const presentationsById = new Map(presentations.map((paper) => [paper.id, paper]));
const namesById = new Map(
	[...organizers, ...pointSud, ...participants, ...coAuthors].map((person) => [
		person.id,
		person.name
	])
);

function pick(value: LocalizedString | undefined, locale: Locale): string {
	return value ? (value[locale] ?? value.en) : '';
}

/** `'11:00 – 12:30'` → the two clock times, whichever dash the data uses. */
function parseTimes(time: string): [string, string] | undefined {
	const parts = time.split(/\s*[–—-]\s*/).map((part) => part.trim());
	if (parts.length !== 2 || !/^\d{2}:\d{2}$/.test(parts[0]) || !/^\d{2}:\d{2}$/.test(parts[1]))
		return undefined;
	return [parts[0], parts[1]];
}

/** A venue-local date and clock time as a UTC iCalendar stamp. */
function utcStamp(date: string, time: string): string {
	const [year, month, day] = date.split('-').map(Number);
	const [hour, minute] = time.split(':').map(Number);
	const at = Date.UTC(year, month - 1, day, hour, minute) - SAST_OFFSET_MINUTES * 60_000;
	return `${new Date(at).toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`;
}

/** RFC 5545 §3.3.11: the four characters that cannot travel raw in a value. */
function escapeText(value: string): string {
	return (
		value
			.replace(/\\/g, '\\\\')
			.replace(/;/g, '\\;')
			.replace(/,/g, '\\,')
			.replace(/\r?\n/g, '\\n')
			// Non-breaking spaces are all over the French copy and survive a round
			// trip badly in older calendar clients; a plain space says the same thing.
			.replace(/\u00a0/g, ' ')
	);
}

/** RFC 5545 §3.1: fold at 75 octets, continuation lines starting with a space. */
function fold(line: string): string {
	const encoder = new TextEncoder();
	if (encoder.encode(line).length <= 75) return line;
	const out: string[] = [];
	let current = '';
	let bytes = 0;
	for (const character of line) {
		const size = encoder.encode(character).length;
		// 74 on continuation lines: the leading space counts towards the 75.
		if (bytes + size > (out.length === 0 ? 75 : 74)) {
			out.push(current);
			current = '';
			bytes = 0;
		}
		current += character;
		bytes += size;
	}
	out.push(current);
	return out.map((part, index) => (index === 0 ? part : ` ${part}`)).join('\r\n');
}

/** The papers of a panel, or the abstract a keynote or discussion refers to. */
function papersOf(session: Session): Presentation[] {
	return (session.presentationIds ?? [])
		.map((id) => presentationsById.get(id))
		.filter((paper): paper is Presentation => paper !== undefined);
}

function namesOf(ids: readonly string[] = []): string[] {
	return ids.map((id) => namesById.get(id)).filter((name): name is string => name !== undefined);
}

/**
 * `Panel 3: Decolonial Methods…`, `Keynote: …`, or the session's own title.
 * Panels are numbered continuously across the four days, exactly as the
 * programme page numbers them, so a calendar entry and the web page name the
 * same panel.
 */
function summaryOf(
	session: Session,
	locale: Locale,
	messages: Messages,
	panelNumber: number | undefined
): string {
	const papers = papersOf(session);
	const own = pick(session.title, locale);
	const title = own || (papers.length === 1 ? papers[0].title : '');
	// French sets a space before the colon. A plain one rather than the copy's
	// non-breaking one: `escapeText` strips those out of calendar values.
	const colon = locale === 'fr' ? ' : ' : ': ';
	if (session.type === 'panel')
		return `${messages.session_panel} ${panelNumber}${title ? `${colon}${title}` : ''}`;
	if (session.type === 'keynote') return `${messages.session_keynote}${colon}${title}`;
	if (session.type === 'discussion' && own !== messages.session_discussion)
		return `${messages.session_discussion}${colon}${title}`;
	return title || messages.session_plenary;
}

function descriptionOf(session: Session, locale: Locale, messages: Messages): string {
	const lines: string[] = [];

	// First line, not last: a calendar entry for a hybrid session gets opened to
	// find the way in, and most clients preview only the start of a description.
	// The CONFERENCE property below carries the same link for the clients that
	// render a Join button, which by no means all of them do.
	if (onlineAccessPublished) {
		const label = messages.online_join.replace('{platform}', onlineAccess.platform);
		lines.push(`${label}${locale === 'fr' ? ' : ' : ': '}${onlineAccess.joinUrl}`);
		// Room systems and the "join with an ID" path cannot follow a link.
		const byId = [
			onlineAccess.meetingId && messages.online_meeting_id.replace('{id}', onlineAccess.meetingId),
			onlineAccess.passcode && messages.online_passcode.replace('{code}', onlineAccess.passcode)
		].filter(Boolean);
		if (byId.length > 0) lines.push(byId.join(' · '));
	}

	const description = pick(session.description, locale);
	if (description) lines.push(description);

	const speakers = namesOf(session.speakers);
	if (speakers.length > 0) lines.push(speakers.join(', '));

	const papers = papersOf(session);
	// A keynote whose heading already is the paper title would only repeat it.
	const listPapers = session.type !== 'keynote' || papers.length > 1;
	if (listPapers) {
		for (const paper of papers) {
			const authors = namesOf(paper.authors).join(', ');
			lines.push(`• ${paper.title}${authors ? ` — ${authors}` : ''}`);
		}
	}

	const chair = (session.chair ? namesById.get(session.chair) : undefined) ?? session.chairName;
	if (chair) lines.push(`${messages.session_chair} ${chair}`);

	lines.push(`${siteConfig.url}/${locale === 'fr' ? 'fr/' : ''}programme#session-${session.id}`);
	return lines.join('\n');
}

function buildCalendar(locale: Locale, messages: Messages): string {
	// Fixed rather than "now", so two builds of the same programme produce the
	// same file and a re-import is a no-op rather than a spurious update.
	const stamp = `${programmeLastUpdated.replace(/-/g, '')}T000000Z`;
	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//STIAS DH & AI Workshop 2026//Programme//EN',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH',
		`X-WR-CALNAME:${escapeText(pick(siteConfig.title, locale))}`,
		'X-WR-TIMEZONE:Africa/Johannesburg',
		`X-WR-CALDESC:${escapeText(pick(siteConfig.description, locale))}`
	];

	let panelNumber = 0;
	let events = 0;
	for (const day of programme) {
		for (const session of day.sessions) {
			if (session.type === 'panel') panelNumber++;
			if (session.type === 'break' || session.type === 'social' || session.inPersonOnly) continue;
			const times = parseTimes(session.time);
			if (!times) throw new Error(`session ${session.id}: unparseable time '${session.time}'`);

			const location = [session.room, venueInfo.name, venueStreet, venueInfo.city]
				.filter(Boolean)
				.join(', ');

			lines.push(
				'BEGIN:VEVENT',
				// Locale-independent, so importing the other language updates the
				// entry rather than duplicating the workshop in someone's calendar.
				`UID:${session.id}@stias-dh-ai-workshop-2026`,
				`DTSTAMP:${stamp}`,
				`DTSTART:${utcStamp(day.date, times[0])}`,
				`DTEND:${utcStamp(day.date, times[1])}`,
				`SUMMARY:${escapeText(summaryOf(session, locale, messages, panelNumber))}`,
				`DESCRIPTION:${escapeText(descriptionOf(session, locale, messages))}`,
				`LOCATION:${escapeText(location)}`,
				`URL:${siteConfig.url}/${locale === 'fr' ? 'fr/' : ''}programme#session-${session.id}`,
				'STATUS:CONFIRMED',
				'SEQUENCE:0'
			);
			if (onlineAccessPublished)
				lines.push(
					`CONFERENCE;VALUE=URI;FEATURE=VIDEO;LABEL=${escapeText(onlineAccess.platform)}:${onlineAccess.joinUrl}`
				);
			lines.push('END:VEVENT');
			events++;
		}
	}

	lines.push('END:VCALENDAR');
	console.log(`✓ ${locale}: ${events} sessions`);
	// CRLF throughout, per RFC 5545, and a trailing break after the last line.
	return `${lines.map(fold).join('\r\n')}\r\n`;
}

await mkdir(OUTPUT_DIR, { recursive: true });
for (const locale of ['en', 'fr'] as Locale[]) {
	const messages = JSON.parse(
		await readFile(path.resolve(`messages/${locale}.json`), 'utf8')
	) as Messages;
	await writeFile(
		path.join(OUTPUT_DIR, `Programme-STIAS-2026-${locale}.ics`),
		buildCalendar(locale, messages),
		'utf8'
	);
}
