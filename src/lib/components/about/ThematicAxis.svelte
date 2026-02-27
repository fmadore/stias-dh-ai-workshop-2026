<script lang="ts">
	import type { ThematicAxis } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	import { Cpu, Building2, BookOpen } from 'lucide-svelte';
	import type { Component } from 'svelte';

	let { axis, compact = false }: { axis: ThematicAxis; compact?: boolean } = $props();

	const iconMap: Record<string, Component> = {
		Cpu,
		Building2,
		BookOpen
	};

	const IconComponent = $derived(iconMap[axis.icon]);
</script>

{#if compact}
	<!-- Compact card for home page -->
	<div
		class="group relative bg-white dark:bg-surface-800/80 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
	>
		<!-- Top accent gradient bar -->
		<div class="h-1 bg-gradient-to-r from-secondary-400 via-secondary-500 to-primary-500"></div>
		<div class="p-6">
			<div
				class="flex items-center justify-center w-14 h-14 rounded-xl bg-primary-500/8 dark:bg-primary-400/10 text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-110 transition-transform duration-300"
			>
				{#if IconComponent}
					<IconComponent size={28} />
				{/if}
			</div>
			<div class="text-xs font-sans font-semibold text-secondary-500 uppercase tracking-wider mb-2">
				Axis {axis.number}
			</div>
			<h3 class="text-lg leading-snug text-surface-900 dark:text-surface-50">{t(axis.title)}</h3>
		</div>
	</div>
{:else}
	<!-- Full card for about page -->
	<div
		class="group relative bg-white dark:bg-surface-800/80 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-secondary-400"
	>
		<div class="p-8">
			<div class="flex items-start gap-5">
				<div
					class="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-secondary-400/10 text-secondary-500 group-hover:bg-secondary-400/20 transition-colors"
				>
					{#if IconComponent}
						<IconComponent size={28} />
					{/if}
				</div>
				<div class="flex-1">
					<div
						class="text-xs font-sans font-semibold text-secondary-500 uppercase tracking-wider mb-1"
					>
						Axis {axis.number}
					</div>
					<h3 class="text-xl leading-snug mb-3 text-surface-900 dark:text-surface-50">
						{t(axis.title)}
					</h3>
					<p class="text-surface-600 dark:text-surface-300 leading-relaxed font-sans font-light">
						{t(axis.description)}
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}
