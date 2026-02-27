<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';

	let now = $state(Date.now());
	let interval: ReturnType<typeof setInterval> | undefined;

	const startDate = new Date(siteConfig.dates.start + 'T09:00:00').getTime();
	const endDate = new Date(siteConfig.dates.end + 'T18:00:00').getTime();

	const status = $derived(now >= endDate ? 'ended' : now >= startDate ? 'started' : 'upcoming');

	const diff = $derived(Math.max(0, startDate - now));
	const days = $derived(Math.floor(diff / (1000 * 60 * 60 * 24)));
	const hours = $derived(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
	const minutes = $derived(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
	const seconds = $derived(Math.floor((diff % (1000 * 60)) / 1000));

	const units = $derived([
		{ value: days, label: m.countdown_days({ count: days.toString() }) },
		{ value: hours, label: m.countdown_hours({ count: hours.toString() }) },
		{ value: minutes, label: m.countdown_minutes({ count: minutes.toString() }) },
		{ value: seconds, label: m.countdown_seconds({ count: seconds.toString() }) }
	]);

	$effect(() => {
		interval = setInterval(() => {
			now = Date.now();
		}, 1000);
		return () => {
			if (interval) clearInterval(interval);
		};
	});
</script>

{#if status === 'ended'}
	<p class="text-lg font-sans font-light text-surface-400">
		{m.countdown_event_ended()}
	</p>
{:else if status === 'started'}
	<p class="text-lg font-sans font-medium text-secondary-400">
		{m.countdown_event_started()}
	</p>
{:else}
	<div class="flex items-center justify-center gap-3 sm:gap-5">
		{#each units as unit, i}
			{#if i > 0}
				<div class="text-xl text-white/20 font-light select-none pb-5">:</div>
			{/if}
			<div class="text-center min-w-[3.5rem]">
				<div
					class="text-3xl sm:text-4xl font-sans font-semibold text-white tabular-nums tracking-tight"
				>
					{String(unit.value).padStart(2, '0')}
				</div>
				<div
					class="text-[11px] sm:text-xs text-white/40 mt-1.5 uppercase tracking-wider font-sans font-light"
				>
					{unit.label}
				</div>
			</div>
		{/each}
	</div>
{/if}
