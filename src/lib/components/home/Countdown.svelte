<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';

	let now = $state(Date.now());
	let interval: ReturnType<typeof setInterval> | undefined;

	const startDate = new Date(siteConfig.dates.start + 'T09:00:00').getTime();
	const endDate = new Date(siteConfig.dates.end + 'T18:00:00').getTime();

	const status = $derived(
		now >= endDate ? 'ended' : now >= startDate ? 'started' : 'upcoming'
	);

	const diff = $derived(Math.max(0, startDate - now));
	const days = $derived(Math.floor(diff / (1000 * 60 * 60 * 24)));
	const hours = $derived(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
	const minutes = $derived(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
	const seconds = $derived(Math.floor((diff % (1000 * 60)) / 1000));

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
	<p class="text-lg font-medium text-surface-500 dark:text-surface-400">
		{m.countdown_event_ended()}
	</p>
{:else if status === 'started'}
	<p class="text-lg font-medium text-secondary-500">
		{m.countdown_event_started()}
	</p>
{:else}
	<div class="flex items-center justify-center gap-4 sm:gap-6">
		<div class="text-center">
			<div class="text-3xl sm:text-4xl font-bold text-primary-500">{days}</div>
			<div class="text-xs sm:text-sm text-surface-500 dark:text-surface-400 mt-1">{m.countdown_days({ count: days.toString() })}</div>
		</div>
		<div class="text-2xl text-surface-300 dark:text-surface-600">:</div>
		<div class="text-center">
			<div class="text-3xl sm:text-4xl font-bold text-primary-500">{String(hours).padStart(2, '0')}</div>
			<div class="text-xs sm:text-sm text-surface-500 dark:text-surface-400 mt-1">{m.countdown_hours({ count: hours.toString() })}</div>
		</div>
		<div class="text-2xl text-surface-300 dark:text-surface-600">:</div>
		<div class="text-center">
			<div class="text-3xl sm:text-4xl font-bold text-primary-500">{String(minutes).padStart(2, '0')}</div>
			<div class="text-xs sm:text-sm text-surface-500 dark:text-surface-400 mt-1">{m.countdown_minutes({ count: minutes.toString() })}</div>
		</div>
		<div class="text-2xl text-surface-300 dark:text-surface-600">:</div>
		<div class="text-center">
			<div class="text-3xl sm:text-4xl font-bold text-primary-500">{String(seconds).padStart(2, '0')}</div>
			<div class="text-xs sm:text-sm text-surface-500 dark:text-surface-400 mt-1">{m.countdown_seconds({ count: seconds.toString() })}</div>
		</div>
	</div>
{/if}
