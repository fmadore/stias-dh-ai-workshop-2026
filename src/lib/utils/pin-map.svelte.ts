import type {
	FitBoundsOptions,
	LngLatBounds,
	Map as MapLibreMap,
	Marker,
	Popup,
	PopupOptions
} from 'maplibre-gl';
import { createLazyMap, type LazyMapOptions } from './map.ts';

/** Anything with a stable id and a point to pin it to. */
export interface PinMapItem {
	id: string;
	coordinates: { lat: number; lng: number };
}

export interface PinMapConfig<T extends PinMapItem> {
	/**
	 * A getter rather than an array, so a component can hand over a `$derived`
	 * list and every lookup sees its current value.
	 */
	items: () => readonly T[];
	/** The canvas's accessible name — the one named region the map exposes. */
	mapTitle: string;
	popupCloseLabel: string;
	/** Merged over the shared popup defaults: `className`, `offset`, `maxWidth`. */
	popup: Pick<PopupOptions, 'className' | 'offset' | 'maxWidth'>;
	/** Camera options for the map before `load`, merged over `createLazyMap`'s. */
	options?: LazyMapOptions['options'];
	/**
	 * The marker for one item, without behaviour. Selection on click is wired
	 * here, so both maps stop the click in the same way for the same reason.
	 */
	markerElement: (item: T) => HTMLElement;
	popupContent: (item: T) => HTMLElement;
	/** How "show all" frames the pins; padding is tighter below 640px. */
	fit: { padding: { narrow: number; wide: number }; maxZoom: number };
	/** The zoom a selection eases to at least, never out from. */
	focusZoom: number;
}

export interface SelectOptions {
	/** Marker clicks leave the camera alone: the pin is already where the reader is looking. */
	moveMap?: boolean;
	/**
	 * The control the selection came from, when it came from outside the map.
	 * Focus moves into the popup and returns here when the popup is dismissed.
	 */
	returnFocusTo?: HTMLElement;
}

export interface PinMap {
	readonly selectedId: string | null;
	readonly ready: boolean;
	readonly failed: boolean;
	select(id: string, options?: SelectOptions): void;
	showAll(animate?: boolean): void;
	/** Boots the map into `container` once it nears the viewport; returns the teardown. */
	mount(container: HTMLElement): () => void;
}

/**
 * The behaviour both maps share once MapLibre is on the page: one marker per
 * item, one shared popup, a selection that a list or chip row beside the map
 * can drive, and a "show all" that frames every pin.
 *
 * The two components had grown this independently and identically — about
 * three hundred lines apiece once their names were normalised — so a fix to
 * one (the popup's `close` racing a re-selection, the marker click bubbling
 * into MapLibre's close handler) had to be remembered for the other. What is
 * left in each component is what actually differs: its data, its marker and
 * popup content, and the list it keeps beside the map.
 *
 * Runes state, hence `.svelte.ts`: `selectedId`, `ready` and `failed` drive
 * the component's markup, and a selection made before the style loads is held
 * here and applied on `load`.
 */
export function createPinMap<T extends PinMapItem>(config: PinMapConfig<T>): PinMap {
	let selectedId = $state<string | null>(null);
	let ready = $state(false);
	let failed = $state(false);

	let map: MapLibreMap | undefined;
	let bounds: LngLatBounds | undefined;
	let popup: Popup | undefined;
	let markers: Array<{ id: string; marker: Marker }> = [];
	let returnFocusTo: HTMLElement | undefined;
	// Whether the view on screen is still the one "show all" framed. A resize
	// refits only then: a reader who has panned, zoomed or picked a pin since
	// has chosen their own view, and a mobile URL bar collapsing under their
	// scroll must not take it away.
	let showingAll = false;

	const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function find(id: string): T | undefined {
		return config.items().find((item) => item.id === id);
	}

	function setSelectedMarker(id: string | null) {
		selectedId = id;
		for (const entry of markers) {
			entry.marker.getElement().classList.toggle('is-active', entry.id === id);
		}
	}

	function select(id: string, { moveMap = true, returnFocusTo: trigger }: SelectOptions = {}) {
		const item = find(id);
		if (!item) return;

		setSelectedMarker(id);
		if (!map || !popup || !ready) return;
		showingAll = false;

		const lngLat: [number, number] = [item.coordinates.lng, item.coordinates.lat];
		if (moveMap) {
			map.easeTo({
				center: lngLat,
				zoom: Math.max(map.getZoom(), config.focusZoom),
				duration: reducedMotion() ? 0 : 700
			});
		}

		popup.setLngLat(lngLat).setDOMContent(config.popupContent(item)).addTo(map);

		// Reassert the selection because moving an already-open shared popup
		// emits `close` before MapLibre attaches it at the new location.
		setSelectedMarker(id);

		// A popup opened from the list sits earlier in the DOM than the button
		// that opened it, so a keyboard reader would otherwise have to Shift+Tab
		// back across the map to reach its links. Only then: a marker click
		// already has focus on the map, and a selection restored on `load` was
		// made long enough ago that yanking focus would be a surprise.
		returnFocusTo = trigger;
		if (trigger) {
			popup.getElement()?.querySelector<HTMLElement>('a[href], button:not([disabled])')?.focus();
		}
	}

	function showAll(animate = true) {
		setSelectedMarker(null);
		popup?.remove();
		if (!map || !bounds || !ready) return;

		const narrow = window.matchMedia('(max-width: 639px)').matches;
		const options: FitBoundsOptions = {
			padding: narrow ? config.fit.padding.narrow : config.fit.padding.wide,
			maxZoom: config.fit.maxZoom,
			duration: animate && !reducedMotion() ? 700 : 0
		};
		map.fitBounds(bounds, options);
		showingAll = true;
	}

	/** Escape closes the popup from anywhere inside it, as a dialog-like overlay should. */
	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape' || !popup?.isOpen()) return;
		if (!(event.target instanceof Node) || !popup.getElement()?.contains(event.target)) return;
		event.preventDefault();
		popup.remove();
	}

	/**
	 * A user gesture — drag, wheel, pinch, the zoom buttons — carries the DOM
	 * event that started it; `fitBounds`, `easeTo` and MapLibre's own resize
	 * handling do not.
	 */
	function handleUserMove(event: { originalEvent?: Event }) {
		if (event.originalEvent) showingAll = false;
	}

	function mount(container: HTMLElement): () => void {
		return createLazyMap({
			container,
			mapTitle: config.mapTitle,
			popupCloseLabel: config.popupCloseLabel,
			options: config.options,
			setup(instance, maplibre) {
				map = instance;

				popup = new maplibre.Popup({
					closeOnClick: true,
					focusAfterOpen: false,
					...config.popup
				});
				popup.on('close', () => {
					setSelectedMarker(null);
					// Focus was inside the popup when it went (Escape, the close
					// button): MapLibre removes those nodes, which drops focus to
					// <body>. Hand it back to the control that opened the popup.
					// A click on the map has already focused the canvas, and a click
					// on another list entry focused that, so neither is overridden.
					const trigger = returnFocusTo;
					returnFocusTo = undefined;
					if (trigger?.isConnected && document.activeElement === document.body) trigger.focus();
				});

				bounds = new maplibre.LngLatBounds();
				for (const item of config.items()) {
					const element = config.markerElement(item);
					element.addEventListener('click', (event) => {
						// Otherwise the same click bubbles to MapLibre's map-level
						// close handler and immediately dismisses the popup we just opened.
						event.stopPropagation();
						select(item.id, { moveMap: false });
					});

					const lngLat: [number, number] = [item.coordinates.lng, item.coordinates.lat];
					const marker = new maplibre.Marker({ element }).setLngLat(lngLat).addTo(instance);
					markers.push({ id: item.id, marker });
					bounds.extend(lngLat);
				}

				instance.on('movestart', handleUserMove);
				instance.on('zoomstart', handleUserMove);
				container.addEventListener('keydown', handleKeydown);
			},
			onReady() {
				ready = true;
				failed = false;
				if (selectedId) select(selectedId);
				else showAll(false);
			},
			onFail() {
				failed = true;
			},
			onResize() {
				if (!selectedId && showingAll) showAll(false);
			},
			teardown() {
				container.removeEventListener('keydown', handleKeydown);
				popup?.remove();
				for (const entry of markers) entry.marker.remove();
				markers = [];
				map = undefined;
			}
		});
	}

	return {
		get selectedId() {
			return selectedId;
		},
		get ready() {
			return ready;
		},
		get failed() {
			return failed;
		},
		select,
		showAll,
		mount
	};
}
