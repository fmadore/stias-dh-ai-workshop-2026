<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { programme } from '$lib/data/programme';
	import ScheduleDay from '$lib/components/programme/ScheduleDay.svelte';
	import { Calendar } from 'lucide-svelte';
</script>

<svelte:head>
	<title>{m.nav_programme()} | {siteConfig.shortTitle}</title>
</svelte:head>

<div class="py-8 sm:py-12">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<h1 class="text-3xl sm:text-4xl font-bold mb-4">{m.section_programme()}</h1>
		<p class="text-lg text-surface-500 dark:text-surface-400 mb-8">{m.hero_dates()}</p>

		{#if programme.length > 0}
			<div class="space-y-10">
				{#each programme as day}
					<ScheduleDay {day} />
				{/each}
			</div>
		{:else}
			<div class="bg-white dark:bg-surface-800 rounded-xl p-12 text-center border border-surface-200 dark:border-surface-700">
				<Calendar size={48} class="mx-auto text-surface-300 dark:text-surface-600 mb-4" />
				<p class="text-lg text-surface-500 dark:text-surface-400">{m.programme_tba()}</p>
			</div>
		{/if}
	</div>
</div>
