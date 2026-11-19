import type { CFPInfo } from '#lib/types/index.ts';

/**
 * The call's three dates, apart from its text.
 *
 * The footer prints the milestones on every page, and it used to read these
 * from `cfp.ts`, which put several KB of bilingual call text (rationale,
 * guidelines, selection criteria…) into the layout's chunk for the sake of
 * three ISO strings — the same trap `organizer-refs.ts` closes for the bios.
 * `cfp.ts` spreads this object back in, so each date is still written once.
 */
export const cfpDates: Pick<CFPInfo, 'deadline' | 'notificationDate' | 'fullPapersDeadline'> = {
	deadline: '2026-04-30',
	notificationDate: '2026-05-15',
	fullPapersDeadline: '2026-08-31'
};
