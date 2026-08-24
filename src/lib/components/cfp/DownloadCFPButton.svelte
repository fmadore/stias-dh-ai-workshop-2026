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

<!-- Both controls take the same Lucide mark. The PDF one used to be a
     hand-copy of it at 16px beside the library's own at 15px, with the letters
     "PDF" baked in at 6px — 8.6 × 5px rendered, the only text on the site below
     the 11px floor, and unreadable at that size. It also repeated the button's
     own label, which says "PDF" four pixels to its right. The two downloads
     differ by format, and the label is where a format belongs. -->
<div class="flex flex-wrap items-center gap-x-3 gap-y-2">
	<span class="text-meta">
		{m.download_cfp()}
	</span>
	<div class="flex flex-wrap items-center gap-2">
		<a href={`${base}/downloads/${stem}.pdf`} download class={buttonClass}>
			<FileText size={15} strokeWidth={1.75} aria-hidden="true" />
			{m.download_cfp_pdf()}
		</a>
		<a href={`${base}/downloads/${stem}.txt`} download class={buttonClass}>
			<FileText size={15} strokeWidth={1.75} aria-hidden="true" />
			{m.download_cfp_text()}
		</a>
	</div>
</div>
