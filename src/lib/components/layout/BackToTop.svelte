<script lang="ts">
	import * as m from '$lib/paraglide/messages';
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
