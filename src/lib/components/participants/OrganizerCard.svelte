<script lang="ts">
	import type { Organizer } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { base } from '$app/paths';
	import { ExternalLink } from 'lucide-svelte';

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

<div class="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
	<div class="flex flex-col sm:flex-row items-center sm:items-start gap-5">
		<!-- Avatar -->
		<div class="flex-shrink-0">
			<div class="w-24 h-24 rounded-full overflow-hidden bg-primary-500/10 flex items-center justify-center">
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
				<span class="hidden text-2xl font-bold text-primary-500">{getInitials(organizer.name)}</span>
			</div>
		</div>

		<!-- Info -->
		<div class="flex-1 text-center sm:text-left">
			<h3 class="text-xl font-bold">{organizer.name}</h3>
			<p class="text-sm text-primary-600 dark:text-primary-400 font-medium">{t(organizer.role)}</p>
			<p class="text-sm text-surface-500 dark:text-surface-400 mb-3">{t(organizer.affiliation)}</p>
			<p class="text-sm text-surface-600 dark:text-surface-300 leading-relaxed mb-3">{t(organizer.bio)}</p>
			<div class="flex items-center gap-3 justify-center sm:justify-start">
				{#if organizer.website}
					<a
						href={organizer.website}
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
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
						class="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
					>
						ORCID
					</a>
				{/if}
			</div>
		</div>
	</div>
</div>
