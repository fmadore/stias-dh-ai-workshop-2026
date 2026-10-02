import { getLocale, type Locale } from '$lib/paraglide/runtime';
import * as dates from './date-format';

/**
 * Every formatter takes the locale as an optional last argument. Components
 * leave it to the Paraglide global; a server load passes the one off its route
 * parameter, because server loads run before the layout load that sets the
 * global (see `papers/[slug]/+page.server.ts`).
 */
export function intlLocale(locale: Locale = getLocale()): string {
	return dates.intlLocale(locale);
}

/**
 * Format a date-only ISO string (e.g. `2026-04-30`) for display.
 * The date is anchored to UTC so visitors in negative-offset timezones
 * never see the previous day.
 */
export function formatDate(isoDate: string, locale: Locale = getLocale()): string {
	return dates.formatDate(isoDate, locale);
}

export function formatDateRange(
	startIso: string,
	endIso: string,
	locale: Locale = getLocale()
): string {
	return dates.formatDateRange(startIso, endIso, locale);
}

/** "Mon 21" / "lun. 21" — a programme day where the month goes without saying. */
export function formatShortDay(isoDate: string, locale: Locale = getLocale()): string {
	return dates.formatShortDay(isoDate, locale);
}
