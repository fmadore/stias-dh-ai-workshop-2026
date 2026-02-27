<script lang="ts">
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { t } from '$lib/utils/i18n';
	import Hero from '$lib/components/home/Hero.svelte';
	import KeyInfo from '$lib/components/home/KeyInfo.svelte';
	import ThematicAxis from '$lib/components/about/ThematicAxis.svelte';
	import { thematicAxes } from '$lib/data/thematic-axes';
	import { ArrowRight } from 'lucide-svelte';
</script>

<svelte:head>
	<title>{siteConfig.shortTitle}</title>
	<meta name="description" content={t(siteConfig.description)} />
	<meta property="og:title" content={t(siteConfig.title)} />
	<meta property="og:description" content={t(siteConfig.description)} />
	<meta property="og:type" content="website" />
</svelte:head>

<Hero />
<KeyInfo />

<!-- Thematic Axes Preview -->
<section class="py-16 sm:py-20 bg-white dark:bg-surface-800">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<h2 class="text-2xl sm:text-3xl font-bold mb-4">{m.section_thematic_axes()}</h2>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each thematicAxes as axis}
				<ThematicAxis {axis} compact={true} />
			{/each}
		</div>
		<div class="text-center mt-8">
			<a
				href="{base}/about"
				class="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
			>
				{m.learn_more()}
				<ArrowRight size={16} />
			</a>
		</div>
	</div>
</section>

<!-- Quick Links -->
<section class="py-16 sm:py-20 bg-surface-50 dark:bg-surface-900">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<a
				href="{base}/call-for-papers"
				class="group bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700 hover:border-primary-500/50 transition-colors"
			>
				<h3 class="font-bold text-lg mb-2 group-hover:text-primary-500 transition-colors">{m.section_cfp()}</h3>
				<p class="text-sm text-surface-500 dark:text-surface-400">{m.learn_more()} &rarr;</p>
			</a>
			<a
				href="{base}/programme"
				class="group bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700 hover:border-primary-500/50 transition-colors"
			>
				<h3 class="font-bold text-lg mb-2 group-hover:text-primary-500 transition-colors">{m.section_programme()}</h3>
				<p class="text-sm text-surface-500 dark:text-surface-400">{m.learn_more()} &rarr;</p>
			</a>
			<a
				href="{base}/venue"
				class="group bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700 hover:border-primary-500/50 transition-colors"
			>
				<h3 class="font-bold text-lg mb-2 group-hover:text-primary-500 transition-colors">{m.section_venue()}</h3>
				<p class="text-sm text-surface-500 dark:text-surface-400">{m.learn_more()} &rarr;</p>
			</a>
		</div>
	</div>
</section>
