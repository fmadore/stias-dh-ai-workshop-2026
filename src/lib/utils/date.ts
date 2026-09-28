import { getLocale, type Locale } from '$lib/paraglide/runtime';

/**
 * Every formatter takes the locale as an optional last argument. Components
 * leave it to the Paraglide global; a server load passes the one off its route
 * parameter, because server loads run before the layout load that sets the
 * global (see `papers/[slug]/+page.server.ts`).
 */
export function intlLocale(locale: Locale = getLocale()): string {
	return locale === 'fr' ? 'fr-FR' : 'en-GB';
}

/**
 * Format a date-only ISO string (e.g. `2026-04-30`) for display.
 * The date is anchored to UTC so visitors in negative-offset timezones
 * never see the previous day.
 */
export function formatDate(isoDate: string, locale: Locale = getLocale()): string {
	return new Date(isoDate + 'T00:00:00Z').toLocaleDateString(intlLocale(locale), {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}

export function formatDateRange(
	startIso: string,
	endIso: string,
	locale: Locale = getLocale()
): string {
	const start = new Date(startIso + 'T00:00:00Z');
	const end = new Date(endIso + 'T00:00:00Z');
	if (
		start.getUTCMonth() === end.getUTCMonth() &&
		start.getUTCFullYear() === end.getUTCFullYear()
	) {
		const month = start.toLocaleDateString(intlLocale(locale), { month: 'long', timeZone: 'UTC' });
		return `${start.getUTCDate()}–${end.getUTCDate()} ${month} ${start.getUTCFullYear()}`;
	}
	return `${formatDate(startIso, locale)} – ${formatDate(endIso, locale)}`;
}

/** "Mon 21" / "lun. 21" — a programme day where the month goes without saying. */
export function formatShortDay(isoDate: string, locale: Locale = getLocale()): string {
	return new Date(isoDate + 'T00:00:00Z').toLocaleDateString(intlLocale(locale), {
		weekday: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	});
}
