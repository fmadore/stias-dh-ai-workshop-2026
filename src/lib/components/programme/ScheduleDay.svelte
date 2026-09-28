<script lang="ts">
	import type { ProgrammeDay, SessionCast } from '$lib/types';
	import * as m from '$lib/paraglide/messages';
	import { t } from '$lib/utils/i18n';
	import SessionCard from './SessionCard.svelte';

	let {
		day,
		/** Session id → panel number, counted across the whole programme (`panelNumbers`). */
		panels,
		/** Session id → the people and papers it names (`sessionCasts`). */
		casts,
		isToday = false
	}: {
		day: ProgrammeDay;
		panels: ReadonlyMap<string, number>;
		casts: Record<string, SessionCast>;
		isToday?: boolean;
	} = $props();
</script>

<!-- scroll-mt derived, not guessed: scroll-padding-top clears the fixed
     header, this clears the sticky day bar on top of it. -->
<section id="day-{day.date}" class="scroll-mt-[var(--day-bar-height)]">
	<div class="mb-5 flex flex-wrap items-center gap-3">
		<!-- h2: days are the top-level sections under the page's h1 -->
		<h2 class="text-section text-strong">{t(day.dayLabel)}</h2>
		{#if isToday}
			<span
				class="bg-accent text-ink text-badge rounded-full px-2.5 py-1 font-semibold tracking-[0.16em] uppercase"
			>
				{m.programme_happening_now()}
			</span>
		{/if}
	</div>
	<div class="card px-4 py-1 sm:px-6 sm:py-2">
		{#each day.sessions as session (session.id)}
			<SessionCard {session} panelNumber={panels.get(session.id)} cast={casts[session.id]} />
		{/each}
	</div>
</section>
