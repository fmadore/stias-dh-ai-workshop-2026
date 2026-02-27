<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { t } from '$lib/utils/i18n';
	import { topicObjectives } from '$lib/data/topic-objectives';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
</script>

<section class="py-16 sm:py-20">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<ScrollReveal>
			<h2 class="text-2xl sm:text-3xl mb-8 text-surface-900 dark:text-surface-50">
				{m.section_about()}
			</h2>
		</ScrollReveal>
		<div class="space-y-4">
			{#each topicObjectives as paragraph, i}
				<ScrollReveal delay={i}>
					<p
						class="text-surface-700 dark:text-surface-300 leading-relaxed font-sans font-light text-base sm:text-lg {i ===
						0
							? 'drop-cap'
							: ''}"
					>
						{t(paragraph)}
					</p>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>
