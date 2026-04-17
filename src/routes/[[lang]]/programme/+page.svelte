<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { programme } from '$lib/data/programme';
	import ScheduleDay from '$lib/components/programme/ScheduleDay.svelte';
	import { Calendar } from '@lucide/svelte';
</script>

<SEO
	title="{m.nav_programme()} | {siteConfig.shortTitle}"
	description={m.seo_programme_description()}
/>

<PageHeader title={m.section_programme()} subtitle={m.hero_dates()} />

<div class="pb-20">
	<div class="container-readable">
		{#if programme.length > 0}
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
