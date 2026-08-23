import * as m from '$lib/paraglide/messages';
import { cfpInfo } from '$lib/data/cfp';
import { siteConfig } from '$lib/data/site-config';
import { formatDate, formatDateRange } from './date';

export type MilestoneId = 'proposals' | 'notification' | 'full-papers' | 'workshop';

export interface Milestone {
	id: MilestoneId;
	label: string;
	value: string;
	/** Epoch ms at which the milestone lapses. */
	at: number;
	/** ISO datetime for the `datetime` attribute of a <time> element. */
	datetime: string;
	past: boolean;
	/** The first milestone still ahead — at most one is true. */
	next: boolean;
}

/**
 * The workshop runs on South African Standard Time (UTC+2, no DST). Deadlines
 * lapse at the end of that day; an offset-less ISO string would be parsed in
 * the visitor's own timezone and shift the answer by up to a day.
 */
const SAST = '+02:00';

/**
 * The same offset as an IANA zone, for the two places that need to ask what
 * the *calendar date* is at the venue rather than how many hours away
 * something is. The programme page asks it to badge today; `daysUntil` asks
 * it so that a deadline at 23:59 today is "today" and not "one day away".
 */
export const VENUE_TIME_ZONE = 'Africa/Johannesburg';

/** The calendar date at the venue, as `YYYY-MM-DD`. */
export function dateAtVenue(at: number | Date = Date.now()): string {
	return new Date(at).toLocaleDateString('en-CA', { timeZone: VENUE_TIME_ZONE });
}

function endOfDay(isoDate: string): string {
	return `${isoDate}T23:59:59${SAST}`;
}

export function workshopStart(): string {
	return `${siteConfig.dates.start}T09:00:00${SAST}`;
}

export function workshopEnd(): string {
	return `${siteConfig.dates.end}T18:00:00${SAST}`;
}

/**
 * The four dates that structure the workshop, in order, each flagged with
 * whether it has passed and whether it is the next one due. Shared by the
 * hero strip, the home-page timeline and the Call for Papers page.
 */
export function getMilestones(now: number = Date.now()): Milestone[] {
	const raw: Array<Omit<Milestone, 'past' | 'next'>> = [
		{
			id: 'proposals',
			label: m.submission_deadline(),
			value: formatDate(cfpInfo.deadline),
			at: new Date(endOfDay(cfpInfo.deadline)).getTime(),
			datetime: endOfDay(cfpInfo.deadline)
		},
		{
			id: 'notification',
			label: m.notification_date(),
			value: formatDate(cfpInfo.notificationDate),
			at: new Date(endOfDay(cfpInfo.notificationDate)).getTime(),
			datetime: endOfDay(cfpInfo.notificationDate)
		},
		{
			id: 'full-papers',
			label: m.full_papers_deadline(),
			value: formatDate(cfpInfo.fullPapersDeadline),
			at: new Date(endOfDay(cfpInfo.fullPapersDeadline)).getTime(),
			datetime: endOfDay(cfpInfo.fullPapersDeadline)
		},
		{
			id: 'workshop',
			label: m.workshop_dates(),
			value: formatDateRange(siteConfig.dates.start, siteConfig.dates.end),
			at: new Date(workshopStart()).getTime(),
			datetime: workshopStart()
		}
	];

	let seenUpcoming = false;
	return raw.map((milestone) => {
		const past = now > milestone.at;
		const next = !past && !seenUpcoming;
		if (next) seenUpcoming = true;
		return { ...milestone, past, next };
	});
}

/** The next milestone still ahead, or undefined once the workshop has begun. */
export function nextMilestone(now: number = Date.now()): Milestone | undefined {
	return getMilestones(now).find((milestone) => milestone.next);
}

/** Whether the call for papers is still accepting proposals. */
export function isCfpOpen(now: number = Date.now()): boolean {
	return now <= new Date(endOfDay(cfpInfo.deadline)).getTime();
}

export type WorkshopPhase = 'before' | 'during' | 'after';

export function workshopPhase(now: number = Date.now()): WorkshopPhase {
	if (now >= new Date(workshopEnd()).getTime()) return 'after';
	if (now >= new Date(workshopStart()).getTime()) return 'during';
	return 'before';
}

/**
 * Whole days from `now` until `target`, counted in venue calendar days and
 * floored at zero.
 *
 * It used to divide the raw interval and round up, which meant a deadline
 * four hours away read as "1 day remaining" — and, since every milestone
 * lapses at 23:59 on its own day, the count was wrong by one on each
 * milestone's last day. On 21 September at 08:00, an hour before the opening,
 * the home page said the workshop was a day away. Counting dates rather than
 * hours makes the final day say `0`, which is the day `countdown_today` was
 * written for and could never previously reach.
 */
export function daysUntil(target: number, now: number = Date.now()): number {
	const midnightAtVenue = (at: number) => Date.parse(`${dateAtVenue(at)}T00:00:00Z`);
	return Math.max(0, Math.round((midnightAtVenue(target) - midnightAtVenue(now)) / 86_400_000));
}
