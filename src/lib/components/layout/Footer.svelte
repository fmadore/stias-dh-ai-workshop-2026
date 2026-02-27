<script lang="ts">
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import { organizers } from '$lib/data/organizers';

	const logos = [
		{
			src: `${base}/images/logos/point-sud-logo.svg`,
			alt: 'Point Sud',
			url: 'https://www.pointsud.org'
		},
		{
			src: `${base}/images/logos/STIAS.png`,
			alt: 'STIAS — Stellenbosch Institute for Advanced Study',
			url: 'https://stias.ac.za'
		},
		{
			src: `${base}/images/logos/uni-bayreuth-africa-multiple-logo.jpeg`,
			alt: 'University of Bayreuth / Africa Multiple',
			url: 'https://www.africamultiple.uni-bayreuth.de/en/index.html'
		},
		{
			src: `${base}/images/logos/King's_College_London_logo.svg`,
			alt: "King's College London",
			url: 'https://www.kcl.ac.uk'
		},
		{
			src: `${base}/images/logos/SADiLaR-1024x487.png`,
			alt: 'SADiLaR',
			url: 'https://sadilar.org'
		}
	];
</script>

<footer class="relative bg-primary-900 dark:bg-surface-950 text-white mt-auto overflow-hidden">
	<!-- Subtle grain -->
	<div class="grain absolute inset-0"></div>

	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
		<!-- Institutional Logos -->
		<div>
			<p
				class="text-center text-sm font-sans font-light text-primary-200/60 dark:text-surface-500 uppercase tracking-widest mb-8"
			>
				{m.footer_supported_by()}
			</p>
			<div class="flex flex-wrap items-center justify-center gap-6">
				{#each logos as logo}
					<a
						href={logo.url}
						target="_blank"
						rel="noopener noreferrer"
						class="opacity-70 hover:opacity-100 transition-opacity bg-white/95 rounded-lg px-4 py-2"
					>
						<img src={logo.src} alt={logo.alt} class="h-10 w-auto object-contain" />
					</a>
				{/each}
			</div>
		</div>

		<div class="mt-10 pt-8 border-t border-primary-800/50 dark:border-surface-800 text-center">
			<p class="text-sm text-primary-300/60 dark:text-surface-500 font-light">
				&copy; {new Date().getFullYear()}
				{organizers.map((o) => o.name).join(', ')}. {m.footer_rights()}
			</p>
		</div>
	</div>
</footer>
