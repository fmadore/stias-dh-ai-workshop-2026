<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import { venueInfo, venueStreet } from '#lib/data/venue.ts';
	import { accommodations } from '#lib/data/accommodation.ts';
	import { createPinMap } from '#lib/utils/pin-map.svelte.ts';
	import MapFrame from '#lib/components/shared/MapFrame.svelte';

	type Place = {
		id: string;
		name: string;
		role: string;
		address: string;
		coordinates: { lat: number; lng: number };
		website: string;
		isVenue: boolean;
	};

	const places: Place[] = [
		{
			id: 'venue',
			name: venueInfo.name,
			role: m.venue_role_venue(),
			address: `${venueStreet}, ${venueInfo.city}`,
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
			isVenue: false
		}))
	];

	function markerElement(place: Place): HTMLElement {
		const markerButton = document.createElement('button');
		markerButton.type = 'button';
		markerButton.className = place.isVenue ? 'venue-marker is-venue' : 'venue-marker is-stay';
		// No `title`: it repeated the accessible name word for word, which some
		// screen readers then read twice. The chip row under the map names every
		// pin in the same colours, so a hover tooltip was not the only label.
		markerButton.setAttribute('aria-label', m.venue_map_select({ place: place.name }));
		return markerButton;
	}

	function popupContent(place: Place): HTMLElement {
		const content = document.createElement('article');
		content.className = 'map-popup-body';

		const role = document.createElement('p');
		role.className = 'map-popup-eyebrow';
		role.textContent = place.role;
		content.appendChild(role);

		const heading = document.createElement('h3');
		heading.className = 'map-popup-title venue-popup-title';
		heading.textContent = place.name;
		content.appendChild(heading);

		const address = document.createElement('p');
		address.className = 'venue-popup-meta';
		address.textContent = place.address;
		content.appendChild(address);

		const link = document.createElement('a');
		link.className = 'map-popup-link venue-popup-link';
		link.href = place.website;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.textContent = m.visit_website();
		content.appendChild(link);

		return content;
	}

	const pinMap = createPinMap({
		items: () => places,
		mapTitle: m.venue_map_label(),
		popupCloseLabel: m.venue_map_popup_close(),
		popup: { className: 'venue-popup', offset: 16, maxWidth: '20rem' },
		options: {
			center: [venueInfo.coordinates.lng, venueInfo.coordinates.lat],
			zoom: 13.5,
			minZoom: 9,
			maxZoom: 18
		},
		markerElement,
		popupContent,
		fit: { padding: { narrow: 46, wide: 84 }, maxZoom: 16 },
		focusZoom: 16
	});

	/**
	 * The popup is MapLibre's, drawn outside this component's markup and
	 * dismissed on any map interaction, so the announcement belongs to the chip
	 * row instead — which is also where the keyboard path already lives.
	 */
	const selectionSummary = $derived.by(() => {
		const id = pinMap.selectedId;
		const place = id ? places.find((entry) => entry.id === id) : undefined;
		if (!place) return '';
		return [place.name, place.role, place.address].filter(Boolean).join(' — ');
	});
</script>

<div class="venue-map-shell">
	<MapFrame
		map={pinMap}
		hostClass="venue-map"
		loadingLabel={m.venue_map_loading()}
		errorLabel={m.venue_map_error()}
	/>

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
						class:active={pinMap.selectedId === place.id}
						aria-pressed={pinMap.selectedId === place.id}
						onclick={(event) => pinMap.select(place.id, { returnFocusTo: event.currentTarget })}
					>
						<span class="venue-chip-dot" aria-hidden="true"></span>
						{place.name}
					</button>
				</li>
			{/each}
		</ul>
		<button class="btn btn-secondary btn-sm" type="button" onclick={() => pinMap.showAll()}>
			{m.venue_map_show_all()}
		</button>
	</div>
</div>

<style>
	.venue-map-shell {
		--map-min-height: 22rem;
		overflow: hidden;
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-sm);
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

	/* The guest-house dot is 1.1rem — 17.6px, under the 24px a pointer target
	   needs. The dot stays that size and the button's box stays the one MapLibre
	   anchors on; a transparent ring around it takes the extra clicks. No
	   `position` here: MapLibre's own `.maplibregl-marker` makes the button
	   absolute, which is what this ring is placed against, and setting it would
	   tie with that rule on specificity. The inset is measured from inside the
	   2px border, hence the extra 2px: 17.6px + 2 × 6px is a 25.6px target. */
	:global(.venue-marker)::before {
		content: '';
		position: absolute;
		inset: calc(-0.25rem - 2px);
		border-radius: inherit;
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

	/* --- Popup: the card chrome is MapFrame's; this is its size and content. --- */

	:global(.venue-popup) {
		--map-popup-min-width: 15rem;
		--map-popup-padding: 1rem 1.15rem;
	}

	:global(.venue-popup-title) {
		margin-top: 0.3rem;
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
	}

	@media (min-width: 768px) {
		.venue-map-shell {
			--map-min-height: 28rem;
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
		:global(.venue-marker) {
			transition: none;
		}

		:global(.venue-marker:hover),
		:global(.venue-marker.is-active) {
			transform: none;
		}
	}
</style>
