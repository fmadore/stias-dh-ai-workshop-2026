<script lang="ts">
	import type { Session } from '$lib/types';
	import { t } from '$lib/utils/i18n';

	let { session }: { session: Session } = $props();

	const typeColors: Record<string, string> = {
		keynote:
			'bg-secondary-400/10 text-secondary-600 dark:text-secondary-400 border-secondary-400/20',
		panel: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20',
		workshop: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
		break:
			'bg-surface-200/50 text-surface-500 dark:bg-surface-700/50 dark:text-surface-400 border-surface-300/20',
		social: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20'
	};
</script>

<div class="border-surface-200 dark:border-surface-700 flex gap-4 border-b py-4 last:border-b-0">
	<div class="text-surface-500 dark:text-surface-400 w-24 flex-shrink-0 pt-1 font-mono text-sm">
		{session.time}
	</div>
	<div class="flex-1">
		<div class="mb-1 flex items-center gap-2">
			<span
				class="rounded-full border px-2 py-0.5 text-xs font-medium {typeColors[session.type] ||
					typeColors.panel}"
			>
				{session.type}
			</span>
			{#if session.room}
				<span class="text-surface-400 text-xs">{session.room}</span>
			{/if}
		</div>
		<h4 class="font-semibold">{t(session.title)}</h4>
		{#if session.description}
			<p class="text-surface-600 dark:text-surface-300 mt-1 text-sm">{t(session.description)}</p>
		{/if}
	</div>
</div>
