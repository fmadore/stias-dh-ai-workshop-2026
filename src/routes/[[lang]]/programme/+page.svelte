<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { programme, programmeLastUpdated } from '$lib/data/programme';
	import ScheduleDay from '$lib/components/programme/ScheduleDay.svelte';
	import { Calendar, Info } from '@lucide/svelte';

	const lastUpdated = new Date(`${programmeLastUpdated}T12:00:00`).toLocaleDateString(
		getLocale() === 'fr' ? 'fr-FR' : 'en-GB',
		{ day: 'numeric', month: 'long', year: 'numeric' }
	);
</script>

<SEO
	title="{m.nav_programme()} | {siteConfig.shortTitle}"
	description={m.seo_programme_description()}
/>

<PageHeader title={m.section_programme()} subtitle={m.hero_dates()} />

<div class="pb-20">
	<div class="container-readable">
		{#if programme.length > 0}
			<ScrollReveal>
				<div
					class="border-secondary-500/30 bg-secondary-500/5 mb-10 flex items-start gap-3 rounded-xl border p-4 sm:p-5"
				>
					<Info
						size={18}
						strokeWidth={1.75}
						class="text-secondary-600 dark:text-secondary-400 mt-0.5 shrink-0"
						aria-hidden="true"
					/>
					<div>
						<p class="text-ink dark:text-surface-200 text-sm leading-relaxed">
							{m.programme_preliminary()}
						</p>
						<p class="text-ink-muted dark:text-surface-400 mt-1 text-xs">
							{m.programme_last_updated({ date: lastUpdated })}
						</p>
					</div>
				</div>
			</ScrollReveal>
			<div class="space-y-12">
				{#each programme as day, i}
					<ScrollReveal delay={i}>
						<ScheduleDay {day} />
					</ScrollReveal>
				{/each}
			</div>
		{:else}
			<ScrollReveal>
				<div class="card border-surface-200/60 dark:border-surface-700/50 border p-14 text-center">
					<Calendar
						size={44}
						strokeWidth={1.25}
						class="text-surface-300 dark:text-surface-600 mx-auto mb-5"
						aria-hidden="true"
					/>
					<p class="text-ink-muted dark:text-surface-400 text-lg font-light">
						{m.programme_tba()}
					</p>
				</div>
			</ScrollReveal>
		{/if}
	</div>
</div>
