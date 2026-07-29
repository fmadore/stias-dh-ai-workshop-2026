<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { daysUntil } from '$lib/utils/milestones';

	let {
		/** ISO datetime the count runs to, e.g. 2026-08-31T23:59:59+02:00. */
		target,
		/** What the reader is counting down to — used in the screen-reader sentence. */
		milestone
	}: {
		target: string;
		milestone: string;
	} = $props();

	let now = $state(Date.now());

	const targetMs = $derived(new Date(target).getTime());
	const days = $derived(daysUntil(targetMs, now));

	// Days, not seconds. A ticking seconds display re-rendered the page once a
	// second for a date months out, and the number nobody can act on was the
	// loudest thing on the home page. An hourly tick is plenty for whole days.
	$effect(() => {
		const interval = setInterval(() => (now = Date.now()), 3_600_000);
		return () => clearInterval(interval);
	});
</script>

<div class="flex items-baseline gap-2.5">
	<!-- The digits carry no relationship to each other for a screen reader, so
	     they are hidden and one sentence is announced instead. -->
	<time datetime={target} class="flex items-baseline gap-2.5">
		<span
			class="font-display text-3xl leading-none text-white tabular-nums sm:text-4xl"
			aria-hidden="true"
		>
			{days}
		</span>
		<span
			class="text-badge font-medium tracking-[0.14em] text-white/65 uppercase"
			aria-hidden="true"
		>
			{m.countdown_days_remaining()}
		</span>
		<span class="sr-only">
			{days === 0 ? m.countdown_today() : m.countdown_until({ count: String(days), milestone })}
		</span>
	</time>
</div>
