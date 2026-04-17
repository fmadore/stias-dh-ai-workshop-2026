<script lang="ts">
	import type { Session } from '$lib/types';
	import { t } from '$lib/utils/i18n';

	let { session }: { session: Session } = $props();

	const typeColors: Record<string, string> = {
		keynote:
			'bg-secondary-500/12 text-secondary-700 dark:text-secondary-300 border-secondary-500/30',
		panel: 'bg-primary-500/10 text-primary-700 dark:text-primary-300 border-primary-500/25',
		workshop: 'bg-primary-500/5 text-primary-800 dark:text-primary-200 border-primary-500/20',
		break: 'bg-surface-200/60 text-surface-600 dark:bg-surface-700/50 dark:text-surface-400 border-surface-300/40',
		social: 'bg-secondary-500/8 text-secondary-800 dark:text-secondary-200 border-secondary-500/20'
	};
</script>

<div
	class="border-surface-200 dark:border-surface-700/70 flex gap-4 border-b py-4 last:border-b-0"
>
	<div
		class="text-ink-muted dark:text-surface-400 font-mono w-20 flex-shrink-0 pt-0.5 text-[0.8125rem] tabular-nums sm:w-24"
	>
		{session.time}
	</div>
	<div class="flex-1">
		<div class="mb-1.5 flex flex-wrap items-center gap-2">
			<span
				class="rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium tracking-wide uppercase {typeColors[
					session.type
				] || typeColors.panel}"
			>
				{session.type}
			</span>
			{#if session.room}
				<span class="text-ink-muted dark:text-surface-500 text-xs">{session.room}</span>
			{/if}
		</div>
		<h4 class="text-ink dark:text-surface-100 font-display text-[1.0625rem] leading-snug">
			{t(session.title)}
		</h4>
		{#if session.description}
			<p class="text-ink-muted dark:text-surface-300 mt-1 text-sm leading-relaxed font-light">
				{t(session.description)}
			</p>
		{/if}
	</div>
</div>
