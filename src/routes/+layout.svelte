<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import BackToTop from '$lib/components/layout/BackToTop.svelte';

	let { children } = $props();

	// Keep <html lang> in sync after client-side navigation — the server only
	// sets it on the initially requested document (see hooks.server.ts).
	$effect(() => {
		document.documentElement.lang = page.params.lang || 'en';
	});

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

<div class="bg-cream flex min-h-screen flex-col">
	<Navbar />
	<main class="flex-1 pt-[4.5rem]">
		{@render children()}
	</main>
	<Footer />
	<BackToTop />
</div>
