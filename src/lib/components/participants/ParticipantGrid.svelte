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
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each participants as participant}
			<div
				class="dark:bg-surface-800 border-surface-200 dark:border-surface-700 rounded-lg border bg-white p-4 shadow-sm"
			>
				<div class="flex items-center gap-3">
					<div
						class="bg-primary-500/10 flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
					>
						{#if participant.image}
							<img
								src="{base}{participant.image}"
								alt={participant.name}
								class="h-full w-full object-cover"
							/>
						{:else}
							<span class="text-primary-500 text-sm font-bold">{getInitials(participant.name)}</span
							>
						{/if}
					</div>
					<div>
						<h4 class="text-sm font-semibold">{participant.name}</h4>
						<p class="text-surface-500 dark:text-surface-400 text-xs">
							{t(participant.affiliation)}
						</p>
						{#if participant.presentationTitle}
							<p class="text-primary-600 dark:text-primary-400 mt-1 text-xs italic">
								{t(participant.presentationTitle)}
							</p>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}
