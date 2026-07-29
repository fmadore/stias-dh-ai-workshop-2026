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

<div class="page-end">
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
			<article class="prose" lang={presentation.language}>
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

	/* The abstract itself is styled by the shared .prose class in app.css —
	   it used to re-implement .text-prose plus link styling in 60 lines of
	   scoped CSS at the same sizes, weights and underline treatment. */
</style>
