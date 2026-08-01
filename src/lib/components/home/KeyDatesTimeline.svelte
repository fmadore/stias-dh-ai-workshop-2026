<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { getMilestones } from '$lib/utils/milestones';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { Check } from '@lucide/svelte';

	// Replaces Quick Links, which restated three navbar items and said
	// "Learn more" three times. The current step is marked, so the band
	// tells the reader where the workshop actually is.
	const milestones = $derived(getMilestones());
</script>

<section class="section-pad bg-cream-dark">
	<div class="container-page">
		<ScrollReveal>
			<div class="mb-10">
				<span class="text-eyebrow mb-3 inline-block">{m.key_dates()}</span>
			</div>

			<ol class="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
				{#each milestones as milestone (milestone.id)}
					<li
						class="border-subtle relative flex flex-col gap-2 border p-6
							{milestone.past ? 'bg-sunken' : 'bg-raised'}
							{milestone.next ? 'border-t-accent border-t-2' : ''}
						"
					>
						<div class="flex h-5 items-center gap-1.5">
							{#if milestone.past}
								<Check size={13} strokeWidth={2.5} class="text-primary-600" aria-hidden="true" />
								<span class="text-meta">{m.milestone_done()}</span>
							{:else if milestone.next}
								<span class="text-eyebrow">{m.milestone_next()}</span>
							{/if}
						</div>

						<div class="text-card-title text-strong">{milestone.label}</div>
						<time datetime={milestone.datetime} class="text-muted text-caption">
							{milestone.value}
						</time>
					</li>
				{/each}
			</ol>
		</ScrollReveal>
	</div>
</section>
