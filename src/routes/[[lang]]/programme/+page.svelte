<script lang="ts">
	import { venueClock } from '$lib/utils/venue-clock';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { programme, programmeLastUpdated } from '$lib/data/programme';
	import { dateAtVenue, workshopPhase } from '$lib/utils/milestones';
	import ScheduleDay from '$lib/components/programme/ScheduleDay.svelte';
	import JoinOnline from '$lib/components/shared/JoinOnline.svelte';
	import { base } from '$app/paths';
	import { Calendar, CalendarPlus, FileText } from '@lucide/svelte';

	const intl = $derived(getLocale() === 'fr' ? 'fr-FR' : 'en-GB');

	// One calendar file per locale, unlike the PDF: an .ics carries the session
	// titles themselves, and a calendar entry written in both languages at once
	// is unreadable in the one line a day view gives it.
	const icsFile = $derived(`Programme-STIAS-2026-${getLocale()}.ics`);

	const lastUpdated = $derived(
		new Date(`${programmeLastUpdated}T12:00:00`).toLocaleDateString(intl, {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	);

	/** Today's date in South African time, so "happening now" matches the venue. */
	const todayAtVenue = $derived(dateAtVenue($venueClock.now));

	// "Happening now" is a claim about the present, not about the date. The
	// closing session ends at 18:00 on the fourth day and the badge sat on that
	// day until midnight, so for six hours the programme said the workshop was
	// under way while the home page said it had concluded.
	const stillRunning = $derived($venueClock.live && workshopPhase($venueClock.now) !== 'after');

	// Panel numbers run across the whole programme, so each day needs to know
	// how many panels preceded it.
	const days = $derived.by(() => {
		let panels = 0;
		return programme.map((day) => {
			const offset = panels;
			panels += day.sessions.filter((session) => session.type === 'panel').length;
			return {
				day,
				panelOffset: offset,
				isToday: day.date === todayAtVenue && stillRunning,
				short: new Date(`${day.date}T12:00:00Z`).toLocaleDateString(intl, {
					weekday: 'short',
					day: 'numeric',
					timeZone: 'UTC'
				})
			};
		});
	});
</script>

<SEO
	title="{m.nav_programme()} | {siteConfig.shortTitle}"
	description={m.seo_programme_description()}
/>

<PageHeader
	title={m.section_programme()}
	subtitle={m.hero_dates()}
	width="page"
	compact
	meta={[m.hero_location(), m.hero_format()]}
>
	{#snippet actions()}
		<!-- One file for both locales: the printed programme is a single bilingual
		     document, so unlike the call for papers there is no per-locale stem. -->
		<a href={`${base}/downloads/Programme-STIAS-2026.pdf`} download class="btn btn-primary btn-sm">
			<FileText size={15} strokeWidth={1.75} aria-hidden="true" />
			{m.download_programme()}
		</a>
		<!-- Sessions that can be followed online: meals, breaks, the two
		     excursions and the in-room ice-breaker are not things anyone needs in
		     their calendar, and they would bury the papers. -->
		<a href={`${base}/downloads/${icsFile}`} download class="btn btn-secondary btn-sm">
			<CalendarPlus size={15} strokeWidth={1.75} aria-hidden="true" />
			{m.download_programme_ics()}
		</a>
	{/snippet}
</PageHeader>

<div class="page-end">
	{#if programme.length > 0}
		<!-- A four-day programme is otherwise 3000px of scroll with no way in.
		     bg-page, not bg-cream/90: the .bg-cream alias is unlayered so it beats
		     the generated utility, but an alpha modifier is a different class name
		     and falls through to the raw light-only token. -->
		<nav
			class="programme-day-nav bg-page/90 border-subtle sticky top-[var(--nav-height)] z-30 border-b backdrop-blur-md"
			aria-label={m.programme_jump_to_day()}
		>
			<!-- flex-nowrap, not flex-wrap: --day-bar-height is a declared constant
			     that days and sessions consume as scroll-margin-top, so the bar is
			     only allowed one height. At 320px four day pills measured 290.7px
			     (EN) and 293.6px (FR) against 288px of content, wrapped to a second
			     row, and rendered 113px — leaving every day heading 36px *behind*
			     the bar it was supposed to clear. A row that cannot wrap keeps the
			     token true by construction; overflow-x is the escape valve if a
			     fifth day or a longer locale ever exceeds the width, so it scrolls
			     rather than silently lying about its height again. -->
			<div class="container-page flex flex-nowrap items-center gap-2 overflow-x-auto py-2">
				<span class="text-meta mr-1 hidden sm:inline">{m.programme_jump_to_day()}</span>
				{#each days as entry (entry.day.date)}
					<a href="#day-{entry.day.date}" class="day-pill" class:is-today={entry.isToday}>
						{entry.short}
					</a>
				{/each}
			</div>
		</nav>

		<div class="container-page programme-body block-flow pt-6 sm:pt-10">
			<!-- Above the schedule, not beside the download buttons: someone who
			     cannot travel needs to know the sessions are open to them before
			     they start reading four days of panels. -->
			<JoinOnline variant="callout" />

			<!-- The revision date used to be the small print under a "this programme
			     is preliminary" notice. With the notice gone it is a fact about the
			     page, not a warning about it, so it drops the callout's amber frame
			     and Info mark and sits as a quiet meta line above the schedule. -->
			<p class="text-muted text-xs">
				{m.programme_last_updated({ date: lastUpdated })}
			</p>

			<div class="block-flow">
				{#each days as entry (entry.day.date)}
					<ScheduleDay day={entry.day} panelOffset={entry.panelOffset} isToday={entry.isToday} />
				{/each}
			</div>
		</div>
	{:else}
		<div class="container-readable page-body">
			<div class="card p-14 text-center">
				<Calendar
					size={44}
					strokeWidth={1.25}
					class="text-surface-300 dark:text-surface-600 mx-auto mb-5"
					aria-hidden="true"
				/>
				<p class="text-muted text-lg font-light">
					{m.programme_tba()}
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	@media (max-width: 639px) {
		.programme-body {
			--space-block: 2rem;
		}
	}
	.day-pill {
		/* The only in-page navigation on a four-day schedule, and the control most
		   likely to be tapped while walking into a room — it rendered 33px against
		   a documented 2.75rem floor. The bar's own padding drops from py-3 to
		   py-2 so honouring the floor costs the sticky bar 2px, not 11. */
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		font-family: var(--font-sans);
		font-size: var(--text-caption);
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--ink-subtle);
		background-color: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-full);
		padding: 0.35rem 0.85rem;
		white-space: nowrap;
		flex-shrink: 0;
		transition:
			background-color var(--duration-fast) var(--ease-standard),
			color var(--duration-fast) var(--ease-standard),
			border-color var(--duration-fast) var(--ease-standard);
	}

	/* Below 360px the four pills need 5.6px back to fit on their single row.
	   Content-driven, not a device breakpoint: 359px is the width at which
	   French — the wider of the two locales — stops fitting. The 2.75rem touch
	   floor is untouched; only the horizontal padding gives. */
	@media (max-width: 359px) {
		.day-pill {
			padding-inline: 0.55rem;
		}
	}

	.day-pill:hover {
		color: var(--ink-strong);
		border-color: var(--border-strong);
	}

	/* Solid gold, one per page — the "happening now" day. */
	.day-pill.is-today {
		background-color: var(--accent);
		border-color: var(--accent);
		color: var(--color-ink);
	}
</style>
