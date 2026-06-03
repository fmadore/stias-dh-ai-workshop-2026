<script lang="ts">
	import type { Presentation } from '$lib/types';
	import * as m from '$lib/paraglide/messages';
	import { Search, X } from '@lucide/svelte';
	import { uniquePaperCountries } from '$lib/utils/paper-filter';

	type Props = {
		presentations: Presentation[];
		visibleCount: number;
		query?: string;
		country?: string | null;
		language?: 'en' | 'fr' | null;
	};

	let {
		presentations,
		visibleCount,
		query = $bindable(''),
		country = $bindable(null),
		language = $bindable(null)
	}: Props = $props();

	const countries = $derived(uniquePaperCountries(presentations));
	const totalCount = $derived(presentations.length);
	const hasActiveFilter = $derived(query.trim() !== '' || country !== null || language !== null);

	function reset() {
		query = '';
		country = null;
		language = null;
	}
</script>

<div class="paper-filter">
	<div class="filter-controls">
		<div class="filter-search">
			<Search size={16} strokeWidth={1.75} class="filter-search-icon" aria-hidden="true" />
			<input
				type="search"
				bind:value={query}
				placeholder={m.papers_search_placeholder()}
				class="filter-input"
				aria-label={m.papers_search_placeholder()}
			/>
		</div>

		<select
			bind:value={country}
			class="filter-select"
			aria-label={m.participants_filter_country_all()}
		>
			<option value={null}>{m.participants_filter_country_all()}</option>
			{#each countries as c}
				<option value={c}>{c}</option>
			{/each}
		</select>

		<div class="filter-pills" role="group" aria-label={m.participants_filter_language_all()}>
			<button
				type="button"
				class="filter-pill"
				class:is-active={language === null}
				onclick={() => (language = null)}
				aria-pressed={language === null}
			>
				{m.participants_filter_language_all()}
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

	<div class="filter-meta">
		<span class="filter-count">
			{m.participants_filter_count({ visible: visibleCount, total: totalCount })}
		</span>
		{#if hasActiveFilter}
			<button type="button" class="filter-reset" onclick={reset}>
				<X size={14} strokeWidth={1.75} aria-hidden="true" />
				{m.participants_filter_clear()}
			</button>
		{/if}
	</div>
</div>

<style>
	.paper-filter {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.filter-controls {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	@media (min-width: 640px) {
		.filter-controls {
			flex-direction: row;
			align-items: center;
			flex-wrap: wrap;
		}
	}

	.filter-search {
		position: relative;
		flex: 1 1 16rem;
		min-width: 0;
	}

	:global(.filter-search-icon) {
		position: absolute;
		left: 0.875rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--color-ink-muted);
		pointer-events: none;
	}

	.filter-input,
	.filter-select {
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		color: var(--color-ink);
		background-color: var(--color-paper);
		border: 1px solid color-mix(in oklab, var(--color-ink) 12%, transparent);
		border-radius: var(--radius-lg);
		padding: 0.625rem 1rem;
		width: 100%;
		transition:
			border-color var(--duration-fast) var(--ease-standard),
			box-shadow var(--duration-fast) var(--ease-standard);
	}

	.filter-input {
		padding-left: 2.5rem;
	}

	.filter-input::placeholder {
		color: var(--color-ink-muted);
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

	:global(.dark) .filter-input,
	:global(.dark) .filter-select {
		background-color: color-mix(in oklab, var(--color-surface-800) 70%, transparent);
		border-color: color-mix(in oklab, var(--color-surface-100) 14%, transparent);
		color: var(--color-surface-100);
	}

	:global(.dark) .filter-input::placeholder {
		color: var(--color-surface-400);
	}

	:global(.dark) .filter-select {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%23a1a1aa' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M3 4.5l3 3 3-3'/%3E%3C/svg%3E");
	}

	.filter-pills {
		display: inline-flex;
		gap: 0.25rem;
		padding: 0.25rem;
		background-color: color-mix(in oklab, var(--color-ink) 4%, transparent);
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
		color: var(--color-ink-muted);
		background: transparent;
		border: 0;
		border-radius: var(--radius-md);
		padding: 0.375rem 0.75rem;
		cursor: pointer;
		transition:
			background-color var(--duration-fast) var(--ease-standard),
			color var(--duration-fast) var(--ease-standard);
	}

	:global(.dark) .filter-pill {
		color: var(--color-surface-400);
	}

	.filter-pill:hover:not(.is-active) {
		color: var(--color-ink);
	}

	:global(.dark) .filter-pill:hover:not(.is-active) {
		color: var(--color-surface-100);
	}

	.filter-pill.is-active {
		background-color: var(--color-paper);
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
		font-family: var(--font-sans);
		font-size: 0.8125rem;
		color: var(--color-ink-muted);
	}

	:global(.dark) .filter-meta {
		color: var(--color-surface-400);
	}

	.filter-reset {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		background: transparent;
		border: 0;
		color: var(--color-ink-muted);
		font-family: var(--font-sans);
		font-size: 0.8125rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-md);
		transition: color var(--duration-fast) var(--ease-standard);
	}

	:global(.dark) .filter-reset {
		color: var(--color-surface-400);
	}

	.filter-reset:hover {
		color: var(--color-primary-600);
	}

	:global(.dark) .filter-reset:hover {
		color: var(--color-primary-300);
	}
</style>
