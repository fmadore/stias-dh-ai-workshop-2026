import { defineConfig, devices } from '@playwright/test';

// Exercise navigation, no-JS fallback, storage and filtering in other engines
// without repeating the full accessibility/map suite or Chromium-only PDFs.
const smokeTests =
	/locale switching uses the canonical French homepage|mobile navigation, theme and participant filtering remain functional|language switching survives without JavaScript|a bad French URL is answered in French|the wordmark says the whole thing on a phone, at the header height|theme and navigation survive unavailable storage|paper filters survive reload, locale switching and clearing/;

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	workers: process.env.CI ? 2 : 4,
	timeout: 60_000,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	reporter: [[process.env.CI ? 'github' : 'list'], ['html', { open: 'never' }]],
	use: {
		baseURL: 'http://127.0.0.1:4317',
		locale: 'en-GB',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure'
	},
	projects: [
		{
			name: 'chromium',
			testIgnore: '**/maps-live.spec.ts',
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'firefox-smoke',
			testMatch: ['**/navigation.spec.ts', '**/resilience.spec.ts'],
			grep: smokeTests,
			use: { ...devices['Desktop Firefox'] }
		},
		{
			name: 'webkit-smoke',
			testMatch: ['**/navigation.spec.ts', '**/resilience.spec.ts'],
			grep: smokeTests,
			use: { ...devices['Desktop Safari'] }
		},
		{
			name: 'live-maps',
			testMatch: '**/maps-live.spec.ts',
			use: { ...devices['Desktop Chrome'] }
		}
	],
	webServer: {
		command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4317 --strictPort',
		url: 'http://127.0.0.1:4317/stias-dh-ai-workshop-2026/',
		reuseExistingServer: !process.env.CI,
		timeout: 60_000
	}
});
