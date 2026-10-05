import assert from 'node:assert/strict';
import test from 'node:test';
import { wrapPlainText } from '../scripts/lib/plain-text.ts';
import {
	formatDate,
	formatDateRange,
	formatPartialDate,
	formatShortDay
} from '../src/lib/utils/date-format.ts';

test('plain-text downloads preserve list items, headings and paragraph breaks while wrapping prose', () => {
	const wrapped = wrapPlainText(
		'Intro paragraph.\n\n1. First axis\nA longer sentence for this first axis.\n\n2. Second axis\n• First author\n• Second author',
		24
	);
	assert.match(wrapped, /Intro paragraph\.\n\n1\. First axis\n/);
	assert.match(wrapped, /\n\n2\. Second axis\n• First author\n• Second author$/);
	assert.ok(wrapped.split('\n').every((line) => line.length <= 24));
	assert.equal(wrapPlainText('One\r\n\r\nTwo'), 'One\n\nTwo');
});

test('the web and download formatters share bilingual UTC date rules', () => {
	assert.equal(formatDate('2026-09-21', 'en'), '21 September 2026');
	assert.equal(formatDate('2026-09-21', 'fr'), '21 septembre 2026');
	assert.equal(formatDateRange('2026-09-21', '2026-09-24', 'en'), '21–24 September 2026');
	// Across a month boundary the year is said once; across a year, twice.
	assert.equal(formatDateRange('2026-09-30', '2026-10-01', 'fr'), '30 septembre – 1 octobre 2026');
	assert.equal(
		formatDateRange('2026-12-30', '2027-01-02', 'en'),
		'30 December 2026 – 2 January 2027'
	);
	assert.equal(formatPartialDate('2026-04', 'en'), 'April 2026');
	assert.equal(formatPartialDate('2026-04', 'fr'), 'avril 2026');
	assert.equal(formatPartialDate('2026-04-21', 'en'), '21 April 2026');
	assert.match(formatShortDay('2026-09-21', 'fr'), /lun\. 21/);
});
