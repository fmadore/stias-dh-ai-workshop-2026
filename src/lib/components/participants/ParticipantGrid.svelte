<script lang="ts">
	import type { Participant } from '$lib/types';
	import * as m from '$lib/paraglide/messages';
	import ParticipantCard from './ParticipantCard.svelte';
	import { getPlacements } from '$lib/utils/placement';
	import { getLocale } from '$lib/paraglide/runtime';
	import { countryName } from '$lib/utils/country';

	let { participants }: { participants: Participant[] } = $props();

	type Grouping = 'none' | 'alpha' | 'country';
	let grouping = $state<Grouping>('none');

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

	const options: Array<{ value: Grouping; label: string }> = [
		{ value: 'none', label: m.directory_no_group() },
		{ value: 'alpha', label: m.directory_group_alpha() },
		{ value: 'country', label: m.directory_group_country() }
	];
</script>

{#if participants.length > 0}
	<!-- Something to scan by. The old single column had no alphabet, no country
	     grouping, and no way to see who was presenting in which session. -->
	<div class="mb-6 flex flex-wrap items-center gap-2">
		<span class="text-meta mr-1">{m.directory_group_label()}</span>
		{#each options as option (option.value)}
			<button
				type="button"
				class="group-pill"
				class:is-active={grouping === option.value}
				aria-pressed={grouping === option.value}
				onclick={() => (grouping = option.value)}
			>
				{option.label}
			</button>
		{/each}
	</div>

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

<style>
	.group-pill {
		font-family: var(--font-sans);
		font-size: var(--text-caption);
		font-weight: 500;
		letter-spacing: 0.04em;
		color: var(--ink-subtle);
		background-color: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-full);
		min-height: 2.75rem;
		padding: 0.45rem 0.9rem;
		cursor: pointer;
		transition:
			background-color var(--duration-fast) var(--ease-standard),
			color var(--duration-fast) var(--ease-standard),
			border-color var(--duration-fast) var(--ease-standard);
	}

	.group-pill:hover:not(.is-active) {
		color: var(--ink-strong);
		border-color: var(--border-strong);
	}

	.group-pill.is-active {
		background-color: var(--color-primary-500);
		border-color: var(--color-primary-500);
		color: #fff;
	}
</style>
