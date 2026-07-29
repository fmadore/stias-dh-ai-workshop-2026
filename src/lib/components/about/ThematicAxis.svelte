<script lang="ts">
	import type { ThematicAxis } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	import { Cpu, Building2, BookOpen } from '@lucide/svelte';

	let { axis, compact = false }: { axis: ThematicAxis; compact?: boolean } = $props();

	const iconMap = {
		Cpu,
		Building2,
		BookOpen
	} as const;

	type IconKey = keyof typeof iconMap;

	const IconComponent = $derived(iconMap[axis.icon as IconKey]);

	// A bare title plus an icon and a big "01" made three cards that all
	// looked the same and said almost nothing. The opening sentence of the
	// description is already written — surface it.
	const summary = $derived(t(axis.description).split(/(?<=[.?!])\s+/)[0] ?? '');
</script>

{#if compact}
	<!-- Compact card for home page: numbered, minimal -->
	<article class="card card-hover group h-full p-7">
		<div class="flex items-start justify-between gap-4">
			<div
				class="bg-primary-50 dark:bg-primary-500/12 text-primary-700 dark:text-primary-300 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg"
			>
				{#if IconComponent}
					<IconComponent size={22} strokeWidth={1.75} />
				{/if}
			</div>
			<span
				class="text-secondary-600 dark:text-secondary-400 font-display text-3xl leading-none opacity-80"
				aria-hidden="true"
			>
				0{axis.number}
			</span>
		</div>
		<h3 class="text-card-title text-strong mt-6">
			{t(axis.title)}
		</h3>
		{#if summary}
			<p class="text-muted text-caption mt-3 leading-relaxed">{summary}</p>
		{/if}
	</article>
{:else}
	<!-- Full card for about page -->
	<article
		class="card group overflow-hidden p-8 transition-colors hover:border-[var(--border-accent)]"
	>
		<div class="flex items-start gap-6">
			<div class="flex-shrink-0">
				<div class="text-accent-ink font-display text-[2.75rem] leading-none" aria-hidden="true">
					0{axis.number}
				</div>
				<div
					class="bg-secondary-500/70 dark:bg-secondary-400/70 mt-3 h-px w-10"
					aria-hidden="true"
				></div>
			</div>
			<div class="flex-1">
				<div class="mb-3 flex items-center gap-2">
					<div
						class="bg-primary-50 dark:bg-primary-500/12 text-primary-700 dark:text-primary-300 flex h-10 w-10 items-center justify-center rounded-lg"
					>
						{#if IconComponent}
							<IconComponent size={20} strokeWidth={1.75} />
						{/if}
					</div>
				</div>
				<h3 class="text-card-title text-strong mb-4">
					{t(axis.title)}
				</h3>
				<p class="text-prose">
					{t(axis.description)}
				</p>
			</div>
		</div>
	</article>
{/if}
