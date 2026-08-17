<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { ArrowLeft, ArrowRight, CalendarClock } from '@lucide/svelte';
	import { t, localePath } from '$lib/utils/i18n';
	import { siteConfig } from '$lib/data/site-config';
	import { getPresentation } from '$lib/data/presentations';
	import { getPlacements, sessionAnchor } from '$lib/utils/placement';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';

	let { data } = $props();

	const presentation = $derived(data.presentation);
	const authors = $derived(data.authors);
	const canonicalPath = $derived(`/papers/${presentation.id}`);

	// An abstract page used to have exactly one exit: "Back to papers". The
	// data already supported linking to its session, its co-authors and the
	// other papers in the same panel.
	const placements = $derived(getPlacements());
	const placement = $derived(placements.get(presentation.id));
	const siblings = $derived(
		(placement?.siblingIds ?? [])
			.map((id) => getPresentation(id))
			.filter((p): p is NonNullable<typeof p> => p !== undefined)
	);

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

<PageHeader
	title={presentation.title}
	titleLang={presentation.language}
	eyebrow={m.nav_papers()}
	meta={placement
		? [placement.sessionLabel, placement.slotLabel, presentation.language === 'fr' ? 'FR' : 'EN']
		: [presentation.language === 'fr' ? 'FR' : 'EN']}
/>

<div class="page-end pt-12">
	<div class="container-readable">
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
							<!-- Author names are links now: every person has a citable page. -->
							<a href={localePath(`/participants/${author.id}`)} class="author-link">
								<span class="font-display text-strong block text-lg">{author.name}</span>
								<span class="text-muted block text-sm">{t(author.affiliation)}</span>
							</a>
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

		{#if placement}
			<section class="mt-12">
				<a
					href="{localePath('/programme')}#{sessionAnchor(placement.session.id)}"
					class="callout hover:border-accent block no-underline"
					style="transition: border-color var(--duration-base) var(--ease-standard);"
				>
					<CalendarClock
						size={18}
						strokeWidth={1.75}
						class="text-accent-ink mt-0.5"
						aria-hidden="true"
					/>
					<span class="min-w-0">
						<span class="text-eyebrow mb-1 block">{m.paper_in_programme()}</span>
						<span class="text-strong block font-medium">
							{placement.sessionLabel} · {placement.slotLabel}
						</span>
						<span class="link-arrow mt-2 inline-flex text-sm">
							{m.paper_view_session()}
							<ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
						</span>
					</span>
				</a>
			</section>
		{/if}

		{#if siblings.length > 0}
			<section class="mt-10">
				<h2 class="text-eyebrow mb-4">{m.paper_same_session()}</h2>
				<ul class="space-y-3">
					{#each siblings as sibling (sibling.id)}
						<li>
							<a href={localePath(`/papers/${sibling.id}`)} class="card card-hover block p-4">
								<span
									class="text-strong block text-sm leading-snug font-medium"
									lang={sibling.language}
								>
									{sibling.title}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
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

	.author-link {
		color: inherit;
		transition: color var(--duration-fast) var(--ease-standard);
	}
	.author-link:hover {
		color: var(--color-primary-700);
	}
	:global(.dark) .author-link:hover {
		color: var(--color-primary-300);
	}

	/* The abstract itself is styled by the shared .prose class in app.css —
	   it used to re-implement .text-prose plus link styling in 60 lines of
	   scoped CSS at the same sizes, weights and underline treatment. */
</style>
