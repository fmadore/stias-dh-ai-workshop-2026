<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { ArrowUp } from '@lucide/svelte';

	let visible = $state(false);

	function onScroll() {
		visible = window.scrollY > 400;
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:window onscroll={onScroll} />

{#if visible}
	<button
		onclick={scrollToTop}
		aria-label={m.back_to_top()}
		class="bg-primary-600 hover:bg-primary-700 animate-fade-rise fixed right-5 bottom-5 z-50 cursor-pointer rounded-full p-3 text-white shadow-[var(--shadow-lg)] transition-[background-color,box-shadow,transform] duration-[var(--duration-base)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-xl)] sm:right-6 sm:bottom-6"
	>
		<ArrowUp size={20} />
	</button>
{/if}
