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
<section class="dark:bg-surface-900 bg-white py-16 sm:py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<ScrollReveal>
			<div class="mb-14 text-center">
				<h2 class="text-surface-900 dark:text-surface-50 mb-4 text-2xl sm:text-3xl">
					{m.section_thematic_axes()}
				</h2>
			</div>
		</ScrollReveal>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{#each thematicAxes as axis, i}
				<ScrollReveal delay={i}>
					<ThematicAxis {axis} compact={true} />
				</ScrollReveal>
			{/each}
		</div>
		<ScrollReveal delay={3}>
			<div class="mt-10 text-center">
				<a
					href={localePath('/about')}
					class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 group inline-flex items-center gap-2 font-sans font-medium transition-colors"
				>
					{m.learn_more()}
					<ArrowRight size={16} class="transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		</ScrollReveal>
	</div>
</section>

<!-- Quick Links -->
<section class="bg-cream-dark py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each quickLinks as link, i}
				<ScrollReveal delay={i}>
					<a
						href={link.href}
						class="group dark:bg-surface-800/80 border-surface-200/50 dark:border-surface-700/50 relative block overflow-hidden rounded-xl border bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:shadow-lg"
					>
						<!-- Hover gradient fill -->
						<div
							class="from-primary-500 to-primary-700 absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						></div>
						<div class="relative z-10">
							<h3
								class="text-surface-900 dark:text-surface-50 mb-2 font-serif text-lg transition-colors group-hover:text-white"
							>
								{link.title}
							</h3>
							<p
								class="text-surface-400 dark:text-surface-500 flex items-center gap-1 font-sans text-sm transition-colors group-hover:text-white/70"
							>
								{m.learn_more()}
								<ArrowRight size={14} class="transition-transform group-hover:translate-x-1" />
							</p>
						</div>
					</a>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>
