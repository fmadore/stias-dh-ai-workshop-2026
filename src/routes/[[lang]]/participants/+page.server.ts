import type { PageServerLoad } from './$types';
import { directoryListings } from '#lib/server/views.ts';

// Everything the directory and its map show, without the 33 bios the cards do
// not print. Search fetches those on demand (`loadFullText`). The locale comes
// off the route parameter for the cards' slot labels ("Panel 3 · Tue 14:00"):
// server loads run before the layout load sets the Paraglide global.
export const load: PageServerLoad = ({ params }) =>
	directoryListings(params.lang === 'fr' ? 'fr' : 'en');
