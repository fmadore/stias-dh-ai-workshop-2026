import * as m from '#lib/paraglide/messages.js';
import { cfpDates } from '#lib/data/cfp-dates.ts';
import { siteConfig } from '#lib/data/site-config.ts';
import { formatDate, formatDateRange } from './date';

export type MilestoneId = 'proposals' | 'notification' | 'full-papers' | 'workshop';

export interface Milestone {
	id: MilestoneId;
	label: string;
	value: string;
	/** ISO datetime for the `datetime` attribute of a <time> element. */
	datetime: string;
}

/**
 * The workshop ran on South African Standard Time (UTC+2, no DST). Deadlines
 * lapsed at the end of that day; an offset-less ISO string would be read in
 * the visitor's own timezone and shift the instant by up to a day.
 */
const SAST = '+02:00';

function endOfDay(isoDate: string): string {
	return `${isoDate}T23:59:59${SAST}`;
}

/** When the workshop opened, as an ISO datetime at the venue — the Event JSON-LD. */
export function workshopStart(): string {
	return `${siteConfig.dates.start}T${siteConfig.hours.start}:00${SAST}`;
}

/** When the workshop closed, as an ISO datetime at the venue. */
export function workshopEnd(): string {
	return `${siteConfig.dates.end}T${siteConfig.hours.end}:00${SAST}`;
}

/**
 * The four dates that structured the workshop, in order, as a plain record.
 *
 * Each used to carry `past` and `next` flags read off a client-side clock,
 * which kept every one of them out of the prerendered HTML: crawlers and
 * no-JS readers were shown the workshop as it stood before the call closed.
 * All four have now passed for good, so there is no state left to compute —
 * only dates to print. A function rather than a constant because the labels
 * and formatted dates belong to whichever locale is rendering.
 */
export function getMilestones(): Milestone[] {
	return [
		{
			id: 'proposals',
			label: m.submission_deadline(),
			value: formatDate(cfpDates.deadline),
			datetime: endOfDay(cfpDates.deadline)
		},
		{
			id: 'notification',
			label: m.notification_date(),
			value: formatDate(cfpDates.notificationDate),
			datetime: endOfDay(cfpDates.notificationDate)
		},
		{
			id: 'full-papers',
			label: m.full_papers_deadline(),
			value: formatDate(cfpDates.fullPapersDeadline),
			datetime: endOfDay(cfpDates.fullPapersDeadline)
		},
		{
			id: 'workshop',
			label: m.workshop_dates(),
			value: formatDateRange(siteConfig.dates.start, siteConfig.dates.end),
			datetime: workshopStart()
		}
	];
}
