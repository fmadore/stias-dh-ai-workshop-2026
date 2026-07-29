<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { t } from '$lib/utils/i18n';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import CFPSection from '$lib/components/cfp/CFPSection.svelte';
	import DownloadCFPButton from '$lib/components/cfp/DownloadCFPButton.svelte';
</script>

<SEO title="{m.nav_cfp()} | {siteConfig.shortTitle}" description={m.seo_cfp_description()} />

<!-- The downloads live in the header band rather than in a card below it,
     and the workshop title is the header's subtitle instead of a second h2
     repeating what the page already says. -->
<PageHeader
	title={m.section_cfp()}
	eyebrow={m.hero_subtitle()}
	subtitle={t(siteConfig.title)}
	meta={[m.hero_dates(), m.hero_location(), m.hero_format()]}
>
	{#snippet actions()}
		<DownloadCFPButton variant="primary" />
	{/snippet}
</PageHeader>

<div class="page-end pt-14">
	<div class="container-readable">
		<CFPSection />
	</div>
</div>
