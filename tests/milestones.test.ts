import assert from 'node:assert/strict';
import test from 'node:test';
import { getMilestones, workshopEnd, workshopStart } from '../src/lib/utils/milestones';
import { organizerRefs } from '../src/lib/data/organizer-refs';
import { organizers } from '../src/lib/data/organizers';

test('the four dates are a fixed record, in order, at the venue offset', () => {
	const milestones = getMilestones();
	assert.deepEqual(
		milestones.map((milestone) => milestone.id),
		['proposals', 'notification', 'full-papers', 'workshop']
	);
	// A deadline lapsed at the end of its own day in Stellenbosch; an
	// offset-less string would be read in the visitor's timezone.
	assert.equal(milestones[0].datetime, '2026-04-30T23:59:59+02:00');
	assert.equal(milestones[3].datetime, workshopStart());
	const instants = milestones.map((milestone) => Date.parse(milestone.datetime));
	assert.deepEqual(
		instants,
		instants.toSorted((a, b) => a - b)
	);
	// No phase flags are left to compute: the record carries none.
	for (const milestone of milestones) {
		assert.deepEqual(Object.keys(milestone).sort(), ['datetime', 'id', 'label', 'value']);
	}
});

test('the workshop opened and closed at the hours the Event JSON-LD states', () => {
	assert.equal(workshopStart(), '2026-09-21T09:00:00+02:00');
	assert.equal(workshopEnd(), '2026-09-24T18:00:00+02:00');
});

test('the bio-less convenor list is the full one, minus the bios', () => {
	assert.deepEqual(
		organizers.map((organizer) => organizer.id),
		organizerRefs.map((ref) => ref.id)
	);
	for (const organizer of organizers) {
		assert.ok(organizer.bio.en.length > 0 && organizer.bio.fr.length > 0, organizer.id);
	}
	for (const ref of organizerRefs) assert.equal('bio' in ref, false, ref.id);
});
