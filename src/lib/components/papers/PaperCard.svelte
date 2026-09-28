<script lang="ts">
	import type { PaperListing } from '$lib/types';
	import { t, localePath } from '$lib/utils/i18n';
	import { getPlacements } from '$lib/utils/placement';

	let {
		presentation,
		/** Passed down from the grid so the map is built once, not once per card. */
		placements = getPlacements()
	}: { presentation: PaperListing; placements?: ReturnType<typeof getPlacements> } = $props();

	const authors = $derived(presentation.authors);
	const authorNames = $derived(authors.map((a) => a.name).join(', '));
	// Co-authors carry no affiliation, so the set is built over the authors that
	// have one rather than over all of them — otherwise the line ends in a
	// stranded separator.
	const affiliations = $derived(
		Array.from(new Set(authors.flatMap((a) => (a.affiliation ? [t(a.affiliation)] : [])))).join(
			' · '
		)
	);
	// line-clamp rather than truncate(200): character truncation cut mid-word
	// and left ragged card heights. The excerpt is still cut, server-side, but
	// well past what three lines can hold, so the clamp is what the reader sees.
	const excerpt = $derived(presentation.excerpt);
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
		<a {href} class="card-link link-underline paper-title-link" lang={presentation.language}>
			{presentation.title}
		</a>
	</h2>

	{#if authors.length > 0}
		<p class="text-strong text-caption leading-snug font-medium">{authorNames}</p>
		{#if affiliations}
			<p class="text-muted text-caption leading-snug">{affiliations}</p>
		{/if}
	{/if}

	{#if excerpt}
		<p class="text-bio mt-3.5 line-clamp-3" lang={excerpt.lang}>{excerpt.text}</p>
	{/if}
</article>

<style>
	/* The resting affordance the programme and the home figures carry
	   (.link-underline, app.css). This was `color: inherit` with a hover-only
	   colour change, which is no cue at all on the phone the papers index is
	   browsed on — and it is the card's title, the one thing a reader is trying
	   to click. The card also lifts on hover, which is a cue for a pointer and
	   nothing for a finger. The rule steps up to 1.5px with the card-title type
	   (19–23px), where 1px reads as a hairline artefact. */
	.paper-title-link {
		--link-underline-weight: 1.5px;
		--link-underline-offset: 0.18em;
	}
</style>
