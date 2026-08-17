<script lang="ts" generics="T extends string | null">
	/**
	 * A labelled tray of mutually exclusive options. Shared so that every
	 * pick-one control on a listing page reads as the same object — the
	 * language filter and the grouping switch used to be two different
	 * idioms sitting 40px apart.
	 *
	 * Sizing comes from `--control-h` on an ancestor (see FilterBar), which
	 * is what keeps the tray level with the inputs beside it.
	 */
	type Option = { value: T; label: string };

	let {
		label,
		options,
		value = $bindable()
	}: {
		label: string;
		options: Option[];
		value: T;
	} = $props();

	const uid = $props.id();
</script>

<div class="field">
	<span class="text-meta field-label" id={uid}>{label}</span>
	<div class="tray" role="group" aria-labelledby={uid}>
		{#each options as option (String(option.value))}
			<button
				type="button"
				class="segment"
				class:is-active={value === option.value}
				aria-pressed={value === option.value}
				onclick={() => (value = option.value)}
			>
				{option.label}
			</button>
		{/each}
	</div>
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		min-width: 0;
	}

	.field-label {
		line-height: 1.2;
	}

	.tray {
		display: flex;
		align-items: stretch;
		gap: 0.25rem;
		/* min-height, not height: the tray's 1px border and 0.25rem padding take
		   10px out of --control-h, so a 3rem tray gave 38px segments. Letting the
		   tray grow lets the segments own the touch floor below 640px. */
		min-height: var(--control-h, 2.75rem);
		padding: 0.25rem;
		background-color: color-mix(in oklab, var(--color-ink) 5%, transparent);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
	}

	:global(.dark) .tray {
		background-color: color-mix(in oklab, var(--color-surface-100) 6%, transparent);
	}

	.segment {
		font-family: var(--font-sans);
		font-size: var(--text-caption);
		font-weight: 500;
		letter-spacing: 0.04em;
		white-space: nowrap;
		color: var(--ink-subtle);
		background: transparent;
		border: 0;
		border-radius: calc(var(--radius-lg) - 0.25rem);
		/* Equal shares while the tray is full-width on mobile; intrinsic
		   widths once it shrinks to its content on desktop. */
		flex: 1 1 auto;
		/* 2.75rem below 640px, where these are thumb targets; above it the tray
		   keeps its --control-h density, matching the input and select beside it.
		   Same breakpoint --control-h itself steps at, for the same reason. */
		min-height: 2.75rem;
		padding: 0 0.875rem;
		cursor: pointer;
		transition:
			background-color var(--duration-fast) var(--ease-standard),
			color var(--duration-fast) var(--ease-standard);
	}

	@media (min-width: 640px) {
		.tray {
			display: inline-flex;
			align-self: flex-start;
		}

		.segment {
			flex: 0 0 auto;
			min-height: 0;
		}
	}

	.segment:hover:not(.is-active) {
		color: var(--ink-strong);
	}

	.segment.is-active {
		background-color: var(--surface-raised);
		color: var(--color-primary-700);
		box-shadow: var(--shadow-xs);
	}

	:global(.dark) .segment.is-active {
		background-color: color-mix(in oklab, var(--color-primary-500) 18%, transparent);
		color: var(--color-primary-200);
	}
</style>
