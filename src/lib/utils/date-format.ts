import type { SupportedLocale } from './localized-paths.ts';

/** Pure date formatting shared by browser views and generated downloads. */
export function intlLocale(locale: SupportedLocale): string {
	return locale === 'fr' ? 'fr-FR' : 'en-GB';
}

/** Date-only values stay anchored to UTC, independent of the reader's zone. */
export function formatDate(isoDate: string, locale: SupportedLocale): string {
	return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString(intlLocale(locale), {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}

export function formatDateRange(startIso: string, endIso: string, locale: SupportedLocale): string {
	const start = new Date(`${startIso}T00:00:00Z`);
	const end = new Date(`${endIso}T00:00:00Z`);
	if (
		start.getUTCMonth() === end.getUTCMonth() &&
		start.getUTCFullYear() === end.getUTCFullYear()
	) {
		const month = start.toLocaleDateString(intlLocale(locale), { month: 'long', timeZone: 'UTC' });
		return `${start.getUTCDate()}–${end.getUTCDate()} ${month} ${start.getUTCFullYear()}`;
	}
	return `${formatDate(startIso, locale)} – ${formatDate(endIso, locale)}`;
}

export function formatShortDay(isoDate: string, locale: SupportedLocale): string {
	return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString(intlLocale(locale), {
		weekday: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	});
}
