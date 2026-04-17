<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import VenueInfo from '$lib/components/venue/VenueInfo.svelte';
	import MapEmbed from '$lib/components/venue/MapEmbed.svelte';
</script>

<SEO title="{m.nav_venue()} | {siteConfig.shortTitle}" description={m.seo_venue_description()} />

<PageHeader title={m.section_venue()} />

<div class="pb-20">
	<div class="container-readable">
		<div class="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
			<ScrollReveal>
				<VenueInfo />
			</ScrollReveal>
			<ScrollReveal delay={1}>
				<div class="lg:pt-16">
					<MapEmbed />
				</div>
			</ScrollReveal>
		</div>
	</div>
</div>
