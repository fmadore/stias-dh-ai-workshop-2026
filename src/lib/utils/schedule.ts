import type { ProgrammeDay } from '../types/index.ts';

/**
 * How the running order is numbered, timed and linked.
 *
 * Deliberately free of Paraglide, `$lib` aliases and Svelte, like
 * `logistics.ts`: the calendar export is a plain Node script, and it has to
 * name "Panel 3" and link `#session-…` exactly as the programme page does.
 * Panel numbering used to be counted separately in five places — the
 * programme page, each schedule day, the placement map, the person page's
 * server load and the calendar script — which is five chances to disagree.
 */

/** Anchor id for a session, shared by the programme page and every link to it. */
export function sessionAnchor(sessionId: string): string {
	return `session-${sessionId}`;
}

/** `'14:00 – 15:30'` → `['14:00', '15:30']`, whichever dash the data uses; `'19:00'` → `['19:00']`. */
export function sessionTimes(time: string): string[] {
	return time.split(/\s*[–—-]\s*/).map((part) => part.trim());
}

/** Session id → panel number. Panels are numbered continuously across the days. */
export function panelNumbers(days: readonly ProgrammeDay[]): Map<string, number> {
	const numbers = new Map<string, number>();
	for (const day of days) {
		for (const session of day.sessions) {
			if (session.type === 'panel') numbers.set(session.id, numbers.size + 1);
		}
	}
	return numbers;
}
