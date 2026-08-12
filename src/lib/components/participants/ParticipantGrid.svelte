<script lang="ts" module>
	export type Grouping = 'none' | 'alpha' | 'country';
</script>

<script lang="ts">
	import type { Participant } from '$lib/types';
	import ParticipantCard from './ParticipantCard.svelte';
	import { getPlacements } from '$lib/utils/placement';
	import { getLocale } from '$lib/paraglide/runtime';
	import { countryName } from '$lib/utils/country';

	// The switch itself lives in the filter row, alongside the other list
	// controls — this component only consumes the choice.
	let { participants, grouping = 'none' }: { participants: Participant[]; grouping?: Grouping } =
		$props();

	// Built once for the whole grid rather than walking the programme per card.
	const placements = $derived(getPlacements());

	/** Surname initial — the list is already sorted by it upstream. */
	function initial(participant: Participant): string {
		const surname = participant.name.trim().split(/\s+/).at(-1) ?? participant.name;
		return surname
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.charAt(0)
			.toUpperCase();
	}

	const groups = $derived.by((): Array<{ key: string; items: Participant[] }> => {
		if (grouping === 'none') return [{ key: '', items: participants }];

		// A plain record, not a Map: svelte/prefer-svelte-reactivity flags any
		// mutable Map in a component, and this is a derived value, not state.
		const keyed: Record<string, Participant[]> = {};
		for (const participant of participants) {
			const key =
				grouping === 'alpha' ? initial(participant) : countryName(participant.country, getLocale());
			(keyed[key] ??= []).push(participant);
		}
		return Object.entries(keyed)
			.map(([key, items]) => ({ key, items }))
			.sort((a, b) => a.key.localeCompare(b.key));
	});
</script>

{#if participants.length > 0}
	{#each groups as group (group.key)}
		<section class={group.key ? 'mb-10' : ''}>
			{#if group.key}
				<h3 class="border-subtle text-eyebrow mb-4 border-b pb-2">{group.key}</h3>
			{/if}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each group.items as participant (participant.id)}
					<ParticipantCard {participant} {placements} />
				{/each}
			</div>
		</section>
	{/each}
{/if}
