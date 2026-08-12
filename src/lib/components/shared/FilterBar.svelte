<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { countryName, sortCountriesByName } from '$lib/utils/country';
	import type { CountryCode } from '$lib/types';
	import { Search, X } from '@lucide/svelte';

	type Props = {
		totalCount: number;
		visibleCount: number;
		countries: CountryCode[];
		searchPlaceholder: string;
		/**
		 * What the EN/FR group actually filters on. It sits inches from the
		 * site's own EN/FR switcher and reads as a duplicate control without a
		 * label — and on the participants page it silently means "presents a
		 * paper in", which nobody would guess.
		 */
		languageLabel?: string;
		query?: string;
		country?: CountryCode | null;
		language?: 'en' | 'fr' | null;
	};

	let {
		totalCount,
		visibleCount,
		countries,
		searchPlaceholder,
		languageLabel = m.filter_language_label(),
		query = $bindable(''),
		country = $bindable(null),
		language = $bindable(null)
	}: Props = $props();

	const uid = $props.id();

	// Sorted here rather than upstream: the order depends on the locale the
	// names render in, which the data layer knows nothing about.
	const sortedCountries = $derived(sortCountriesByName(countries, getLocale()));

	const hasActiveFilter = $derived(query.trim() !== '' || country !== null || language !== null);

	function reset() {
		query = '';
		country = null;
		language = null;
	}
</script>

<div class="filter-bar">
	<!-- Every control carries its own label above it, so the three sit on a
	     shared baseline at a shared height. Labelling only the pill group left
	     it hanging above a row it no longer lined up with. -->
	<div class="filter-fields">
		<div class="filter-field filter-field--search">
			<label class="filter-label" for="{uid}-search">{m.filter_search_label()}</label>
			<div class="filter-search">
				<Search size={16} strokeWidth={1.75} class="filter-search-icon" aria-hidden="true" />
				<input
					id="{uid}-search"
					type="search"
					bind:value={query}
					placeholder={searchPlaceholder}
					class="filter-input"
				/>
			</div>
		</div>

		<div class="filter-field">
			<label class="filter-label" for="{uid}-country">{m.filter_country_label()}</label>
			<select id="{uid}-country" bind:value={country} class="filter-select">
				<option value={null}>{m.filter_country_all()}</option>
				{#each sortedCountries as c (c)}
					<option value={c}>{countryName(c, getLocale())}</option>
				{/each}
			</select>
		</div>

		<div class="filter-field">
			<span class="filter-label" id="{uid}-language">{languageLabel}</span>
			<div class="filter-pills" role="group" aria-labelledby="{uid}-language">
				<button
					type="button"
					class="filter-pill"
					class:is-active={language === null}
					onclick={() => (language = null)}
					aria-pressed={language === null}
				>
					{m.filter_language_all()}
				</button>
				<button
					type="button"
					class="filter-pill"
					class:is-active={language === 'en'}
					onclick={() => (language = 'en')}
					aria-pressed={language === 'en'}
				>
					EN
				</button>
				<button
					type="button"
					class="filter-pill"
					class:is-active={language === 'fr'}
					onclick={() => (language = 'fr')}
					aria-pressed={language === 'fr'}
				>
					FR
				</button>
			</div>
		</div>
	</div>

	<div class="filter-meta">
		<span class="filter-count" role="status" aria-live="polite" aria-atomic="true">
			{m.filter_count({ visible: visibleCount, total: totalCount })}
		</span>
		{#if hasActiveFilter}
			<button type="button" class="filter-reset" onclick={reset}>
				<X size={14} strokeWidth={1.75} aria-hidden="true" />
				{m.filter_clear()}
			</button>
		{/if}
	</div>
</div>

<style>
	.filter-bar {
		/* One height for input, select and pill tray — the tray used to run
		   12px taller than the fields beside it. Roomier while the controls are
		   stacked and thumb-sized, tighter once they share a row. */
		--control-h: 3rem;
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

	.filter-fields {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.filter-field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		min-width: 0;
	}

	.filter-label {
		font-family: var(--font-sans);
		font-size: var(--text-badge);
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-subtle);
	}

	@media (min-width: 640px) {
		.filter-bar {
			--control-h: 2.75rem;
		}

		.filter-fields {
			flex-direction: row;
			flex-wrap: wrap;
			/* Bottom edges, not centres: the labels differ in length and can
			   wrap, so only the controls themselves are worth aligning. */
			align-items: flex-end;
			gap: 0.75rem 1rem;
		}

		.filter-field--search {
			flex: 1 1 18rem;
		}
	}

	.filter-search {
		position: relative;
	}

	:global(.filter-search-icon) {
		position: absolute;
		left: 0.875rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--ink-subtle);
		pointer-events: none;
	}

	.filter-input,
	.filter-select {
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		color: var(--ink-strong);
		background-color: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		height: var(--control-h);
		padding: 0 1rem;
		width: 100%;
		transition:
			border-color var(--duration-fast) var(--ease-standard),
			box-shadow var(--duration-fast) var(--ease-standard);
	}

	.filter-input {
		padding-left: 2.5rem;
	}

	.filter-input::placeholder {
		color: var(--ink-subtle);
	}

	.filter-select {
		appearance: none;
		-webkit-appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%2356514a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M3 4.5l3 3 3-3'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.875rem center;
		padding-right: 2.25rem;
		cursor: pointer;
	}

	@media (min-width: 640px) {
		.filter-select {
			width: auto;
			min-width: 12rem;
		}
	}

	.filter-input:hover,
	.filter-select:hover {
		border-color: color-mix(in oklab, var(--color-primary-500) 50%, transparent);
	}

	:global(.dark) .filter-select {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%23a1a1aa' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M3 4.5l3 3 3-3'/%3E%3C/svg%3E");
	}

	.filter-pills {
		display: flex;
		align-items: stretch;
		gap: 0.25rem;
		height: var(--control-h);
		padding: 0.25rem;
		background-color: color-mix(in oklab, var(--color-ink) 5%, transparent);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
	}

	:global(.dark) .filter-pills {
		background-color: color-mix(in oklab, var(--color-surface-100) 6%, transparent);
	}

	.filter-pill {
		font-family: var(--font-sans);
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		color: var(--ink-subtle);
		background: transparent;
		border: 0;
		border-radius: calc(var(--radius-lg) - 0.25rem);
		/* Equal thirds while the tray is full-width on mobile; intrinsic
		   widths once it shrinks to its content on desktop. */
		flex: 1 1 auto;
		padding: 0 0.875rem;
		cursor: pointer;
		transition:
			background-color var(--duration-fast) var(--ease-standard),
			color var(--duration-fast) var(--ease-standard);
	}

	@media (min-width: 640px) {
		.filter-pills {
			display: inline-flex;
			align-self: flex-start;
		}

		.filter-pill {
			flex: 0 0 auto;
		}
	}

	.filter-pill:hover:not(.is-active) {
		color: var(--ink-strong);
	}

	.filter-pill.is-active {
		background-color: var(--surface-raised);
		color: var(--color-primary-700);
		box-shadow: var(--shadow-xs);
	}

	:global(.dark) .filter-pill.is-active {
		background-color: color-mix(in oklab, var(--color-primary-500) 18%, transparent);
		color: var(--color-primary-200);
	}

	.filter-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		/* Reserved height: the reset button appears and disappears with the
		   filters, and without this the grid below jumped 26px each time. */
		min-height: 2.5rem;
		font-family: var(--font-sans);
		font-size: 0.8125rem;
		color: var(--ink-subtle);
	}

	.filter-count {
		font-variant-numeric: tabular-nums;
	}

	.filter-reset {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		background: transparent;
		border: 0;
		color: var(--ink-subtle);
		font-family: var(--font-sans);
		font-size: 0.8125rem;
		cursor: pointer;
		min-height: 2.5rem;
		padding: 0.5rem 0.625rem;
		margin-right: -0.625rem;
		border-radius: var(--radius-md);
		transition: color var(--duration-fast) var(--ease-standard);
	}

	.filter-reset:hover {
		color: var(--link-hover);
	}
</style>
