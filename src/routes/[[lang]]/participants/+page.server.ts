import type { PageServerLoad } from './$types';
import { directoryListings } from '$lib/server/views';

// Everything the directory and its map show, without the 33 bios the cards do
// not print. Search fetches those on demand (`loadFullText`).
export const load: PageServerLoad = () => directoryListings();
