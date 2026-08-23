import assert from 'node:assert/strict';
import test from 'node:test';
import { daysUntil, dateAtVenue, workshopPhase } from '../src/lib/utils/milestones';

const at = (iso: string) => Date.parse(iso);

test('a deadline later the same day at the venue is today, not tomorrow', () => {
	// Every milestone lapses at 23:59:59 SAST on its own date. Dividing the raw
	// interval and rounding up made the last few hours of each one read as
	// "1 day remaining", so the count was wrong on the one day it mattered.
	const deadline = at('2026-08-31T23:59:59+02:00');
	assert.equal(daysUntil(deadline, at('2026-08-31T20:00:00+02:00')), 0);
	assert.equal(daysUntil(deadline, at('2026-08-31T00:05:00+02:00')), 0);
	assert.equal(daysUntil(deadline, at('2026-08-30T23:00:00+02:00')), 1);
});

test('the workshop reads as today from midnight, not from an hour before it opens', () => {
	const opening = at('2026-09-21T09:00:00+02:00');
	assert.equal(daysUntil(opening, at('2026-09-21T08:00:00+02:00')), 0);
	assert.equal(daysUntil(opening, at('2026-09-20T22:00:00+02:00')), 1);
	assert.equal(daysUntil(opening, at('2026-09-01T09:00:00+02:00')), 20);
});

test('the count is the venue calendar, not the reader s', () => {
	// A reader in Auckland is already on the next date when Stellenbosch is not.
	const opening = at('2026-09-21T09:00:00+02:00');
	assert.equal(daysUntil(opening, at('2026-09-20T23:00:00+12:00')), 1);
});

test('a lapsed target counts zero rather than going negative', () => {
	assert.equal(daysUntil(at('2026-08-31T23:59:59+02:00'), at('2026-09-05T12:00:00+02:00')), 0);
});

test('the venue date is South African, whatever the reader s clock says', () => {
	// 00:30 on the 22nd in Auckland is still the 21st in Stellenbosch.
	assert.equal(dateAtVenue(at('2026-09-22T00:30:00+12:00')), '2026-09-21');
});

test('the workshop phase turns over at the opening and at the close', () => {
	assert.equal(workshopPhase(at('2026-09-21T08:59:00+02:00')), 'before');
	assert.equal(workshopPhase(at('2026-09-21T09:00:01+02:00')), 'during');
	assert.equal(workshopPhase(at('2026-09-24T17:59:00+02:00')), 'during');
	assert.equal(workshopPhase(at('2026-09-24T18:00:01+02:00')), 'after');
});
