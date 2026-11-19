<script lang="ts">
	import { staticAsset } from '#lib/utils/base-path.ts';
	import { getInitials } from '#lib/utils/text.ts';

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
	// The failure is remembered against the image that failed, not as a bare
	// flag, so a reused avatar tries the next person's photograph without an
	// effect resetting state after the render that showed the wrong one.
	let failedSrc = $state<string>();
	const failed = $derived(failedSrc === image);
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
			src={staticAsset(image)}
			alt={decorative ? '' : name}
			class="h-full w-full object-cover"
			{loading}
			decoding="async"
			onerror={() => (failedSrc = image)}
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
