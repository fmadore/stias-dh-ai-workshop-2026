<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { presentations } from '$lib/data/presentations';
	import PaperGrid from '$lib/components/papers/PaperGrid.svelte';
	import FilterBar from '$lib/components/shared/FilterBar.svelte';
	import { filterPresentations, uniquePaperCountries } from '$lib/utils/filter';
	import type { CountryCode } from '$lib/types';

	const sorted = [...presentations].sort((a, b) =>
		a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
	);

	let query = $state('');
	let country = $state<CountryCode | null>(null);
	let language = $state<'en' | 'fr' | null>(null);

	const countries = uniquePaperCountries(sorted);
	const filtered = $derived(filterPresentations(sorted, { query, country, language }));
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

<div class="page-end pt-14">
	<div class="container-page">
		{#if sorted.length > 0}
			<div class="mb-8">
				<FilterBar
					totalCount={sorted.length}
					visibleCount={filtered.length}
					{countries}
					searchPlaceholder={m.papers_search_placeholder()}
					bind:query
					bind:country
					bind:language
				/>
			</div>
			{#if filtered.length > 0}
				<PaperGrid presentations={filtered} />
			{:else}
				<p class="text-muted py-12 text-center text-sm">
					{m.papers_filter_no_results()}
				</p>
			{/if}
		{/if}
	</div>
</div>
