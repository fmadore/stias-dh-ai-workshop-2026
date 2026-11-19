import { getLocale, type Locale } from '#lib/paraglide/runtime.js';
import { programme } from '#lib/data/programme.ts';
import type { PlacementLabel } from '#lib/types/index.ts';
import { formatShortDay } from '#lib/utils/date.ts';
import { panelNumbers, sessionAnchor, sessionTimes } from '#lib/utils/schedule.ts';
import { sessionLabel } from '#lib/utils/session-label.ts';

export interface Placement extends PlacementLabel {
	/** Fragment id for the session on the programme page. */
	anchor: string;
	/** The other papers in the same session, in running order. */
	siblingIds: string[];
}

/**
 * Every paper's place in the running order, keyed by presentation id.
 *
 * The programme already knows which session each paper belongs to; until now
 * nothing outside the programme page could see it, so paper and participant
 * cards led with "English" instead of "Panel 3 · Tue 14:00".
 *
 * Server-only: it walks the whole programme registry, every session's title
 * and description in both languages. The paper and participant cards used to
 * call this in the browser, which put that registry in the module preloads of
 * /papers and /participants for the sake of two short labels per card. Their
 * loads now resolve the labels at prerender and pass them down as data.
 *
 * Rebuilt per call rather than cached at module scope because the labels are
 * localised. A server load passes the locale explicitly: it runs before the
 * layout load sets the global.
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

/** Just the two labels a card prints — the anchor and siblings stay on the server. */
export function placementLabel(placement: Placement | undefined): PlacementLabel | undefined {
	return placement && { sessionLabel: placement.sessionLabel, slotLabel: placement.slotLabel };
}
