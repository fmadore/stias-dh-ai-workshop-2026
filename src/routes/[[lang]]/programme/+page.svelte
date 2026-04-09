<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { programme } from '$lib/data/programme';
	import ScheduleDay from '$lib/components/programme/ScheduleDay.svelte';
	import { Calendar } from 'lucide-svelte';
</script>

<SEO
	title="{m.nav_programme()} | {siteConfig.shortTitle}"
	description={m.seo_programme_description()}
/>

<div class="bg-cream">
	<PageHeader title={m.section_programme()} subtitle={m.hero_dates()} />

	<div class="pb-16 sm:pb-20">
		<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
			{#if programme.length > 0}
				<div class="space-y-10">
					{#each programme as day, i}
						<ScrollReveal delay={i}>
							<ScheduleDay {day} />
						</ScrollReveal>
					{/each}
				</div>
			{:else}
				<ScrollReveal>
					<div
						class="dark:bg-surface-800/80 border-surface-200/50 dark:border-surface-700/50 rounded-xl border bg-white p-14 text-center"
					>
						<Calendar size={48} class="text-surface-300 dark:text-surface-600 mx-auto mb-4" />
						<p class="text-surface-400 dark:text-surface-500 font-sans text-lg font-light">
							{m.programme_tba()}
						</p>
					</div>
				</ScrollReveal>
			{/if}
		</div>
	</div>
</div>
