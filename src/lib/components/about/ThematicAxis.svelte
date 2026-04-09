<script lang="ts">
	import type { ThematicAxis } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	import { Cpu, Building2, BookOpen } from 'lucide-svelte';

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
	<!-- Compact card for home page -->
	<div
		class="group dark:bg-surface-800/80 relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
	>
		<!-- Top accent gradient bar -->
		<div class="from-secondary-400 via-secondary-500 to-primary-500 h-1 bg-gradient-to-r"></div>
		<div class="p-6">
			<div
				class="bg-primary-500/8 dark:bg-primary-400/10 text-primary-600 dark:text-primary-400 mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
			>
				{#if IconComponent}
					<IconComponent size={28} />
				{/if}
			</div>
			<div class="text-secondary-500 mb-2 font-sans text-xs font-semibold tracking-wider uppercase">
				Axis {axis.number}
			</div>
			<h3 class="text-surface-900 dark:text-surface-50 text-lg leading-snug">{t(axis.title)}</h3>
		</div>
	</div>
{:else}
	<!-- Full card for about page -->
	<div
		class="group dark:bg-surface-800/80 hover:border-l-secondary-400 relative overflow-hidden rounded-xl border-l-4 border-l-transparent bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
	>
		<div class="p-8">
			<div class="flex items-start gap-5">
				<div
					class="bg-secondary-400/10 text-secondary-500 group-hover:bg-secondary-400/20 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl transition-colors"
				>
					{#if IconComponent}
						<IconComponent size={28} />
					{/if}
				</div>
				<div class="flex-1">
					<div
						class="text-secondary-500 mb-1 font-sans text-xs font-semibold tracking-wider uppercase"
					>
						Axis {axis.number}
					</div>
					<h3 class="text-surface-900 dark:text-surface-50 mb-3 text-xl leading-snug">
						{t(axis.title)}
					</h3>
					<p class="text-surface-600 dark:text-surface-300 font-sans leading-relaxed font-light">
						{t(axis.description)}
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}
