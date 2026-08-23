<script lang="ts">
	import { cfpInfo } from '$lib/data/cfp';
	import { organizers } from '$lib/data/organizers';
	import { venueInfo } from '$lib/data/venue';
	import { joinLogisticsList } from '$lib/utils/logistics';
	import { thematicAxes } from '$lib/data/thematic-axes';
	import { contactEmails } from '$lib/data/contacts';
	import { t } from '$lib/utils/i18n';
	import { getMilestones } from '$lib/utils/milestones';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import { Send, ExternalLink, Check } from '@lucide/svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	const locale = $derived(getLocale() as 'en' | 'fr');

	const JDHASA_NAME = 'Journal of the Digital Humanities Association of Southern Africa (JDHASA)';
	const JDHASA_URL = 'https://upjournals.up.ac.za/index.php/dhasa';

	const publicationParts = $derived.by(() => {
		const full = t(cfpInfo.publication);
		const idx = full.indexOf(JDHASA_NAME);
		if (idx === -1) return { before: full, after: '' };
		return {
			before: full.slice(0, idx),
			after: full.slice(idx + JDHASA_NAME.length)
		};
	});

	// getMilestones, not getKeyDates: the same four dates render on the home
	// page flagged past/next, and rendered here as a bare list with no state at
	// all — on the one page whose whole subject is a deadline that has passed.
	// The PDF and text exports build their own list in generate-cfp-downloads.ts
	// and stay stateless, as a record of the call as published should.
	const keyDates = $derived(getMilestones());
</script>

<div class="block-flow">
	<!-- Rationale -->
	<ScrollReveal>
		<section>
			<h2 class="text-section text-strong mb-5">
				{m.cfp_rationale_label()}
			</h2>
			<p class="text-prose text-body">
				{t(cfpInfo.rationale)}
			</p>
		</section>
	</ScrollReveal>

	<!-- Convenors -->
	<ScrollReveal>
		<section>
			<h2 class="text-section text-strong mb-5">
				{m.cfp_convenors_label()}
			</h2>
			<ul class="space-y-2.5">
				{#each organizers as organizer}
					<li class="text-body flex items-start gap-3 font-light">
						<span
							class="bg-secondary-500 mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
							aria-hidden="true"
						></span>
						<span class="leading-relaxed">
							<span class="text-strong font-medium">{organizer.name}</span>, {t(
								organizer.affiliation
							)}
						</span>
					</li>
				{/each}
			</ul>
		</section>
	</ScrollReveal>

	<!-- Thematic Axes reference -->
	<ScrollReveal>
		<section>
			<h2 class="text-section text-strong mb-5">
				{m.section_thematic_axes()}
			</h2>
			<p class="text-prose text-body mb-8">
				{m.thematic_axes_reference()}
			</p>
			<div class="space-y-8">
				{#each thematicAxes as axis}
					<div>
						<div class="mb-3 flex items-baseline gap-4">
							<span
								class="text-accent-ink font-display w-8 flex-shrink-0 text-2xl leading-none"
								aria-hidden="true"
							>
								0{axis.number}
							</span>
							<!-- The same thematic axes render as .text-card-title on /about
							     (ThematicAxis.svelte); one role, one rendering. The sans/medium
							     utilities here never applied — a bare h3 outranked them — so
							     this has always shipped as display serif. -->
							<h3 class="text-card-title text-strong">
								{t(axis.title)}
							</h3>
						</div>
						<p class="text-prose text-body pl-12">
							{t(axis.description)}
						</p>
					</div>
				{/each}
			</div>
		</section>
	</ScrollReveal>

	<!-- Workshop Format & Language Policy -->
	<ScrollReveal>
		<section>
			<h2 class="text-section text-strong mb-5">
				{m.workshop_format_label()}
			</h2>
			<p class="text-prose text-body">
				{t(cfpInfo.workshopFormat)}
			</p>
		</section>
	</ScrollReveal>

	<!-- Guidelines -->
	<ScrollReveal>
		<section>
			<h2 class="text-section text-strong mb-5">{m.guidelines()}</h2>
			<p class="text-prose text-body mb-5">
				{t(cfpInfo.guidelines)}
			</p>
			<p class="text-prose text-body mb-5">
				{m.cfp_contact_text()}
			</p>
			<ul class="space-y-2.5">
				{#each organizers as organizer}
					{@const email = contactEmails[organizer.id]}
					{#if email}
						<li class="flex items-start gap-3 font-light">
							<span
								class="bg-secondary-500 mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
								aria-hidden="true"
							></span>
							<span class="leading-relaxed">
								<span class="text-strong font-medium">{organizer.name}</span>:
								<a href="mailto:{email}" class="link-inline">{email}</a>
							</span>
						</li>
					{/if}
				{/each}
			</ul>
		</section>
	</ScrollReveal>

	<!-- Publication -->
	<ScrollReveal>
		<section>
			<h2 class="text-section text-strong mb-5">
				{m.cfp_publication_label()}
			</h2>
			<p class="text-prose text-body">
				{publicationParts.before}<a
					href={JDHASA_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="link-inline italic"
					>{JDHASA_NAME}<ExternalLink size={13} class="-mt-0.5 ml-1 inline" aria-hidden="true" /></a
				>{publicationParts.after}
			</p>
		</section>
	</ScrollReveal>

	<!-- Selection Criteria -->
	<ScrollReveal>
		<section>
			<h2 class="text-section text-strong mb-5">
				{m.cfp_selection_label()}
			</h2>
			<p class="text-prose text-body">
				{t(cfpInfo.selectionCriteria)}
			</p>
		</section>
	</ScrollReveal>

	<!-- Funding -->
	<ScrollReveal>
		<section>
			<h2 class="text-section text-strong mb-5">
				{m.cfp_funding_label()}
			</h2>
			<!-- Composed from the venue's two logistics lists — one source of truth,
			     and this page keeps the sentence the call was published with. -->
			<p class="text-prose text-body">
				{m.logistics_covered_sentence({
					items: joinLogisticsList(venueInfo.logisticsCovered, locale)
				})}
				{m.logistics_not_covered_sentence({
					items: joinLogisticsList(venueInfo.logisticsNotCovered, locale)
				})}
			</p>
		</section>
	</ScrollReveal>

	<!-- Key Dates — refined timeline -->
	<ScrollReveal>
		<section>
			<h2 class="text-section text-strong mb-8">{m.key_dates()}</h2>
			<div class="relative">
				<!-- vertical rule -->
				<span
					class="bg-secondary-500/40 dark:bg-secondary-400/30 absolute top-2 bottom-2 left-[5px] hidden w-px sm:block"
					aria-hidden="true"
				></span>
				<ol class="space-y-5">
					{#each keyDates as dateItem (dateItem.id)}
						<li class="flex items-start gap-5">
							<span
								class="bg-secondary-500 border-cream dark:border-deep relative z-10 mt-1.5 hidden h-[11px] w-[11px] flex-shrink-0 rounded-full border-2 sm:block"
								aria-hidden="true"
							></span>
							<div class="card flex-1 p-5" class:is-past={dateItem.past}>
								<div class="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
									<p class="text-meta">{dateItem.label}</p>
									{#if dateItem.past}
										<span class="text-meta inline-flex items-center gap-1">
											<Check
												size={12}
												strokeWidth={2.5}
												class="text-primary-600 dark:text-primary-300"
												aria-hidden="true"
											/>
											{m.milestone_done()}
										</span>
									{:else if dateItem.next}
										<span class="text-eyebrow">{m.milestone_next()}</span>
									{/if}
								</div>
								<p class="text-strong font-sans text-lg font-medium">
									<time datetime={dateItem.datetime}>{dateItem.value}</time>
								</p>
							</div>
						</li>
					{/each}
				</ol>
			</div>
		</section>
	</ScrollReveal>

	<!-- Submit button -->
	{#if cfpInfo.submissionUrl}
		<ScrollReveal>
			<div class="pt-4 text-center">
				<a
					href={cfpInfo.submissionUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-primary text-ui px-7 py-3.5"
				>
					<Send size={17} strokeWidth={1.75} />
					{m.submit_proposal()}
				</a>
			</div>
		</ScrollReveal>
	{/if}
</div>

<style>
	/* Sunken rather than raised: a date that has passed is still on the record,
	   it just is not what the reader is waiting for. */
	.is-past {
		background-color: var(--surface-sunken);
	}
</style>
