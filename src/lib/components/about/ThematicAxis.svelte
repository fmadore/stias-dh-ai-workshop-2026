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

<div class="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700 transition-shadow hover:shadow-md">
	<div class="flex items-start gap-4">
		<div class="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary-400/10 text-secondary-500">
			{#if IconComponent}
				<IconComponent size={24} />
			{/if}
		</div>
		<div class="flex-1">
			<div class="text-sm font-semibold text-secondary-500 mb-1">Axis {axis.number}</div>
			<h3 class="text-lg font-bold mb-2 leading-snug">{t(axis.title)}</h3>
			{#if !compact}
				<p class="text-surface-600 dark:text-surface-300 leading-relaxed">{t(axis.description)}</p>
			{/if}
		</div>
	</div>
</div>
