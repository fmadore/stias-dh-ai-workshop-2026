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
	import { filterPeople, uniquePersonCountries } from '$lib/utils/filter';
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

	// One directory, three card treatments — not three directories. The filter
	// used to narrow the participants array alone while the two sections above it
	// rendered raw, so searching a convenor's name reported "1 of 33" with the
	// convenor visible and unmatched, and the "no results" line rendered below
	// seven people who were still on screen.
	const everyone = [...organizers, ...pointSud, ...participants];
	const countries = uniquePersonCountries(everyone);

	const options = $derived({ query, country, language });
	const shownOrganizers = $derived(filterPeople(organizers, options));
	const shownPointSud = $derived(filterPeople(pointSud, options));
	const shownParticipants = $derived(filterPeople(participants, options));
	const shownCount = $derived(
		shownOrganizers.length + shownPointSud.length + shownParticipants.length
	);

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

<div class="page-end page-body">
	<div class="container-page">
		<!-- The controls lead, because they now govern all three sections rather
		     than the last one. -->
		<div class="mb-8">
			<FilterBar
				countLabel={m.filter_count_people({ visible: shownCount, total: everyone.length })}
				hasResults={shownCount > 0}
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

		<div class="block-flow">
			{#if shownCount === 0}
				<NoResults message={m.participants_filter_no_results()} onclear={clearFilters} />
			{:else}
				<!-- The convenors keep the editorial two-column card: four people whose
			     only distinction used to be one teal role line on an identical card. -->
				{#if shownOrganizers.length > 0}
					<section>
						<h2 class="text-section text-strong mb-8">
							{m.section_organisers()}
						</h2>
						<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{#each shownOrganizers as organizer (organizer.id)}
								<OrganizerCard {organizer} />
							{/each}
						</div>
					</section>
				{/if}

				{#if shownPointSud.length > 0}
					<section>
						<h2 class="text-section text-strong mb-2">
							{m.section_point_sud()}
						</h2>
						<p class="text-muted mb-8 text-sm">
							{m.section_point_sud_note()}
						</p>
						<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{#each shownPointSud as person (person.id)}
								<PointSudCard {person} />
							{/each}
						</div>
					</section>
				{/if}

				{#if shownParticipants.length > 0}
					<section>
						<h2 class="text-section text-strong mb-8">
							{m.section_participants()}
						</h2>
						<ParticipantGrid participants={shownParticipants} {grouping} />
					</section>
				{/if}
			{/if}

			<!-- Outside the filter: the map is a statement about every affiliation the
		     workshop brings together, and it carries its own selection control.
		     The id is the landing point for the home page's countries figure —
		     a number whose evidence is this map, not the grid above it. -->
			<section id="affiliations">
				<AffiliationMap />
			</section>
		</div>
	</div>
</div>
