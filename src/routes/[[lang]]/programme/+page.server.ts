import type { PageServerLoad } from './$types';
import { sessionCasts } from '$lib/server/views';

// Names, titles and bylines resolved at prerender, so the schedule does not
// ship the bios and abstracts it never shows. Locale-free: affiliations stay
// `LocalizedString` and are picked by the component.
export const load: PageServerLoad = () => ({ casts: sessionCasts() });
