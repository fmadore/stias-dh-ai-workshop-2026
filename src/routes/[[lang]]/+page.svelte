<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { t, localePath } from '$lib/utils/i18n';
	import SEO from '$lib/components/SEO.svelte';
	import Hero from '$lib/components/home/Hero.svelte';
	import KeyInfo from '$lib/components/home/KeyInfo.svelte';
	import ThematicAxis from '$lib/components/about/ThematicAxis.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { thematicAxes } from '$lib/data/thematic-axes';
	import { ArrowRight } from 'lucide-svelte';

	const quickLinks = $derived([
		{ href: localePath('/call-for-papers'), title: m.section_cfp() },
		{ href: localePath('/programme'), title: m.section_programme() },
		{ href: localePath('/venue'), title: m.section_venue() }
	]);
</script>

<SEO title={siteConfig.shortTitle} description={t(siteConfig.description)} />

<Hero />
<KeyInfo />

<!-- Thematic Axes Preview -->
<section class="py-16 sm:py-24 bg-white dark:bg-surface-900">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<ScrollReveal>
			<div class="text-center mb-14">
				<h2 class="text-2xl sm:text-3xl mb-4 text-surface-900 dark:text-surface-50">
					{m.section_thematic_axes()}
				</h2>
			</div>
		</ScrollReveal>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each thematicAxes as axis, i}
				<ScrollReveal delay={i}>
					<ThematicAxis {axis} compact={true} />
				</ScrollReveal>
			{/each}
		</div>
		<ScrollReveal delay={3}>
			<div class="text-center mt-10">
				<a
					href={localePath('/about')}
					class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-sans font-medium transition-colors group"
				>
					{m.learn_more()}
					<ArrowRight size={16} class="group-hover:translate-x-1 transition-transform" />
				</a>
			</div>
		</ScrollReveal>
	</div>
</section>

<!-- Quick Links -->
<section class="py-16 sm:py-20 bg-cream-dark">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
			{#each quickLinks as link, i}
				<ScrollReveal delay={i}>
					<a
						href={link.href}
						class="group relative block rounded-xl p-7 bg-white dark:bg-surface-800/80 overflow-hidden border border-surface-200/50 dark:border-surface-700/50 hover:border-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
					>
						<!-- Hover gradient fill -->
						<div
							class="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
						></div>
						<div class="relative z-10">
							<h3
								class="text-lg mb-2 text-surface-900 dark:text-surface-50 group-hover:text-white transition-colors font-serif"
							>
								{link.title}
							</h3>
							<p
								class="text-sm font-sans text-surface-400 dark:text-surface-500 group-hover:text-white/70 transition-colors flex items-center gap-1"
							>
								{m.learn_more()}
								<ArrowRight size={14} class="group-hover:translate-x-1 transition-transform" />
							</p>
						</div>
					</a>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>
