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

<div class="bg-cream">
	<PageHeader title={m.section_venue()} />

	<div class="pb-16 sm:pb-20">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
				<ScrollReveal>
					<VenueInfo />
				</ScrollReveal>
				<ScrollReveal delay={1}>
					<div class="lg:pt-10">
						<MapEmbed />
					</div>
				</ScrollReveal>
			</div>
		</div>
	</div>
</div>
