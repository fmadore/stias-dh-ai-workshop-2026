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
</script>

{#if compact}
	<!-- Compact card for home page: numbered, minimal -->
	<article class="card-hover group h-full p-7">
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
		<h3 class="text-card-title text-ink dark:text-surface-50 mt-6">
			{t(axis.title)}
		</h3>
	</article>
{:else}
	<!-- Full card for about page -->
	<article
		class="card border-surface-200/60 dark:border-surface-700/50 group overflow-hidden border p-8 transition-colors hover:border-[color-mix(in_oklab,var(--color-secondary-500)_45%,transparent)]"
	>
		<div class="flex items-start gap-6">
			<div class="flex-shrink-0">
				<div
					class="text-secondary-600 dark:text-secondary-400 font-display text-[2.75rem] leading-none"
					aria-hidden="true"
				>
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
				<h3 class="text-ink dark:text-surface-50 mb-4 text-[1.375rem] leading-snug">
					{t(axis.title)}
				</h3>
				<p class="text-prose text-ink-muted dark:text-surface-300">
					{t(axis.description)}
				</p>
			</div>
		</div>
	</article>
{/if}
