<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import { ArrowUp } from '@lucide/svelte';

	let visible = $state(false);

	function onScroll() {
		visible = window.scrollY > 400;
	}

	function scrollToTop() {
		// `scroll-behavior: auto` in the reduced-motion block does not reach this:
		// a behavior named in script overrides the stylesheet's, so asking for
		// 'smooth' here animated the whole page for the readers who had asked
		// the whole page not to move. This was the longest piece of motion on
		// the site and the only one that ignored the preference outright.
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
		// The button unmounts once the page is back above 400px, and focus on a
		// removed element falls to <body>: a keyboard reader who pressed it was
		// sent back to the start of the document, skip link and all. Land them
		// where the skip link does instead. preventScroll keeps the scroll above
		// in charge of the movement.
		document.getElementById('main')?.focus({ preventScroll: true });
	}
</script>

<svelte:window onscroll={onScroll} />

{#if visible}
	<button
		onclick={scrollToTop}
		aria-label={m.back_to_top()}
		class="back-to-top bg-primary-600 hover:bg-primary-700 animate-fade-rise fixed right-5 bottom-5 z-50 cursor-pointer rounded-full p-3 text-white shadow-[var(--shadow-lg)] transition-[background-color,box-shadow,transform] duration-[var(--duration-base)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-xl)] sm:right-6 sm:bottom-6"
	>
		<ArrowUp size={20} />
	</button>
{/if}
