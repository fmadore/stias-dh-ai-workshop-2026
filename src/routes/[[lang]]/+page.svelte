<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { buildEventSchema } from '$lib/data/event-schema';
	import { t, localePath } from '$lib/utils/i18n';
	import SEO from '$lib/components/SEO.svelte';
	import Hero from '$lib/components/home/Hero.svelte';
	import AtAGlance from '$lib/components/home/AtAGlance.svelte';
	import KeyDatesTimeline from '$lib/components/home/KeyDatesTimeline.svelte';
	import ThematicAxis from '$lib/components/about/ThematicAxis.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { thematicAxes } from '$lib/data/thematic-axes';
	import { ArrowRight } from '@lucide/svelte';
</script>

<SEO
	title={siteConfig.shortTitle}
	description={t(siteConfig.description)}
	additionalSchema={buildEventSchema(`${siteConfig.url}/images/og-default.png`)}
/>

<Hero />
<AtAGlance />

<!-- Thematic Axes Preview -->
<section class="section-pad-lg bg-raised">
	<div class="container-page">
		<!-- One reveal per section container, never one per child: three cards
		     each waiting their turn is friction, not delight. -->
		<ScrollReveal>
			<div class="mx-auto mb-12 max-w-xl text-center">
				<span class="text-eyebrow mb-3 inline-block">{m.nav_about()}</span>
				<h2 class="text-section text-strong">
					{m.section_thematic_axes()}
				</h2>
			</div>
			<!-- 1 → 2 → 3 rather than 1 → 3: going straight to three columns at
			     768px left each card 169px of content for a serif card title and a
			     caption, the tightest card on the site, in the 768–1023 band alone. -->
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each thematicAxes as axis (axis.id)}
					<ThematicAxis {axis} compact={true} />
				{/each}
			</div>
			<div class="mt-10 text-center">
				<a href={localePath('/about')} class="link-arrow">
					{m.learn_more()}
					<ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
				</a>
			</div>
		</ScrollReveal>
	</div>
</section>

<KeyDatesTimeline />
