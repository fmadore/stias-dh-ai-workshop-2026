<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { t } from '$lib/utils/i18n';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import CFPSection from '$lib/components/cfp/CFPSection.svelte';
	import DownloadCFPButton from '$lib/components/cfp/DownloadCFPButton.svelte';
	import { MapPin, Calendar } from 'lucide-svelte';
</script>

<SEO title="{m.nav_cfp()} | {siteConfig.shortTitle}" description={m.seo_cfp_description()} />

<div class="bg-cream">
	<PageHeader title={m.section_cfp()} />

	<!-- Workshop identity block -->
	<div class="pb-10 sm:pb-14">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<div
				class="bg-white dark:bg-surface-800/80 rounded-2xl p-8 sm:p-10 border border-surface-200/50 dark:border-surface-700/50"
			>
				<p
					class="text-sm font-sans font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-3"
				>
					{m.hero_subtitle()}
				</p>
				<h2
					class="text-2xl sm:text-3xl font-normal tracking-tight text-surface-900 dark:text-surface-50 mb-6"
				>
					{t(siteConfig.title)}
				</h2>
				<div class="flex flex-col sm:flex-row gap-4 text-surface-600 dark:text-surface-300 mb-6">
					<span class="inline-flex items-center gap-2 font-sans font-light">
						<Calendar size={18} class="text-primary-500" />
						{m.hero_dates()}
					</span>
					<span class="inline-flex items-center gap-2 font-sans font-light">
						<MapPin size={18} class="text-primary-500" />
						{m.hero_location()}
					</span>
				</div>
				<DownloadCFPButton variant="primary" />
			</div>
		</div>
	</div>

	<div class="pb-16 sm:pb-20">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<CFPSection />
		</div>
	</div>
</div>
