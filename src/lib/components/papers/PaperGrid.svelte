<script lang="ts">
	import type { Presentation } from '$lib/types';
	import PaperCard from './PaperCard.svelte';

	let { presentations }: { presentations: Presentation[] } = $props();
</script>

{#if presentations.length > 0}
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each presentations as presentation (presentation.id)}
			<PaperCard {presentation} />
		{/each}
	</div>
{/if}
