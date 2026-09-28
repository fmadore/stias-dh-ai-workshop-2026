<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import PaperGrid from '$lib/components/papers/PaperGrid.svelte';
	import FilterBar from '$lib/components/shared/FilterBar.svelte';
	import NoResults from '$lib/components/shared/NoResults.svelte';
	import { filterPresentations, uniquePaperCountries } from '$lib/utils/filter';
	import { createUrlFilters } from '$lib/utils/url-filters.svelte';
	import { fullText, loadFullText } from '$lib/utils/search-text.svelte';

	let { data } = $props();

	// Sorted by title and trimmed to what a card shows, by the server load.
	const sorted = $derived(data.papers);

	const countries = $derived(uniquePaperCountries(sorted));
	const filters = createUrlFilters(() => countries);
	const filtered = $derived(
		filterPresentations(
			sorted,
			{
				query: filters.query,
				country: filters.country,
				language: filters.language
			},
			fullText.current?.papers
		)
	);

	// A query restored from the URL needs the abstracts as much as a typed one.
	$effect(() => {
		if (filters.query) loadFullText();
	});

	function clearFilters() {
		filters.reset();
	}
</script>

<SEO title="{m.nav_papers()} | {siteConfig.shortTitle}" description={m.seo_papers_description()} />

<!-- Title and count used to live in two different places; the header band
     carries both now. -->
<PageHeader
	title={m.nav_papers()}
	subtitle={m.papers_page_subtitle()}
	width="page"
	meta={[
		`${sorted.length} ${m.glance_papers()}`,
		`${countries.length} ${m.glance_countries()}`,
		'EN · FR'
	]}
/>

<div class="page-end page-body">
	<div class="container-page">
		{#if sorted.length > 0}
			<div class="mb-8">
				<FilterBar
					countLabel={m.filter_count_papers({ visible: filtered.length, total: sorted.length })}
					hasResults={filtered.length > 0}
					{countries}
					searchPlaceholder={m.papers_search_placeholder()}
					bind:query={filters.query}
					bind:country={filters.country}
					bind:language={filters.language}
					onsearchfocus={loadFullText}
				/>
			</div>
			{#if filtered.length > 0}
				<PaperGrid presentations={filtered} />
			{:else}
				<NoResults message={m.papers_filter_no_results()} onclear={clearFilters} />
			{/if}
		{/if}
	</div>
</div>
