<script lang="ts">
	import type { Presentation } from '$lib/types';
	import { t, localePath, resolveAbstract } from '$lib/utils/i18n';
	import { getPresentationAuthors } from '$lib/data/presentations';
	import { getPlacements } from '$lib/utils/placement';
	import { abstractToPlainText } from '$lib/utils/text';

	let {
		presentation,
		/** Passed down from the grid so the map is built once, not once per card. */
		placements = getPlacements()
	}: { presentation: Presentation; placements?: ReturnType<typeof getPlacements> } = $props();

	const authors = $derived(getPresentationAuthors(presentation));
	const authorNames = $derived(authors.map((a) => a.name).join(', '));
	const affiliations = $derived(
		Array.from(new Set(authors.map((a) => t(a.affiliation)))).join(' · ')
	);
	// line-clamp rather than truncate(200): character truncation cut mid-word
	// and left ragged card heights.
	const abstract = $derived(resolveAbstract(presentation));
	const excerpt = $derived(abstract ? abstractToPlainText(abstract.text) : '');
	const href = $derived(localePath(`/papers/${presentation.id}`));
	const placement = $derived(placements.get(presentation.id));
</script>

<article class="card card-hover border-t-accent flex h-full flex-col border-t-2 p-6 sm:p-7">
	<!-- Leads with where the paper sits, not with a pill saying "English" that
	     twenty-odd cards all repeated. Language drops to a quiet corner mark. -->
	<div class="mb-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
		{#if placement}
			<span class="text-eyebrow">{placement.sessionLabel}</span>
			<span class="bg-hairline h-2.5 w-px" aria-hidden="true"></span>
			<span class="text-meta">{placement.slotLabel}</span>
		{/if}
		<span
			class="text-link text-badge ml-auto font-semibold tracking-[0.16em]"
			lang={presentation.language}
		>
			{presentation.language === 'fr' ? 'FR' : 'EN'}
		</span>
	</div>

	<h2 class="text-card-title text-strong mb-2.5">
		<!-- .card-link makes the whole card the hit area, so the card that lifts
		     on hover is finally clickable and the duplicate "Read more" tab stop
		     to the same URL is gone. -->
		<a {href} class="card-link paper-title-link" lang={presentation.language}>
			{presentation.title}
		</a>
	</h2>

	{#if authors.length > 0}
		<p class="text-strong text-caption leading-snug font-medium">{authorNames}</p>
		{#if affiliations}
			<p class="text-muted text-caption leading-snug">{affiliations}</p>
		{/if}
	{/if}

	{#if abstract}
		<p class="text-bio mt-3.5 line-clamp-3" lang={abstract.lang}>{excerpt}</p>
	{/if}
</article>

<style>
	/* The resting affordance the programme and the home figures already carry.
	   This link was `color: inherit` with a hover-only colour change, which is
	   no cue at all on the phone the papers index is browsed on — and it is the
	   card's title, the one thing a reader is trying to click. The mixes are the
	   measured ones: 65% light, 60% dark, both clearing 3:1 on the raised card,
	   where 35% measured 1.78:1. The card also lifts on hover, which is a cue
	   for a pointer and nothing for a finger.

	   Thickness steps up with the type, as it does under the home page's serif
	   numerals: this is the card-title step (19–23px), where a 1px rule reads as
	   a hairline artefact rather than an underline. */
	.paper-title-link {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: color-mix(in oklab, var(--color-primary-600) 65%, transparent);
		text-decoration-thickness: 1.5px;
		text-underline-offset: 0.18em;
		transition:
			color var(--duration-fast) var(--ease-standard),
			text-decoration-color var(--duration-fast) var(--ease-standard);
	}

	:global(.dark) .paper-title-link {
		text-decoration-color: color-mix(in oklab, var(--color-primary-300) 60%, transparent);
	}

	.paper-title-link:hover,
	.paper-title-link:focus-visible {
		color: var(--color-primary-700);
		text-decoration-color: currentColor;
	}

	:global(.dark) .paper-title-link:hover,
	:global(.dark) .paper-title-link:focus-visible {
		color: var(--color-primary-300);
		text-decoration-color: currentColor;
	}
</style>
