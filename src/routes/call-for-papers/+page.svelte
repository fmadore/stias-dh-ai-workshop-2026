<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import CFPSection from '$lib/components/cfp/CFPSection.svelte';
</script>

<svelte:head>
	<title>{m.nav_cfp()} | {siteConfig.shortTitle}</title>
</svelte:head>

<div class="py-8 sm:py-12">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<h1 class="text-3xl sm:text-4xl font-bold mb-8">{m.section_cfp()}</h1>
		<CFPSection />
	</div>
</div>
