<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { organizers } from '$lib/data/organizers';
	import { pointSud } from '$lib/data/point-sud';
	import { participants } from '$lib/data/participants';
	import OrganizerCard from '$lib/components/participants/OrganizerCard.svelte';
	import PointSudCard from '$lib/components/participants/PointSudCard.svelte';
	import ParticipantGrid, {
		type Grouping
	} from '$lib/components/participants/ParticipantGrid.svelte';
	import FilterBar from '$lib/components/shared/FilterBar.svelte';
	import SegmentedControl from '$lib/components/shared/SegmentedControl.svelte';
	import NoResults from '$lib/components/shared/NoResults.svelte';
	import AffiliationMap from '$lib/components/participants/AffiliationMap.svelte';
	import { filterParticipants, uniqueParticipantCountries } from '$lib/utils/filter';
	import type { CountryCode } from '$lib/types';

	let query = $state('');
	let country = $state<CountryCode | null>(null);
	let language = $state<'en' | 'fr' | null>(null);
	let grouping = $state<Grouping>('none');

	const groupingOptions: Array<{ value: Grouping; label: string }> = $derived([
		{ value: 'none', label: m.directory_no_group() },
		{ value: 'alpha', label: m.directory_group_alpha() },
		{ value: 'country', label: m.directory_group_country() }
	]);

	const countries = uniqueParticipantCountries(participants);
	const filtered = $derived(filterParticipants(participants, { query, country, language }));

	function clearFilters() {
		query = '';
		country = null;
		language = null;
	}
</script>

<SEO
	title="{m.nav_participants()} | {siteConfig.shortTitle}"
	description={m.seo_participants_description()}
/>

<PageHeader
	title={m.nav_participants()}
	width="page"
	meta={[
		`${participants.length} ${m.glance_participants()}`,
		`${organizers.length} ${m.section_organisers()}`,
		`${countries.length} ${m.glance_countries()}`
	]}
/>

<div class="page-end pt-14">
	<div class="container-page">
		<!-- The convenors keep the editorial two-column card: four people whose
		     only distinction used to be one teal role line on an identical card. -->
		<section class="mb-16">
			<h2 class="text-section text-strong mb-8">
				{m.section_organisers()}
			</h2>
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{#each organizers as organizer (organizer.id)}
					<OrganizerCard {organizer} />
				{/each}
			</div>
		</section>

		{#if pointSud.length > 0}
			<section class="mb-16">
				<h2 class="text-section text-strong mb-2">
					{m.section_point_sud()}
				</h2>
				<p class="text-muted mb-8 text-sm">
					{m.section_point_sud_note()}
				</p>
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{#each pointSud as person (person.id)}
						<PointSudCard {person} />
					{/each}
				</div>
			</section>
		{/if}

		{#if participants.length > 0}
			<section class="mb-16">
				<h2 class="text-section text-strong mb-8">
					{m.section_participants()}
				</h2>
				<div class="mb-8">
					<FilterBar
						countLabel={m.filter_count_participants({
							visible: filtered.length,
							total: participants.length
						})}
						hasResults={filtered.length > 0}
						{countries}
						searchPlaceholder={m.participants_search_placeholder()}
						languageLabel={m.filter_language_label_participants()}
						bind:query
						bind:country
						bind:language
					>
						{#snippet trailing()}
							<SegmentedControl
								label={m.directory_group_label()}
								options={groupingOptions}
								bind:value={grouping}
							/>
						{/snippet}
					</FilterBar>
				</div>
				{#if filtered.length > 0}
					<ParticipantGrid participants={filtered} {grouping} />
				{:else}
					<NoResults message={m.participants_filter_no_results()} onclear={clearFilters} />
				{/if}
			</section>

			<section>
				<AffiliationMap />
			</section>
		{/if}
	</div>
</div>
