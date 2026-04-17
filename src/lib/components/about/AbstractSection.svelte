<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { t } from '$lib/utils/i18n';
	import { topicObjectives } from '$lib/data/topic-objectives';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
</script>

<section class="section-pad">
	<div class="container-readable">
		<ScrollReveal>
			<div class="mb-10">
				<span class="text-eyebrow mb-3 inline-block">{m.nav_about()}</span>
				<h2 class="text-section text-ink dark:text-surface-50">
					{m.section_about()}
				</h2>
			</div>
		</ScrollReveal>
		<div class="space-y-5">
			{#each topicObjectives as paragraph, i}
				<ScrollReveal delay={i}>
					<p class="text-prose text-ink-muted dark:text-surface-300 {i === 0 ? 'drop-cap' : ''}">
						{t(paragraph)}
					</p>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>
