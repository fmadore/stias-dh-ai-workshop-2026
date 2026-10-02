<script lang="ts">
	import type { PaperSummary, ParticipantListing } from '$lib/types';
	import { t, localePath } from '$lib/utils/i18n';
	import { getPlacements } from '$lib/utils/placement';
	import Avatar from '$lib/components/shared/Avatar.svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { countryName } from '$lib/utils/country';

	let {
		participant,
		/** Their papers, resolved by the page's load rather than from the registries. */
		papers,
		placements = getPlacements()
	}: {
		participant: ParticipantListing;
		papers: PaperSummary[];
		placements?: ReturnType<typeof getPlacements>;
	} = $props();

	const presentations = $derived(papers);
	const href = $derived(localePath(`/participants/${participant.id}`));
</script>

<!--
	A directory card, not an editorial one. The bio moved to the individual
	page: 32 full-width rows with a 900px-wide bio beside a 112px portrait was
	roughly seven screens of scrolling with no rhythm and nothing to scan by.
	What the card carries now is what people scan for — name, place, paper, slot.
-->
<article class="card card-hover flex h-full flex-col p-5">
	<Avatar name={participant.name} image={participant.image} size="small" decorative />

	<h3 class="text-card-title text-strong mt-3.5">
		<a {href} class="card-link link-quiet">{participant.name}</a>
	</h3>

	<p class="text-muted text-caption mt-1 leading-snug">
		{t(participant.affiliation)} · {countryName(participant.country, getLocale())}
	</p>

	{#each presentations as presentation (presentation.id)}
		{@const placement = placements.get(presentation.id)}
		<p
			class="border-accent/55 text-link text-caption mt-3 border-l-2 pl-2.5 leading-snug"
			lang={presentation.language}
		>
			{presentation.title}
		</p>
		{#if placement}
			<p class="text-eyebrow mt-2">{placement.sessionLabel} · {placement.slotLabel}</p>
		{/if}
	{/each}
</article>
