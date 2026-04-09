<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { t } from '$lib/utils/i18n';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import CFPSection from '$lib/components/cfp/CFPSection.svelte';
	import DownloadCFPButton from '$lib/components/cfp/DownloadCFPButton.svelte';
	import { MapPin, Calendar } from '@lucide/svelte';
</script>

<SEO title="{m.nav_cfp()} | {siteConfig.shortTitle}" description={m.seo_cfp_description()} />

<div class="bg-cream">
	<PageHeader title={m.section_cfp()} />

	<!-- Workshop identity block -->
	<div class="pb-10 sm:pb-14">
		<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
			<div
				class="dark:bg-surface-800/80 border-surface-200/50 dark:border-surface-700/50 rounded-2xl border bg-white p-8 sm:p-10"
			>
				<p
					class="text-secondary-500 dark:text-secondary-400 mb-3 font-sans text-sm font-medium tracking-wider uppercase"
				>
					{m.hero_subtitle()}
				</p>
				<h2
					class="text-surface-900 dark:text-surface-50 mb-6 text-2xl font-normal tracking-tight sm:text-3xl"
				>
					{t(siteConfig.title)}
				</h2>
				<div class="text-surface-600 dark:text-surface-300 mb-6 flex flex-col gap-4 sm:flex-row">
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
		<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
			<CFPSection />
		</div>
	</div>
</div>
