<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { localePath } from '$lib/utils/i18n';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	/** Counted at prerender (`glanceStats`), so the page does not ship what it counts. */
	let { glance }: { glance: { papers: number; participants: number; countries: number } } =
		$props();

	// Replaces Key Information, which restated the hero's dates and location.
	// Every number here already exists in the data.
	//
	// Each count now goes where the thing it counts actually is: these were the
	// three most clickable-looking objects on the page and the only inert ones.
	// "Format" stays plain — there is no page that is the hybrid format, and a
	// link invented to even up a row is worse than a row that is uneven.
	const stats = $derived([
		{ value: String(glance.papers), label: m.glance_papers(), href: localePath('/papers') },
		{
			value: String(glance.participants),
			label: m.glance_participants(),
			href: localePath('/participants')
		},
		{
			// Over people, not papers — see `glanceStats` for why the two differ.
			value: String(glance.countries),
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
								<a href={stat.href} class="stat-link link-underline">{stat.value}</a>
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
	/* The programme's resting affordance (.link-underline, app.css), with the
	   rule stepped up to 2px: 1px under a 48px serif numeral reads as a
	   hairline artefact. */
	.stat-link {
		--link-underline-weight: 2px;
		--link-underline-offset: 0.16em;
		/* SC 2.5.8's floor on the narrow axis. The figures are already 47px tall
		   and 35–38px wide at "25" and "33", so this binds on exactly one of
		   them: "17" set 21.4px at 375px and 320px, which is the width a
		   two-digit tabular numeral gives you and no amount of type scale fixes.
		   Centring only takes effect once the digits are narrower than the
		   floor, so the other two are untouched. */
		display: inline-block;
		min-width: 1.5rem;
		text-align: center;
	}
</style>
