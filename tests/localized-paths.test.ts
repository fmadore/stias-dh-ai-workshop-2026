import assert from 'node:assert/strict';
import test from 'node:test';
import {
	localeFromPath,
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

test('reads the locale from a path, including routes that never matched', () => {
	assert.equal(localeFromPath(`${base}/fr`, base), 'fr');
	assert.equal(localeFromPath(`${base}/fr/programme`, base), 'fr');
	// The case the error page exists for: a bad URL under the French prefix.
	assert.equal(localeFromPath(`${base}/fr/no-such-page`, base), 'fr');
	assert.equal(localeFromPath(`${base}/programme`, base), 'en');
	assert.equal(localeFromPath(`${base}/`, base), 'en');
	// "french-history" starts with "fr" but is not the locale segment.
	assert.equal(localeFromPath(`${base}/papers/french-history`, base), 'en');
	assert.equal(localeFromPath(`${base}/french-history`, base), 'en');
});
