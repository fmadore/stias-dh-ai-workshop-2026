import assert from 'node:assert/strict';
import test from 'node:test';
import {
	localizedAbsoluteUrl,
	localizedPath,
	switchLocalePath,
	unlocalizedPath
} from '../src/lib/utils/localized-paths';

const base = '/stias-dh-ai-workshop-2026';

test('builds GitHub Pages-compatible localized home paths', () => {
	assert.equal(localizedPath('/', 'en', base), `${base}/`);
	assert.equal(localizedPath('/', 'fr', base), `${base}/fr`);
	assert.equal(
		localizedAbsoluteUrl('https://example.test/repo', '/', 'fr'),
		'https://example.test/repo/fr'
	);
});

test('builds localized content paths without trailing slashes', () => {
	assert.equal(localizedPath('/about/', 'fr', base), `${base}/fr/about`);
	assert.equal(localizedPath('papers/example', 'en', base), `${base}/papers/example`);
});

test('removes only the deployment base and active locale prefix', () => {
	assert.equal(unlocalizedPath(`${base}/fr`, 'fr', base), '/');
	assert.equal(unlocalizedPath(`${base}/fr/about`, 'fr', base), '/about');
	assert.equal(
		unlocalizedPath(`${base}/papers/french-history`, 'en', base),
		'/papers/french-history'
	);
});

test('switches locale while preserving the content route', () => {
	assert.equal(switchLocalePath(`${base}/`, 'en', 'fr', base), `${base}/fr`);
	assert.equal(switchLocalePath(`${base}/fr`, 'fr', 'en', base), `${base}/`);
	assert.equal(switchLocalePath(`${base}/fr/programme`, 'fr', 'en', base), `${base}/programme`);
});
