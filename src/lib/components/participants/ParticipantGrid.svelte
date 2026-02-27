<script lang="ts">
	import type { Participant } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	import { base } from '$app/paths';

	let { participants }: { participants: Participant[] } = $props();

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

{#if participants.length > 0}
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each participants as participant}
			<div
				class="bg-white dark:bg-surface-800 rounded-lg p-4 shadow-sm border border-surface-200 dark:border-surface-700"
			>
				<div class="flex items-center gap-3">
					<div
						class="w-12 h-12 rounded-full overflow-hidden bg-primary-500/10 flex items-center justify-center flex-shrink-0"
					>
						{#if participant.image}
							<img
								src="{base}{participant.image}"
								alt={participant.name}
								class="w-full h-full object-cover"
							/>
						{:else}
							<span class="text-sm font-bold text-primary-500">{getInitials(participant.name)}</span
							>
						{/if}
					</div>
					<div>
						<h4 class="font-semibold text-sm">{participant.name}</h4>
						<p class="text-xs text-surface-500 dark:text-surface-400">
							{t(participant.affiliation)}
						</p>
						{#if participant.presentationTitle}
							<p class="text-xs text-primary-600 dark:text-primary-400 mt-1 italic">
								{t(participant.presentationTitle)}
							</p>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}
