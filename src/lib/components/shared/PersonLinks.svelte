<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { ExternalLink } from '@lucide/svelte';

	let { website, orcid }: { website?: string; orcid?: string } = $props();
</script>

{#if website || orcid}
	<div class="flex items-center justify-center gap-4 sm:justify-start">
		{#if website}
			<a href={website} target="_blank" rel="noopener noreferrer" class="link-arrow text-sm">
				<ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
				{m.visit_website()}
			</a>
		{/if}
		{#if orcid}
			<a
				href="https://orcid.org/{orcid}"
				target="_blank"
				rel="noopener noreferrer"
				class="text-orcid hover:text-orcid-hover inline-flex items-center gap-1 text-sm transition-colors duration-[var(--duration-fast)]"
				title={m.view_orcid()}
			>
				<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
					<path
						d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zM86.3 186.2H70.9V79.1h15.4v107.1zm-8.8-121c-5.6 0-10.2-4.6-10.2-10.2s4.6-10.2 10.2-10.2c5.6 0 10.2 4.6 10.2 10.2s-4.6 10.2-10.2 10.2zM128.4 79.1h36.1c34.8 0 50 24.9 50 53.5 0 31.1-19.1 53.5-49.9 53.5h-36.2V79.1zm15.4 92.3h18.3c23.5 0 36.1-14.1 36.1-38.8 0-20.8-12.1-38.8-36.1-38.8h-18.3v77.6z"
					/>
				</svg>
				ORCID
			</a>
		{/if}
	</div>
{/if}
