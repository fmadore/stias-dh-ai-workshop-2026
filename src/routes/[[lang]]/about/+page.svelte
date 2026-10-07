<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import AbstractSection from '$lib/components/about/AbstractSection.svelte';
	import ThematicAxis from '$lib/components/about/ThematicAxis.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { thematicAxes } from '$lib/data/thematic-axes';
	import { onlineAccess } from '$lib/data/online-access';
	import { localePath } from '$lib/utils/i18n';

	// The app's name is the link, so the sentence is cut around it, as the call
	// for papers does for its journal. It stays English inside the French
	// sentence and carries `lang` for that.
	const APP_NAME = 'Live Translation & Subtitles';
	const languageParts = $derived.by(() => {
		const full = m.about_languages_body({ platform: onlineAccess.platform });
		const idx = full.indexOf(APP_NAME);
		if (idx === -1) return { before: full, linked: false, after: '' };
		return {
			before: full.slice(0, idx),
			linked: true,
			after: full.slice(idx + APP_NAME.length)
		};
	});
</script>

<SEO title="{m.nav_about()} | {siteConfig.shortTitle}" description={m.seo_about_description()} />

<PageHeader
	title={m.nav_about()}
	subtitle={m.seo_about_description()}
	meta={[m.hero_dates(), m.hero_location(), m.hero_format()]}
/>

<AbstractSection />

<section class="section-pad bg-raised">
	<div class="container-readable">
		<ScrollReveal>
			<div class="mb-10">
				<h2 class="text-section text-strong">
					{m.section_thematic_axes()}
				</h2>
			</div>
		</ScrollReveal>
		<ScrollReveal>
			<div class="space-y-5">
				{#each thematicAxes as axis (axis.id)}
					<ThematicAxis {axis} compact={false} />
				{/each}
			</div>
		</ScrollReveal>
	</div>
</section>

<!-- The abstract above is the proposal, in the future tense, and stays as it
     was written. This is what happened: the one place the page says how the
     four days actually ran, which the header's "Hybrid · EN & FR" only names. -->
<section class="section-pad">
	<div class="container-readable">
		<ScrollReveal>
			<h2 class="text-section text-strong mb-5">{m.about_languages_title()}</h2>
			<p class="text-prose">
				{languageParts.before}{#if languageParts.linked}<a
						href="{localePath('/resources')}#made-for-the-workshop"
						class="link-inline"
						lang="en">{APP_NAME}</a
					>{/if}{languageParts.after}
			</p>
		</ScrollReveal>
	</div>
</section>
