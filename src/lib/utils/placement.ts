import * as m from '$lib/paraglide/messages';
import { getLocale, type Locale } from '$lib/paraglide/runtime';
import { programme } from '$lib/data/programme';
import type { Session } from '$lib/types';
import { formatShortDay } from './date';
import { panelNumbers, sessionAnchor, sessionTimes } from './schedule';

export interface Placement {
	/** "Panel 3" / "Keynote" — the session's name in the running order. */
	sessionLabel: string;
	/** "Mon 21 · 14:00" — where it sits in the week. */
	slotLabel: string;
	/** Fragment id for the session on the programme page. */
	anchor: string;
	/** The other papers in the same session, in running order. */
	siblingIds: string[];
}

/** "Panel 3", "Keynote", … — a session type as the running order names it. */
export function sessionLabel(
	type: Session['type'],
	panelNumber?: number,
	locale: Locale = getLocale()
): string {
	const options = { locale };
	switch (type) {
		case 'panel':
			return panelNumber
				? `${m.session_panel({}, options)} ${panelNumber}`
				: m.session_panel({}, options);
		case 'keynote':
			return m.session_keynote({}, options);
		case 'discussion':
			return m.session_discussion({}, options);
		case 'plenary':
			return m.session_plenary({}, options);
		case 'social':
			return m.session_social({}, options);
		case 'break':
			return m.session_break({}, options);
	}
}

/**
 * Every paper's place in the running order, keyed by presentation id.
 *
 * The programme already knows which session each paper belongs to; until now
 * nothing outside the programme page could see it, so paper and participant
 * cards led with "English" instead of "Panel 3 · Tue 14:00".
 *
 * Rebuilt per call rather than cached at module scope because the labels are
 * localised and the locale can change between renders. A server load passes
 * the locale explicitly: it runs before the layout load sets the global.
 */
export function getPlacements(locale: Locale = getLocale()): Map<string, Placement> {
	const placements = new Map<string, Placement>();
	const panels = panelNumbers(programme);

	for (const day of programme) {
		for (const session of day.sessions) {
			const ids = session.presentationIds ?? [];
			if (ids.length === 0) continue;

			const placement = {
				sessionLabel: sessionLabel(session.type, panels.get(session.id), locale),
				slotLabel: `${formatShortDay(day.date, locale)} · ${sessionTimes(session.time)[0]}`,
				anchor: sessionAnchor(session.id)
			};

			for (const id of ids) {
				placements.set(id, { ...placement, siblingIds: ids.filter((other) => other !== id) });
			}
		}
	}

	return placements;
}
