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

<PageHeader title={m.section_cfp()} />

<!-- Workshop identity block -->
<div class="pb-12">
	<div class="container-readable">
		<div class="card border-surface-200/60 dark:border-surface-700/50 border p-8 sm:p-10">
			<span class="text-eyebrow mb-4 inline-block">{m.hero_subtitle()}</span>
			<h2 class="text-page-title text-ink dark:text-surface-50 mb-6">
				{t(siteConfig.title)}
			</h2>
			<div
				class="text-ink-muted dark:text-surface-300 mb-8 flex flex-col gap-3 sm:flex-row sm:gap-6"
			>
				<span class="inline-flex items-center gap-2 text-[0.9375rem] font-light">
					<Calendar size={17} strokeWidth={1.75} class="text-primary-600" aria-hidden="true" />
					{m.hero_dates()}
				</span>
				<span class="inline-flex items-center gap-2 text-[0.9375rem] font-light">
					<MapPin size={17} strokeWidth={1.75} class="text-primary-600" aria-hidden="true" />
					{m.hero_location()}
				</span>
			</div>
			<DownloadCFPButton variant="primary" />
		</div>
	</div>
</div>

<div class="pb-20">
	<div class="container-readable">
		<CFPSection />
	</div>
</div>
