import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = path.resolve('build/_app/immutable');
const manifestPath = path.resolve('.svelte-kit/output/client/.vite/manifest.json');
const budgets = {
	maxJavaScriptGzip: 100 * 1024,
	totalJavaScriptGzip: 300 * 1024,
	totalCssGzip: 45 * 1024,
	// MapLibre is a deliberately lazy feature: keep its renderer and Web Worker
	// out of the core-site budget, but give both their own regression ceilings.
	mapLibreRendererGzip: 260 * 1024,
	mapLibreWorkerGzip: 130 * 1024
};

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((entry) => {
			const target = path.join(directory, entry.name);
			return entry.isDirectory() ? walk(target) : [target];
		})
	);
	return nested.flat();
}

const assets = await walk(root);
const sizes = await Promise.all(
	assets
		.filter((file) => /\.(?:js|css)$/.test(file))
		.map(async (file) => ({ file, gzip: gzipSync(await readFile(file)).byteLength }))
);
const javascript = sizes.filter(({ file }) => file.endsWith('.js'));
const css = sizes.filter(({ file }) => file.endsWith('.css'));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const mapLibreEntry = manifest['node_modules/maplibre-gl/dist/maplibre-gl.mjs'];
const mapLibreRendererPath = mapLibreEntry ? path.resolve('build', mapLibreEntry.file) : undefined;
const mapLibreRenderer = javascript.find(({ file }) => file === mapLibreRendererPath);
const mapLibreWorkers = javascript.filter(({ file }) =>
	file.includes(`${path.sep}workers${path.sep}maplibre-gl-worker-`)
);
const coreJavaScript = javascript.filter(
	({ file }) =>
		file !== mapLibreRendererPath && !mapLibreWorkers.some((worker) => worker.file === file)
);
const total = (items) => items.reduce((sum, item) => sum + item.gzip, 0);
const largest = coreJavaScript.toSorted((a, b) => b.gzip - a.gzip)[0];
const failures = [];

if (largest.gzip > budgets.maxJavaScriptGzip)
	failures.push(`largest JS chunk is ${(largest.gzip / 1024).toFixed(1)} KiB gzip`);
if (total(coreJavaScript) > budgets.totalJavaScriptGzip)
	failures.push(`core JS is ${(total(coreJavaScript) / 1024).toFixed(1)} KiB gzip`);
if (total(css) > budgets.totalCssGzip)
	failures.push(`all CSS is ${(total(css) / 1024).toFixed(1)} KiB gzip`);
if (!mapLibreRenderer) failures.push('MapLibre renderer chunk was not found in the Vite manifest');
if (mapLibreRenderer && mapLibreRenderer.gzip > budgets.mapLibreRendererGzip)
	failures.push(`MapLibre renderer is ${(mapLibreRenderer.gzip / 1024).toFixed(1)} KiB gzip`);
if (mapLibreWorkers.length !== 1)
	failures.push(`expected 1 MapLibre worker chunk, found ${mapLibreWorkers.length}`);
if (total(mapLibreWorkers) > budgets.mapLibreWorkerGzip)
	failures.push(`MapLibre worker is ${(total(mapLibreWorkers) / 1024).toFixed(1)} KiB gzip`);

if (failures.length) {
	for (const failure of failures) console.error(`✗ ${failure}`);
	process.exit(1);
}

console.log(
	`bundle-size: OK (largest core JS ${(largest.gzip / 1024).toFixed(1)} KiB, core JS ${(total(coreJavaScript) / 1024).toFixed(1)} KiB, MapLibre ${((mapLibreRenderer?.gzip ?? 0) / 1024).toFixed(1)} KiB + worker ${(total(mapLibreWorkers) / 1024).toFixed(1)} KiB, CSS ${(total(css) / 1024).toFixed(1)} KiB gzip)`
);
