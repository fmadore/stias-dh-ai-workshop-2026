<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { getLocale, locales, baseLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import { switchLocalePath, type SupportedLocale } from '$lib/utils/localized-paths';
	import { Languages } from '@lucide/svelte';

	const currentLocale = $derived(getLocale());

	/**
	 * One control, not two. With exactly two locales, "EN / FR" spent a
	 * separator and two 2.75rem boxes largely to tell the reader which language
	 * they were already reading — which the page around it says rather more
	 * loudly. What is left is the only thing the control can actually do: go to
	 * the other one.
	 *
	 * An anchor, not a button: the destination is fully computable at render
	 * time, so the only route between the English and French sites had no
	 * business being inert without JavaScript, unopenable in a new tab, or
	 * impossible to copy. `data-sveltekit-reload` keeps the full page
	 * navigation the locale strategy needs — Paraglide resolves the locale
	 * during prerender, so a client-side route change would leave the old one
	 * in play.
	 */
	const target = $derived.by(() => {
		const other = (locales as readonly SupportedLocale[]).find(
			(locale) => locale !== currentLocale
		);
		if (!other) return undefined;
		return {
			locale: other,
			href: switchLocalePath(
				page.url.pathname,
				currentLocale as SupportedLocale,
				other,
				base,
				baseLocale as SupportedLocale
			)
		};
	});
</script>

{#if target}
	<nav aria-label={m.language_switcher_label()}>
		<a
			href={target.href}
			hreflang={target.locale}
			lang={target.locale}
			data-sveltekit-reload
			class="switcher"
		>
			<Languages size={17} strokeWidth={1.75} aria-hidden="true" />
			<span class="code">{target.locale.toUpperCase()}</span>
		</a>
	</nav>
{/if}

<style>
	/* Pill rather than the ghost's 2.75rem square, because it carries two
	   letters as well as the glyph — but the same height, so it sits level with
	   the theme toggle beside it. The height is the documented touch floor, not
	   a visual choice. */
	.switcher {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		min-height: 2.75rem;
		padding-inline: 0.6875rem;
		border-radius: var(--radius-full);
		color: var(--ink-subtle);
		font-family: var(--font-sans);
		font-size: var(--text-badge);
		font-weight: 600;
		letter-spacing: 0.16em;
		white-space: nowrap;
		transition:
			color var(--duration-fast) var(--ease-standard),
			background-color var(--duration-fast) var(--ease-standard);
	}

	/* 0.16em of tracking hangs off the last letter, so without this the pill
	   looks right-heavy against the glyph. Optical, not structural. */
	.code {
		margin-inline-end: -0.16em;
	}

	.switcher:hover {
		color: var(--ink-strong);
		background-color: color-mix(in oklab, var(--color-ink) 6%, transparent);
	}

	:global(.dark) .switcher:hover {
		background-color: color-mix(in oklab, var(--color-surface-100) 8%, transparent);
	}
</style>
