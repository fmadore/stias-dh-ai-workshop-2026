<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import BackToTop from '$lib/components/layout/BackToTop.svelte';

	let { children } = $props();
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
