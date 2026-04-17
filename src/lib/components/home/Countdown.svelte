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
	<p class="text-surface-400 text-lg font-light">
		{m.countdown_event_ended()}
	</p>
{:else if status === 'started'}
	<p class="text-secondary-400 text-lg font-medium">
		{m.countdown_event_started()}
	</p>
{:else}
	<div class="flex items-center justify-center gap-4 sm:gap-7">
		{#each units as unit, i}
			{#if i > 0}
				<div
					class="pb-5 text-xl font-light text-white/15 select-none"
					aria-hidden="true"
				>
					·
				</div>
			{/if}
			<div class="min-w-[3.25rem] text-center">
				<div class="text-3xl font-semibold tracking-tight text-white tabular-nums sm:text-4xl">
					{String(unit.value).padStart(2, '0')}
				</div>
				<div
					class="mt-1.5 text-[11px] font-medium tracking-[0.16em] text-white/50 uppercase sm:text-xs"
				>
					{unit.label}
				</div>
			</div>
		{/each}
	</div>
{/if}
