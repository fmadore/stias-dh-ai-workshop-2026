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
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildCalendar } from './lib/programme-calendar.ts';

const outputDirectory = path.resolve('static/downloads');
await mkdir(outputDirectory, { recursive: true });
for (const locale of ['en', 'fr'] as const) {
	const messages = JSON.parse(await readFile(path.resolve(`messages/${locale}.json`), 'utf8'));
	await writeFile(
		path.join(outputDirectory, `Programme-STIAS-2026-${locale}.ics`),
		buildCalendar(locale, messages),
		'utf8'
	);
}
console.log('downloads: generated bilingual programme calendars');
