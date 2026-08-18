<script lang="ts">
	import type { Accommodation } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { ExternalLink } from '@lucide/svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { countryName } from '$lib/utils/country';
	import { venueInfo } from '$lib/data/venue';
	import { distanceMetres, formatDistance } from '$lib/utils/geo';

	let { accommodation }: { accommodation: Accommodation } = $props();

	const locale = $derived(getLocale() as 'en' | 'fr');
	const distance = $derived(
		m.accommodation_distance({
			distance: formatDistance(
				distanceMetres(venueInfo.coordinates, accommodation.coordinates),
				locale
			)
		})
	);
</script>

<!--
	The map answers "where", this answers "which one and what is it". Both are
	needed: the map is the only place the three points sit in relation to each
	other, and it is also the one part of the page that never arrives without
	JavaScript — so every address, distance and link is repeated here as text.
-->
<article class="card flex h-full flex-col p-5">
	<p class="text-eyebrow">{m.venue_role_guest_house()}</p>

	<h3 class="text-card-title text-strong mt-2">{accommodation.name}</h3>

	<p class="text-muted text-caption mt-1 leading-snug">
		{accommodation.address}, {accommodation.postalCode}
		{accommodation.city}, {countryName(accommodation.country, locale)}
	</p>

	<p class="text-link mt-1 text-sm font-medium">{distance}</p>

	<p class="text-bio mt-3">{t(accommodation.description)}</p>

	<a
		href={accommodation.website}
		target="_blank"
		rel="noopener noreferrer"
		class="link-arrow mt-auto pt-4 text-sm"
	>
		<ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
		{m.visit_website()}
	</a>
</article>
