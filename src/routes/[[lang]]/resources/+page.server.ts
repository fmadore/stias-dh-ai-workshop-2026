import type { PageServerLoad } from './$types';
import { resourcesPage } from '#lib/server/views.ts';

export const prerender = true;

// Slide decks and bylines resolved at prerender, so the page does not ship
// the bios and abstracts it never shows — and every description, intro and
// link label resolved for this page's locale, so it does not ship the other
// language's either. The locale comes off the route parameter: server loads
// run before the layout load sets the Paraglide global.
export const load: PageServerLoad = ({ params }) =>
	resourcesPage(params.lang === 'fr' ? 'fr' : 'en');
