<script lang="ts">
	import { venueInfo } from '$lib/data/venue';
	import { t } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { ExternalLink } from 'lucide-svelte';
</script>

<div class="space-y-8">
	<!-- Venue description -->
	<div>
		<h2 class="text-2xl sm:text-3xl font-bold mb-2">{venueInfo.name}</h2>
		<p class="text-lg text-primary-600 dark:text-primary-400 mb-4">{t(venueInfo.fullName)}</p>
		<p class="text-surface-600 dark:text-surface-300 leading-relaxed mb-4">{t(venueInfo.description)}</p>
		<p class="text-sm text-surface-500 dark:text-surface-400">{venueInfo.address}, {venueInfo.city}, {venueInfo.country}</p>
		<a
			href={venueInfo.website}
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 mt-2"
		>
			<ExternalLink size={14} />
			{m.visit_website()}
		</a>
	</div>

	<!-- Travel info -->
	<div>
		<h3 class="text-xl font-bold mb-3">{m.travel_info()}</h3>
		<p class="text-surface-600 dark:text-surface-300 leading-relaxed">{t(venueInfo.travelInfo)}</p>
	</div>

	<!-- Accommodation -->
	<div>
		<h3 class="text-xl font-bold mb-3">{m.accommodation()}</h3>
		<p class="text-surface-600 dark:text-surface-300 leading-relaxed">{t(venueInfo.accommodationInfo)}</p>
	</div>
</div>
