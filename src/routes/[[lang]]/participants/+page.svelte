<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { organizers } from '$lib/data/organizers';
	import { participants } from '$lib/data/participants';
	import OrganizerCard from '$lib/components/participants/OrganizerCard.svelte';
	import ParticipantGrid from '$lib/components/participants/ParticipantGrid.svelte';
	import FilterBar from '$lib/components/shared/FilterBar.svelte';
	import { filterParticipants, uniqueParticipantCountries } from '$lib/utils/filter';

	let query = $state('');
	let country = $state<string | null>(null);
	let language = $state<'en' | 'fr' | null>(null);

	const countries = uniqueParticipantCountries(participants);
	const filtered = $derived(filterParticipants(participants, { query, country, language }));
</script>

<SEO
	title="{m.nav_participants()} | {siteConfig.shortTitle}"
	description={m.seo_participants_description()}
/>

<PageHeader title={m.nav_participants()} />

<div class="pb-20">
	<div class="container-readable max-w-5xl">
		<section class="mb-16">
			<ScrollReveal>
				<h2 class="text-section text-ink dark:text-surface-50 mb-8">
					{m.section_organisers()}
				</h2>
			</ScrollReveal>
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{#each organizers as organizer, i (organizer.id)}
					<ScrollReveal delay={i}>
						<OrganizerCard {organizer} />
					</ScrollReveal>
				{/each}
			</div>
		</section>

		{#if participants.length > 0}
			<section>
				<ScrollReveal>
					<h2 class="text-section text-ink dark:text-surface-50 mb-8">
						{m.section_participants()}
					</h2>
				</ScrollReveal>
				<ScrollReveal delay={1}>
					<div class="mb-8">
						<FilterBar
							totalCount={participants.length}
							visibleCount={filtered.length}
							{countries}
							searchPlaceholder={m.participants_search_placeholder()}
							bind:query
							bind:country
							bind:language
						/>
					</div>
				</ScrollReveal>
				{#if filtered.length > 0}
					<ParticipantGrid participants={filtered} />
				{:else}
					<p class="text-ink-muted dark:text-surface-400 py-12 text-center text-sm">
						{m.participants_filter_no_results()}
					</p>
				{/if}
			</section>
		{/if}
	</div>
</div>
