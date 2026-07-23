<script lang="ts">
	import type { ProgrammeDay } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	import SessionCard from './SessionCard.svelte';

	let { day }: { day: ProgrammeDay } = $props();
</script>

<section>
	<div class="mb-5">
		<!-- h2: days are the top-level sections under the page's h1 -->
		<h2 class="text-section text-ink dark:text-surface-50">{t(day.dayLabel)}</h2>
	</div>
	<div class="card p-4 sm:p-6">
		{#each day.sessions as session (session.id)}
			<SessionCard {session} />
		{/each}
	</div>
</section>
