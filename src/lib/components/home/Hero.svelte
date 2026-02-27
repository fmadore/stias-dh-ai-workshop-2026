<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { t } from '$lib/utils/i18n';
	import Countdown from './Countdown.svelte';
	import { MapPin, Calendar } from 'lucide-svelte';
</script>

<section class="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 text-white">
	<!-- Subtle pattern overlay -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute inset-0" style="background-image: radial-gradient(circle at 25px 25px, white 1px, transparent 0); background-size: 50px 50px;"></div>
	</div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
		<div class="text-center max-w-4xl mx-auto">
			<p class="text-sm sm:text-base font-medium text-primary-100 uppercase tracking-widest mb-4">
				{m.hero_subtitle()}
			</p>
			<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
				{t(siteConfig.title)}
			</h1>

			<div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-primary-100 mb-10">
				<span class="flex items-center gap-2">
					<Calendar size={18} />
					{m.hero_dates()}
				</span>
				<span class="hidden sm:inline text-primary-300">|</span>
				<span class="flex items-center gap-2">
					<MapPin size={18} />
					{m.hero_location()}
				</span>
			</div>

			<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 inline-block">
				<Countdown />
			</div>
		</div>
	</div>
</section>
