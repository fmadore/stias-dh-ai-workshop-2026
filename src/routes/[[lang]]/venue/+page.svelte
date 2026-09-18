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
	import { Info } from '@lucide/svelte';
</script>

<SEO title="{m.nav_venue()} | {siteConfig.shortTitle}" description={m.seo_venue_description()} />

<PageHeader
	title={m.section_venue()}
	subtitle={m.venue_page_subtitle()}
	meta={[m.hero_dates(), m.hero_location()]}
/>

<div class="page-end page-body block-flow">
	<div class="container-readable">
		<ScrollReveal>
			<VenueInfo />
		</ScrollReveal>
	</div>

	<!-- Wider than the prose above it: the map carries four pins roughly a
	     kilometre apart, and at 56rem the guest houses crowd the venue. -->
	<div class="container-wide">
		<ScrollReveal>
			<section>
				<div class="measure-prose mb-7">
					<h2 class="text-section text-strong mb-2">{m.accommodation_title()}</h2>
					<p class="text-prose">{m.accommodation_intro()}</p>

					<!-- The one thing a participant has to act on here is that nobody is
					     coming to collect them in the morning. The distances on the cards
					     below state how far it is; only this says what that means for the
					     daily commute, and it also settles the "local transport" bullet in
					     the logistics list above, which reads like a shuttle until it is
					     told apart from the airport transfer and the off-site visits. -->
					<div class="callout mt-5">
						<Info
							size={18}
							strokeWidth={1.75}
							class="text-accent-ink mt-0.5 shrink-0"
							aria-hidden="true"
						/>
						<p class="text-body text-sm leading-relaxed">{m.accommodation_no_transfer()}</p>
					</div>
				</div>

				<VenueMap />

				<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each accommodations as accommodation (accommodation.id)}
						<AccommodationCard {accommodation} />
					{/each}
				</div>
			</section>
		</ScrollReveal>
	</div>
</div>
