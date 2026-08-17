<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { t, localePath } from '$lib/utils/i18n';
	import { isCfpOpen, nextMilestone, workshopPhase } from '$lib/utils/milestones';
	import Countdown from './Countdown.svelte';
	import { ArrowRight } from '@lucide/svelte';

	// The title carries its own deck after the colon ("…in African Studies:
	// Towards sustainable and equitable practices"). As one balanced headline
	// it disappeared; split it into a display line and an italic serif deck.
	const parts = $derived(t(siteConfig.title).split(/\s*:\s*/));
	const headline = $derived(parts[0]);
	const deck = $derived(parts.slice(1).join(': '));

	// The call closed on 30 April 2026, so the primary ask is no longer
	// "submit" — it is the programme. Derived rather than hard-coded so the
	// hero is right at every stage of the workshop's life.
	const cfpOpen = $derived(isCfpOpen());
	const phase = $derived(workshopPhase());
	const milestone = $derived(nextMilestone());

	const primary = $derived(
		cfpOpen
			? { href: localePath('/call-for-papers'), label: m.submit_proposal() }
			: { href: localePath('/programme'), label: m.section_programme() }
	);
	const secondary = $derived(
		cfpOpen
			? { href: localePath('/call-for-papers'), label: m.hero_cta_read_call() }
			: { href: localePath('/papers'), label: m.hero_cta_browse_papers() }
	);
	const tertiary = $derived(
		cfpOpen
			? { href: localePath('/programme'), label: m.section_programme() }
			: { href: localePath('/participants'), label: m.section_participants() }
	);
</script>

<section
	class="from-primary-900 via-primary-800 to-primary-950 grain focus-on-inverse relative overflow-hidden bg-gradient-to-br text-white"
>
	<!-- Texture comes from the .grain class above; a second inline feTurbulence
	     layer only stacked more noise for another rasterised filter pass. -->

	<!-- Single soft radial accent -->
	<div
		class="pointer-events-none absolute -top-1/3 -right-1/4 h-[140%] w-[70%] rounded-full opacity-[0.18]"
		style="background: radial-gradient(closest-side, var(--color-secondary-500), transparent 70%);"
		aria-hidden="true"
	></div>

	<div class="container-wide relative z-10">
		<div class="max-w-3xl pt-[clamp(4.5rem,10vw,8rem)] pb-[clamp(3rem,6vw,4.5rem)]">
			<p
				class="mb-6 text-xs font-medium tracking-[0.18em] text-[var(--color-primary-200)] uppercase"
			>
				{m.hero_subtitle()}
			</p>

			<h1 class="text-display mb-5 text-white">{headline}</h1>

			{#if deck}
				<p class="font-display text-secondary-300 mb-7 text-2xl leading-[1.3] italic sm:text-3xl">
					{deck}
				</p>
			{/if}

			<div
				class="text-primary-100/85 mb-9 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:text-base"
			>
				<span>{m.hero_dates()}</span>
				<span class="text-primary-300/40" aria-hidden="true">·</span>
				<span>{m.hero_location()}</span>
				<span class="text-primary-300/40" aria-hidden="true">·</span>
				<span>{m.hero_format()}</span>
			</div>

			<!-- The page has a job now. Gold is solid here — it is the one place
			     the second brand colour is a colour rather than a hairline. -->
			<div class="flex flex-wrap items-center gap-3">
				<a href={primary.href} class="btn btn-accent">
					{primary.label}
					<ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
				</a>
				<a href={secondary.href} class="btn btn-on-dark">{secondary.label}</a>
				<a href={tertiary.href} class="btn btn-quiet-on-dark">{tertiary.label}</a>
			</div>
		</div>
	</div>

	<!-- Deadline strip: the countdown moved out of the spotlight and now counts
	     to the next thing anyone can act on, in days. -->
	{#if milestone}
		<div class="relative z-10 border-t border-white/12 bg-black/20">
			<div
				class="container-wide flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4.5"
			>
				<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<span class="text-secondary-300 text-badge font-semibold tracking-[0.16em] uppercase">
						{milestone.label}
					</span>
					<span class="text-primary-100 font-mono text-sm">{milestone.value}</span>
				</div>
				<Countdown target={milestone.datetime} milestone={milestone.label} />
			</div>
		</div>
	{:else if phase === 'during'}
		<div class="relative z-10 border-t border-white/12 bg-black/20">
			<div class="container-wide py-4.5">
				<p class="text-secondary-300 font-medium">{m.countdown_event_started()}</p>
			</div>
		</div>
	{:else}
		<div class="relative z-10 border-t border-white/12 bg-black/20">
			<div class="container-wide py-4.5">
				<p class="text-primary-100/80">{m.countdown_event_ended()}</p>
			</div>
		</div>
	{/if}
</section>
