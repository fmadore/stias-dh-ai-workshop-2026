<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Calendar, MapPin, Users } from 'lucide-svelte';
</script>

<section class="py-16 sm:py-20 bg-surface-50 dark:bg-surface-900">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<h2 class="text-2xl sm:text-3xl font-bold text-center mb-12">{m.section_key_info()}</h2>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
			<div class="bg-white dark:bg-surface-800 rounded-xl p-6 text-center shadow-sm border border-surface-200 dark:border-surface-700">
				<div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/10 text-primary-500 mb-4">
					<Calendar size={24} />
				</div>
				<h3 class="font-semibold text-lg mb-2">{m.date_label()}</h3>
				<p class="text-surface-600 dark:text-surface-300">{m.hero_dates()}</p>
			</div>

			<div class="bg-white dark:bg-surface-800 rounded-xl p-6 text-center shadow-sm border border-surface-200 dark:border-surface-700">
				<div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/10 text-primary-500 mb-4">
					<MapPin size={24} />
				</div>
				<h3 class="font-semibold text-lg mb-2">{m.location_label()}</h3>
				<p class="text-surface-600 dark:text-surface-300">{m.hero_location()}</p>
			</div>

			<div class="bg-white dark:bg-surface-800 rounded-xl p-6 text-center shadow-sm border border-surface-200 dark:border-surface-700">
				<div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/10 text-primary-500 mb-4">
					<Users size={24} />
				</div>
				<h3 class="font-semibold text-lg mb-2">{m.format_label()}</h3>
				<p class="text-surface-600 dark:text-surface-300">{m.format_value()}</p>
			</div>
		</div>
	</div>
</section>
