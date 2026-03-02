<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { ArrowUp } from 'lucide-svelte';

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
		class="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer opacity-0 animate-fade-in"
	>
		<ArrowUp size={20} />
	</button>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.3s ease-out forwards;
	}
</style>
