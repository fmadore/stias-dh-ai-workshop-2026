<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { t } from '$lib/utils/i18n';
	import Countdown from './Countdown.svelte';
	import { MapPin, Calendar } from 'lucide-svelte';
</script>

<section
	class="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white grain"
>
	<!-- SVG noise texture overlay -->
	<div class="absolute inset-0 opacity-[0.04]" aria-hidden="true">
		<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
			<filter id="heroNoise">
				<feTurbulence
					type="fractalNoise"
					baseFrequency="0.65"
					numOctaves="3"
					stitchTiles="stitch"
				/>
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#heroNoise)" opacity="1" />
		</svg>
	</div>

	<!-- Warm gradient accent at bottom -->
	<div
		class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-900/40 to-transparent"
	></div>

	<div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 lg:py-44">
		<div class="text-center max-w-4xl mx-auto">
			<!-- Subtitle / Eyebrow -->
			<p
				class="text-sm sm:text-base font-sans font-light text-primary-200/80 uppercase tracking-[0.25em] mb-6"
			>
				{m.hero_subtitle()}
			</p>

			<!-- Main title — big serif -->
			<h1 class="text-4xl sm:text-5xl lg:text-7xl font-normal leading-[1.05] mb-8 tracking-tight">
				{t(siteConfig.title)}
			</h1>

			<!-- Date & Location -->
			<div
				class="flex flex-col sm:flex-row items-center justify-center gap-4 text-primary-100/70 font-sans font-light text-sm sm:text-base mb-14"
			>
				<span class="flex items-center gap-2">
					<Calendar size={16} class="text-secondary-400" />
					{m.hero_dates()}
				</span>
				<span class="hidden sm:inline text-primary-400/40">&#x2022;</span>
				<span class="flex items-center gap-2">
					<MapPin size={16} class="text-secondary-400" />
					{m.hero_location()}
				</span>
			</div>

			<!-- Countdown glass card -->
			<div
				class="inline-block bg-white/[0.07] backdrop-blur-sm rounded-2xl px-8 py-6 sm:px-10 sm:py-8 border border-white/[0.08]"
			>
				<Countdown />
			</div>
		</div>
	</div>
</section>
