<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import AbstractSection from '$lib/components/about/AbstractSection.svelte';
	import ThematicAxis from '$lib/components/about/ThematicAxis.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { thematicAxes } from '$lib/data/thematic-axes';
</script>

<SEO title="{m.nav_about()} | {siteConfig.shortTitle}" description={m.seo_about_description()} />

<div class="bg-cream">
	<PageHeader title={m.nav_about()} />

	<AbstractSection />

	<section class="dark:bg-surface-800/50 bg-white py-16 sm:py-20">
		<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
			<ScrollReveal>
				<h2 class="text-surface-900 dark:text-surface-50 mb-10 text-2xl sm:text-3xl">
					{m.section_thematic_axes()}
				</h2>
			</ScrollReveal>
			<div class="space-y-6">
				{#each thematicAxes as axis, i}
					<ScrollReveal delay={i}>
						<ThematicAxis {axis} compact={false} />
					</ScrollReveal>
				{/each}
			</div>
		</div>
	</section>
</div>
