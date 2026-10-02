import assert from 'node:assert/strict';
import test from 'node:test';
import { programme } from '../src/lib/data/programme.ts';
import type { ProgrammeDay, Session } from '../src/lib/types/index.ts';
import {
	isCalendarDate,
	programmeTimingErrors,
	sessionTimeRange,
	venueUtcStamp
} from '../src/lib/utils/schedule-validation.ts';
import { moduleIdentityErrors, presentationAuthorErrors } from '../scripts/lib/validate-content.ts';

const session = (id: string, time: string, type: Session['type'] = 'panel'): Session => ({
	id,
	time,
	type
});
const day = (sessions: Session[], date = '2026-09-21'): ProgrammeDay => ({
	date,
	dayLabel: { en: 'Day', fr: 'Jour' },
	sessions
});

test('dates and clock ranges reject normalization and preserve venue midnight conversion', () => {
	assert.equal(isCalendarDate('2026-02-30'), false);
	assert.equal(isCalendarDate('2026-02-29'), false);
	assert.equal(isCalendarDate('2028-02-29'), true);
	assert.equal(isCalendarDate('2026-9-21'), false);
	for (const time of ['25:99 – 00:00', '09:60 – 10:30', '09:00 – 09:00', '11:00 – 09:00', '09:00'])
		assert.throws(() => sessionTimeRange(session('bad', time)));
	assert.equal(sessionTimeRange(session('dinner', '19:00', 'social')).end, undefined);
	assert.equal(venueUtcStamp('2026-09-21', '00:30'), '20260920T223000Z');
	assert.throws(() => venueUtcStamp('2026-02-30', '09:00'));
});

test('schedule validation detects working overlaps and ordering without rejecting planned departures', () => {
	assert.deepEqual(programmeTimingErrors(programme), []);
	assert.match(
		programmeTimingErrors([
			day([session('first', '09:00 – 10:30'), session('second', '10:00 – 11:00')])
		]).join('\n'),
		/overlaps/
	);
	assert.match(
		programmeTimingErrors([
			day([session('first', '10:00 – 11:00'), session('second', '09:00 – 10:00')])
		]).join('\n'),
		/start-time order/
	);
	assert.match(
		programmeTimingErrors([day([], '2026-09-22'), day([], '2026-09-21')]).join('\n'),
		/date order/
	);
	assert.match(programmeTimingErrors([day([]), day([])]).join('\n'), /unique/);
	assert.match(programmeTimingErrors([day([], '2026-02-30')]).join('\n'), /invalid date/);
	assert.deepEqual(
		programmeTimingErrors([
			day([
				session('lunch', '12:30 – 14:00', 'break'),
				session('departure', '13:30 – 17:00', 'social'),
				session('evening', '17:00', 'social')
			])
		]),
		[]
	);
});

test('content files and author lists enforce public URL and byline invariants', () => {
	assert.deepEqual(
		moduleIdentityErrors([{ file: 'one-paper.ts', value: { id: 'one-paper' } }], 'paper'),
		[]
	);
	assert.match(
		moduleIdentityErrors([{ file: 'old.ts', value: { id: 'new' } }], 'paper').join('\n'),
		/filename must match/
	);
	assert.match(
		moduleIdentityErrors([{ file: 'Bad Name.ts', value: { id: 'Bad Name' } }], 'paper').join('\n'),
		/invalid URL slug/
	);
	const people = new Map([['author', {}]]);
	assert.deepEqual(presentationAuthorErrors({ id: 'paper', authors: ['author'] }, people), []);
	assert.match(
		presentationAuthorErrors({ id: 'paper', authors: ['author', 'author'] }, people).join('\n'),
		/duplicate author/
	);
	assert.match(
		presentationAuthorErrors({ id: 'paper', authors: ['missing'] }, people).join('\n'),
		/unknown author/
	);
	assert.match(
		presentationAuthorErrors({ id: 'paper', authors: [] }, people).join('\n'),
		/empty authors/
	);
});
