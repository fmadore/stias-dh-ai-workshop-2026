<script lang="ts">
	import { venueInfo, venueStreet } from '$lib/data/venue';
	import { t } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { Check, ExternalLink, Minus } from '@lucide/svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { countryName } from '$lib/utils/country';

	const locale = $derived(getLocale() as 'en' | 'fr');

	// Two lists, not one sentence. See the comment on `logisticsCovered`.
	const covered = $derived(venueInfo.logisticsCovered[locale] ?? venueInfo.logisticsCovered.en);
	const notCovered = $derived(
		venueInfo.logisticsNotCovered[locale] ?? venueInfo.logisticsNotCovered.en
	);
</script>

<div class="space-y-10">
	<section>
		<!-- No eyebrow: it was `m.section_venue()`, the same string the page's own
		     h1 renders 300px above it. A label that repeats the heading it sits
		     under carries nothing. -->
		<h2 class="text-section text-strong mb-2">{venueInfo.name}</h2>
		<p class="text-link mb-4 text-lg font-light">
			{t(venueInfo.fullName)}
		</p>
		<p class="text-prose text-body mb-4">
			{t(venueInfo.description)}
		</p>
		<!-- The page that answers "where is this" is the page where someone asks
		     whether they have to be there. The platform is a fact; no joining
		     details are published yet, so none are promised. -->
		<p class="text-prose text-body mb-4">
			{m.venue_hybrid()}
		</p>
		<p class="text-muted text-sm">
			{venueStreet}, {venueInfo.postalCode}
			{venueInfo.city}, {countryName(venueInfo.country, locale)}
		</p>
		<a
			href={venueInfo.website}
			target="_blank"
			rel="noopener noreferrer"
			class="link-arrow mt-3 text-sm"
			aria-label={m.visit_website_of({ name: venueInfo.name })}
		>
			<ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
			{m.visit_website()}
		</a>
	</section>

	<section>
		<h2 class="text-section text-strong mb-5">{m.logistics_label()}</h2>
		<div class="logistics-groups">
			<div>
				<h3 class="text-meta text-muted mb-3">{m.logistics_covered_label()}</h3>
				<ul class="logistics-list">
					{#each covered as item (item)}
						<li>
							<Check size={15} strokeWidth={2} aria-hidden="true" class="text-link" />
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</div>
			<div>
				<h3 class="text-meta text-muted mb-3">{m.logistics_not_covered_label()}</h3>
				<ul class="logistics-list">
					{#each notCovered as item (item)}
						<li>
							<Minus size={15} strokeWidth={2} aria-hidden="true" class="text-muted" />
							<span>{item}</span>
						</li>
					{/each}
				</ul>
				<p class="text-muted mt-3 text-sm">{m.logistics_not_covered_note()}</p>
			</div>
		</div>
	</section>
</div>

<style>
	/* Side by side once there is room for two columns of short phrases, stacked
	   below it — the French items run long enough that a two-column grid at
	   375px would break "les repas pendant les jours de voyage" across four
	   lines a word wide. */
	.logistics-groups {
		display: grid;
		gap: 2rem;
	}
	@media (min-width: 640px) {
		.logistics-groups {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 2.5rem;
		}
	}

	.logistics-list {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		list-style: none;
		padding: 0;
		margin: 0;
		color: var(--ink-body);
	}

	.logistics-list li {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.625rem;
		align-items: start;
		line-height: 1.5;
	}

	/* The icon sits on the first line's cap height rather than its box top. */
	.logistics-list :global(svg) {
		margin-block-start: 0.2em;
	}
</style>
