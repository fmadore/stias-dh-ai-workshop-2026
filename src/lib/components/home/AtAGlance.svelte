<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { participants } from '$lib/data/participants';
	import { presentations } from '$lib/data/presentations';
	import { uniquePaperCountries } from '$lib/utils/filter';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	// Replaces Key Information, which restated the hero's dates and location.
	// Every number here already exists in the data.
	const stats = $derived([
		{ value: String(presentations.length), label: m.glance_papers() },
		{ value: String(participants.length), label: m.glance_participants() },
		{ value: String(uniquePaperCountries(presentations).length), label: m.glance_countries() },
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
							{stat.value}
						</dd>
					</div>
				{/each}
			</dl>
		</ScrollReveal>
	</div>
</section>
