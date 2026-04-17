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
	import { ArrowRight } from '@lucide/svelte';

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
<section class="section-pad-lg bg-paper dark:bg-paper-dark">
	<div class="container-page">
		<ScrollReveal>
			<div class="mx-auto mb-12 max-w-xl text-center">
				<span class="text-eyebrow mb-3 inline-block">{m.nav_about()}</span>
				<h2 class="text-section text-ink dark:text-surface-50">
					{m.section_thematic_axes()}
				</h2>
			</div>
		</ScrollReveal>
		<div class="grid grid-cols-1 gap-5 md:grid-cols-3">
			{#each thematicAxes as axis, i}
				<ScrollReveal delay={i}>
					<ThematicAxis {axis} compact={true} />
				</ScrollReveal>
			{/each}
		</div>
		<ScrollReveal delay={3}>
			<div class="mt-10 text-center">
				<a href={localePath('/about')} class="link-arrow">
					{m.learn_more()}
					<ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
				</a>
			</div>
		</ScrollReveal>
	</div>
</section>

<!-- Quick Links — editorial style, no gradient fills -->
<section class="section-pad bg-cream-dark">
	<div class="container-page">
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each quickLinks as link, i}
				<ScrollReveal delay={i}>
					<a
						href={link.href}
						class="card-hover border-surface-200/60 dark:border-surface-700/50 group block border-t-2 border-transparent p-7 hover:border-t-[var(--color-secondary-500)]"
					>
						<h3 class="text-card-title text-ink dark:text-surface-50 mb-3">
							{link.title}
						</h3>
						<p
							class="text-ink-muted dark:text-surface-400 inline-flex items-center gap-1.5 text-sm"
						>
							{m.learn_more()}
							<ArrowRight
								size={14}
								strokeWidth={1.75}
								class="transition-transform duration-[var(--duration-base)] group-hover:translate-x-1"
								aria-hidden="true"
							/>
						</p>
					</a>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>
