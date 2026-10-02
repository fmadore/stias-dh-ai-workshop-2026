import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

test('the generated link checker validates local and cross-page fragments', async () => {
	const directory = await mkdtemp(path.join(tmpdir(), 'stias-links-'));
	try {
		await writeFile(
			path.join(directory, 'index.html'),
			'<a href="#welcome">Start</a><h1 id="welcome">Hello</h1><a href="programme#caf%C3%A9">Session</a>'
		);
		await writeFile(path.join(directory, 'programme.html'), '<h1 id="caf&#233;">Programme</h1>');
		const run = () =>
			spawnSync(process.execPath, ['scripts/check-links.mjs', directory], { encoding: 'utf8' });
		assert.equal(run().status, 0);
		await writeFile(path.join(directory, 'programme.html'), '<h1 id="renamed">Programme</h1>');
		const failed = run();
		assert.equal(failed.status, 1);
		assert.match(failed.stderr, /programme#caf%C3%A9/);
	} finally {
		assert.equal(path.dirname(path.resolve(directory)), path.resolve(tmpdir()));
		await rm(directory, { recursive: true, force: true });
	}
});

test('missing deployment bases fail while deliberate external owner-site links remain valid', async () => {
	const directory = await mkdtemp(path.join(tmpdir(), 'stias-links-'));
	try {
		const run = () =>
			spawnSync(process.execPath, ['scripts/check-links.mjs', directory], { encoding: 'utf8' });
		await writeFile(
			path.join(directory, 'index.html'),
			'<a href="https://fmadore.github.io/">Owner</a><a href="https://example.org/">External</a>'
		);
		assert.equal(run().status, 0);
		for (const reference of [
			'/',
			'/programme',
			'/images/missing.png',
			'https://fmadore.github.io/programme',
			'/stias-dh-ai-workshop-2026-typo/'
		]) {
			await writeFile(path.join(directory, 'index.html'), `<a href="${reference}">Broken</a>`);
			const failed = run();
			assert.equal(failed.status, 1, reference);
			assert.match(failed.stderr, /missing deployment base/);
		}
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
});

test('JSON-LD identifiers are distinct from navigable URLs and HTML anchors', async () => {
	const directory = await mkdtemp(path.join(tmpdir(), 'stias-links-'));
	try {
		const run = () =>
			spawnSync(process.execPath, ['scripts/check-links.mjs', directory], { encoding: 'utf8' });
		const json = {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@id': 'https://fmadore.github.io/stias-dh-ai-workshop-2026#event',
					url: 'https://fmadore.github.io/stias-dh-ai-workshop-2026/',
					subEvent: {
						'@id': 'https://fmadore.github.io/stias-dh-ai-workshop-2026/programme#presentation'
					}
				}
			]
		};
		const script = `<script type="application/ld+json">${JSON.stringify(json)}</script>`;
		await writeFile(
			path.join(directory, 'index.html'),
			`${script}<script>const hydration = ${JSON.stringify(json)};</script>`
		);
		assert.equal(run().status, 0, 'entity identifiers need no matching page fragment');
		await writeFile(path.join(directory, 'index.html'), `${script}<a href="#event">Jump</a>`);
		assert.equal(run().status, 1, 'real fragment links still need a DOM target');
		json['@graph'][0].url = 'https://fmadore.github.io/stias-dh-ai-workshop-2026/missing';
		await writeFile(
			path.join(directory, 'index.html'),
			`<script type="application/ld+json">${JSON.stringify(json)}</script>`
		);
		const brokenUrl = run();
		assert.equal(brokenUrl.status, 1);
		assert.match(brokenUrl.stderr, /missing/);
		await writeFile(
			path.join(directory, 'index.html'),
			'<script type="application/ld+json">{broken}</script>'
		);
		const invalidJson = run();
		assert.equal(invalidJson.status, 1);
		assert.match(invalidJson.stderr, /invalid JSON-LD/);
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
});
