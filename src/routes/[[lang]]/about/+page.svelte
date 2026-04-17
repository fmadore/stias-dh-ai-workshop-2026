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

<PageHeader title={m.nav_about()} />

<AbstractSection />

<section class="section-pad bg-paper dark:bg-paper-dark">
	<div class="container-readable">
		<ScrollReveal>
			<div class="mb-10">
				<span class="text-eyebrow mb-3 inline-block">{m.section_thematic_axes()}</span>
				<h2 class="text-section text-ink dark:text-surface-50">
					{m.section_thematic_axes()}
				</h2>
			</div>
		</ScrollReveal>
		<div class="space-y-5">
			{#each thematicAxes as axis, i}
				<ScrollReveal delay={i}>
					<ThematicAxis {axis} compact={false} />
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>
