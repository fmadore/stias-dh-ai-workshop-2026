<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { participants } from '$lib/data/participants';
	import { organizers } from '$lib/data/organizers';
	import { pointSud } from '$lib/data/point-sud';
	import { presentations } from '$lib/data/presentations';
	import { uniquePersonCountries } from '$lib/utils/filter';
	import { localePath } from '$lib/utils/i18n';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	// Replaces Key Information, which restated the hero's dates and location.
	// Every number here already exists in the data.
	//
	// Each count now goes where the thing it counts actually is: these were the
	// three most clickable-looking objects on the page and the only inert ones.
	// "Format" stays plain — there is no page that is the hybrid format, and a
	// link invented to even up a row is worse than a row that is uneven.
	const stats = $derived([
		{ value: String(presentations.length), label: m.glance_papers(), href: localePath('/papers') },
		{
			value: String(participants.length),
			label: m.glance_participants(),
			href: localePath('/participants')
		},
		{
			// Counted over people, not papers. This figure links to the affiliation
			// map, which plots where the 39 people work — and paper countries are a
			// different set: Mali is here only because Point Sud's representative
			// is, and he presents nothing. Counting papers made this read 16 while
			// the page it points at said 17.
			value: String(uniquePersonCountries([...organizers, ...pointSud, ...participants]).length),
			label: m.glance_countries(),
			href: `${localePath('/participants')}#affiliations`
		},
		{ value: m.format_value(), label: m.glance_format(), text: true }
	]);
</script>

<section class="section-pad bg-cream">
	<div class="container-page">
		<ScrollReveal>
			<div class="mb-10">
				<span class="text-eyebrow mb-3 inline-block">{m.section_at_a_glance()}</span>
			</div>
			<dl class="border-subtle grid grid-cols-2 gap-x-6 gap-y-10 border-t pt-10 md:grid-cols-4">
				{#each stats as stat (stat.label)}
					<!-- Reversed so the number reads first while <dt> still precedes
					     <dd> in the DOM, as a description list requires. -->
					<div class="flex flex-col-reverse gap-2">
						<dt class="text-meta">{stat.label}</dt>
						<dd
							class="font-display text-strong m-0 leading-none {stat.text
								? 'text-2xl sm:text-3xl'
								: 'text-4xl tabular-nums sm:text-5xl'}"
						>
							{#if stat.href}
								<a href={stat.href} class="stat-link">{stat.value}</a>
							{:else}
								{stat.value}
							{/if}
						</dd>
					</div>
				{/each}
			</dl>
		</ScrollReveal>
	</div>
</section>

<style>
	/* The same resting affordance the programme carries: a faint teal underline
	   at a generous offset, going solid on hover and focus. The mixes are the
	   ones measured there — 65% light, 60% dark — because below that a resting
	   cue does not clear 3:1 and is not a cue. Thickness steps up with the type:
	   a 1px rule under a 48px serif numeral reads as a hairline artefact. */
	.stat-link {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: color-mix(in oklab, var(--color-primary-600) 65%, transparent);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.16em;
		transition:
			color var(--duration-fast) var(--ease-standard),
			text-decoration-color var(--duration-fast) var(--ease-standard);
	}
	:global(.dark) .stat-link {
		text-decoration-color: color-mix(in oklab, var(--color-primary-300) 60%, transparent);
	}
	.stat-link:hover,
	.stat-link:focus-visible {
		color: var(--color-primary-700);
		text-decoration-color: currentColor;
	}
	:global(.dark) .stat-link:hover,
	:global(.dark) .stat-link:focus-visible {
		color: var(--color-primary-300);
	}
</style>
