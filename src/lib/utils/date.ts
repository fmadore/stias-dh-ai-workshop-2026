import { getLocale } from '$lib/paraglide/runtime';

function intlLocale(): string {
	return getLocale() === 'fr' ? 'fr-FR' : 'en-GB';
}

/**
 * Format a date-only ISO string (e.g. `2026-04-30`) for display.
 * The date is anchored to UTC so visitors in negative-offset timezones
 * never see the previous day.
 */
export function formatDate(isoDate: string): string {
	return new Date(isoDate + 'T00:00:00Z').toLocaleDateString(intlLocale(), {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}

export function formatDateRange(startIso: string, endIso: string): string {
	const start = new Date(startIso + 'T00:00:00Z');
	const end = new Date(endIso + 'T00:00:00Z');
	if (
		start.getUTCMonth() === end.getUTCMonth() &&
		start.getUTCFullYear() === end.getUTCFullYear()
	) {
		const month = start.toLocaleDateString(intlLocale(), { month: 'long', timeZone: 'UTC' });
		return `${start.getUTCDate()}–${end.getUTCDate()} ${month} ${start.getUTCFullYear()}`;
	}
	return `${formatDate(startIso)} – ${formatDate(endIso)}`;
}
