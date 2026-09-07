import { test as base, expect } from '@playwright/test';

export const BASE = '/stias-dh-ai-workshop-2026';

/** Exercise the actual renderer and markers without a dependency on tile servers. */
export const test = base.extend({
	context: async ({ context }, use) => {
		await context.route('https://tiles.openfreemap.org/styles/*', (route) =>
			route.fulfill({
				json: {
					version: 8,
					sources: {},
					layers: [
						{ id: 'background', type: 'background', paint: { 'background-color': '#f6f1e5' } }
					]
				}
			})
		);
		await use(context);
	}
});

export { expect };
