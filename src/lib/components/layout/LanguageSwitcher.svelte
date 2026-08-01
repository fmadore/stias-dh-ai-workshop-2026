<script lang="ts">
	import { base } from '$app/paths';
	import { getLocale, locales, baseLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import { switchLocalePath, type SupportedLocale } from '$lib/utils/localized-paths';

	const currentLocale = $derived(getLocale());

	function switchLocale(newLocale: string) {
		window.location.href = switchLocalePath(
			window.location.pathname,
			getLocale() as SupportedLocale,
			newLocale as SupportedLocale,
			base,
			baseLocale as SupportedLocale
		);
	}
</script>

<nav class="flex items-center gap-0.5" aria-label={m.language_switcher_label()}>
	{#each locales as locale, i}
		{#if i > 0}
			<span class="text-surface-300 dark:text-surface-700 text-xs" aria-hidden="true">/</span>
		{/if}
		<button
			onclick={() => switchLocale(locale)}
			class="min-h-11 min-w-11 rounded-[var(--radius-sm)] px-2 py-1 text-[11px] font-semibold tracking-[0.12em] transition-colors duration-[var(--duration-fast)] {currentLocale ===
			locale
				? 'text-link'
				: 'text-ink-muted dark:text-surface-300 hover:text-ink dark:hover:text-surface-100'}"
			aria-current={currentLocale === locale ? 'true' : undefined}
		>
			{locale.toUpperCase()}
		</button>
	{/each}
</nav>
