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

<!-- The count is a clause in the milestone line, not a metric. A 36px display
     serif numeral over a tracked uppercase label is the hero-metric template,
     and an urgency device on a page whose deadline concerns twenty-five
     authors; the same fact set in the strip's own small sans says it once. -->
<time datetime={target} class="text-primary-100/85 text-sm tabular-nums">
	{#if days === 0}
		<!-- One reading for both. Everywhere else the digits carry no
		     relationship to the words, so they are hidden and a sentence is
		     announced instead; "today" is already the whole fact and needs no
		     screen-reader twin. -->
		{m.countdown_today()}
	{:else}
		<span aria-hidden="true">
			{days}
			{days === 1 ? m.countdown_days_remaining_one() : m.countdown_days_remaining()}
		</span>
		<span class="sr-only">
			{days === 1
				? m.countdown_until_one({ count: String(days), milestone })
				: m.countdown_until({ count: String(days), milestone })}
		</span>
	{/if}
</time>
