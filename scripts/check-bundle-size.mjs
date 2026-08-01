import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = path.resolve('build/_app/immutable');
const budgets = {
	maxJavaScriptGzip: 100 * 1024,
	totalJavaScriptGzip: 300 * 1024,
	totalCssGzip: 45 * 1024
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
const total = (items) => items.reduce((sum, item) => sum + item.gzip, 0);
const largest = javascript.toSorted((a, b) => b.gzip - a.gzip)[0];
const failures = [];

if (largest.gzip > budgets.maxJavaScriptGzip)
	failures.push(`largest JS chunk is ${(largest.gzip / 1024).toFixed(1)} KiB gzip`);
if (total(javascript) > budgets.totalJavaScriptGzip)
	failures.push(`all JS is ${(total(javascript) / 1024).toFixed(1)} KiB gzip`);
if (total(css) > budgets.totalCssGzip)
	failures.push(`all CSS is ${(total(css) / 1024).toFixed(1)} KiB gzip`);

if (failures.length) {
	for (const failure of failures) console.error(`✗ ${failure}`);
	process.exit(1);
}

console.log(
	`bundle-size: OK (largest JS ${(largest.gzip / 1024).toFixed(1)} KiB, total JS ${(total(javascript) / 1024).toFixed(1)} KiB, CSS ${(total(css) / 1024).toFixed(1)} KiB gzip)`
);
