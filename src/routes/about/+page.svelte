<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { t } from '$lib/utils/i18n';
	import AbstractSection from '$lib/components/about/AbstractSection.svelte';
	import ThematicAxis from '$lib/components/about/ThematicAxis.svelte';
	import { thematicAxes } from '$lib/data/thematic-axes';
</script>

<svelte:head>
	<title>{m.nav_about()} | {siteConfig.shortTitle}</title>
	<meta name="description" content={t(siteConfig.description)} />
</svelte:head>

<div class="py-8 sm:py-12">
	<AbstractSection />

	<section class="py-16 sm:py-20 bg-white dark:bg-surface-800">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-2xl sm:text-3xl font-bold mb-8">{m.section_thematic_axes()}</h2>
			<div class="space-y-6">
				{#each thematicAxes as axis}
					<ThematicAxis {axis} compact={false} />
				{/each}
			</div>
		</div>
	</section>
</div>
