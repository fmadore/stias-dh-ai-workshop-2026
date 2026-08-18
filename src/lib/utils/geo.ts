/**
 * Great-circle distance in metres. The venue page states how far each guest
 * house is from STIAS, and deriving that from the coordinates already on
 * record beats a hand-written number that nobody re-measures when a pin moves.
 */
export function distanceMetres(
	a: { lat: number; lng: number },
	b: { lat: number; lng: number }
): number {
	const R = 6371008.8;
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const dLat = toRad(b.lat - a.lat);
	const dLng = toRad(b.lng - a.lng);
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Straight-line metres as a reader-facing figure: rounded to the nearest 50 m
 * below a kilometre, to one decimal above it. Intl supplies the unit so French
 * gets its narrow no-break space before the `m` without a second string.
 */
export function formatDistance(metres: number, locale: 'en' | 'fr'): string {
	const kilometres = metres >= 1000;
	return new Intl.NumberFormat(locale, {
		style: 'unit',
		unit: kilometres ? 'kilometer' : 'meter',
		unitDisplay: 'short',
		maximumFractionDigits: kilometres ? 1 : 0
	}).format(kilometres ? metres / 1000 : Math.round(metres / 50) * 50);
}
