<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { t } from '$lib/utils/i18n';
	import Countdown from './Countdown.svelte';
	import { MapPin, Calendar } from '@lucide/svelte';
</script>

<section
	class="from-primary-900 via-primary-800 to-primary-950 grain relative overflow-hidden bg-gradient-to-br text-white"
>
	<!-- SVG noise texture overlay -->
	<div class="absolute inset-0 opacity-[0.05]" aria-hidden="true">
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

	<!-- Single soft radial accent -->
	<div
		class="pointer-events-none absolute -top-1/3 -right-1/4 h-[140%] w-[70%] rounded-full opacity-[0.18]"
		style="background: radial-gradient(closest-side, var(--color-secondary-500), transparent 70%);"
		aria-hidden="true"
	></div>

	<div
		class="container-wide relative z-10 py-[clamp(5rem,11vw,10rem)] sm:py-[clamp(6rem,12vw,12rem)]"
	>
		<div class="mx-auto max-w-4xl text-center">
			<p class="text-primary-100/80 text-eyebrow mb-6 !text-[color:var(--color-primary-200)]">
				{m.hero_subtitle()}
			</p>

			<h1 class="text-display mb-8 text-balance text-white">
				{t(siteConfig.title)}
			</h1>

			<div
				class="text-primary-100/80 mb-14 flex flex-col items-center justify-center gap-3 text-sm font-light sm:flex-row sm:gap-6 sm:text-base"
			>
				<span class="inline-flex items-center gap-2">
					<Calendar size={16} class="text-secondary-400" />
					{m.hero_dates()}
				</span>
				<span class="text-primary-300/40 hidden sm:inline" aria-hidden="true">·</span>
				<span class="inline-flex items-center gap-2">
					<MapPin size={16} class="text-secondary-400" />
					{m.hero_location()}
				</span>
			</div>

			<div
				class="inline-block rounded-2xl border border-white/[0.08] bg-white/[0.06] px-8 py-6 backdrop-blur-[2px] sm:px-10 sm:py-8"
			>
				<Countdown />
			</div>
		</div>
	</div>
</section>
