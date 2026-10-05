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
	// Across a month boundary the year is still said once: "28 June – 3 July 2027".
	if (start.getUTCFullYear() === end.getUTCFullYear()) {
		const dayMonth = start.toLocaleDateString(intlLocale(locale), {
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC'
		});
		return `${dayMonth} – ${formatDate(endIso, locale)}`;
	}
	return `${formatDate(startIso, locale)} – ${formatDate(endIso, locale)}`;
}

/**
 * A date that may be known only to the month (`2026-04`), as a citation gives
 * it: "April 2026" rather than an invented first of the month.
 */
export function formatPartialDate(iso: string, locale: SupportedLocale): string {
	if (!/^\d{4}-\d{2}$/.test(iso)) return formatDate(iso, locale);
	return new Date(`${iso}-01T00:00:00Z`).toLocaleDateString(intlLocale(locale), {
		year: 'numeric',
		month: 'long',
		timeZone: 'UTC'
	});
}

export function formatShortDay(isoDate: string, locale: SupportedLocale): string {
	return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString(intlLocale(locale), {
		weekday: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	});
}
