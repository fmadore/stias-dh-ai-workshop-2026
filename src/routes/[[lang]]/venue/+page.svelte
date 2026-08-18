<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import VenueInfo from '$lib/components/venue/VenueInfo.svelte';
	import VenueMap from '$lib/components/venue/VenueMap.svelte';
	import AccommodationCard from '$lib/components/venue/AccommodationCard.svelte';
	import { accommodations } from '$lib/data/accommodation';
</script>

<SEO title="{m.nav_venue()} | {siteConfig.shortTitle}" description={m.seo_venue_description()} />

<PageHeader
	title={m.section_venue()}
	subtitle={m.venue_page_subtitle()}
	meta={[m.hero_dates(), m.hero_location()]}
/>

<div class="page-end pt-14">
	<div class="container-readable">
		<ScrollReveal>
			<VenueInfo />
		</ScrollReveal>
	</div>

	<!-- Wider than the prose above it: the map carries three pins roughly a
	     kilometre apart, and at 56rem the guest houses crowd the venue. -->
	<div class="container-wide mt-16">
		<ScrollReveal delay={1}>
			<section>
				<div class="measure-prose mb-7">
					<h2 class="text-section text-strong mb-2">{m.accommodation_title()}</h2>
					<p class="text-prose">{m.accommodation_intro()}</p>
				</div>

				<VenueMap />

				<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
					{#each accommodations as accommodation (accommodation.id)}
						<AccommodationCard {accommodation} />
					{/each}
				</div>
			</section>
		</ScrollReveal>
	</div>
</div>
