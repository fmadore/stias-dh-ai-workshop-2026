<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import VenueInfo from '$lib/components/venue/VenueInfo.svelte';
	import MapEmbed from '$lib/components/venue/MapEmbed.svelte';
</script>

<svelte:head>
	<title>{m.nav_venue()} | {siteConfig.shortTitle}</title>
</svelte:head>

<div class="py-8 sm:py-12">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<h1 class="text-3xl sm:text-4xl font-bold mb-8">{m.section_venue()}</h1>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
			<VenueInfo />
			<div class="lg:pt-10">
				<MapEmbed />
			</div>
		</div>
	</div>
</div>
