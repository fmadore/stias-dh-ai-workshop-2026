<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import BackToTop from '$lib/components/layout/BackToTop.svelte';

	let { children } = $props();

	onMount(() => {
		// Auto-detect browser language on first visit (only if not already on a /fr/ page)
		const hasVisited = sessionStorage.getItem('locale_detected');
		if (!hasVisited) {
			sessionStorage.setItem('locale_detected', '1');
			const browserLang = navigator.language || navigator.languages?.[0] || '';
			const pathname = base
				? window.location.pathname.slice(base.length) || '/'
				: window.location.pathname;
			const isAlreadyFr = pathname.startsWith('/fr');
			if (browserLang.startsWith('fr') && !isAlreadyFr) {
				window.location.href = `${base}/fr${pathname}`;
			}
		}
	});
</script>

<div
	class="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-50"
>
	<Navbar />
	<main class="flex-1 pt-16">
		{@render children()}
	</main>
	<Footer />
	<BackToTop />
</div>
