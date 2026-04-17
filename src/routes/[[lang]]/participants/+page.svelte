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
</script>

<SEO
	title="{m.nav_participants()} | {siteConfig.shortTitle}"
	description={m.seo_participants_description()}
/>

<PageHeader title={m.section_organisers()} />

<div class="pb-20">
	<div class="container-readable max-w-5xl">
		<section class="mb-16">
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{#each organizers as organizer, i}
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
					<ParticipantGrid {participants} />
				</ScrollReveal>
			</section>
		{/if}
	</div>
</div>
