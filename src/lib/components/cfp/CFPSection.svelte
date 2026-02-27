<script lang="ts">
	import { cfpInfo } from '$lib/data/cfp';
	import { siteConfig } from '$lib/data/site-config';
	import { t } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { Calendar, Send } from 'lucide-svelte';

	const locale = $derived(getLocale());

	function formatDate(isoDate: string): string {
		return new Date(isoDate).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="space-y-10">
	<!-- Key Dates -->
	<div>
		<h2 class="text-2xl font-bold mb-6">{m.key_dates()}</h2>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<div class="bg-white dark:bg-surface-800 rounded-xl p-5 border border-surface-200 dark:border-surface-700 text-center">
				<Calendar size={20} class="mx-auto text-secondary-500 mb-2" />
				<p class="text-sm text-surface-500 dark:text-surface-400">{m.submission_deadline()}</p>
				<p class="font-bold text-lg">{formatDate(cfpInfo.deadline)}</p>
			</div>
			<div class="bg-white dark:bg-surface-800 rounded-xl p-5 border border-surface-200 dark:border-surface-700 text-center">
				<Calendar size={20} class="mx-auto text-secondary-500 mb-2" />
				<p class="text-sm text-surface-500 dark:text-surface-400">{m.notification_date()}</p>
				<p class="font-bold text-lg">{formatDate(cfpInfo.notificationDate)}</p>
			</div>
			<div class="bg-white dark:bg-surface-800 rounded-xl p-5 border border-surface-200 dark:border-surface-700 text-center">
				<Calendar size={20} class="mx-auto text-secondary-500 mb-2" />
				<p class="text-sm text-surface-500 dark:text-surface-400">{m.workshop_dates()}</p>
				<p class="font-bold text-lg">{formatDate(siteConfig.dates.start)} – {formatDate(siteConfig.dates.end)}</p>
			</div>
		</div>
	</div>

	<!-- Guidelines -->
	<div>
		<h2 class="text-2xl font-bold mb-4">{m.guidelines()}</h2>
		<p class="text-surface-600 dark:text-surface-300 leading-relaxed">{t(cfpInfo.guidelines)}</p>
	</div>

	<!-- Topics -->
	<div>
		<h2 class="text-2xl font-bold mb-4">{m.suggested_topics()}</h2>
		<ul class="space-y-2">
			{#each cfpInfo.topics as topic}
				<li class="flex items-start gap-3 text-surface-600 dark:text-surface-300">
					<span class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-secondary-400 mt-2.5"></span>
					<span>{t(topic)}</span>
				</li>
			{/each}
		</ul>
	</div>

	<!-- Submit button -->
	{#if cfpInfo.submissionUrl}
		<div class="text-center">
			<a
				href={cfpInfo.submissionUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
			>
				<Send size={18} />
				{m.submit_proposal()}
			</a>
		</div>
	{/if}
</div>
