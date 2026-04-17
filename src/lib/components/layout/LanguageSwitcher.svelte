<script lang="ts">
	import { base } from '$app/paths';
	import { getLocale, locales, baseLocale } from '$lib/paraglide/runtime';

	const currentLocale = $derived(getLocale());

	function switchLocale(newLocale: string) {
		const currentLoc = getLocale();
		const pathname = window.location.pathname;

		let path = base ? pathname.slice(base.length) || '/' : pathname;

		if (currentLoc !== baseLocale && path.startsWith(`/${currentLoc}`)) {
			path = path.slice(`/${currentLoc}`.length) || '/';
		}

		const prefix = newLocale === baseLocale ? '' : `/${newLocale}`;
		window.location.href = `${base}${prefix}${path}`;
	}
</script>

<nav class="flex items-center gap-0.5" aria-label="Language">
	{#each locales as locale, i}
		{#if i > 0}
			<span class="text-surface-300 dark:text-surface-700 text-xs" aria-hidden="true">/</span>
		{/if}
		<button
			onclick={() => switchLocale(locale)}
			class="rounded-[var(--radius-sm)] px-1.5 py-1 text-[11px] font-semibold tracking-[0.12em] transition-colors duration-[var(--duration-fast)] {currentLocale ===
			locale
				? 'text-primary-700 dark:text-primary-300'
				: 'text-ink-muted/70 dark:text-surface-500 hover:text-ink dark:hover:text-surface-200'}"
			aria-current={currentLocale === locale ? 'true' : undefined}
		>
			{locale.toUpperCase()}
		</button>
	{/each}
</nav>
