import { json } from '@sveltejs/kit';
import { paperText, personText } from '$lib/server/full-text';
import type { RequestHandler } from './$types';

// A non-dynamic route is included by SvelteKit's default '*' prerender entry,
// even though it is fetched on demand rather than linked in rendered HTML.
export const prerender = true;

export const GET: RequestHandler = () =>
	json({ people: Object.fromEntries(personText), papers: Object.fromEntries(paperText) });
