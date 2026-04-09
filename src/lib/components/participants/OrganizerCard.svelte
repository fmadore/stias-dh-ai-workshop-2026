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
	class="dark:bg-surface-800/80 overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
>
	<div class="p-6 sm:p-7">
		<div class="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
			<!-- Avatar — larger presence -->
			<div class="flex-shrink-0">
				<div
					class="bg-primary-500/8 ring-surface-200/50 dark:ring-surface-700/50 flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl ring-2"
				>
					<img
						src="{base}{organizer.image}"
						alt={organizer.name}
						class="h-full w-full object-cover"
						onerror={(e) => {
							const target = e.currentTarget as HTMLImageElement;
							target.style.display = 'none';
							target.nextElementSibling?.classList.remove('hidden');
						}}
					/>
					<span class="text-primary-500 hidden font-sans text-2xl font-bold"
						>{getInitials(organizer.name)}</span
					>
				</div>
			</div>

			<!-- Info — clear hierarchy -->
			<div class="flex-1 text-center sm:text-left">
				<h3 class="text-surface-900 dark:text-surface-50 font-serif text-xl">{organizer.name}</h3>
				<p class="text-primary-600 dark:text-primary-400 mt-0.5 font-sans text-sm font-medium">
					{t(organizer.role)}
				</p>
				<p class="text-surface-400 dark:text-surface-500 mb-3 font-sans text-sm">
					{t(organizer.affiliation)}
				</p>

				<div class="bg-secondary-400/40 mx-auto mb-3 h-px w-8 sm:mx-0"></div>

				<p
					class="text-surface-600 dark:text-surface-300 mb-3 font-sans text-sm leading-relaxed font-light"
				>
					{t(organizer.bio)}
				</p>
				<div class="flex items-center justify-center gap-3 sm:justify-start">
					{#if organizer.website}
						<a
							href={organizer.website}
							target="_blank"
							rel="noopener noreferrer"
							class="text-primary-500 hover:text-primary-600 flex items-center gap-1 font-sans text-sm transition-colors"
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
							class="flex items-center gap-1 font-sans text-sm text-[#a6ce39] transition-colors hover:text-[#8aab2d]"
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
