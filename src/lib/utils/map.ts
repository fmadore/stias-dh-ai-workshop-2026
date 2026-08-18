import type { Map as MapLibreMap, MapOptions } from 'maplibre-gl';
import * as m from '$lib/paraglide/messages';

type MapLibre = typeof import('maplibre-gl');

export interface LazyMapOptions {
	/** The element MapLibre draws into, and the one watched for entry. */
	container: HTMLElement;
	/** Merged over the shared defaults. `container` and `style` are supplied here. */
	options?: Partial<Omit<MapOptions, 'container' | 'style'>>;
	/** MapLibre's close button announces what it closes, which differs per map. */
	popupCloseLabel: string;
	/** Runs once the renderer exists, before `load`. Markers and popups go here. */
	setup?: (map: MapLibreMap, maplibre: MapLibre) => void;
	onReady?: (map: MapLibreMap) => void;
	onFail?: () => void;
	/** Debounced window resize, delivered only after `load`. */
	onResize?: (map: MapLibreMap) => void;
	/**
	 * Runs before the map is removed, for whatever `setup` created. Markers and
	 * popups outlive `map.remove()` — they are DOM overlays the map does not own.
	 */
	teardown?: () => void;
}

/**
 * Boots a MapLibre map once its container is near the viewport and returns a
 * teardown for `onMount`.
 *
 * The two maps on this site are unrelated in what they show and identical in
 * how they have to arrive: the renderer and its stylesheet are 500 KB that no
 * page should pay for before someone scrolls to a map, OpenFreeMap's two styles
 * have to follow the theme toggle, and its dark style references a sprite name
 * its own sprite sheet does not carry. Keeping that in one place is the
 * difference between fixing such a thing once and fixing it twice.
 */
export function createLazyMap(config: LazyMapOptions): () => void {
	let destroyed = false;
	let started = false;
	let ready = false;
	let map: MapLibreMap | undefined;
	let themeObserver: MutationObserver | undefined;
	let intersectionObserver: IntersectionObserver | undefined;
	let loadTimer: number | undefined;
	let resizeTimer: number | undefined;

	function handleResize() {
		if (!map) return;
		if (resizeTimer) window.clearTimeout(resizeTimer);
		resizeTimer = window.setTimeout(() => {
			if (!map) return;
			map.resize();
			if (ready) config.onResize?.(map);
		}, 150);
	}

	window.addEventListener('resize', handleResize);

	async function initialize() {
		if (started) return;
		started = true;

		try {
			// The stylesheet rides the same lazy path as the renderer. Imported
			// statically it was hoisted into the route stylesheet, where it was
			// 83,143 of 89,906 bytes — 92.5% of a file that blocks the first
			// paint for every visitor, including the ones who never scroll to the
			// map and the ones whose browser never runs this function at all.
			// Dynamic, it becomes its own asset that arrives with the renderer it
			// styles.
			const [maplibre, workerModule] = await Promise.all([
				import('maplibre-gl'),
				import('maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'),
				import('maplibre-gl/dist/maplibre-gl.css')
			]);
			if (destroyed) return;

			maplibre.setWorkerUrl(workerModule.default);
			let dark = document.documentElement.classList.contains('dark');
			const styleUrl = () =>
				dark
					? 'https://tiles.openfreemap.org/styles/dark'
					: 'https://tiles.openfreemap.org/styles/positron';

			map = new maplibre.Map({
				cooperativeGestures: true,
				dragRotate: false,
				...config.options,
				container: config.container,
				style: styleUrl(),
				locale: {
					'AttributionControl.ToggleAttribution': m.map_attribution_toggle(),
					'NavigationControl.ZoomIn': m.map_zoom_in(),
					'NavigationControl.ZoomOut': m.map_zoom_out(),
					'Popup.Close': config.popupCloseLabel,
					'CooperativeGesturesHandler.WindowsHelpText': m.map_gesture_windows(),
					'CooperativeGesturesHandler.MacHelpText': m.map_gesture_mac(),
					'CooperativeGesturesHandler.MobileHelpText': m.map_gesture_mobile()
				}
			});

			map.setMissingStyleImageResolver((imageId) => {
				if (imageId !== 'circle-11' || !map) return;

				// OpenFreeMap's dark style references the legacy Maki name
				// `circle-11`; its shared sprite contains the same icon as
				// `circle_11_black`. Register an alias without replacing the
				// externally maintained style or suppressing other image errors.
				const fallback = map.getImage('circle_11_black');
				if (!fallback || map.hasImage(imageId)) return;
				map.addImage(imageId, fallback.data, {
					pixelRatio: fallback.pixelRatio,
					sdf: fallback.sdf
				});
			});
			map.touchZoomRotate.disableRotation();
			map.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right');
			map.addControl(new maplibre.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');

			config.setup?.(map, maplibre);

			map.on('load', () => {
				if (loadTimer) window.clearTimeout(loadTimer);
				ready = true;
				if (map) config.onReady?.(map);
			});

			loadTimer = window.setTimeout(() => {
				if (!ready) config.onFail?.();
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
			config.onFail?.();
		}
	}

	if ('IntersectionObserver' in window) {
		intersectionObserver = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				intersectionObserver?.disconnect();
				void initialize();
			},
			{ rootMargin: '320px 0px' }
		);
		intersectionObserver.observe(config.container);
	} else {
		void initialize();
	}

	return () => {
		destroyed = true;
		if (loadTimer) window.clearTimeout(loadTimer);
		if (resizeTimer) window.clearTimeout(resizeTimer);
		window.removeEventListener('resize', handleResize);
		intersectionObserver?.disconnect();
		themeObserver?.disconnect();
		config.teardown?.();
		map?.remove();
		map = undefined;
	};
}
