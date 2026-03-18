<script lang="ts">
	import { base } from '$app/paths';
	import { getLocale, locales, baseLocale } from '$lib/paraglide/runtime';

	const currentLocale = $derived(getLocale());

	function switchLocale(newLocale: string) {
		const currentLoc = getLocale();
		const pathname = window.location.pathname;

		// Strip base path (on client, base is absolute like '/stias-dh-ai-workshop-2026')
		let path = base ? pathname.slice(base.length) || '/' : pathname;

		// Strip current locale prefix if present
		if (currentLoc !== baseLocale && path.startsWith(`/${currentLoc}`)) {
			path = path.slice(`/${currentLoc}`.length) || '/';
		}

		// Build new path with target locale prefix
		const prefix = newLocale === baseLocale ? '' : `/${newLocale}`;
		window.location.href = `${base}${prefix}${path}`;
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
