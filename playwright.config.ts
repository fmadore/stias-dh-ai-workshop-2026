import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	workers: process.env.CI ? 2 : 4,
	timeout: 60_000,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: 'http://127.0.0.1:4317',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	],
	webServer: {
		command: 'npm run preview -- --host 127.0.0.1 --port 4317 --strictPort',
		url: 'http://127.0.0.1:4317/stias-dh-ai-workshop-2026/',
		reuseExistingServer: !process.env.CI,
		timeout: 60_000
	}
});
