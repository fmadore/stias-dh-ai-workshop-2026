<script lang="ts">
	import { cfpInfo } from '$lib/data/cfp';
	import { siteConfig } from '$lib/data/site-config';
	import { organizers } from '$lib/data/organizers';
	import { thematicAxes } from '$lib/data/thematic-axes';
	import { contactEmails } from '$lib/data/contacts';
	import { t } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { base } from '$app/paths';
	import { Download, Loader2 } from 'lucide-svelte';
	import type { CfpPdfLabels } from '$lib/utils/generate-cfp-pdf';

	interface Props {
		variant?: 'primary' | 'secondary';
	}

	const { variant = 'primary' }: Props = $props();

	let loading = $state(false);

	const locale = $derived(getLocale());

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

	async function handleDownload() {
		if (loading) return;
		loading = true;

		try {
			const { generateCfpPdf } = await import('$lib/utils/generate-cfp-pdf');

			const labels: CfpPdfLabels = {
				cfpLabel: m.section_cfp(),
				title: t(siteConfig.title),
				heroSubtitle: m.hero_subtitle(),
				heroDates: m.hero_dates(),
				heroLocation: m.hero_location(),
				rationaleLabel: m.cfp_rationale_label(),
				rationale: t(cfpInfo.rationale),
				convenorsLabel: m.cfp_convenors_label(),
				convenors: organizers.map((o) => ({
					name: o.name,
					affiliation: t(o.affiliation)
				})),
				thematicAxesLabel: m.section_thematic_axes(),
				thematicAxesIntro: m.thematic_axes_reference(),
				axes: thematicAxes.map((a) => ({
					number: a.number,
					title: t(a.title),
					description: t(a.description)
				})),
				workshopFormatLabel: m.workshop_format_label(),
				workshopFormat: t(cfpInfo.workshopFormat),
				guidelinesLabel: m.guidelines(),
				guidelines: t(cfpInfo.guidelines),
				contactText: m.cfp_contact_text(),
				contacts: organizers
					.filter((o) => contactEmails[o.id])
					.map((o) => ({
						name: o.name,
						email: contactEmails[o.id]
					})),
				selectionLabel: m.cfp_selection_label(),
				selectionCriteria: t(cfpInfo.selectionCriteria),
				keyDatesLabel: m.key_dates(),
				keyDates: [
					{ label: m.submission_deadline(), value: formatDate(cfpInfo.deadline) },
					{ label: m.notification_date(), value: formatDate(cfpInfo.notificationDate) },
					{
						label: m.full_papers_deadline(),
						value: formatDate(cfpInfo.fullPapersDeadline)
					},
					{
						label: m.workshop_dates(),
						value: formatDateRange(siteConfig.dates.start, siteConfig.dates.end)
					}
				],
				supportedByLabel: m.footer_supported_by(),
				siteUrl: siteConfig.url,
				filename:
					locale === 'fr'
						? 'Appel-a-contributions-STIAS-2026.pdf'
						: 'Call-for-Papers-STIAS-2026.pdf'
			};

			await generateCfpPdf(labels, base);
		} catch (err) {
			console.error('PDF generation failed:', err);
		} finally {
			loading = false;
		}
	}
</script>

{#if variant === 'primary'}
	<button
		onclick={handleDownload}
		disabled={loading}
		class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-sans font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer disabled:cursor-wait"
	>
		{#if loading}
			<Loader2 size={18} class="animate-spin" />
		{:else}
			<Download size={18} />
		{/if}
		{m.download_cfp()}
	</button>
{:else}
	<button
		onclick={handleDownload}
		disabled={loading}
		class="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-60 font-sans font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:cursor-wait"
	>
		{#if loading}
			<Loader2 size={18} class="animate-spin" />
		{:else}
			<Download size={18} />
		{/if}
		{m.download_cfp()}
	</button>
{/if}
