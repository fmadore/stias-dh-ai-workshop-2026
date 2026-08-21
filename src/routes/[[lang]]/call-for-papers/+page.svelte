<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { cfpInfo } from '$lib/data/cfp';
	import { t, localePath } from '$lib/utils/i18n';
	import { isCfpOpen } from '$lib/utils/milestones';
	import { formatDate } from '$lib/utils/date';
	import { Archive, ArrowRight } from '@lucide/svelte';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import CFPSection from '$lib/components/cfp/CFPSection.svelte';
	import DownloadCFPButton from '$lib/components/cfp/DownloadCFPButton.svelte';

	// The call closed on 30 April 2026 and the page said so nowhere: it still
	// opened "We invite proposals…" and listed four addresses to send them to.
	// Derived, not asserted — the same rule the hero follows.
	const closed = $derived(!isCfpOpen());
	const closedOn = $derived(formatDate(cfpInfo.deadline));
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

<div class="page-end page-body">
	<div class="container-readable block-flow">
		{#if closed}
			<div class="callout">
				<Archive
					size={18}
					strokeWidth={1.75}
					class="text-accent-ink mt-0.5 shrink-0"
					aria-hidden="true"
				/>
				<div>
					<p class="text-body measure-prose text-sm leading-relaxed">
						{m.cfp_closed_notice({ date: closedOn })}
					</p>
					<a href={localePath('/papers')} class="link-arrow mt-2 inline-flex text-sm">
						{m.cfp_closed_cta()}
						<ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
					</a>
				</div>
			</div>
		{/if}
		<CFPSection />
	</div>
</div>
