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
