import type { PageServerLoad } from './$types';
import { paperListings } from '$lib/server/views';

// Titles, bylines and a card's worth of each abstract. The full abstracts
// arrive only if someone searches (`loadFullText`). The locale comes off the
// route parameter because a bilingual abstract's excerpt follows the reader,
// and server loads run before the layout load sets the Paraglide global.
export const load: PageServerLoad = ({ params }) => ({
	papers: paperListings(params.lang === 'fr' ? 'fr' : 'en')
});
