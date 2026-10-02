<script lang="ts">
	import { base } from '$app/paths';
	import { getInitials } from '$lib/utils/text';

	let {
		name,
		image,
		loading = 'lazy',
		size = 'large',
		decorative = false
	}: {
		name: string;
		/** Path under static/, e.g. `/images/participants/….webp`. */
		image?: string;
		loading?: 'lazy' | 'eager';
		size?: 'small' | 'large';
		/** True when an adjacent heading already identifies the person. */
		decorative?: boolean;
	} = $props();

	// Declarative fallback: if the image fails to load we flip to initials.
	// (An imperative onerror that mutates the DOM breaks when Svelte reuses
	// card DOM across filter changes.)
	let failed = $state(false);
	$effect(() => {
		// A reused avatar must try the next person's photograph after a failure.
		if (image) failed = false;
	});
</script>

<div
	class="bg-primary-500/8 ring-surface-200/50 dark:ring-surface-700/50 flex items-center justify-center overflow-hidden ring-1 {size ===
	'small'
		? 'h-13 w-13 rounded-[var(--radius-lg)]'
		: 'h-24 w-24 rounded-[var(--radius-xl)] sm:h-28 sm:w-28'}"
	aria-hidden={decorative ? true : undefined}
>
	{#if image && !failed}
		<img
			src="{base}{image}"
			alt={decorative ? '' : name}
			class="h-full w-full object-cover"
			{loading}
			decoding="async"
			onerror={() => (failed = true)}
		/>
	{:else}
		<!-- primary-600 measures 2.56:1 on the dark wash; primary-300 is 7.7:1.
		     Eight participants have no photograph, so this is a shipped state. -->
		<span
			class="text-primary-600 dark:text-primary-300 font-display {size === 'small'
				? 'text-lg'
				: 'text-2xl'}"
			role={decorative ? undefined : 'img'}
			aria-label={decorative ? undefined : name}>{getInitials(name)}</span
		>
	{/if}
</div>
