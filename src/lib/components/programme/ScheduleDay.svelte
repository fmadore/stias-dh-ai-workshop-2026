<script lang="ts">
	import type { ProgrammeDay } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	import SessionCard from './SessionCard.svelte';

	let { day }: { day: ProgrammeDay } = $props();
</script>

<div>
	<h3 class="mb-1 text-xl font-bold">{t(day.dayLabel)}</h3>
	<p class="text-surface-500 dark:text-surface-400 mb-4 text-sm">{t(day.title)}</p>
	<div
		class="dark:bg-surface-800 border-surface-200 dark:border-surface-700 rounded-xl border bg-white p-4 sm:p-6"
	>
		{#each day.sessions as session}
			<SessionCard {session} />
		{/each}
	</div>
</div>
