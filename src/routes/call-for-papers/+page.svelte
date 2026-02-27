<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import CFPSection from '$lib/components/cfp/CFPSection.svelte';
</script>

<SEO title="{m.nav_cfp()} | {siteConfig.shortTitle}" description={m.seo_cfp_description()} />

<div class="bg-cream">
	<PageHeader title={m.section_cfp()} />

	<div class="pb-16 sm:pb-20">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<CFPSection />
		</div>
	</div>
</div>
