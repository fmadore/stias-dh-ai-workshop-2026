<script lang="ts">
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { FileText } from '@lucide/svelte';

	interface Props {
		variant?: 'primary' | 'secondary';
	}

	let { variant = 'primary' }: Props = $props();

	const stem = $derived(
		getLocale() === 'fr' ? 'Appel-a-contributions-STIAS-2026' : 'Call-for-Papers-STIAS-2026'
	);
	const buttonClass = $derived(
		variant === 'primary' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'
	);
</script>

{#snippet pdfIcon()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
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

<div class="flex flex-wrap items-center gap-x-3 gap-y-2">
	<span class="text-meta">
		{m.download_cfp()}
	</span>
	<div class="flex flex-wrap items-center gap-2">
		<a href={`${base}/downloads/${stem}.pdf`} download class={buttonClass}>
			{@render pdfIcon()}
			{m.download_cfp_pdf()}
		</a>
		<a href={`${base}/downloads/${stem}.txt`} download class={buttonClass}>
			<FileText size={15} strokeWidth={1.75} aria-hidden="true" />
			{m.download_cfp_text()}
		</a>
	</div>
</div>
