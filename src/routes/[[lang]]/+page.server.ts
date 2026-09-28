import type { PageServerLoad } from './$types';
import { glanceStats } from '$lib/server/views';

// Three counts, resolved at prerender: importing the registries to take their
// `.length` put every bio and abstract on the landing page.
export const load: PageServerLoad = () => ({ glance: glanceStats() });
