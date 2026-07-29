<script lang="ts">
	import type { Presentation } from '$lib/types';
	import PaperCard from './PaperCard.svelte';
	import { getPlacements } from '$lib/utils/placement';

	let { presentations }: { presentations: Presentation[] } = $props();

	// Built once for the whole grid rather than walking the programme per card.
	const placements = $derived(getPlacements());
</script>

{#if presentations.length > 0}
	<!-- No ScrollReveal here: a filterable grid that fades its results in on
	     every keystroke is friction. Reveal the page around it instead. -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each presentations as presentation (presentation.id)}
			<PaperCard {presentation} {placements} />
		{/each}
	</div>
{/if}
