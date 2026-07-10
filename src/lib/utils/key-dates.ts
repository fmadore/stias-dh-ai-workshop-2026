import * as m from '$lib/paraglide/messages';
import { cfpInfo } from '$lib/data/cfp';
import { siteConfig } from '$lib/data/site-config';
import { formatDate, formatDateRange } from './date';

export interface KeyDate {
	label: string;
	value: string;
}

/** The CFP timeline, shared by the CFP page and the PDF/text exports. */
export function getKeyDates(): KeyDate[] {
	return [
		{ label: m.submission_deadline(), value: formatDate(cfpInfo.deadline) },
		{ label: m.notification_date(), value: formatDate(cfpInfo.notificationDate) },
		{ label: m.full_papers_deadline(), value: formatDate(cfpInfo.fullPapersDeadline) },
		{
			label: m.workshop_dates(),
			value: formatDateRange(siteConfig.dates.start, siteConfig.dates.end)
		}
	];
}
