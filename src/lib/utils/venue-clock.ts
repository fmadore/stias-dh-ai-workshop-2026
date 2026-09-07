import { readable } from 'svelte/store';
import { getMilestones, msUntilNextVenueMidnight, workshopEnd } from './milestones';

/** Wake only when a displayed date or event status can change. */
export function nextClockDelay(now: number): number {
	const boundaries = [
		...getMilestones(now).map((milestone) => milestone.at + (milestone.id === 'workshop' ? 0 : 1)),
		Date.parse(workshopEnd())
	];
	return Math.max(
		1,
		Math.min(
			msUntilNextVenueMidnight(now),
			...boundaries.filter((at) => at > now).map((at) => at - now)
		)
	);
}

/** One timer for all mounted consumers; prerendered output makes no live claims. */
export const venueClock = readable({ now: Date.now(), live: false }, (set) => {
	if (typeof window === 'undefined') return;
	let timer: ReturnType<typeof setTimeout>;
	function refresh() {
		clearTimeout(timer);
		const now = Date.now();
		set({ now, live: true });
		timer = setTimeout(refresh, nextClockDelay(now));
	}
	function resume() {
		if (document.visibilityState === 'visible') refresh();
	}
	refresh();
	document.addEventListener('visibilitychange', resume);
	window.addEventListener('pageshow', refresh);
	return () => {
		clearTimeout(timer);
		document.removeEventListener('visibilitychange', resume);
		window.removeEventListener('pageshow', refresh);
	};
});
