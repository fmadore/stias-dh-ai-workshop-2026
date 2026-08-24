<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { t } from '$lib/utils/i18n';
	import { topicObjectives } from '$lib/data/topic-objectives';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
</script>

<section class="section-pad">
	<div class="container-readable">
		<!-- One reveal around the section, not one per paragraph. Each paragraph
		     used to carry delay={i}, so at 120ms a step the last one arrived
		     ~840ms after entering view — prose that fades in as you reach it. -->
		<ScrollReveal>
			<!-- No eyebrow: it was `m.nav_about()`, which is also this page's h1.
			     On the home page the same section keeps its label, because there it
			     names which section you are in. Here it named the page you are on. -->
			<div class="mb-10">
				<h2 class="text-section text-strong">
					{m.section_about()}
				</h2>
			</div>
			<div class="space-y-5">
				{#each topicObjectives as paragraph, i (i)}
					<p class="text-prose {i === 0 ? 'drop-cap' : ''}">
						{t(paragraph)}
					</p>
				{/each}
			</div>
		</ScrollReveal>
	</div>
</section>
