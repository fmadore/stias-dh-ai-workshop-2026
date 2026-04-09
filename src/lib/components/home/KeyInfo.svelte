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

<section class="bg-cream py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<ScrollReveal>
			<h2 class="text-surface-900 dark:text-surface-50 mb-12 text-center text-2xl sm:text-3xl">
				{m.section_key_info()}
			</h2>
		</ScrollReveal>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
			{#each keyItems as item, i}
				<ScrollReveal delay={i}>
					<div
						class="dark:bg-surface-800/80 border-l-secondary-400 relative rounded-xl border-t-0 border-r-0 border-b-0 border-l-4 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
					>
						<div class="flex items-start gap-4">
							<div class="text-primary-500 dark:text-primary-400 mt-0.5 flex-shrink-0">
								<item.icon size={22} />
							</div>
							<div>
								<h3
									class="text-surface-400 dark:text-surface-500 mb-1 font-sans text-sm font-semibold tracking-wider uppercase"
								>
									{item.label}
								</h3>
								<p class="text-surface-800 dark:text-surface-200 font-sans">{item.value}</p>
							</div>
						</div>
					</div>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>
