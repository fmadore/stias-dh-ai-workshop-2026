import type { CoAuthor } from '$lib/types';

/**
 * People credited on a paper who are not themselves coming to Stellenbosch.
 * They resolve through the people registry so the programme and the paper
 * pages can print a full byline, but they hold nothing beyond a name: no
 * affiliation, no country, no portrait, and so no page of their own. Author
 * links skip them rather than pointing at an empty profile.
 *
 * Order is meaningless here — a paper's byline order lives in its own
 * `authors` list.
 */
export const coAuthors: CoAuthor[] = [
	{
		id: 'adebanjo-oreoluwa-baderin',
		name: 'Adebanjo Oreoluwa Baderin'
	},
	{
		id: 'alawiye-basheer-adisa',
		name: 'Alawiye Basheer Adisa'
	},
	{
		id: 'elizabeth-olanike-adekoya',
		name: 'Elizabeth Olanike Adekoya'
	}
];
