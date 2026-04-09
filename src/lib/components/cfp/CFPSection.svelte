<script lang="ts">
	import { cfpInfo } from '$lib/data/cfp';
	import { siteConfig } from '$lib/data/site-config';
	import { organizers } from '$lib/data/organizers';
	import { thematicAxes } from '$lib/data/thematic-axes';
	import { contactEmails } from '$lib/data/contacts';
	import { t } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { Send, ExternalLink } from 'lucide-svelte';
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
		<div>
			<h2 class="text-surface-900 dark:text-surface-50 mb-4 text-2xl">
				{m.cfp_rationale_label()}
			</h2>
			<p
				class="text-surface-600 dark:text-surface-300 font-sans text-base leading-relaxed font-light sm:text-lg"
			>
				{t(cfpInfo.rationale)}
			</p>
		</div>
	</ScrollReveal>

	<!-- Convenors -->
	<ScrollReveal delay={1}>
		<div>
			<h2 class="text-surface-900 dark:text-surface-50 mb-4 text-2xl">
				{m.cfp_convenors_label()}
			</h2>
			<ul class="space-y-2">
				{#each organizers as organizer}
					<li
						class="text-surface-600 dark:text-surface-300 flex items-start gap-3 font-sans font-light"
					>
						<span class="bg-secondary-400 mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
						<span class="leading-relaxed">
							<span class="text-surface-800 dark:text-surface-100 font-medium"
								>{organizer.name}</span
							>, {t(organizer.affiliation)}
						</span>
					</li>
				{/each}
			</ul>
		</div>
	</ScrollReveal>

	<!-- Thematic Axes reference -->
	<ScrollReveal delay={2}>
		<div>
			<h2 class="text-surface-900 dark:text-surface-50 mb-4 text-2xl">
				{m.section_thematic_axes()}
			</h2>
			<p
				class="text-surface-600 dark:text-surface-300 mb-6 font-sans text-base leading-relaxed font-light sm:text-lg"
			>
				{m.thematic_axes_reference()}
			</p>
			<div class="space-y-8">
				{#each thematicAxes as axis}
					<div>
						<div class="mb-3 flex items-start gap-4">
							<span
								class="from-secondary-400 to-secondary-500 mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-medium text-white"
							>
								{axis.number}
							</span>
							<h3 class="text-surface-800 dark:text-surface-100 leading-relaxed font-medium">
								{t(axis.title)}
							</h3>
						</div>
						<p
							class="text-surface-600 dark:text-surface-300 pl-11 font-sans text-base leading-relaxed font-light sm:text-lg"
						>
							{t(axis.description)}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</ScrollReveal>

	<!-- Workshop Format & Language Policy -->
	<ScrollReveal delay={3}>
		<div>
			<h2 class="text-surface-900 dark:text-surface-50 mb-4 text-2xl">
				{m.workshop_format_label()}
			</h2>
			<p
				class="text-surface-600 dark:text-surface-300 font-sans text-base leading-relaxed font-light sm:text-lg"
			>
				{t(cfpInfo.workshopFormat)}
			</p>
		</div>
	</ScrollReveal>

	<!-- Guidelines -->
	<ScrollReveal delay={4}>
		<div>
			<h2 class="text-surface-900 dark:text-surface-50 mb-4 text-2xl">{m.guidelines()}</h2>
			<p
				class="text-surface-600 dark:text-surface-300 mb-4 font-sans text-base leading-relaxed font-light sm:text-lg"
			>
				{t(cfpInfo.guidelines)}
			</p>
			<p
				class="text-surface-600 dark:text-surface-300 mb-4 font-sans text-base leading-relaxed font-light sm:text-lg"
			>
				{m.cfp_contact_text()}
			</p>
			<ul class="space-y-2">
				{#each organizers as organizer}
					{@const email = contactEmails[organizer.id]}
					{#if email}
						<li class="flex items-start gap-3 font-sans font-light">
							<span class="bg-secondary-400 mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
							<span class="leading-relaxed">
								<span class="text-surface-800 dark:text-surface-100 font-medium"
									>{organizer.name}</span
								>:
								<a href="mailto:{email}" class="text-primary-500 hover:text-primary-600">{email}</a>
							</span>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	</ScrollReveal>

	<!-- Publication -->
	<ScrollReveal delay={5}>
		<div>
			<h2 class="text-surface-900 dark:text-surface-50 mb-4 text-2xl">
				{m.cfp_publication_label()}
			</h2>
			<p
				class="text-surface-600 dark:text-surface-300 font-sans text-base leading-relaxed font-light sm:text-lg"
			>
				{publicationParts.before}<a
					href={JDHASA_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary-500 hover:text-primary-600 inline-items-center italic"
					>{JDHASA_NAME}<ExternalLink size={14} class="-mt-0.5 ml-1 inline" /></a
				>{publicationParts.after}
			</p>
		</div>
	</ScrollReveal>

	<!-- Selection Criteria & Inclusivity -->
	<ScrollReveal delay={6}>
		<div>
			<h2 class="text-surface-900 dark:text-surface-50 mb-4 text-2xl">
				{m.cfp_selection_label()}
			</h2>
			<p
				class="text-surface-600 dark:text-surface-300 font-sans text-base leading-relaxed font-light sm:text-lg"
			>
				{t(cfpInfo.selectionCriteria)}
			</p>
		</div>
	</ScrollReveal>

	<!-- Funding & Logistics -->
	<ScrollReveal delay={7}>
		<div>
			<h2 class="text-surface-900 dark:text-surface-50 mb-4 text-2xl">
				{m.cfp_funding_label()}
			</h2>
			<p
				class="text-surface-600 dark:text-surface-300 font-sans text-base leading-relaxed font-light sm:text-lg"
			>
				{m.cfp_funding_text()}
			</p>
		</div>
	</ScrollReveal>

	<!-- Key Dates — Timeline style -->
	<ScrollReveal delay={8}>
		<div>
			<h2 class="text-surface-900 dark:text-surface-50 mb-8 text-2xl">{m.key_dates()}</h2>
			<div class="relative">
				<!-- Connecting line -->
				<div
					class="from-secondary-400 via-secondary-300 to-primary-400 absolute top-2 bottom-2 left-[11px] hidden w-px bg-gradient-to-b sm:block"
				></div>

				<div class="space-y-6">
					{#each keyDates as dateItem}
						<div class="flex items-start gap-5">
							<!-- Timeline dot -->
							<div
								class="dark:bg-surface-800 border-secondary-400 relative z-10 mt-0.5 hidden h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 bg-white sm:flex"
							>
								<div class="bg-secondary-400 h-2 w-2 rounded-full"></div>
							</div>
							<div
								class="dark:bg-surface-800/80 border-surface-200/50 dark:border-surface-700/50 flex-1 rounded-xl border bg-white p-5"
							>
								<p
									class="text-surface-400 dark:text-surface-500 mb-1 font-sans text-sm font-medium tracking-wider uppercase"
								>
									{dateItem.label}
								</p>
								<p class="text-surface-900 dark:text-surface-50 font-sans text-lg font-semibold">
									{dateItem.value}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</ScrollReveal>

	<!-- Submit button -->
	{#if cfpInfo.submissionUrl}
		<ScrollReveal delay={9}>
			<div class="pt-4 text-center">
				<a
					href={cfpInfo.submissionUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="bg-primary-600 hover:bg-primary-700 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-sans font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
				>
					<Send size={18} />
					{m.submit_proposal()}
				</a>
			</div>
		</ScrollReveal>
	{/if}
</div>
