<script lang="ts">
	import type { Presentation } from '$lib/types';
	import { t, localePath } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { ArrowRight } from '@lucide/svelte';
	import { getPresentationAuthors } from '$lib/data/presentations';
	import { abstractToPlainText, truncate } from '$lib/utils/abstract';

	let { presentation }: { presentation: Presentation } = $props();

	const authors = $derived(getPresentationAuthors(presentation));
	const authorNames = $derived(authors.map((a) => a.name).join(', '));
	const affiliations = $derived(
		Array.from(new Set(authors.map((a) => t(a.affiliation)))).join(' · ')
	);
	const excerpt = $derived(
		presentation.abstract ? truncate(abstractToPlainText(presentation.abstract), 200) : ''
	);
	const href = $derived(localePath(`/papers/${presentation.id}`));
</script>

<article class="card-hover flex h-full flex-col p-6 sm:p-7">
	<div class="mb-4">
		<span class="language-badge" lang={presentation.language}>
			{presentation.language === 'fr' ? 'Français' : 'English'}
		</span>
	</div>

	<h3 class="text-card-title text-ink dark:text-surface-50 mb-2">
		<a {href} class="paper-title-link" lang={presentation.language}>{presentation.title}</a>
	</h3>

	{#if authors.length > 0}
		<p class="text-ink dark:text-surface-200 text-sm font-medium">{authorNames}</p>
		{#if affiliations}
			<p class="text-ink-muted dark:text-surface-400 text-sm">{affiliations}</p>
		{/if}
	{/if}

	{#if excerpt}
		<p
			class="text-ink-muted dark:text-surface-300 mt-4 text-[0.9375rem] leading-relaxed font-light"
		>
			{excerpt}
		</p>
	{/if}

	<a
		{href}
		class="link-arrow mt-auto self-start pt-6 text-sm"
		aria-label="{m.read_more()}: {presentation.title}"
	>
		{m.read_more()}
		<ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
	</a>
</article>

<style>
	.language-badge {
		display: inline-flex;
		align-items: center;
		font-family: var(--font-sans);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-primary-700);
		background-color: color-mix(in oklab, var(--color-primary-500) 10%, transparent);
		padding: 0.3rem 0.625rem;
		border-radius: var(--radius-full);
	}

	:global(.dark) .language-badge {
		color: var(--color-primary-200);
		background-color: color-mix(in oklab, var(--color-primary-500) 18%, transparent);
	}

	.paper-title-link {
		color: inherit;
		transition: color var(--duration-fast) var(--ease-standard);
	}

	.paper-title-link:hover {
		color: var(--color-primary-700);
	}

	:global(.dark) .paper-title-link:hover {
		color: var(--color-primary-300);
	}
</style>
