<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { ArrowLeft } from '@lucide/svelte';
	import { t, localePath } from '$lib/utils/i18n';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';

	let { data } = $props();

	const presentation = $derived(data.presentation);
	const authors = $derived(data.authors);
	const canonicalPath = $derived(`/papers/${presentation.id}`);

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'ScholarlyArticle',
		headline: presentation.title,
		name: presentation.title,
		abstract: data.abstractText || undefined,
		inLanguage: presentation.language,
		isPartOf: {
			'@type': 'Event',
			name: siteConfig.shortTitle,
			startDate: siteConfig.dates.start,
			endDate: siteConfig.dates.end
		},
		author: authors.map((a) => ({
			'@type': 'Person',
			name: a.name,
			affiliation: { '@type': 'Organization', name: t(a.affiliation) }
		}))
	});
</script>

<SEO
	title="{presentation.title} | {siteConfig.shortTitle}"
	description={data.description}
	type="article"
	{canonicalPath}
	additionalSchema={schema}
/>

<PageHeader title={presentation.title} />

<div class="pb-24">
	<div class="container-readable max-w-4xl">
		<div class="mb-8 flex flex-wrap items-center justify-between gap-3">
			<span class="language-badge" lang={presentation.language}>
				{presentation.language === 'fr' ? 'Français' : 'English'}
			</span>
			<a href={localePath('/papers')} class="link-arrow text-sm">
				<ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" />
				{m.paper_back_to_papers()}
			</a>
		</div>

		{#if authors.length > 0}
			<section class="mb-10">
				<h2 class="text-eyebrow mb-4">{m.paper_presented_by()}</h2>
				<ul class="authors">
					{#each authors as author (author.id)}
						<li class="author">
							<div class="font-display text-ink dark:text-surface-50 text-lg">
								{author.name}
							</div>
							<div class="text-ink-muted dark:text-surface-400 text-sm">
								{t(author.affiliation)}
							</div>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if data.abstractHtml}
			<article class="abstract" lang={presentation.language}>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html data.abstractHtml}
			</article>
		{/if}
	</div>
</div>

<style>
	.authors {
		display: grid;
		gap: 0.875rem 1.5rem;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.author {
		padding-left: 0.75rem;
		border-left: 2px solid color-mix(in oklab, var(--color-secondary-500) 60%, transparent);
	}

	.abstract {
		font-family: var(--font-sans);
		font-weight: 300;
		font-size: 1rem;
		line-height: 1.72;
		color: var(--color-ink);
		max-width: 42rem;
	}

	:global(.dark) .abstract {
		color: var(--color-surface-200);
	}

	@media (min-width: 640px) {
		.abstract {
			font-size: 1.0625rem;
		}
	}

	.abstract :global(p) {
		margin-block: 0 1.1em;
	}

	.abstract :global(p:last-child) {
		margin-bottom: 0;
	}

	.abstract :global(strong) {
		font-weight: 600;
		color: var(--color-ink);
	}

	:global(.dark) .abstract :global(strong) {
		color: var(--color-surface-50);
	}

	.abstract :global(em) {
		font-style: italic;
	}

	.abstract :global(a) {
		color: var(--color-primary-600);
		text-decoration: underline;
		text-decoration-color: color-mix(in oklab, var(--color-primary-600) 30%, transparent);
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
		transition: color var(--duration-fast) var(--ease-standard);
	}

	:global(.dark) .abstract :global(a) {
		color: var(--color-primary-300);
	}

	.abstract :global(a:hover) {
		color: var(--color-primary-700);
		text-decoration-color: currentColor;
	}
</style>
