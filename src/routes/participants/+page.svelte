<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { organizers } from '$lib/data/organizers';
	import { participants } from '$lib/data/participants';
	import OrganizerCard from '$lib/components/participants/OrganizerCard.svelte';
	import ParticipantGrid from '$lib/components/participants/ParticipantGrid.svelte';
</script>

<svelte:head>
	<title>{m.nav_participants()} | {siteConfig.shortTitle}</title>
</svelte:head>

<div class="py-8 sm:py-12">
	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Organisers -->
		<section class="mb-16">
			<h1 class="text-3xl sm:text-4xl font-bold mb-8">{m.section_organisers()}</h1>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{#each organizers as organizer}
					<OrganizerCard {organizer} />
				{/each}
			</div>
		</section>

		<!-- Participants -->
		{#if participants.length > 0}
			<section>
				<h2 class="text-2xl sm:text-3xl font-bold mb-8">{m.section_participants()}</h2>
				<ParticipantGrid {participants} />
			</section>
		{/if}
	</div>
</div>
