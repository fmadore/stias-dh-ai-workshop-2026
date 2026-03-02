<script lang="ts">
	import { cfpInfo } from '$lib/data/cfp';
	import { siteConfig } from '$lib/data/site-config';
	import { organizers } from '$lib/data/organizers';
	import { thematicAxes } from '$lib/data/thematic-axes';
	import { contactEmails } from '$lib/data/contacts';
	import { t } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { Send } from 'lucide-svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	const locale = $derived(getLocale());

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
			<h2 class="text-2xl mb-4 text-surface-900 dark:text-surface-50">
				{m.cfp_rationale_label()}
			</h2>
			<p
				class="text-surface-600 dark:text-surface-300 leading-relaxed font-sans font-light text-base sm:text-lg"
			>
				{t(cfpInfo.rationale)}
			</p>
		</div>
	</ScrollReveal>

	<!-- Convenors -->
	<ScrollReveal delay={1}>
		<div>
			<h2 class="text-2xl mb-4 text-surface-900 dark:text-surface-50">
				{m.cfp_convenors_label()}
			</h2>
			<ul class="space-y-2">
				{#each organizers as organizer}
					<li
						class="flex items-start gap-3 text-surface-600 dark:text-surface-300 font-sans font-light"
					>
						<span class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-secondary-400 mt-2.5"></span>
						<span class="leading-relaxed">
							<span class="font-medium text-surface-800 dark:text-surface-100"
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
			<h2 class="text-2xl mb-4 text-surface-900 dark:text-surface-50">
				{m.section_thematic_axes()}
			</h2>
			<p
				class="text-surface-600 dark:text-surface-300 leading-relaxed font-sans font-light text-base sm:text-lg mb-6"
			>
				{m.thematic_axes_reference()}
			</p>
			<div class="space-y-8">
				{#each thematicAxes as axis}
					<div>
						<div class="flex items-start gap-4 mb-3">
							<span
								class="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-500 text-white text-sm font-medium flex items-center justify-center mt-0.5"
							>
								{axis.number}
							</span>
							<h3 class="font-medium text-surface-800 dark:text-surface-100 leading-relaxed">
								{t(axis.title)}
							</h3>
						</div>
						<p
							class="text-surface-600 dark:text-surface-300 leading-relaxed font-sans font-light text-base sm:text-lg pl-11"
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
			<h2 class="text-2xl mb-4 text-surface-900 dark:text-surface-50">
				{m.workshop_format_label()}
			</h2>
			<p
				class="text-surface-600 dark:text-surface-300 leading-relaxed font-sans font-light text-base sm:text-lg"
			>
				{t(cfpInfo.workshopFormat)}
			</p>
		</div>
	</ScrollReveal>

	<!-- Guidelines -->
	<ScrollReveal delay={4}>
		<div>
			<h2 class="text-2xl mb-4 text-surface-900 dark:text-surface-50">{m.guidelines()}</h2>
			<p
				class="text-surface-600 dark:text-surface-300 leading-relaxed font-sans font-light text-base sm:text-lg mb-4"
			>
				{t(cfpInfo.guidelines)}
			</p>
			<p
				class="text-surface-600 dark:text-surface-300 leading-relaxed font-sans font-light text-base sm:text-lg mb-4"
			>
				{m.cfp_contact_text()}
			</p>
			<ul class="space-y-2">
				{#each organizers as organizer}
					{@const email = contactEmails[organizer.id]}
					{#if email}
						<li class="flex items-start gap-3 font-sans font-light">
							<span class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-secondary-400 mt-2.5"></span>
							<span class="leading-relaxed">
								<span class="font-medium text-surface-800 dark:text-surface-100"
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

	<!-- Selection Criteria & Inclusivity -->
	<ScrollReveal delay={5}>
		<div>
			<h2 class="text-2xl mb-4 text-surface-900 dark:text-surface-50">
				{m.cfp_selection_label()}
			</h2>
			<p
				class="text-surface-600 dark:text-surface-300 leading-relaxed font-sans font-light text-base sm:text-lg"
			>
				{t(cfpInfo.selectionCriteria)}
			</p>
		</div>
	</ScrollReveal>

	<!-- Key Dates — Timeline style -->
	<ScrollReveal delay={6}>
		<div>
			<h2 class="text-2xl mb-8 text-surface-900 dark:text-surface-50">{m.key_dates()}</h2>
			<div class="relative">
				<!-- Connecting line -->
				<div
					class="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-secondary-400 via-secondary-300 to-primary-400 hidden sm:block"
				></div>

				<div class="space-y-6">
					{#each keyDates as dateItem}
						<div class="flex items-start gap-5">
							<!-- Timeline dot -->
							<div
								class="flex-shrink-0 relative z-10 w-6 h-6 rounded-full bg-white dark:bg-surface-800 border-2 border-secondary-400 mt-0.5 hidden sm:flex items-center justify-center"
							>
								<div class="w-2 h-2 rounded-full bg-secondary-400"></div>
							</div>
							<div
								class="flex-1 bg-white dark:bg-surface-800/80 rounded-xl p-5 border border-surface-200/50 dark:border-surface-700/50"
							>
								<p
									class="text-sm font-sans font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-1"
								>
									{dateItem.label}
								</p>
								<p class="text-lg font-sans font-semibold text-surface-900 dark:text-surface-50">
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
		<ScrollReveal delay={7}>
			<div class="text-center pt-4">
				<a
					href={cfpInfo.submissionUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-sans font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
				>
					<Send size={18} />
					{m.submit_proposal()}
				</a>
			</div>
		</ScrollReveal>
	{/if}
</div>
