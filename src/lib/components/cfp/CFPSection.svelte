<script lang="ts">
	import { cfpInfo } from '$lib/data/cfp';
	import { siteConfig } from '$lib/data/site-config';
	import { organizers } from '$lib/data/organizers';
	import { thematicAxes } from '$lib/data/thematic-axes';
	import { contactEmails } from '$lib/data/contacts';
	import { t } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { Send, ExternalLink } from '@lucide/svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	const JDHASA_NAME = 'Journal of the Digital Humanities Association of Southern Africa (JDHASA)';
	const JDHASA_URL = 'https://upjournals.up.ac.za/index.php/dhasa';

	const locale = $derived(getLocale());

	const publicationParts = $derived.by(() => {
		const full = t(cfpInfo.publication);
		const idx = full.indexOf(JDHASA_NAME);
		if (idx === -1) return { before: full, after: '' };
		return {
			before: full.slice(0, idx),
			after: full.slice(idx + JDHASA_NAME.length)
		};
	});

	const keyDates = $derived([
		{ label: m.submission_deadline(), value: formatDate(cfpInfo.deadline) },
		{ label: m.notification_date(), value: formatDate(cfpInfo.notificationDate) },
		{ label: m.full_papers_deadline(), value: formatDate(cfpInfo.fullPapersDeadline) },
		{
			label: m.workshop_dates(),
			value: formatDateRange(siteConfig.dates.start, siteConfig.dates.end)
		}
	]);

	function formatDate(isoDate: string): string {
		return new Date(isoDate).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatDateRange(startIso: string, endIso: string): string {
		const start = new Date(startIso);
		const end = new Date(endIso);
		const loc = locale === 'fr' ? 'fr-FR' : 'en-GB';
		if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
			const month = start.toLocaleDateString(loc, { month: 'long' });
			const year = start.getFullYear();
			return `${start.getDate()}–${end.getDate()} ${month} ${year}`;
		}
		return `${formatDate(startIso)} – ${formatDate(endIso)}`;
	}
</script>

<div class="space-y-14">
	<!-- Rationale -->
	<ScrollReveal>
		<section>
			<h2 class="text-section text-ink dark:text-surface-50 mb-5">
				{m.cfp_rationale_label()}
			</h2>
			<p class="text-prose text-ink-muted dark:text-surface-300">
				{t(cfpInfo.rationale)}
			</p>
		</section>
	</ScrollReveal>

	<!-- Convenors -->
	<ScrollReveal delay={1}>
		<section>
			<h2 class="text-section text-ink dark:text-surface-50 mb-5">
				{m.cfp_convenors_label()}
			</h2>
			<ul class="space-y-2.5">
				{#each organizers as organizer}
					<li class="text-ink-muted dark:text-surface-300 flex items-start gap-3 font-light">
						<span
							class="bg-secondary-500 mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
							aria-hidden="true"
						></span>
						<span class="leading-relaxed">
							<span class="text-ink dark:text-surface-100 font-medium">{organizer.name}</span>, {t(
								organizer.affiliation
							)}
						</span>
					</li>
				{/each}
			</ul>
		</section>
	</ScrollReveal>

	<!-- Thematic Axes reference -->
	<ScrollReveal delay={2}>
		<section>
			<h2 class="text-section text-ink dark:text-surface-50 mb-5">
				{m.section_thematic_axes()}
			</h2>
			<p class="text-prose text-ink-muted dark:text-surface-300 mb-8">
				{m.thematic_axes_reference()}
			</p>
			<div class="space-y-8">
				{#each thematicAxes as axis}
					<div>
						<div class="mb-3 flex items-baseline gap-4">
							<span
								class="text-secondary-600 dark:text-secondary-400 font-display w-8 flex-shrink-0 text-2xl leading-none"
								aria-hidden="true"
							>
								0{axis.number}
							</span>
							<h3
								class="text-ink dark:text-surface-100 font-sans text-base leading-snug font-medium sm:text-lg"
							>
								{t(axis.title)}
							</h3>
						</div>
						<p class="text-prose text-ink-muted dark:text-surface-300 pl-12">
							{t(axis.description)}
						</p>
					</div>
				{/each}
			</div>
		</section>
	</ScrollReveal>

	<!-- Workshop Format & Language Policy -->
	<ScrollReveal delay={3}>
		<section>
			<h2 class="text-section text-ink dark:text-surface-50 mb-5">
				{m.workshop_format_label()}
			</h2>
			<p class="text-prose text-ink-muted dark:text-surface-300">
				{t(cfpInfo.workshopFormat)}
			</p>
		</section>
	</ScrollReveal>

	<!-- Guidelines -->
	<ScrollReveal delay={4}>
		<section>
			<h2 class="text-section text-ink dark:text-surface-50 mb-5">{m.guidelines()}</h2>
			<p class="text-prose text-ink-muted dark:text-surface-300 mb-5">
				{t(cfpInfo.guidelines)}
			</p>
			<p class="text-prose text-ink-muted dark:text-surface-300 mb-5">
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
								<span class="text-ink dark:text-surface-100 font-medium">{organizer.name}</span>:
								<a href="mailto:{email}" class="link-inline">{email}</a>
							</span>
						</li>
					{/if}
				{/each}
			</ul>
		</section>
	</ScrollReveal>

	<!-- Publication -->
	<ScrollReveal delay={5}>
		<section>
			<h2 class="text-section text-ink dark:text-surface-50 mb-5">
				{m.cfp_publication_label()}
			</h2>
			<p class="text-prose text-ink-muted dark:text-surface-300">
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
	<ScrollReveal delay={6}>
		<section>
			<h2 class="text-section text-ink dark:text-surface-50 mb-5">
				{m.cfp_selection_label()}
			</h2>
			<p class="text-prose text-ink-muted dark:text-surface-300">
				{t(cfpInfo.selectionCriteria)}
			</p>
		</section>
	</ScrollReveal>

	<!-- Funding -->
	<ScrollReveal delay={7}>
		<section>
			<h2 class="text-section text-ink dark:text-surface-50 mb-5">
				{m.cfp_funding_label()}
			</h2>
			<p class="text-prose text-ink-muted dark:text-surface-300">
				{m.cfp_funding_text()}
			</p>
		</section>
	</ScrollReveal>

	<!-- Key Dates — refined timeline -->
	<ScrollReveal delay={8}>
		<section>
			<h2 class="text-section text-ink dark:text-surface-50 mb-8">{m.key_dates()}</h2>
			<ol class="relative">
				<!-- vertical rule -->
				<span
					class="bg-secondary-500/40 dark:bg-secondary-400/30 absolute top-2 bottom-2 left-[5px] hidden w-px sm:block"
					aria-hidden="true"
				></span>
				<div class="space-y-5">
					{#each keyDates as dateItem}
						<li class="flex items-start gap-5">
							<span
								class="bg-secondary-500 border-cream dark:border-deep relative z-10 mt-1.5 hidden h-[11px] w-[11px] flex-shrink-0 rounded-full border-2 sm:block"
								aria-hidden="true"
							></span>
							<div class="card border-surface-200/60 dark:border-surface-700/50 flex-1 border p-5">
								<p class="text-meta mb-1">{dateItem.label}</p>
								<p class="text-ink dark:text-surface-50 font-sans text-lg font-medium">
									{dateItem.value}
								</p>
							</div>
						</li>
					{/each}
				</div>
			</ol>
		</section>
	</ScrollReveal>

	<!-- Submit button -->
	{#if cfpInfo.submissionUrl}
		<ScrollReveal delay={9}>
			<div class="pt-4 text-center">
				<a
					href={cfpInfo.submissionUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-primary px-7 py-3.5 text-[0.9375rem]"
				>
					<Send size={17} strokeWidth={1.75} />
					{m.submit_proposal()}
				</a>
			</div>
		</ScrollReveal>
	{/if}
</div>
