import type { PageServerLoad } from './$types';
import { resourcesPage } from '$lib/server/views';

export const prerender = true;

// Slide decks and bylines resolved at prerender, so the page does not ship
// the bios and abstracts it never shows. Locale-free: the component picks
// each `LocalizedString`.
export const load: PageServerLoad = () => resourcesPage();
