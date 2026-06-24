<script lang="ts">
	import type { ProgrammeDay } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	import SessionCard from './SessionCard.svelte';

	let { day }: { day: ProgrammeDay } = $props();
</script>

<section>
	<div class="mb-5">
		<h3 class="text-section text-ink dark:text-surface-50">{t(day.dayLabel)}</h3>
	</div>
	<div class="card p-4 sm:p-6">
		{#each day.sessions as session}
			<SessionCard {session} />
		{/each}
	</div>
</section>
