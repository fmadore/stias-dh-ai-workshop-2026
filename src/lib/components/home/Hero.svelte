<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import { siteConfig } from '#lib/data/site-config.ts';
	import { t, localePath } from '#lib/utils/i18n.ts';
	import { ArrowRight } from '@lucide/svelte';

	// The title carries its own deck after the colon ("…in African Studies:
	// Towards sustainable and equitable practices"). As one balanced headline
	// it disappeared; split it into a display line and an italic serif deck.
	const parts = $derived(t(siteConfig.title).split(/\s*:\s*/));
	const headline = $derived(parts[0]);
	const deck = $derived(parts.slice(1).join(': '));

	// The workshop is over, so the actions are what it left behind: the slides
	// and writing first, the papers as a body of work, then the four days they
	// were presented across. Fixed rather than derived from a clock — every
	// phase a clock could report is behind us, and a clock that only runs after
	// hydration kept the static HTML on the "submit a proposal" hero for good.
	const primary = $derived({ href: localePath('/resources'), label: m.hero_cta_resources() });
	const secondary = $derived({ href: localePath('/papers'), label: m.hero_cta_browse_papers() });
	const tertiary = $derived({ href: localePath('/programme'), label: m.section_programme() });
</script>

<!-- One tonal wash, top to bottom, between two adjacent steps of the same teal
     — where there were three stops on a diagonal plus a brass radial at 18%
     plus grain. Three decorative layers on one surface is the "conference
     brand" reading DESIGN.md names; one is the reading room. The wash also
     deepens into the strip below, so that strip needs no overlay of its own. -->
<section
	class="from-primary-900 to-primary-950 grain on-inverse relative overflow-hidden bg-gradient-to-b text-white"
>
	<div class="container-wide relative z-10">
		<div class="max-w-3xl pt-[clamp(4.5rem,10vw,8rem)] pb-[clamp(3rem,6vw,4.5rem)]">
			<p class="text-eyebrow mb-6">{m.hero_subtitle()}</p>

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

	<!-- Status strip: one line stating where the workshop stands, in the
	     prerendered HTML itself. It used to be a live milestone line that only
	     resolved after hydration, so every crawler and no-JS reader saw the
	     dates line and the page then swapped it for this one, shifting the
	     layout under anyone who had started reading. -->
	<div class="relative z-10 border-t border-white/12">
		<div class="container-wide py-4.5">
			<p class="text-primary-100/80">{m.workshop_concluded()}</p>
		</div>
	</div>
</section>
