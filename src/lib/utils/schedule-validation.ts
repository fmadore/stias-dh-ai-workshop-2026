import type { ProgrammeDay, Session } from '../types/index.ts';
import { sessionTimes } from './schedule.ts';

/** Reject impossible dates rather than letting Date silently move into the next month. */
export function isCalendarDate(value: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const date = new Date(`${value}T00:00:00Z`);
	return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function clockMinutes(value: string): number | undefined {
	if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) return undefined;
	const [hours, minutes] = value.split(':').map(Number);
	return hours * 60 + minutes;
}

/** Social activities may state only a departure/start time; streamed sessions need an end. */
export function sessionTimeRange(session: Pick<Session, 'id' | 'time' | 'type'>): {
	start: string;
	end?: string;
	startMinutes: number;
	endMinutes?: number;
} {
	const parts = sessionTimes(session.time);
	const startMinutes = clockMinutes(parts[0]);
	const endMinutes = parts.length === 2 ? clockMinutes(parts[1]) : undefined;
	if (
		parts.length > 2 ||
		startMinutes === undefined ||
		(parts.length === 2 && endMinutes === undefined) ||
		(parts.length === 1 && session.type !== 'social')
	)
		throw new Error(`programme ${session.id}: invalid time '${session.time}'`);
	if (endMinutes !== undefined && endMinutes <= startMinutes)
		throw new Error(`programme ${session.id}: end time must be after start time`);
	return { start: parts[0], end: parts[1], startMinutes, endMinutes };
}

/** Working sessions and breaks cannot overlap; departures may overlap lunch deliberately. */
export function programmeTimingErrors(days: readonly ProgrammeDay[]): string[] {
	const errors: string[] = [];
	let previousDate: string | undefined;
	for (const day of days) {
		if (!isCalendarDate(day.date)) errors.push(`programme: invalid date '${day.date}'`);
		if (previousDate && day.date <= previousDate)
			errors.push(
				`programme: days must be unique and in date order (${previousDate}, ${day.date})`
			);
		previousDate = day.date;
		let previousStart = -1;
		let workingEnd = -1;
		let workingId = '';
		for (const session of day.sessions) {
			try {
				const { startMinutes, endMinutes } = sessionTimeRange(session);
				if (startMinutes < previousStart)
					errors.push(`programme ${session.id}: sessions must be in start-time order`);
				previousStart = startMinutes;
				if (session.type !== 'social') {
					if (startMinutes < workingEnd)
						errors.push(
							`programme ${session.id}: overlaps working session or break '${workingId}'`
						);
					if (endMinutes !== undefined && endMinutes > workingEnd) {
						workingEnd = endMinutes;
						workingId = session.id;
					}
				}
			} catch (error) {
				errors.push(error instanceof Error ? error.message : String(error));
			}
		}
	}
	return errors;
}

/** South Africa has a fixed UTC+2 offset; validate before constructing an instant. */
export function venueUtcStamp(date: string, time: string): string {
	const minutes = clockMinutes(time);
	if (!isCalendarDate(date) || minutes === undefined)
		throw new Error(`invalid venue date/time '${date} ${time}'`);
	const at = Date.parse(`${date}T00:00:00Z`) + (minutes - 120) * 60_000;
	return `${new Date(at).toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`;
}
