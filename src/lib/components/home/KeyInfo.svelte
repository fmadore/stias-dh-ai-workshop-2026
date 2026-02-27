<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Calendar, MapPin, Users } from 'lucide-svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	const keyItems = $derived([
		{ icon: Calendar, label: m.date_label(), value: m.hero_dates() },
		{ icon: MapPin, label: m.location_label(), value: m.hero_location() },
		{ icon: Users, label: m.format_label(), value: m.format_value() }
	]);
</script>

<section class="py-16 sm:py-20 bg-cream">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<ScrollReveal>
			<h2 class="text-2xl sm:text-3xl text-center mb-12 text-surface-900 dark:text-surface-50">{m.section_key_info()}</h2>
		</ScrollReveal>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
			{#each keyItems as item, i}
				<ScrollReveal delay={i}>
					<div class="relative bg-white dark:bg-surface-800/80 rounded-xl p-6 border-l-4 border-l-secondary-400 border-t-0 border-r-0 border-b-0 shadow-sm hover:shadow-md transition-shadow">
						<div class="flex items-start gap-4">
							<div class="flex-shrink-0 text-primary-500 dark:text-primary-400 mt-0.5">
								<item.icon size={22} />
							</div>
							<div>
								<h3 class="font-sans font-semibold text-sm uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-1">{item.label}</h3>
								<p class="text-surface-800 dark:text-surface-200 font-sans">{item.value}</p>
							</div>
						</div>
					</div>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>
