<script lang="ts">
	import type { Session } from '$lib/types';
	import { t, localePath } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { getPeople } from '$lib/data/people';
	import { getPresentation, getPresentationAuthors } from '$lib/data/presentations';

	let { session }: { session: Session } = $props();

	const typeStyles: Record<Session['type'], string> = {
		keynote:
			'bg-secondary-500/12 text-secondary-700 dark:text-secondary-300 border-secondary-500/30',
		panel: 'bg-primary-500/10 text-primary-700 dark:text-primary-300 border-primary-500/25',
		plenary: 'bg-primary-500/5 text-primary-800 dark:text-primary-200 border-primary-500/20',
		break:
			'bg-surface-200/60 text-surface-700 dark:bg-surface-700/50 dark:text-surface-300 border-surface-300/40',
		social: 'bg-secondary-500/8 text-secondary-800 dark:text-secondary-200 border-secondary-500/20',
		discussion: 'bg-primary-500/8 text-primary-700 dark:text-primary-300 border-primary-500/25'
	};

	const typeLabels: Record<Session['type'], string> = {
		keynote: m.session_keynote(),
		panel: m.session_panel(),
		plenary: m.session_plenary(),
		break: m.session_break(),
		social: m.session_social(),
		discussion: m.session_discussion()
	};

	const speakers = $derived(getPeople(session.speakers));
	const papers = $derived(
		(session.presentationIds ?? [])
			.map((id) => getPresentation(id))
			.filter((p): p is NonNullable<typeof p> => p !== undefined)
	);

	const isPanel = $derived(session.type === 'panel');
	const isKeynote = $derived(session.type === 'keynote');
	const isDiscussion = $derived(session.type === 'discussion');

	// Panels and keynotes always show a chair line (falling back to "to be
	// determined"); other session types only show one when a chair is set.
	const chairPerson = $derived(session.chair ? getPeople([session.chair])[0] : undefined);
	const showChair = $derived(isPanel || isKeynote || !!session.chair);

	// A keynote or group discussion that references a single paper derives its
	// heading (and a link to the abstract) from it; everything else uses the
	// explicit localized title.
	const featuredPaper = $derived(
		(isKeynote || isDiscussion) && papers.length === 1 ? papers[0] : undefined
	);
	const heading = $derived(session.title ? t(session.title) : (featuredPaper?.title ?? ''));
	const headingHref = $derived(
		featuredPaper ? localePath(`/papers/${featuredPaper.id}`) : undefined
	);
</script>

<div
	class="border-surface-200 dark:border-surface-700/70 flex gap-4 border-b py-4 last:border-b-0 sm:gap-5"
>
	<div
		class="text-ink-muted dark:text-surface-400 w-20 flex-shrink-0 pt-1 font-mono text-[0.8125rem] leading-snug tabular-nums sm:w-28"
	>
		{session.time}
	</div>
	<div class="min-w-0 flex-1">
		<div class="mb-1.5 flex flex-wrap items-center gap-2">
			<span
				class="rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium tracking-wide uppercase {typeStyles[
					session.type
				]}"
			>
				{typeLabels[session.type]}
			</span>
			{#if session.room}
				<span class="text-ink-muted dark:text-surface-500 text-xs">{session.room}</span>
			{/if}
		</div>

		{#if heading}
			<h3 class="text-ink dark:text-surface-100 font-display text-[1.0625rem] leading-snug">
				{#if headingHref}
					<a href={headingHref} class="session-link" lang={featuredPaper?.language}>{heading}</a>
				{:else}
					{heading}
				{/if}
			</h3>
		{/if}

		{#if (isKeynote || isDiscussion) && speakers.length > 0}
			<p class="text-ink dark:text-surface-200 mt-1 text-sm font-medium">
				{speakers.map((s) => s.name).join(', ')}
			</p>
			<p class="text-ink-muted dark:text-surface-400 text-sm">
				{Array.from(new Set(speakers.map((s) => t(s.affiliation)))).join(' · ')}
			</p>
		{/if}

		{#if showChair}
			<p class="text-ink-muted dark:text-surface-400 mt-2 text-xs">
				<span class="font-medium">{m.session_chair()}</span>
				{chairPerson ? chairPerson.name : m.session_tbd()}
			</p>
		{/if}

		{#if session.description}
			<p class="text-ink-muted dark:text-surface-300 mt-1.5 text-sm leading-relaxed font-light">
				{t(session.description)}
			</p>
		{/if}

		{#if isPanel && papers.length > 0}
			<ul class="mt-3 space-y-2.5">
				{#each papers as paper (paper.id)}
					{@const authors = getPresentationAuthors(paper)}
					<li class="session-paper">
						<a
							href={localePath(`/papers/${paper.id}`)}
							class="session-paper-link"
							lang={paper.language}
						>
							{paper.title}
						</a>
						<span class="session-lang" lang={paper.language}
							>{paper.language === 'fr' ? 'FR' : 'EN'}</span
						>
						{#if authors.length > 0}
							<span class="text-ink-muted dark:text-surface-400 mt-0.5 block text-xs">
								{authors.map((a) => a.name).join(', ')}
							</span>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	.session-link,
	.session-paper-link {
		color: inherit;
		transition: color var(--duration-fast) var(--ease-standard);
	}
	.session-link:hover,
	.session-paper-link:hover {
		color: var(--color-primary-700);
	}
	:global(.dark) .session-link:hover,
	:global(.dark) .session-paper-link:hover {
		color: var(--color-primary-300);
	}

	.session-paper {
		padding-left: 0.75rem;
		border-left: 2px solid color-mix(in oklab, var(--color-secondary-500) 55%, transparent);
	}

	.session-paper-link {
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--color-ink);
	}
	:global(.dark) .session-paper-link {
		color: var(--color-surface-100);
	}

	.session-lang {
		display: inline-block;
		margin-left: 0.4rem;
		font-family: var(--font-sans);
		font-size: 0.625rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		vertical-align: 0.1em;
		color: var(--color-primary-700);
	}
	:global(.dark) .session-lang {
		color: var(--color-primary-300);
	}
</style>
