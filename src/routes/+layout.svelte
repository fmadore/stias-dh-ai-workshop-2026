<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import '../app.css';
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
