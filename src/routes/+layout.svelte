<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import '../app.css';
	// Preloaded, not merely imported. Instrument Serif has no metric-compatible
	// fallback: its mean advance is 0.3366em against Georgia's 0.4384em, so with
	// font-display: swap every heading on the site lays out ~30% wide on first
	// paint and then reflows — the hero headline goes 3 lines to 4 and back. A
	// size-adjust fallback would trade that width jump for an x-height jump
	// (0.481 to 0.37), so the fix is to stop the round trip instead. Imported
	// through Vite so the hashed, fingerprinted URLs stay correct.
	//
	// Latin only. The latin-ext subset is another 11.6 KB and just 18 of the 143
	// built pages contain a character that needs it — mostly Yoruba diacritics in
	// paper titles. Preloading it everywhere would push an unused font at 87% of
	// page loads on a site whose brief puts low bandwidth first, and earn a
	// "preloaded but not used" warning on each. It still loads on demand.
	import instrumentSerifLatin from '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2?url';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import WhatNext from '$lib/components/layout/WhatNext.svelte';
	import BackToTop from '$lib/components/layout/BackToTop.svelte';
	import { localizedPath, localeFromPath } from '$lib/utils/localized-paths';

	let { children } = $props();

	// Keep <html lang> in sync after client-side navigation — the server only
	// sets it on the initially requested document (see hooks.server.ts). Read
	// from the path, not from params: the error page matches no route, so
	// params.lang is undefined there and a French 404 declared itself English.
	$effect(() => {
		document.documentElement.lang = localeFromPath(page.url.pathname, base);
	});

	onMount(() => {
		// Auto-detect browser language on first visit (only if not already on a French page).
		const hasVisited = sessionStorage.getItem('locale_detected');
		if (!hasVisited) {
			sessionStorage.setItem('locale_detected', '1');
			const browserLang = navigator.language || navigator.languages?.[0] || '';
			const pathname = base
				? window.location.pathname.slice(base.length) || '/'
				: window.location.pathname;
			const isAlreadyFr = pathname.startsWith('/fr');
			if (browserLang.startsWith('fr') && !isAlreadyFr) {
				window.location.href = localizedPath(pathname, 'fr', base);
			}
		}
	});
</script>

<svelte:head>
	<link
		rel="preload"
		href={instrumentSerifLatin}
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
</svelte:head>

<a class="skip-link" href="#main">{m.skip_to_content()}</a>

<div class="bg-cream flex min-h-screen flex-col">
	<Navbar />
	<main id="main" class="flex-1 pt-[var(--nav-height)]">
		{@render children()}
	</main>
	<WhatNext />
	<Footer />
	<BackToTop />
</div>
