<script lang="ts">
	import { base } from '$app/paths';
	import { getInitials } from '$lib/utils/text';

	let {
		name,
		image,
		loading = 'lazy'
	}: {
		name: string;
		/** Path under static/, e.g. `/images/participants/….webp`. */
		image?: string;
		loading?: 'lazy' | 'eager';
	} = $props();

	// Declarative fallback: if the image fails to load we flip to initials.
	// (An imperative onerror that mutates the DOM breaks when Svelte reuses
	// card DOM across filter changes.)
	let failed = $state(false);
</script>

<div
	class="bg-primary-500/8 ring-surface-200/50 dark:ring-surface-700/50 flex h-24 w-24 items-center justify-center overflow-hidden rounded-[var(--radius-xl)] ring-1 sm:h-28 sm:w-28"
>
	{#if image && !failed}
		<img
			src="{base}{image}"
			alt={name}
			class="h-full w-full object-cover"
			{loading}
			decoding="async"
			onerror={() => (failed = true)}
		/>
	{:else}
		<span class="text-primary-600 font-display text-2xl">{getInitials(name)}</span>
	{/if}
</div>
