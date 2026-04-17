<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Calendar, MapPin, Users } from '@lucide/svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	const keyItems = $derived([
		{ icon: Calendar, label: m.date_label(), value: m.hero_dates() },
		{ icon: MapPin, label: m.location_label(), value: m.hero_location() },
		{ icon: Users, label: m.format_label(), value: m.format_value() }
	]);
</script>

<section class="section-pad bg-cream">
	<div class="container-page">
		<ScrollReveal>
			<h2 class="text-section text-ink dark:text-surface-50 mb-10 text-center">
				{m.section_key_info()}
			</h2>
		</ScrollReveal>
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
			{#each keyItems as item, i}
				<ScrollReveal delay={i}>
					<div class="card border-secondary-500/70 border-l-[3px] p-6">
						<div class="flex items-start gap-4">
							<div class="text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0">
								<item.icon size={20} strokeWidth={1.75} />
							</div>
							<div>
								<h3 class="text-meta mb-1">{item.label}</h3>
								<p class="text-ink dark:text-surface-100 font-sans">{item.value}</p>
							</div>
						</div>
					</div>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>
