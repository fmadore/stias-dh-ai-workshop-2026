import * as m from '$lib/paraglide/messages';
import { getLocale } from '$lib/paraglide/runtime';
import { programme } from '$lib/data/programme';
import type { ProgrammeDay, Session } from '$lib/types';

export interface Placement {
	session: Session;
	day: ProgrammeDay;
	/** "Panel 3" / "Keynote" — the session's name in the running order. */
	sessionLabel: string;
	/** "Mon 21 · 14:00" — where it sits in the week. */
	slotLabel: string;
	/** Fragment id for the session on the programme page. */
	anchor: string;
	/** The other papers in the same session, in running order. */
	siblingIds: string[];
}

/** Anchor id for a session, shared by the programme page and every link to it. */
export function sessionAnchor(sessionId: string): string {
	return `session-${sessionId}`;
}

function shortDay(isoDate: string): string {
	// Noon UTC so the weekday never slips in a negative-offset timezone.
	return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString(
		getLocale() === 'fr' ? 'fr-FR' : 'en-GB',
		{ weekday: 'short', day: 'numeric', timeZone: 'UTC' }
	);
}

/** "14:00 – 15:30" → "14:00" */
function startTime(time: string): string {
	return time.split(/[–—-]/)[0].trim();
}

function sessionLabel(session: Session, panelNumber: number | undefined): string {
	switch (session.type) {
		case 'panel':
			return panelNumber ? `${m.session_panel()} ${panelNumber}` : m.session_panel();
		case 'keynote':
			return m.session_keynote();
		case 'discussion':
			return m.session_discussion();
		case 'plenary':
			return m.session_plenary();
		case 'social':
			return m.session_social();
		case 'break':
			return m.session_break();
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
 * localised and the locale can change between renders.
 */
export function getPlacements(): Map<string, Placement> {
	const placements = new Map<string, Placement>();
	let panelCount = 0;

	for (const day of programme) {
		for (const session of day.sessions) {
			if (session.type === 'panel') panelCount += 1;
			const ids = session.presentationIds ?? [];
			if (ids.length === 0) continue;

			const placement = {
				session,
				day,
				sessionLabel: sessionLabel(session, session.type === 'panel' ? panelCount : undefined),
				slotLabel: `${shortDay(day.date)} · ${startTime(session.time)}`,
				anchor: sessionAnchor(session.id)
			};

			for (const id of ids) {
				placements.set(id, { ...placement, siblingIds: ids.filter((other) => other !== id) });
			}
		}
	}

	return placements;
}

export function getPlacement(presentationId: string): Placement | undefined {
	return getPlacements().get(presentationId);
}
