<script lang="ts">
	import { venueInfo } from '$lib/data/venue';
	import { t } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { ExternalLink } from '@lucide/svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { countryName } from '$lib/utils/country';
</script>

<div class="space-y-10">
	<section>
		<span class="text-eyebrow mb-3 inline-block">{m.section_venue()}</span>
		<h2 class="text-section text-strong mb-2">{venueInfo.name}</h2>
		<p class="text-link mb-4 text-lg font-light">
			{t(venueInfo.fullName)}
		</p>
		<p class="text-prose text-body mb-4">
			{t(venueInfo.description)}
		</p>
		<p class="text-muted text-sm">
			{venueInfo.address}, {venueInfo.postalCode}
			{venueInfo.city}, {countryName(venueInfo.country, getLocale())}
		</p>
		<a
			href={venueInfo.website}
			target="_blank"
			rel="noopener noreferrer"
			class="link-arrow mt-3 text-sm"
		>
			<ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
			{m.visit_website()}
		</a>
	</section>

	<section>
		<h2 class="text-section text-strong mb-4">{m.logistics_label()}</h2>
		<p class="text-prose text-body">
			{t(venueInfo.logisticsInfo)}
		</p>
	</section>
</div>
