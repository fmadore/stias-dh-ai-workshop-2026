<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { ArrowLeft, ArrowRight, CalendarClock } from '@lucide/svelte';
	import { t, localePath } from '$lib/utils/i18n';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';

	let { data } = $props();

	const presentation = $derived(data.presentation);
	const authors = $derived(data.authors);

	// Resolved by the server load, which is what keeps the registries of every
	// abstract and bio out of this route's client bundle.
	const placement = $derived(data.placement);
	const siblings = $derived(data.siblings);

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
			...(a.affiliation ? { affiliation: { '@type': 'Organization', name: t(a.affiliation) } } : {})
		}))
	});
</script>

<SEO
	title="{presentation.title} | {siteConfig.shortTitle}"
	description={data.description}
	type="article"
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

<div class="page-end page-body">
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

		<div class="block-flow">
			{#if authors.length > 0}
				<section>
					<h2 class="text-eyebrow mb-4">{m.paper_presented_by()}</h2>
					<ul class="authors">
						{#each authors as author (author.id)}
							<li class="author">
								<!-- Author names are links now: every person attending has a citable
								     page. A credited co-author has none, so they read as plain text
								     rather than as a link to nothing. -->
								{#if author.group === 'co-author'}
									<span class="font-display text-strong block text-lg">{author.name}</span>
									{#if author.affiliation}
										<span class="text-muted block text-sm">{t(author.affiliation)}</span>
									{/if}
								{:else}
									<!-- The resting underline goes on the name, not the anchor: the
									     anchor also wraps the affiliation, and underlining a second
									     line of muted 14px reads as two links rather than one. -->
									<a href={localePath(`/participants/${author.id}`)} class="author-link link-group">
										<span class="author-name link-underline font-display text-strong block text-lg">
											{author.name}
										</span>
										{#if author.affiliation}
											<span class="text-muted block text-sm">{t(author.affiliation)}</span>
										{/if}
									</a>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if data.abstractHtml}
				<!-- The heading is UI copy in the page's locale; the abstract keeps its
				     own `lang`, so the two cannot be one element. It also gives the
				     author's own section headings something to sit beneath: they are
				     `<h3>`s now (see `renderAbstract`), which needed an h2 above them
				     to land in the outline without skipping a level. -->
				<section>
					<h2 class="text-eyebrow mb-4">{m.paper_abstract()}</h2>
					<article class="prose" lang={data.abstractLang}>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html data.abstractHtml}
					</article>
				</section>
			{/if}

			{#if placement}
				<section>
					<a
						href="{localePath('/programme')}#{placement.anchor}"
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
				<section>
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

	/* The author link wraps the name and the affiliation, and only the name is
	   ruled: underlining a second line of muted 14px reads as two links rather
	   than one. So the anchor is a .link-group and the name the .link-underline
	   (app.css), which takes its hover and focus states from the anchor. It
	   used to be `color: inherit` with a hover-only colour change that reached
	   neither child span, since both set their own colour — no resting cue and
	   no working one. The rule is 1.5px because the name sets 18px display
	   serif. */
	.author-name {
		--link-underline-weight: 1.5px;
		--link-underline-offset: 0.18em;
	}

	/* The abstract itself is styled by the shared .prose class in app.css —
	   it used to re-implement .text-prose plus link styling in 60 lines of
	   scoped CSS at the same sizes, weights and underline treatment. */
</style>
