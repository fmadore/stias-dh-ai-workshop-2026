<script lang="ts">
	import { venueInfo } from '$lib/data/venue';
	import { t } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { ExternalLink } from 'lucide-svelte';
</script>

<div class="space-y-8">
	<!-- Venue description -->
	<div>
		<h2 class="mb-2 text-2xl font-bold sm:text-3xl">{venueInfo.name}</h2>
		<p class="text-primary-600 dark:text-primary-400 mb-4 text-lg">{t(venueInfo.fullName)}</p>
		<p class="text-surface-600 dark:text-surface-300 mb-4 leading-relaxed">
			{t(venueInfo.description)}
		</p>
		<p class="text-surface-500 dark:text-surface-400 text-sm">
			{venueInfo.address}, {venueInfo.city}, {venueInfo.country}
		</p>
		<a
			href={venueInfo.website}
			target="_blank"
			rel="noopener noreferrer"
			class="text-primary-500 hover:text-primary-600 mt-2 inline-flex items-center gap-1 text-sm"
		>
			<ExternalLink size={14} />
			{m.visit_website()}
		</a>
	</div>

	<!-- Logistics -->
	<div>
		<h2 class="mb-3 text-2xl font-bold sm:text-3xl">{m.logistics_label()}</h2>
		<p class="text-surface-600 dark:text-surface-300 leading-relaxed">
			{t(venueInfo.logisticsInfo)}
		</p>
	</div>
</div>
