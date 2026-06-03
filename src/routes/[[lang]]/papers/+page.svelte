<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { presentations } from '$lib/data/presentations';
	import PaperGrid from '$lib/components/papers/PaperGrid.svelte';
	import PaperFilter from '$lib/components/papers/PaperFilter.svelte';
	import { filterPresentations } from '$lib/utils/paper-filter';

	const sorted = [...presentations].sort((a, b) =>
		a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
	);

	let query = $state('');
	let country = $state<string | null>(null);
	let language = $state<'en' | 'fr' | null>(null);

	const filtered = $derived(filterPresentations(sorted, { query, country, language }));
</script>

<SEO title="{m.nav_papers()} | {siteConfig.shortTitle}" description={m.seo_papers_description()} />

<PageHeader title={m.nav_papers()} subtitle={m.papers_page_subtitle()} />

<div class="pb-20">
	<div class="container-readable max-w-5xl">
		{#if sorted.length > 0}
			<ScrollReveal>
				<div class="mb-8">
					<PaperFilter
						presentations={sorted}
						visibleCount={filtered.length}
						bind:query
						bind:country
						bind:language
					/>
				</div>
			</ScrollReveal>
			{#if filtered.length > 0}
				<PaperGrid presentations={filtered} />
			{:else}
				<p class="text-ink-muted dark:text-surface-400 py-12 text-center text-sm">
					{m.papers_filter_no_results()}
				</p>
			{/if}
		{/if}
	</div>
</div>
