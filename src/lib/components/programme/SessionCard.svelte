<script lang="ts">
	import type { Session } from '$lib/types';
	import { t, localePath } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { getPeople } from '$lib/data/people';
	import { getPresentation, getPresentationAuthors } from '$lib/data/presentations';
	import { sessionAnchor } from '$lib/utils/placement';
	import { Video, Link as LinkIcon, ExternalLink } from '@lucide/svelte';

	let { session, panelNumber }: { session: Session; panelNumber?: number } = $props();

	// Three treatments, not six tinted badges. Keynote gold, panel teal-10,
	// plenary teal-5, discussion teal-8 and social gold-8 were three
	// near-identical teals nobody was going to decode; meanwhile a tea break
	// carried the same border, padding and badge grammar as a keynote.
	const treatment = $derived(
		session.type === 'break' ? 'interlude' : session.type === 'social' ? 'social' : 'session'
	);

	const typeLabels: Record<Session['type'], string> = {
		keynote: m.session_keynote(),
		panel: m.session_panel(),
		plenary: m.session_plenary(),
		break: m.session_break(),
		social: m.session_social(),
		discussion: m.session_discussion()
	};

	const typeLabel = $derived(
		session.type === 'panel' && panelNumber
			? `${typeLabels.panel} ${panelNumber}`
			: typeLabels[session.type]
	);

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

	const anchor = $derived(sessionAnchor(session.id));
	const times = $derived(session.time.split(/\s*[–—-]\s*/));
</script>

<!--
	Marks a person taking part remotely. Rendered right after their name, so a
	panel with both on-site and online authors stays unambiguous.
-->
{#snippet onlineBadge()}
	<span class="online-badge" title={m.session_online_title()}>
		<Video size={11} strokeWidth={2.25} aria-hidden="true" />
		{m.session_online()}
	</span>
{/snippet}

{#if treatment === 'interlude'}
	<!-- A break is a quiet dashed rule: no badge, no card, no serif. -->
	<!-- scroll-mt-28 matches the session row below: without it a break anchor
	     landed on the global scroll-padding-top (88px), which clears the header
	     but not the programme's own sticky day bar — 41px behind it at 375px.

	     border-b, not border-y: the session above already draws a solid rule on
	     its own bottom edge, so border-y stacked a dashed hairline directly on
	     it at all ten session→break boundaries. -->
	<div
		id={anchor}
		class="border-subtle interlude-row flex scroll-mt-28 items-baseline border-b border-dashed py-2.5 last:border-b-0"
	>
		<span class="text-muted text-caption interlude-time flex-shrink-0 tabular-nums">
			{times[0]}
		</span>
		<span class="text-muted text-caption">
			{session.title ? t(session.title) : typeLabel}
		</span>
	</div>
{:else}
	<div
		id={anchor}
		class="border-subtle group scroll-mt-28 border-b py-5 last:border-b-0 {treatment === 'social'
			? 'opacity-90'
			: ''}"
	>
		<div class="session-row">
			<!-- Start time leads, end time recedes. Outfit with tabular-nums, not
			     font-mono: DESIGN.md names session times as a tabular-Outfit site,
			     and the mono stack was resolving to whatever face the OS supplied
			     (Consolas / SF Mono) in the most repeated position on the site.
			     tabular-nums keeps the column aligned without a third family.

			     Below 640px the time is a line above the title rather than a side
			     gutter: the gutter cost 97px of a 343px card and squeezed titles to
			     23 characters a line over 4.8 lines each. Times still lead the row
			     and still align on the left edge, so scanning a day survives. -->
			<div class="session-time flex-shrink-0">
				<div class="text-strong text-sm tabular-nums">{times[0]}</div>
				{#if times[1]}
					<div class="session-time-end text-muted text-xs tabular-nums">{times[1]}</div>
				{/if}
			</div>

			<div class="min-w-0 flex-1">
				<div class="mb-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
					<span class={treatment === 'social' ? 'text-meta' : 'text-eyebrow'}>{typeLabel}</span>
					{#if session.room}
						<span class="text-muted text-xs">{session.room}</span>
					{/if}
					{#if session.venue}
						<span class="text-muted text-xs">
							{#if session.venueUrl}
								<a
									href={session.venueUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="session-link inline-flex items-center gap-1"
								>
									{session.venue}<ExternalLink size={11} strokeWidth={2} aria-hidden="true" />
								</a>
							{:else}
								{session.venue}
							{/if}
						</span>
					{/if}
					<!-- Per-session anchor: until now you could not send anyone a
					     link to Tuesday's panel. -->
					<a
						href="#{anchor}"
						class="text-primary-600/50 hover:text-primary-600 text-xs opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
						aria-label={m.session_anchor_label()}
					>
						<LinkIcon size={12} strokeWidth={2} aria-hidden="true" />
					</a>
				</div>

				{#if heading}
					<!-- Deliberately below .text-card-title: a session name frames the
					     papers inside it and should not outweigh them. leading comes from
					     the h3 base step. -->
					<h3 class="text-strong font-display text-reading">
						{#if headingHref}
							<a href={headingHref} class="session-link" lang={featuredPaper?.language}>{heading}</a
							>
						{:else}
							{heading}
						{/if}
					</h3>
				{/if}

				{#if (isKeynote || isDiscussion) && speakers.length > 0}
					<p class="text-strong mt-1 text-sm font-medium">
						<!-- prettier-ignore -->
						{#each speakers as speaker, i (speaker.id)}{i > 0 ? ', ' : ''}<a href={localePath(`/participants/${speaker.id}`)} class="session-link">{speaker.name}</a>{#if speaker.online}{@render onlineBadge()}{/if}{/each}
					</p>
					<p class="text-muted text-sm">
						{Array.from(new Set(speakers.map((s) => t(s.affiliation)))).join(' · ')}
					</p>
				{/if}

				{#if showChair}
					<p class="text-muted mt-2 text-xs">
						<span class="font-medium">{m.session_chair()}</span>
						<!-- prettier-ignore -->
						{chairPerson ? chairPerson.name : m.session_tbd()}{#if chairPerson?.online}{@render onlineBadge()}{/if}
					</p>
				{/if}

				{#if session.description}
					<p class="text-muted measure-prose mt-1.5 text-sm leading-relaxed">
						{t(session.description)}
					</p>
				{/if}

				{#if session.links && session.links.length > 0}
					<p class="text-muted mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
						{#each session.links as link (link.url)}
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								class="session-link inline-flex items-center gap-1"
							>
								{link.label}<ExternalLink size={11} strokeWidth={2} aria-hidden="true" />
							</a>
						{/each}
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
									<span class="text-muted mt-0.5 block text-xs">
										<!-- prettier-ignore -->
										{#each authors as author, i (author.id)}{i > 0 ? ', ' : ''}<a href={localePath(`/participants/${author.id}`)} class="session-link">{author.name}</a>{#if author.online}{@render onlineBadge()}{/if}{/each}
									</span>
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	/* Media queries live inside the scoped block rather than as `sm:` utilities:
	   Svelte scoped styles are unlayered and outrank @layer utilities, so a
	   responsive utility on an element this block also styles would silently
	   lose. Same reason the navbar disclosure was rewritten this way. */
	.session-row {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	/* Mobile: the two times sit on one line, joined by an en dash. */
	.session-time {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
	}
	.session-time-end::before {
		content: '–';
		margin-inline-end: 0.4rem;
		color: var(--ink-subtle);
	}

	/* A break stays one line at every width — it is a time and three words. Its
	   gap tracks .session-row's so the label starts on the same x as a session's
	   content column; at gap-4 against the row's 1.25rem they sat 4px apart,
	   staggering the one column this layout exists to make scannable. */
	.interlude-row {
		gap: 1rem;
	}

	.interlude-time {
		width: auto;
	}

	@media (min-width: 640px) {
		.session-row {
			flex-direction: row;
			gap: 1.25rem;
		}

		.interlude-row {
			gap: 1.25rem;
		}

		/* From 640px the time returns to a fixed gutter, which is what lets the
		   eye run down a column of start times on a wide screen. */
		.session-time {
			display: block;
			width: 7rem;
			padding-inline-end: 1rem;
			border-inline-end: 1px solid var(--border-subtle);
		}
		.session-time-end::before {
			content: none;
		}

		.interlude-time {
			width: 7rem;
		}
	}

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
		font-size: var(--text-ui);
		font-weight: 500;
		line-height: 1.4;
		color: var(--ink-strong);
	}

	.session-lang {
		display: inline-block;
		margin-left: 0.4rem;
		font-family: var(--font-sans);
		/* 11px is the documented floor; this and .online-badge were the only
		   10px type on the site, on the surface most often read on a phone. */
		font-size: var(--text-badge);
		font-weight: 600;
		/* 0.16em: the badge role's tracking, shared with the EN/FR chip on
		   PaperCard and the language switcher. Uppercase needs positive
		   tracking, and one chip should not have three renderings. */
		letter-spacing: 0.16em;
		vertical-align: 0.1em;
		color: var(--color-primary-700);
	}
	:global(.dark) .session-lang {
		color: var(--color-primary-300);
	}

	.online-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		margin-left: 0.4rem;
		padding: 0.05rem 0.4rem;
		border: 1px solid var(--border-accent);
		border-radius: 9999px;
		background-color: color-mix(in oklab, var(--accent) 10%, transparent);
		font-size: var(--text-badge);
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		line-height: 1.5;
		white-space: nowrap;
		vertical-align: 0.05em;
		color: var(--accent-ink);
	}
</style>
