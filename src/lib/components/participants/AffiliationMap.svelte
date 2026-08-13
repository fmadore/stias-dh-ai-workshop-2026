<script lang="ts">
	import { onMount } from 'svelte';
	import type {
		LngLatBounds as MapLibreBounds,
		Map as MapLibreMap,
		Marker as MapLibreMarker,
		Popup as MapLibrePopup
	} from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import * as m from '$lib/paraglide/messages';
	import { affiliationLocations } from '$lib/data/affiliations';
	import { participants } from '$lib/data/participants';
	import type { AffiliationLocation, Participant } from '$lib/types';
	import { countryName } from '$lib/utils/country';
	import { localePath, t } from '$lib/utils/i18n';
	import { getLocale } from '$lib/paraglide/runtime';

	type LocationView = AffiliationLocation & {
		label: string;
		place: string;
		people: Participant[];
	};

	const participantsById = Object.fromEntries(
		participants.map((participant) => [participant.id, participant])
	) as Record<string, Participant>;
	const locale = getLocale();
	const locations: LocationView[] = affiliationLocations
		.map((location) => ({
			...location,
			label: t(location.name),
			place: `${t(location.city)}, ${countryName(location.country, locale)}`,
			people: location.participantIds
				.map((id) => participantsById[id])
				.filter((participant): participant is Participant => Boolean(participant))
		}))
		.filter((location) => location.people.length > 0)
		.sort((a, b) => a.label.localeCompare(b.label, locale));

	let mapHost: HTMLDivElement;
	let map: MapLibreMap | undefined;
	let bounds: MapLibreBounds | undefined;
	let popup: MapLibrePopup | undefined;
	let markers: Array<{ id: string; marker: MapLibreMarker }> = [];
	let selectedId = $state<string | null>(null);
	let mapReady = $state(false);
	let mapFailed = $state(false);

	function memberCount(count: number): string {
		return count === 1 ? m.affiliations_member_one() : m.affiliations_member_many({ count });
	}

	function setSelectedMarker(id: string | null) {
		for (const entry of markers) {
			entry.marker.getElement().classList.toggle('is-active', entry.id === id);
		}
	}

	function popupContent(location: LocationView): HTMLElement {
		const content = document.createElement('article');
		content.className = 'affiliation-popup-body';

		const heading = document.createElement('h3');
		heading.className = 'affiliation-popup-title';
		heading.textContent = location.label;
		content.appendChild(heading);

		const place = document.createElement('p');
		place.className = 'affiliation-popup-place';
		place.textContent = location.place;
		content.appendChild(place);

		const peopleLabel = document.createElement('p');
		peopleLabel.className = 'affiliation-popup-label';
		peopleLabel.textContent = m.affiliations_popup_participants();
		content.appendChild(peopleLabel);

		const list = document.createElement('ul');
		list.className = 'affiliation-popup-list';
		for (const participant of location.people) {
			const item = document.createElement('li');
			const link = document.createElement('a');
			link.href = localePath(`/participants/${participant.id}`);
			link.textContent = participant.name;
			item.appendChild(link);
			list.appendChild(item);
		}
		content.appendChild(list);

		return content;
	}

	function selectLocation(id: string, moveMap = true) {
		const location = locations.find((entry) => entry.id === id);
		if (!location) return;

		selectedId = id;
		setSelectedMarker(id);
		if (!map || !popup || !mapReady) return;

		if (moveMap) {
			const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			map.easeTo({
				center: [location.coordinates.lng, location.coordinates.lat],
				zoom: Math.max(map.getZoom(), 4.5),
				duration: reducedMotion ? 0 : 700
			});
		}

		popup
			.setLngLat([location.coordinates.lng, location.coordinates.lat])
			.setDOMContent(popupContent(location))
			.addTo(map);
	}

	function showAllLocations(animate = true) {
		selectedId = null;
		setSelectedMarker(null);
		popup?.remove();
		if (!map || !bounds || !mapReady) return;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const narrow = window.matchMedia('(max-width: 639px)').matches;
		map.fitBounds(bounds, {
			padding: narrow ? 30 : 52,
			maxZoom: 2.8,
			duration: animate && !reducedMotion ? 700 : 0
		});
	}

	onMount(() => {
		let destroyed = false;
		let started = false;
		let themeObserver: MutationObserver | undefined;
		let intersectionObserver: IntersectionObserver | undefined;
		let loadTimer: number | undefined;
		let resizeTimer: number | undefined;

		function handleResize() {
			if (!map) return;
			if (resizeTimer) window.clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(() => {
				map?.resize();
				if (mapReady && !selectedId) showAllLocations(false);
			}, 150);
		}

		window.addEventListener('resize', handleResize);

		async function initializeMap() {
			if (started) return;
			started = true;

			try {
				const [maplibre, workerModule] = await Promise.all([
					import('maplibre-gl'),
					import('maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url')
				]);
				if (destroyed) return;

				maplibre.setWorkerUrl(workerModule.default);
				let dark = document.documentElement.classList.contains('dark');
				const styleUrl = () =>
					dark
						? 'https://tiles.openfreemap.org/styles/dark'
						: 'https://tiles.openfreemap.org/styles/positron';

				map = new maplibre.Map({
					container: mapHost,
					style: styleUrl(),
					center: [-10, 18],
					zoom: 1.25,
					minZoom: 0.5,
					maxZoom: 12,
					renderWorldCopies: false,
					cooperativeGestures: true,
					dragRotate: false,
					locale: {
						'AttributionControl.ToggleAttribution': m.map_attribution_toggle(),
						'NavigationControl.ZoomIn': m.map_zoom_in(),
						'NavigationControl.ZoomOut': m.map_zoom_out(),
						'Popup.Close': m.map_popup_close(),
						'CooperativeGesturesHandler.WindowsHelpText': m.map_gesture_windows(),
						'CooperativeGesturesHandler.MacHelpText': m.map_gesture_mac(),
						'CooperativeGesturesHandler.MobileHelpText': m.map_gesture_mobile()
					}
				});
				map.touchZoomRotate.disableRotation();
				map.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right');
				map.addControl(new maplibre.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');

				popup = new maplibre.Popup({
					className: 'affiliation-popup',
					offset: 18,
					maxWidth: '22rem',
					focusAfterOpen: false
				});
				popup.on('close', () => {
					selectedId = null;
					setSelectedMarker(null);
				});

				bounds = new maplibre.LngLatBounds();
				for (const location of locations) {
					const markerButton = document.createElement('button');
					markerButton.type = 'button';
					markerButton.className = 'affiliation-marker';
					markerButton.textContent = String(location.people.length);
					markerButton.setAttribute(
						'aria-label',
						m.affiliations_select({ affiliation: location.label })
					);
					markerButton.title = location.label;
					markerButton.addEventListener('click', () => selectLocation(location.id, false));

					const marker = new maplibre.Marker({ element: markerButton })
						.setLngLat([location.coordinates.lng, location.coordinates.lat])
						.addTo(map);
					markers.push({ id: location.id, marker });
					bounds.extend([location.coordinates.lng, location.coordinates.lat]);
				}

				map.on('load', () => {
					if (loadTimer) window.clearTimeout(loadTimer);
					mapReady = true;
					mapFailed = false;
					showAllLocations(false);
				});

				loadTimer = window.setTimeout(() => {
					if (!mapReady) mapFailed = true;
				}, 15000);

				themeObserver = new MutationObserver(() => {
					const nextDark = document.documentElement.classList.contains('dark');
					if (nextDark === dark) return;
					dark = nextDark;
					map?.setStyle(styleUrl());
				});
				themeObserver.observe(document.documentElement, {
					attributes: true,
					attributeFilter: ['class']
				});
			} catch {
				mapFailed = true;
			}
		}

		if ('IntersectionObserver' in window) {
			intersectionObserver = new IntersectionObserver(
				(entries) => {
					if (!entries.some((entry) => entry.isIntersecting)) return;
					intersectionObserver?.disconnect();
					void initializeMap();
				},
				{ rootMargin: '320px 0px' }
			);
			intersectionObserver.observe(mapHost);
		} else {
			void initializeMap();
		}

		return () => {
			destroyed = true;
			if (loadTimer) window.clearTimeout(loadTimer);
			if (resizeTimer) window.clearTimeout(resizeTimer);
			window.removeEventListener('resize', handleResize);
			intersectionObserver?.disconnect();
			themeObserver?.disconnect();
			popup?.remove();
			for (const entry of markers) entry.marker.remove();
			markers = [];
			map?.remove();
			map = undefined;
		};
	});
</script>

<div class="mb-7 max-w-3xl">
	<h2 class="text-section text-strong mb-2">{m.affiliations_title()}</h2>
	<p class="text-prose">{m.affiliations_intro()}</p>
</div>

<div class="affiliation-shell">
	<div class="map-frame" role="region" aria-label={m.affiliations_map_label()}>
		<div bind:this={mapHost} class="affiliation-map"></div>
		{#if !mapReady && !mapFailed}
			<div class="map-state" aria-live="polite">
				<span class="map-loader" aria-hidden="true"></span>
				<span>{m.affiliations_map_loading()}</span>
			</div>
		{:else if mapFailed}
			<p class="map-state map-error" role="status">{m.affiliations_map_error()}</p>
		{/if}
	</div>

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
			<button class="btn btn-secondary btn-sm" type="button" onclick={() => showAllLocations()}>
				{m.affiliations_show_all()}
			</button>
		</div>

		<ol class="affiliation-list">
			{#each locations as location (location.id)}
				<li>
					<button
						type="button"
						class:active={selectedId === location.id}
						aria-pressed={selectedId === location.id}
						onclick={() => selectLocation(location.id)}
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

<p class="text-muted mt-3 max-w-3xl text-sm leading-relaxed">{m.affiliations_note()}</p>

<style>
	.affiliation-shell {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		overflow: hidden;
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-sm);
	}

	.map-frame {
		position: relative;
		min-height: 24rem;
		background: var(--surface-sunken);
	}

	.affiliation-map {
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
		font-weight: 700;
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

	:global(.affiliation-popup .maplibregl-popup-tip) {
		display: none;
	}

	:global(.affiliation-popup .maplibregl-popup-content) {
		min-width: min(18rem, calc(100vw - 4rem));
		padding: 1.1rem 1.2rem;
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-xl);
		color: var(--ink-body);
	}

	:global(.affiliation-popup .maplibregl-popup-close-button) {
		width: 2.5rem;
		height: 2.5rem;
		color: var(--ink-subtle);
		font-size: 1.25rem;
	}

	:global(.affiliation-popup .maplibregl-popup-close-button:hover) {
		background: color-mix(in oklab, var(--ink-strong) 7%, transparent);
		color: var(--ink-strong);
	}

	:global(.affiliation-popup-body) {
		padding-inline-end: 1.5rem;
	}

	:global(.affiliation-popup-title) {
		color: var(--ink-strong);
		font-family: var(--font-display);
		font-size: 1.2rem;
		line-height: 1.2;
	}

	:global(.affiliation-popup-place) {
		margin-top: 0.25rem;
		color: var(--ink-subtle);
		font-size: var(--text-caption);
	}

	:global(.affiliation-popup-label) {
		margin-top: 0.9rem;
		color: var(--ink-subtle);
		font-size: var(--text-badge);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	:global(.affiliation-popup-list) {
		margin-top: 0.35rem;
	}

	:global(.affiliation-popup-list li + li) {
		margin-top: 0.25rem;
	}

	:global(.affiliation-popup-list a) {
		color: var(--link);
		font-size: 0.875rem;
		text-decoration: underline;
		text-decoration-color: color-mix(in oklab, var(--link) 30%, transparent);
		text-underline-offset: 0.18em;
	}

	:global(.affiliation-popup-list a:hover) {
		color: var(--link-hover);
		text-decoration-color: currentColor;
	}

	.affiliation-map :global(.maplibregl-ctrl-group) {
		overflow: hidden;
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
	}

	.affiliation-map :global(.maplibregl-ctrl-group button + button) {
		border-top-color: var(--border-subtle);
	}

	.affiliation-map :global(.maplibregl-ctrl-group button) {
		width: 2.5rem;
		height: 2.5rem;
	}

	:global(.dark) .affiliation-map :global(.maplibregl-ctrl-icon) {
		filter: invert(1);
	}

	.affiliation-map :global(.maplibregl-ctrl-attrib) {
		background: color-mix(in oklab, var(--surface-raised) 88%, transparent);
		color: var(--ink-subtle);
	}

	.affiliation-map :global(.maplibregl-ctrl-attrib a) {
		color: var(--link);
	}

	@media (min-width: 1024px) {
		.affiliation-shell {
			grid-template-columns: minmax(0, 2fr) minmax(20rem, 1fr);
		}

		.map-frame {
			min-height: 34rem;
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
		.map-loader {
			animation-duration: 1.5s;
		}

		:global(.affiliation-marker) {
			transition: none;
		}

		:global(.affiliation-marker:hover),
		:global(.affiliation-marker.is-active) {
			transform: none;
		}
	}

	@keyframes map-spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
