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
	import { FileText, Loader2 } from 'lucide-svelte';
	import type { CfpPdfLabels } from '$lib/utils/generate-cfp-pdf';

	interface Props {
		variant?: 'primary' | 'secondary';
	}

	const { variant = 'primary' }: Props = $props();

	let loadingPdf = $state(false);
	let loadingText = $state(false);

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

	function buildLabels(filename: string): CfpPdfLabels {
		return {
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
			filename
		};
	}

	async function handleDownloadPdf() {
		if (loadingPdf) return;
		loadingPdf = true;

		try {
			const { generateCfpPdf } = await import('$lib/utils/generate-cfp-pdf');
			const filename =
				locale === 'fr'
					? 'Appel-a-contributions-STIAS-2026.pdf'
					: 'Call-for-Papers-STIAS-2026.pdf';
			await generateCfpPdf(buildLabels(filename), base);
		} catch (err) {
			console.error('PDF generation failed:', err);
		} finally {
			loadingPdf = false;
		}
	}

	async function handleDownloadText() {
		if (loadingText) return;
		loadingText = true;

		try {
			const { generateCfpText } = await import('$lib/utils/generate-cfp-text');
			const filename =
				locale === 'fr'
					? 'Appel-a-contributions-STIAS-2026.txt'
					: 'Call-for-Papers-STIAS-2026.txt';
			generateCfpText(buildLabels(filename));
		} catch (err) {
			console.error('Text generation failed:', err);
		} finally {
			loadingText = false;
		}
	}
</script>

{#snippet pdfIcon()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
		<polyline points="14 2 14 8 20 8" />
		<text
			x="12"
			y="17"
			text-anchor="middle"
			font-size="6"
			font-weight="700"
			font-family="sans-serif"
			fill="currentColor"
			stroke="none">PDF</text
		>
	</svg>
{/snippet}

<span class="inline-flex items-center gap-2 flex-wrap">
	<span class="text-sm font-sans font-medium text-surface-500 dark:text-surface-400">
		{m.download_cfp()}:
	</span>
	{#if variant === 'primary'}
		<span class="inline-flex items-center gap-2">
			<button
				onclick={handleDownloadPdf}
				disabled={loadingPdf}
				class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-sans font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer disabled:cursor-wait text-sm"
			>
				{#if loadingPdf}
					<Loader2 size={16} class="animate-spin" />
				{:else}
					{@render pdfIcon()}
				{/if}
				{m.download_cfp_pdf()}
			</button>
			<button
				onclick={handleDownloadText}
				disabled={loadingText}
				class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-sans font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer disabled:cursor-wait text-sm"
			>
				{#if loadingText}
					<Loader2 size={16} class="animate-spin" />
				{:else}
					<FileText size={16} />
				{/if}
				{m.download_cfp_text()}
			</button>
		</span>
	{:else}
		<span class="inline-flex items-center gap-2">
			<button
				onclick={handleDownloadPdf}
				disabled={loadingPdf}
				class="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-60 font-sans font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-wait text-sm"
			>
				{#if loadingPdf}
					<Loader2 size={16} class="animate-spin" />
				{:else}
					{@render pdfIcon()}
				{/if}
				{m.download_cfp_pdf()}
			</button>
			<button
				onclick={handleDownloadText}
				disabled={loadingText}
				class="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-60 font-sans font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-wait text-sm"
			>
				{#if loadingText}
					<Loader2 size={16} class="animate-spin" />
				{:else}
					<FileText size={16} />
				{/if}
				{m.download_cfp_text()}
			</button>
		</span>
	{/if}
</span>
