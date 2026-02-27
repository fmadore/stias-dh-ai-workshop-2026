<script lang="ts">
	import type { ProgrammeDay } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	import SessionCard from './SessionCard.svelte';

	let { day }: { day: ProgrammeDay } = $props();
</script>

<div>
	<h3 class="text-xl font-bold mb-1">{t(day.dayLabel)}</h3>
	<p class="text-sm text-surface-500 dark:text-surface-400 mb-4">{t(day.title)}</p>
	<div
		class="bg-white dark:bg-surface-800 rounded-xl p-4 sm:p-6 border border-surface-200 dark:border-surface-700"
	>
		{#each day.sessions as session}
			<SessionCard {session} />
		{/each}
	</div>
</div>
