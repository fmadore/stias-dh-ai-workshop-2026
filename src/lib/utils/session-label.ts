import * as m from '#lib/paraglide/messages.js';
import { getLocale, type Locale } from '#lib/paraglide/runtime.js';
import type { Session } from '#lib/types/index.ts';

/**
 * "Panel 3", "Keynote", … — a session type as the running order names it.
 *
 * Its own module, apart from the placement map in `server/placement.ts`: the
 * programme page's session cards need only this, and importing it from beside
 * `getPlacements` is how the programme registry once rode into the papers and
 * participants pages.
 */
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
