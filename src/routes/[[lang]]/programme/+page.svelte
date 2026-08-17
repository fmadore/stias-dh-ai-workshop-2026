<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import { programme, programmeLastUpdated } from '$lib/data/programme';
	import ScheduleDay from '$lib/components/programme/ScheduleDay.svelte';
	import { Calendar, Info } from '@lucide/svelte';

	const intl = $derived(getLocale() === 'fr' ? 'fr-FR' : 'en-GB');

	const lastUpdated = $derived(
		new Date(`${programmeLastUpdated}T12:00:00`).toLocaleDateString(intl, {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	);

	/** Today's date in South African time, so "happening now" matches the venue. */
	const todayAtVenue = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Johannesburg' });

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
				isToday: day.date === todayAtVenue,
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
	meta={[m.hero_location(), m.hero_format()]}
/>

<div class="page-end">
	{#if programme.length > 0}
		<!-- A four-day programme is otherwise 3000px of scroll with no way in.
		     bg-page, not bg-cream/90: the .bg-cream alias is unlayered so it beats
		     the generated utility, but an alpha modifier is a different class name
		     and falls through to the raw light-only token. -->
		<nav
			class="bg-page/90 border-subtle sticky top-[var(--nav-height)] z-30 border-b backdrop-blur-md"
			aria-label={m.programme_jump_to_day()}
		>
			<div class="container-page flex flex-wrap items-center gap-2 py-2">
				<span class="text-meta mr-1 hidden sm:inline">{m.programme_jump_to_day()}</span>
				{#each days as entry (entry.day.date)}
					<a href="#day-{entry.day.date}" class="day-pill" class:is-today={entry.isToday}>
						{entry.short}
					</a>
				{/each}
			</div>
		</nav>

		<div class="container-page pt-10">
			<div class="callout mb-10">
				<Info
					size={18}
					strokeWidth={1.75}
					class="text-accent-ink mt-0.5 shrink-0"
					aria-hidden="true"
				/>
				<div>
					<p class="text-body text-sm leading-relaxed">
						{m.programme_preliminary()}
					</p>
					<p class="text-muted mt-1 text-xs">
						{m.programme_last_updated({ date: lastUpdated })}
					</p>
				</div>
			</div>

			<div class="space-y-12">
				{#each days as entry (entry.day.date)}
					<ScheduleDay day={entry.day} panelOffset={entry.panelOffset} isToday={entry.isToday} />
				{/each}
			</div>
		</div>
	{:else}
		<div class="container-readable pt-14">
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
		transition:
			background-color var(--duration-fast) var(--ease-standard),
			color var(--duration-fast) var(--ease-standard),
			border-color var(--duration-fast) var(--ease-standard);
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
