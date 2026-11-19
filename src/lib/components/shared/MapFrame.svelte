<script lang="ts">
	import { onMount } from 'svelte';
	import type { PinMap } from '#lib/utils/pin-map.svelte.ts';

	let {
		/** The controller this frame boots and whose loading state it shows. */
		map,
		/**
		 * A class for the element MapLibre draws into, so a page — and its tests —
		 * can address one map among several.
		 */
		hostClass,
		loadingLabel,
		/** Shown when the map fails, and in place of it without JavaScript. */
		errorLabel
	}: {
		map: Pick<PinMap, 'ready' | 'failed' | 'mount'>;
		hostClass: string;
		loadingLabel: string;
		errorLabel: string;
	} = $props();

	let host: HTMLDivElement;

	onMount(() => map.mount(host));
</script>

<!--
	No `role="region"` here. MapLibre makes its canvas a region and names it
	from `mapTitle`; a second named region around it announced the map twice,
	once in the page's language and once, from MapLibre's default, in English.
-->
<div class="map-frame">
	<div bind:this={host} class="map-host {hostClass}"></div>
	<noscript>
		<p class="map-state map-error">{errorLabel}</p>
	</noscript>
	{#if !map.ready && !map.failed}
		<div class="map-state map-loading" aria-live="polite">
			<span class="map-loader" aria-hidden="true"></span>
			<span>{loadingLabel}</span>
		</div>
	{:else if map.failed}
		<p class="map-state map-error" role="status">{errorLabel}</p>
	{/if}
</div>

<style>
	/* The loading state is prerendered, so without JavaScript it is a spinner
	   that spins forever under a promise nothing will keep. The <noscript>
	   message above takes its place; whatever the map component lists beside
	   the map — the affiliations, the addresses — is static markup and works
	   either way. */
	:global(.no-js) .map-loading {
		display: none;
	}

	/* Each map sets its own height through `--map-min-height`, at its own
	   breakpoint; a custom property inherits into this component where a
	   parent's scoped selector would tie with this one on specificity. */
	.map-frame {
		position: relative;
		min-height: var(--map-min-height, 22rem);
		background: var(--surface-sunken);
	}

	.map-host {
		position: absolute;
		inset: 0;
	}

	.map-state {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.65rem;
		padding: 2rem;
		background: var(--surface-sunken);
		color: var(--ink-subtle);
		font-size: var(--text-ui);
		text-align: center;
	}

	.map-loader {
		width: 1rem;
		height: 1rem;
		border: 2px solid color-mix(in oklab, var(--color-primary-500) 25%, transparent);
		border-top-color: var(--color-primary-600);
		border-radius: var(--radius-full);
		animation: map-spin 700ms linear infinite;
	}

	.map-error {
		color: var(--ink-body);
	}

	/* --- Popup chrome ---
	   MapLibre appends popups to the map container, so they are scoped to this
	   frame's host. Each map sizes its own card through `--map-popup-min-width`
	   and `--map-popup-padding` on its popup class, and styles what it puts in
	   the card; the classes below are the parts both cards share. */

	.map-host :global(.maplibregl-popup-tip) {
		display: none;
	}

	.map-host :global(.maplibregl-popup-content) {
		min-width: min(var(--map-popup-min-width, 15rem), calc(100vw - 4rem));
		padding: var(--map-popup-padding, 1rem 1.15rem);
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-xl);
		color: var(--ink-body);
	}

	.map-host :global(.maplibregl-popup-close-button) {
		width: 2.5rem;
		height: 2.5rem;
		color: var(--ink-subtle);
		font-size: 1.25rem;
	}

	.map-host :global(.maplibregl-popup-close-button:hover) {
		background: color-mix(in oklab, var(--ink-strong) 7%, transparent);
		color: var(--ink-strong);
	}

	.map-host :global(.map-popup-body) {
		padding-inline-end: 1.5rem;
	}

	.map-host :global(.map-popup-title) {
		color: var(--ink-strong);
		font-family: var(--font-display);
		/* The card-title role at its floor, fixed rather than fluid: the popup
		   has a max-width, so it must not grow with the viewport. */
		font-size: 1.1875rem;
		line-height: 1.25;
		letter-spacing: -0.012em;
	}

	.map-host :global(.map-popup-eyebrow) {
		color: var(--ink-subtle);
		font-size: var(--text-badge);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.map-host :global(.map-popup-link) {
		color: var(--link);
		font-size: var(--text-ui-sm);
		text-decoration: underline;
		text-decoration-color: color-mix(in oklab, var(--link) 30%, transparent);
		text-underline-offset: 0.18em;
	}

	.map-host :global(.map-popup-link:hover) {
		color: var(--link-hover);
		text-decoration-color: currentColor;
	}

	/* --- MapLibre controls --- */

	.map-host :global(.maplibregl-ctrl-group) {
		overflow: hidden;
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
	}

	.map-host :global(.maplibregl-ctrl-group button + button) {
		border-top-color: var(--border-subtle);
	}

	.map-host :global(.maplibregl-ctrl-group button) {
		width: 2.5rem;
		height: 2.5rem;
	}

	:global(.dark) .map-host :global(.maplibregl-ctrl-icon) {
		filter: invert(1);
	}

	.map-host :global(.maplibregl-ctrl-attrib) {
		background: color-mix(in oklab, var(--surface-raised) 88%, transparent);
		color: var(--ink-subtle);
	}

	.map-host :global(.maplibregl-ctrl-attrib a) {
		color: var(--link);
	}

	@media (prefers-reduced-motion: reduce) {
		.map-loader {
			animation-duration: 1.5s;
		}
	}

	@keyframes map-spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
