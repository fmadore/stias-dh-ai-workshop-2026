import type { CFPInfo } from '#lib/types/index.ts';

/**
 * The call's three dates, apart from its text.
 *
 * The milestones read these on every page — the footer's key dates, the
 * navbar's "call open" check, the hero — and they used to read them from
 * `cfp.ts`, which put several KB of bilingual call text (rationale,
 * guidelines, selection criteria…) into the shared layout chunk for the sake
 * of three ISO strings. `cfp.ts` spreads this object back in, so each date is
 * still written once.
 */
export const cfpDates: Pick<CFPInfo, 'deadline' | 'notificationDate' | 'fullPapersDeadline'> = {
	deadline: '2026-04-30',
	notificationDate: '2026-05-15',
	fullPapersDeadline: '2026-08-31'
};
