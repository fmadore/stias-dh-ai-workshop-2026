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
			<article class="card p-4">
				<div class="flex items-center gap-3">
					<div
						class="bg-primary-500/10 ring-surface-200/40 dark:ring-surface-700/40 flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full ring-1"
					>
						{#if participant.image}
							<img
								src="{base}{participant.image}"
								alt={participant.name}
								class="h-full w-full object-cover"
							/>
						{:else}
							<span class="text-primary-700 text-sm font-semibold">
								{getInitials(participant.name)}
							</span>
						{/if}
					</div>
					<div class="min-w-0">
						<h4 class="text-ink dark:text-surface-50 truncate text-sm font-semibold">
							{participant.name}
						</h4>
						<p class="text-ink-muted dark:text-surface-400 truncate text-xs">
							{t(participant.affiliation)}
						</p>
						{#if participant.presentationTitle}
							<p class="text-primary-700 dark:text-primary-300 mt-1 text-xs italic">
								{t(participant.presentationTitle)}
							</p>
						{/if}
					</div>
				</div>
			</article>
		{/each}
	</div>
{/if}
