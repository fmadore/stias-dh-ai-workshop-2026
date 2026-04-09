<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { t } from '$lib/utils/i18n';
	import Countdown from './Countdown.svelte';
	import { MapPin, Calendar } from '@lucide/svelte';
</script>

<section
	class="from-primary-800 via-primary-700 to-primary-900 grain relative overflow-hidden bg-gradient-to-br text-white"
>
	<!-- SVG noise texture overlay -->
	<div class="absolute inset-0 opacity-[0.04]" aria-hidden="true">
		<svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
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
		class="from-primary-900/40 absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t to-transparent"
	></div>

	<div class="relative z-10 mx-auto max-w-6xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
		<div class="mx-auto max-w-4xl text-center">
			<!-- Subtitle / Eyebrow -->
			<p
				class="text-primary-200/80 mb-6 font-sans text-sm font-light tracking-[0.25em] uppercase sm:text-base"
			>
				{m.hero_subtitle()}
			</p>

			<!-- Main title — big serif -->
			<h1 class="mb-8 text-4xl leading-[1.05] font-normal tracking-tight sm:text-5xl lg:text-7xl">
				{t(siteConfig.title)}
			</h1>

			<!-- Date & Location -->
			<div
				class="text-primary-100/70 mb-14 flex flex-col items-center justify-center gap-4 font-sans text-sm font-light sm:flex-row sm:text-base"
			>
				<span class="flex items-center gap-2">
					<Calendar size={16} class="text-secondary-400" />
					{m.hero_dates()}
				</span>
				<span class="text-primary-400/40 hidden sm:inline">&#x2022;</span>
				<span class="flex items-center gap-2">
					<MapPin size={16} class="text-secondary-400" />
					{m.hero_location()}
				</span>
			</div>

			<!-- Countdown glass card -->
			<div
				class="inline-block rounded-2xl border border-white/[0.08] bg-white/[0.07] px-8 py-6 backdrop-blur-sm sm:px-10 sm:py-8"
			>
				<Countdown />
			</div>
		</div>
	</div>
</section>
