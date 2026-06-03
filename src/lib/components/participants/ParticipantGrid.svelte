<script lang="ts">
	import type { Participant } from '$lib/types';
	import ParticipantCard from './ParticipantCard.svelte';

	let { participants }: { participants: Participant[] } = $props();
</script>

{#if participants.length > 0}
	<div class="flex flex-col gap-6">
		{#each participants as participant}
			<ParticipantCard {participant} />
		{/each}
	</div>
{/if}
