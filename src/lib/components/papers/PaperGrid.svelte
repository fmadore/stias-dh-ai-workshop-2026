<script lang="ts">
	import type { PaperListing } from '#lib/types/index.ts';
	import PaperCard from './PaperCard.svelte';

	let { presentations }: { presentations: PaperListing[] } = $props();
</script>

{#if presentations.length > 0}
	<!-- No ScrollReveal here: a filterable grid that fades its results in on
	     every keystroke is friction. Reveal the page around it instead. -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each presentations as presentation (presentation.id)}
			<PaperCard {presentation} />
		{/each}
	</div>
{/if}
