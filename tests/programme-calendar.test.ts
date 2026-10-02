import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import ICAL from 'ical.js';
import { buildCalendar, escapeText, fold } from '../scripts/lib/programme-calendar.ts';
import { programme } from '../src/lib/data/programme.ts';
import { onlineAccessPublished } from '../src/lib/data/online-access.ts';

test('bilingual calendars round-trip with stable identities, venue UTC times and only remote sessions', async () => {
	const expectedIds = programme.flatMap((day) =>
		day.sessions
			.filter(
				(session) => session.type !== 'break' && session.type !== 'social' && !session.inPersonOnly
			)
			.map((session) => `${session.id}@stias-dh-ai-workshop-2026`)
	);
	const idsByLocale: string[][] = [];
	for (const locale of ['en', 'fr'] as const) {
		const messages = JSON.parse(await readFile(`messages/${locale}.json`, 'utf8'));
		const text = buildCalendar(locale, messages);
		assert.equal(
			buildCalendar(locale, messages),
			text,
			'unchanged source must generate identical calendars'
		);
		assert.equal(text.endsWith('\r\n'), true);
		assert.doesNotMatch(text.replaceAll('\r\n', ''), /[\r\n]/);
		assert.ok(text.split('\r\n').every((line) => Buffer.byteLength(line) <= 75));
		const calendar = new ICAL.Component(ICAL.parse(text));
		const events = calendar
			.getAllSubcomponents('vevent')
			.map((component) => new ICAL.Event(component));
		const ids = events.map((event) => event.uid);
		idsByLocale.push(ids);
		assert.deepEqual(ids, expectedIds);
		assert.equal(new Set(ids).size, ids.length);
		for (const event of events) {
			assert.ok(event.endDate.compare(event.startDate) > 0);
			assert.equal(event.startDate.zone.tzid, 'UTC');
			const url = String(event.component.getFirstPropertyValue('url'));
			assert.ok(url.includes(`${locale === 'fr' ? '/fr' : ''}/programme#session-`));
			assert.equal(event.component.hasProperty('conference'), onlineAccessPublished);
			assert.ok(event.description.includes(url));
		}
		const welcome = events.find((event) => event.uid === 'd1-welcome@stias-dh-ai-workshop-2026')!;
		assert.equal(welcome.startDate.toJSDate().toISOString(), '2026-09-21T07:00:00.000Z');
		assert.equal(welcome.endDate.toJSDate().toISOString(), '2026-09-21T07:30:00.000Z');
		assert.equal(welcome.summary, locale === 'fr' ? 'Mots de bienvenue' : 'Welcome addresses');
		assert.match(
			welcome.description,
			locale === 'fr' ? /Brefs mots de bienvenue/ : /Short welcome addresses/
		);
	}
	assert.deepEqual(idsByLocale[0], idsByLocale[1]);
});

test('calendar escaping and octet folding preserve punctuation, newlines and multibyte text', () => {
	const description =
		'Écritures africaines 😀 '.repeat(12) + '\\ manuscrits; noms, lieux\nDeuxième paragraphe';
	const text =
		[
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'BEGIN:VEVENT',
			'UID:roundtrip@example.test',
			'DTSTAMP:20260921T000000Z',
			'DTSTART:20260921T070000Z',
			'DTEND:20260921T073000Z',
			`DESCRIPTION:${escapeText(description)}`,
			'END:VEVENT',
			'END:VCALENDAR'
		]
			.map(fold)
			.join('\r\n') + '\r\n';
	assert.ok(text.split('\r\n').every((line) => Buffer.byteLength(line) <= 75));
	const event = new ICAL.Event(
		new ICAL.Component(ICAL.parse(text)).getFirstSubcomponent('vevent')!
	);
	assert.equal(event.description, description);
});
