<script lang="ts">
	import { onMount } from 'svelte';
	import type {
		LngLatBounds as MapLibreBounds,
		Map as MapLibreMap,
		Marker as MapLibreMarker,
		Popup as MapLibrePopup
	} from 'maplibre-gl';
	import * as m from '$lib/paraglide/messages';
	import { venueInfo } from '$lib/data/venue';
	import { accommodations } from '$lib/data/accommodation';
	import { getLocale } from '$lib/paraglide/runtime';
	import { createLazyMap } from '$lib/utils/map';
	import { distanceMetres, formatDistance } from '$lib/utils/geo';

	type Place = {
		id: string;
		name: string;
		role: string;
		address: string;
		coordinates: { lat: number; lng: number };
		website: string;
		isVenue: boolean;
		/** Absent for the venue itself — nothing is 0 m from the venue. */
		distance?: string;
	};

	const locale = getLocale() as 'en' | 'fr';

	const places: Place[] = [
		{
			id: 'venue',
			name: venueInfo.name,
			role: m.venue_role_venue(),
			address: `${venueInfo.address}, ${venueInfo.city}`,
			coordinates: venueInfo.coordinates,
			website: venueInfo.website,
			isVenue: true
		},
		...accommodations.map((place) => ({
			id: place.id,
			name: place.name,
			role: m.venue_role_guest_house(),
			address: `${place.address}, ${place.city}`,
			coordinates: place.coordinates,
			website: place.website,
			isVenue: false,
			distance: m.accommodation_distance({
				distance: formatDistance(distanceMetres(venueInfo.coordinates, place.coordinates), locale)
			})
		}))
	];

	let mapHost: HTMLDivElement;
	let map: MapLibreMap | undefined;
	let bounds: MapLibreBounds | undefined;
	let popup: MapLibrePopup | undefined;
	let markers: Array<{ id: string; marker: MapLibreMarker }> = [];
	let selectedId = $state<string | null>(null);
	let mapReady = $state(false);
	let mapFailed = $state(false);

	/**
	 * The popup is MapLibre's, drawn outside this component's markup and
	 * dismissed on any map interaction, so the announcement belongs to the chip
	 * row instead — which is also where the keyboard path already lives.
	 */
	const selectionSummary = $derived.by(() => {
		const place = selectedId ? places.find((entry) => entry.id === selectedId) : undefined;
		if (!place) return '';
		return [place.name, place.role, place.address, place.distance].filter(Boolean).join(' — ');
	});

	function setSelectedMarker(id: string | null) {
		selectedId = id;
		for (const entry of markers) {
			entry.marker.getElement().classList.toggle('is-active', entry.id === id);
		}
	}

	function popupContent(place: Place): HTMLElement {
		const content = document.createElement('article');
		content.className = 'venue-popup-body';

		const role = document.createElement('p');
		role.className = 'venue-popup-role';
		role.textContent = place.role;
		content.appendChild(role);

		const heading = document.createElement('h3');
		heading.className = 'venue-popup-title';
		heading.textContent = place.name;
		content.appendChild(heading);

		const address = document.createElement('p');
		address.className = 'venue-popup-meta';
		address.textContent = place.distance ? `${place.address} · ${place.distance}` : place.address;
		content.appendChild(address);

		const link = document.createElement('a');
		link.className = 'venue-popup-link';
		link.href = place.website;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.textContent = m.visit_website();
		content.appendChild(link);

		return content;
	}

	function selectPlace(id: string, moveMap = true) {
		const place = places.find((entry) => entry.id === id);
		if (!place) return;

		setSelectedMarker(id);
		if (!map || !popup || !mapReady) return;

		if (moveMap) {
			const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			map.easeTo({
				center: [place.coordinates.lng, place.coordinates.lat],
				zoom: Math.max(map.getZoom(), 16),
				duration: reducedMotion ? 0 : 700
			});
		}

		popup
			.setLngLat([place.coordinates.lng, place.coordinates.lat])
			.setDOMContent(popupContent(place))
			.addTo(map);

		// Reassert the selection because moving an already-open shared popup
		// emits `close` before MapLibre attaches it at the new location.
		setSelectedMarker(id);
	}

	function showAllPlaces(animate = true) {
		setSelectedMarker(null);
		popup?.remove();
		if (!map || !bounds || !mapReady) return;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const narrow = window.matchMedia('(max-width: 639px)').matches;
		map.fitBounds(bounds, {
			padding: narrow ? 46 : 84,
			maxZoom: 16,
			duration: animate && !reducedMotion ? 700 : 0
		});
	}

	onMount(() =>
		createLazyMap({
			container: mapHost,
			popupCloseLabel: m.venue_map_popup_close(),
			options: {
				center: [venueInfo.coordinates.lng, venueInfo.coordinates.lat],
				zoom: 13.5,
				minZoom: 9,
				maxZoom: 18
			},
			setup(instance, maplibre) {
				map = instance;

				popup = new maplibre.Popup({
					className: 'venue-popup',
					closeOnClick: true,
					offset: 16,
					maxWidth: '20rem',
					focusAfterOpen: false
				});
				popup.on('close', () => {
					selectedId = null;
					setSelectedMarker(null);
				});

				bounds = new maplibre.LngLatBounds();
				for (const place of places) {
					const markerButton = document.createElement('button');
					markerButton.type = 'button';
					markerButton.className = place.isVenue ? 'venue-marker is-venue' : 'venue-marker is-stay';
					markerButton.setAttribute('aria-label', m.venue_map_select({ place: place.name }));
					markerButton.title = place.name;
					markerButton.addEventListener('click', (event) => {
						// Otherwise the same click bubbles to MapLibre's map-level
						// close handler and immediately dismisses the popup we just opened.
						event.stopPropagation();
						selectPlace(place.id, false);
					});

					const marker = new maplibre.Marker({ element: markerButton })
						.setLngLat([place.coordinates.lng, place.coordinates.lat])
						.addTo(instance);
					markers.push({ id: place.id, marker });
					bounds.extend([place.coordinates.lng, place.coordinates.lat]);
				}
			},
			onReady() {
				mapReady = true;
				mapFailed = false;
				showAllPlaces(false);
			},
			onFail() {
				mapFailed = true;
			},
			onResize() {
				if (!selectedId) showAllPlaces(false);
			},
			teardown() {
				popup?.remove();
				for (const entry of markers) entry.marker.remove();
				markers = [];
				map = undefined;
			}
		})
	);
</script>

<div class="venue-map-shell">
	<div class="map-frame" role="region" aria-label={m.venue_map_label()}>
		<div bind:this={mapHost} class="venue-map"></div>
		<noscript>
			<p class="map-state map-error">{m.venue_map_error()}</p>
		</noscript>
		{#if !mapReady && !mapFailed}
			<div class="map-state map-loading" aria-live="polite">
				<span class="map-loader" aria-hidden="true"></span>
				<span>{m.venue_map_loading()}</span>
			</div>
		{:else if mapFailed}
			<p class="map-state map-error" role="status">{m.venue_map_error()}</p>
		{/if}
	</div>

	<div class="venue-map-legend">
		<h3 class="sr-only">{m.venue_map_places_label()}</h3>
		<p class="sr-only" role="status" aria-live="polite" aria-atomic="true">{selectionSummary}</p>
		<ul class="venue-chips">
			{#each places as place (place.id)}
				<li>
					<button
						type="button"
						class="venue-chip"
						class:is-venue={place.isVenue}
						class:active={selectedId === place.id}
						aria-pressed={selectedId === place.id}
						onclick={() => selectPlace(place.id)}
					>
						<span class="venue-chip-dot" aria-hidden="true"></span>
						{place.name}
					</button>
				</li>
			{/each}
		</ul>
		<button class="btn btn-secondary btn-sm" type="button" onclick={() => showAllPlaces()}>
			{m.venue_map_show_all()}
		</button>
	</div>
</div>

<style>
	/* The loading state is prerendered, so without JavaScript it is a spinner
	   that spins forever under a promise nothing will keep. The <noscript>
	   message above takes its place; the addresses listed below the map are
	   static markup and work either way. */
	:global(.no-js) .map-loading {
		display: none;
	}

	.venue-map-shell {
		overflow: hidden;
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-sm);
	}

	.map-frame {
		position: relative;
		min-height: 22rem;
		background: var(--surface-sunken);
	}

	.venue-map {
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

	.venue-map-legend {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 1.1rem;
		border-top: 1px solid var(--border-subtle);
	}

	.venue-map-legend .btn {
		flex-shrink: 0;
	}

	.venue-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 0.5rem;
	}

	.venue-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.35rem 0.7rem;
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-full);
		color: var(--ink-body);
		font-size: var(--text-ui-sm);
		line-height: 1.3;
		transition:
			background-color var(--duration-fast) var(--ease-standard),
			border-color var(--duration-fast) var(--ease-standard),
			color var(--duration-fast) var(--ease-standard);
	}

	.venue-chip:hover {
		border-color: color-mix(in oklab, var(--color-primary-500) 45%, var(--border-subtle));
		color: var(--ink-strong);
	}

	.venue-chip.active {
		background: color-mix(in oklab, var(--color-primary-500) 10%, transparent);
		border-color: color-mix(in oklab, var(--color-primary-500) 55%, transparent);
		color: var(--ink-strong);
	}

	.venue-chip-dot {
		width: 0.55rem;
		height: 0.55rem;
		flex-shrink: 0;
		border-radius: var(--radius-full);
		background: var(--color-primary-600);
	}

	.venue-chip.is-venue .venue-chip-dot {
		background: var(--color-secondary-500);
	}

	/* --- Markers --- */

	:global(.venue-marker) {
		display: block;
		border: 2px solid #fff;
		border-radius: var(--radius-full);
		box-shadow: var(--shadow-md);
		transition:
			transform var(--duration-fast) var(--ease-standard),
			box-shadow var(--duration-fast) var(--ease-standard);
	}

	/* The venue is the point of reference the other two are measured against,
	   so it reads as the larger gold pin and the guest houses as smaller teal
	   ones. Size and hue both carry it — hue alone would not survive a
	   monochrome print or a red-green deficiency. */
	:global(.venue-marker.is-venue) {
		width: 1.5rem;
		height: 1.5rem;
		background: var(--color-secondary-500);
	}

	:global(.venue-marker.is-stay) {
		width: 1.1rem;
		height: 1.1rem;
		background: var(--color-primary-600);
	}

	:global(.venue-marker:hover),
	:global(.venue-marker.is-active) {
		transform: scale(1.2);
		box-shadow: var(--shadow-lg);
	}

	/* --- Popup --- */

	:global(.venue-popup .maplibregl-popup-tip) {
		display: none;
	}

	:global(.venue-popup .maplibregl-popup-content) {
		min-width: min(15rem, calc(100vw - 4rem));
		padding: 1rem 1.15rem;
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-xl);
		color: var(--ink-body);
	}

	:global(.venue-popup .maplibregl-popup-close-button) {
		width: 2.5rem;
		height: 2.5rem;
		color: var(--ink-subtle);
		font-size: 1.25rem;
	}

	:global(.venue-popup .maplibregl-popup-close-button:hover) {
		background: color-mix(in oklab, var(--ink-strong) 7%, transparent);
		color: var(--ink-strong);
	}

	:global(.venue-popup-body) {
		padding-inline-end: 1.5rem;
	}

	:global(.venue-popup-role) {
		color: var(--ink-subtle);
		font-size: var(--text-badge);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	:global(.venue-popup-title) {
		margin-top: 0.3rem;
		color: var(--ink-strong);
		font-family: var(--font-display);
		/* The card-title role at its floor, fixed rather than fluid: the popup
		   has a max-width, so it must not grow with the viewport. */
		font-size: 1.1875rem;
		line-height: 1.25;
		letter-spacing: -0.012em;
	}

	:global(.venue-popup-meta) {
		margin-top: 0.3rem;
		color: var(--ink-subtle);
		font-size: var(--text-caption);
		line-height: 1.45;
	}

	:global(.venue-popup-link) {
		display: inline-block;
		margin-top: 0.6rem;
		color: var(--link);
		font-size: var(--text-ui-sm);
		text-decoration: underline;
		text-decoration-color: color-mix(in oklab, var(--link) 30%, transparent);
		text-underline-offset: 0.18em;
	}

	:global(.venue-popup-link:hover) {
		color: var(--link-hover);
		text-decoration-color: currentColor;
	}

	/* --- MapLibre chrome --- */

	.venue-map :global(.maplibregl-ctrl-group) {
		overflow: hidden;
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
	}

	.venue-map :global(.maplibregl-ctrl-group button + button) {
		border-top-color: var(--border-subtle);
	}

	.venue-map :global(.maplibregl-ctrl-group button) {
		width: 2.5rem;
		height: 2.5rem;
	}

	:global(.dark) .venue-map :global(.maplibregl-ctrl-icon) {
		filter: invert(1);
	}

	.venue-map :global(.maplibregl-ctrl-attrib) {
		background: color-mix(in oklab, var(--surface-raised) 88%, transparent);
		color: var(--ink-subtle);
	}

	.venue-map :global(.maplibregl-ctrl-attrib a) {
		color: var(--link);
	}

	@media (min-width: 768px) {
		.map-frame {
			min-height: 28rem;
		}
	}

	@media (max-width: 559px) {
		.venue-map-legend {
			align-items: stretch;
			flex-direction: column;
		}

		.venue-map-legend .btn {
			align-self: flex-start;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.map-loader {
			animation-duration: 1.5s;
		}

		:global(.venue-marker) {
			transition: none;
		}

		:global(.venue-marker:hover),
		:global(.venue-marker.is-active) {
			transform: none;
		}
	}

	@keyframes map-spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
