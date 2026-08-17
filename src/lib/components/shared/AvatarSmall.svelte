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

	// Declarative fallback, as in Avatar: an imperative onerror that mutates the
	// DOM breaks when Svelte reuses card DOM across filter changes.
	let failed = $state(false);
</script>

<!-- The directory-grid portrait. Avatar.svelte stays the editorial size, used
     on convenor cards and the individual participant page. -->
<div
	class="bg-primary-500/8 ring-surface-200/50 dark:ring-surface-700/50 flex h-13 w-13 items-center justify-center overflow-hidden rounded-[var(--radius-lg)] ring-1"
>
	{#if image && !failed}
		<img
			src="{base}{image}"
			alt=""
			class="h-full w-full object-cover"
			{loading}
			decoding="async"
			onerror={() => (failed = true)}
		/>
	{:else}
		<span class="text-primary-600 dark:text-primary-300 font-display text-lg" aria-hidden="true"
			>{getInitials(name)}</span
		>
	{/if}
</div>
