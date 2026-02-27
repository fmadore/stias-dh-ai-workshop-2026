<script lang="ts">
	import type { Organizer } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { base } from '$app/paths';
	import { ExternalLink } from 'lucide-svelte';
	import Icon from '@iconify/svelte';

	let { organizer }: { organizer: Organizer } = $props();

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<div
	class="bg-white dark:bg-surface-800/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
>
	<div class="p-6 sm:p-7">
		<div class="flex flex-col sm:flex-row items-center sm:items-start gap-5">
			<!-- Avatar — larger presence -->
			<div class="flex-shrink-0">
				<div
					class="w-28 h-28 rounded-2xl overflow-hidden bg-primary-500/8 flex items-center justify-center ring-2 ring-surface-200/50 dark:ring-surface-700/50"
				>
					<img
						src="{base}{organizer.image}"
						alt={organizer.name}
						class="w-full h-full object-cover"
						onerror={(e) => {
							const target = e.currentTarget as HTMLImageElement;
							target.style.display = 'none';
							target.nextElementSibling?.classList.remove('hidden');
						}}
					/>
					<span class="hidden text-2xl font-sans font-bold text-primary-500"
						>{getInitials(organizer.name)}</span
					>
				</div>
			</div>

			<!-- Info — clear hierarchy -->
			<div class="flex-1 text-center sm:text-left">
				<h3 class="text-xl font-serif text-surface-900 dark:text-surface-50">{organizer.name}</h3>
				<p class="text-sm font-sans font-medium text-primary-600 dark:text-primary-400 mt-0.5">
					{t(organizer.role)}
				</p>
				<p class="text-sm font-sans text-surface-400 dark:text-surface-500 mb-3">
					{t(organizer.affiliation)}
				</p>

				<div class="w-8 h-px bg-secondary-400/40 mb-3 mx-auto sm:mx-0"></div>

				<p
					class="text-sm text-surface-600 dark:text-surface-300 leading-relaxed font-sans font-light mb-3"
				>
					{t(organizer.bio)}
				</p>
				<div class="flex items-center gap-3 justify-center sm:justify-start">
					{#if organizer.website}
						<a
							href={organizer.website}
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm font-sans text-primary-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
						>
							<ExternalLink size={14} />
							{m.visit_website()}
						</a>
					{/if}
					{#if organizer.orcid}
						<a
							href="https://orcid.org/{organizer.orcid}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm font-sans text-[#a6ce39] hover:text-[#8aab2d] flex items-center gap-1 transition-colors"
							title={m.view_orcid()}
						>
							<Icon icon="academicons:orcid" width={16} height={16} />
							ORCID
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
