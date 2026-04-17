<script lang="ts">
	import { venueInfo } from '$lib/data/venue';
	import { t } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { ExternalLink } from '@lucide/svelte';
</script>

<div class="space-y-10">
	<section>
		<span class="text-eyebrow mb-3 inline-block">{m.section_venue()}</span>
		<h2 class="text-section text-ink dark:text-surface-50 mb-2">{venueInfo.name}</h2>
		<p class="text-primary-700 dark:text-primary-300 mb-4 text-lg font-light">
			{t(venueInfo.fullName)}
		</p>
		<p class="text-prose text-ink-muted dark:text-surface-300 mb-4">
			{t(venueInfo.description)}
		</p>
		<p class="text-ink-muted dark:text-surface-400 text-sm">
			{venueInfo.address}, {venueInfo.city}, {venueInfo.country}
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
		<h2 class="text-section text-ink dark:text-surface-50 mb-4">{m.logistics_label()}</h2>
		<p class="text-prose text-ink-muted dark:text-surface-300">
			{t(venueInfo.logisticsInfo)}
		</p>
	</section>
</div>
