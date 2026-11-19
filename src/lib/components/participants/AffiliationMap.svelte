<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import type { MappedAffiliation } from '#lib/types/index.ts';
	import { countryName } from '#lib/utils/country.ts';
	import { localePath, t } from '#lib/utils/i18n.ts';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { createPinMap } from '#lib/utils/pin-map.svelte.ts';
	import MapFrame from '#lib/components/shared/MapFrame.svelte';

	let {
		/** The campuses and who works at each, resolved by the page's load. */
		affiliations
	}: { affiliations: MappedAffiliation[] } = $props();

	type LocationView = MappedAffiliation & {
		label: string;
		place: string;
	};

	const locale = getLocale();
	const locations: LocationView[] = $derived(
		affiliations
			.map((location) => ({
				...location,
				label: t(location.name),
				place: `${t(location.city)}, ${countryName(location.country, locale)}`
			}))
			.sort((a, b) => a.label.localeCompare(b.label, locale))
	);

	function memberCount(count: number): string {
		return count === 1 ? m.affiliations_member_one() : m.affiliations_member_many({ count });
	}

	function markerElement(location: LocationView): HTMLElement {
		const markerButton = document.createElement('button');
		markerButton.type = 'button';
		markerButton.className = 'affiliation-marker';
		markerButton.textContent = String(location.people.length);
		// No `title`: it repeated the accessible name word for word, which some
		// screen readers then read twice. Sighted readers lose a hover tooltip
		// with the campus name, and get it from the popup a click away and the
		// list beside the map.
		markerButton.setAttribute('aria-label', m.affiliations_select({ affiliation: location.label }));
		return markerButton;
	}

	function popupContent(location: LocationView): HTMLElement {
		const content = document.createElement('article');
		content.className = 'map-popup-body';

		const heading = document.createElement('h3');
		heading.className = 'map-popup-title';
		heading.textContent = location.label;
		content.appendChild(heading);

		const place = document.createElement('p');
		place.className = 'affiliation-popup-place';
		place.textContent = location.place;
		content.appendChild(place);

		const peopleLabel = document.createElement('p');
		peopleLabel.className = 'map-popup-eyebrow affiliation-popup-label';
		peopleLabel.textContent = m.affiliations_popup_people();
		content.appendChild(peopleLabel);

		const list = document.createElement('ul');
		list.className = 'affiliation-popup-list';
		for (const person of location.people) {
			const item = document.createElement('li');
			const link = document.createElement('a');
			link.className = 'map-popup-link';
			link.href = localePath(`/participants/${person.id}`);
			link.textContent = person.name;
			item.appendChild(link);
			list.appendChild(item);
		}
		content.appendChild(list);

		return content;
	}

	const pinMap = createPinMap({
		items: () => locations,
		mapTitle: m.affiliations_map_label(),
		popupCloseLabel: m.map_popup_close(),
		popup: { className: 'affiliation-popup', offset: 18, maxWidth: '22rem' },
		options: {
			center: [-10, 18],
			zoom: 1.25,
			minZoom: 0.5,
			maxZoom: 12,
			renderWorldCopies: false
		},
		markerElement,
		popupContent,
		fit: { padding: { narrow: 30, wide: 52 }, maxZoom: 2.8 },
		focusZoom: 4.5
	});

	/**
	 * Selecting a location moved the map and opened a popup, and announced
	 * nothing — so the one control that answers "who works here" was silent to
	 * anyone not looking at the pin. The popup is MapLibre's, drawn outside this
	 * component's markup and dismissed on any map interaction, so the
	 * announcement belongs to the panel instead, which is also where the
	 * keyboard path already lives.
	 */
	const selectedLocation = $derived(
		pinMap.selectedId ? locations.find((entry) => entry.id === pinMap.selectedId) : undefined
	);

	const selectionSummary = $derived(
		selectedLocation
			? `${selectedLocation.label}, ${selectedLocation.place} — ${memberCount(
					selectedLocation.people.length
				)}: ${selectedLocation.people.map((person) => person.name).join(', ')}`
			: ''
	);
</script>

<div class="mb-7 max-w-3xl">
	<h2 class="text-section text-strong mb-2">{m.affiliations_title()}</h2>
	<p class="text-prose">{m.affiliations_intro()}</p>
</div>

<div class="affiliation-shell">
	<MapFrame
		map={pinMap}
		hostClass="affiliation-map"
		loadingLabel={m.affiliations_map_loading()}
		errorLabel={m.affiliations_map_error()}
	/>

	<aside class="affiliation-panel" aria-labelledby="affiliation-list-heading">
		<div class="affiliation-panel-header">
			<div>
				<h3 id="affiliation-list-heading" class="font-display text-strong text-xl">
					{m.affiliations_list_label()}
				</h3>
				<p class="text-muted text-caption mt-1">
					{locations.length} · {memberCount(
						locations.reduce((sum, item) => sum + item.people.length, 0)
					)}
				</p>
			</div>
			<button class="btn btn-secondary btn-sm" type="button" onclick={() => pinMap.showAll()}>
				{m.affiliations_show_all()}
			</button>
		</div>

		<p class="sr-only" role="status" aria-live="polite" aria-atomic="true">{selectionSummary}</p>

		<ol class="affiliation-list">
			{#each locations as location (location.id)}
				<li>
					<button
						type="button"
						class:active={pinMap.selectedId === location.id}
						aria-pressed={pinMap.selectedId === location.id}
						onclick={(event) => pinMap.select(location.id, { returnFocusTo: event.currentTarget })}
					>
						<span class="affiliation-name">{location.label}</span>
						<span class="affiliation-place">{location.place}</span>
						<span class="affiliation-count">{memberCount(location.people.length)}</span>
					</button>
				</li>
			{/each}
		</ol>
	</aside>
</div>

<p class="text-muted measure-prose mt-3 text-sm leading-relaxed">{m.affiliations_note()}</p>

<style>
	.affiliation-shell {
		--map-min-height: 24rem;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		overflow: hidden;
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-sm);
	}

	.affiliation-panel {
		display: flex;
		min-height: 0;
		flex-direction: column;
		border-top: 1px solid var(--border-subtle);
	}

	.affiliation-panel-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem;
		border-bottom: 1px solid var(--border-subtle);
	}

	.affiliation-panel-header .btn {
		flex-shrink: 0;
	}

	.affiliation-list {
		max-height: 22rem;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.affiliation-list li + li {
		border-top: 1px solid var(--border-subtle);
	}

	.affiliation-list button {
		position: relative;
		display: grid;
		width: 100%;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.2rem 0.75rem;
		padding: 0.9rem 1.25rem;
		text-align: left;
		transition: background-color var(--duration-fast) var(--ease-standard);
	}

	.affiliation-list button:hover {
		background: color-mix(in oklab, var(--color-primary-500) 7%, transparent);
	}

	.affiliation-list button.active {
		background: color-mix(in oklab, var(--color-secondary-500) 12%, transparent);
	}

	.affiliation-list button.active::before {
		content: '';
		position: absolute;
		inset-block: 0.75rem;
		inset-inline-start: 0;
		width: 1px;
		background: var(--color-secondary-500);
	}

	.affiliation-name {
		color: var(--ink-strong);
		font-size: var(--text-ui);
		font-weight: 500;
		line-height: 1.3;
	}

	.affiliation-place,
	.affiliation-count {
		color: var(--ink-subtle);
		font-size: var(--text-caption);
		line-height: 1.35;
	}

	.affiliation-place {
		grid-column: 1;
	}

	.affiliation-count {
		grid-column: 2;
		grid-row: 1 / span 2;
		align-self: center;
		white-space: nowrap;
	}

	:global(.affiliation-marker) {
		display: inline-flex;
		width: 2rem;
		height: 2rem;
		align-items: center;
		justify-content: center;
		border: 2px solid #fff;
		border-radius: var(--radius-full);
		background: var(--color-primary-600);
		box-shadow: var(--shadow-md);
		color: #fff;
		font-family: var(--font-sans);
		font-size: var(--text-caption);
		/* 600, not 700: this marker count was the only 700 in the codebase, and
		   Outfit 700 ships 20.5 KB across two subsets to set a one- or two-digit
		   number inside a 2rem circle. 600 is already loaded, is a documented
		   weight in the type system, and is indistinguishable at this size. */
		font-weight: 600;
		line-height: 1;
		transition:
			background-color var(--duration-fast) var(--ease-standard),
			color var(--duration-fast) var(--ease-standard),
			transform var(--duration-fast) var(--ease-standard);
	}

	:global(.affiliation-marker:hover),
	:global(.affiliation-marker.is-active) {
		transform: scale(1.12);
	}

	:global(.affiliation-marker.is-active) {
		background: var(--color-secondary-500);
		color: var(--color-ink);
	}

	/* --- Popup: the card chrome is MapFrame's; this is its size and content. --- */

	:global(.affiliation-popup) {
		--map-popup-min-width: 18rem;
		--map-popup-padding: 1.1rem 1.2rem;
	}

	:global(.affiliation-popup-place) {
		margin-top: 0.25rem;
		color: var(--ink-subtle);
		font-size: var(--text-caption);
	}

	:global(.affiliation-popup-label) {
		margin-top: 0.9rem;
	}

	:global(.affiliation-popup-list) {
		margin-top: 0.35rem;
	}

	:global(.affiliation-popup-list li + li) {
		margin-top: 0.25rem;
	}

	@media (min-width: 1024px) {
		.affiliation-shell {
			--map-min-height: 34rem;
			grid-template-columns: minmax(0, 2fr) minmax(20rem, 1fr);
		}

		.affiliation-panel {
			border-top: 0;
			border-left: 1px solid var(--border-subtle);
		}

		.affiliation-list {
			max-height: 28rem;
		}
	}

	@media (max-width: 479px) {
		.affiliation-panel-header {
			align-items: stretch;
			flex-direction: column;
		}

		.affiliation-panel-header .btn {
			align-self: flex-start;
		}

		.affiliation-count {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.affiliation-marker) {
			transition: none;
		}

		:global(.affiliation-marker:hover),
		:global(.affiliation-marker.is-active) {
			transform: none;
		}
	}
</style>
