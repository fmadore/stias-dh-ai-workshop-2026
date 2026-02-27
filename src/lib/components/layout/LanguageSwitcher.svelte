<script lang="ts">
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime';

	const currentLocale = $derived(getLocale());

	function switchLocale(locale: string) {
		setLocale(locale as 'en' | 'fr');
		// Reload the page to apply the new locale
		window.location.reload();
	}
</script>

<nav class="flex items-center gap-1" aria-label="Language">
	{#each locales as locale}
		<button
			onclick={() => switchLocale(locale)}
			class="px-2 py-1 text-sm font-medium rounded transition-colors {currentLocale === locale
				? 'bg-primary-500 text-white'
				: 'hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300'}"
			aria-current={currentLocale === locale ? 'true' : undefined}
		>
			{locale.toUpperCase()}
		</button>
	{/each}
</nav>
