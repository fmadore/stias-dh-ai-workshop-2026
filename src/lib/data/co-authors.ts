import type { CoAuthor } from '$lib/types';

/**
 * People credited on a paper who are not themselves coming to Stellenbosch.
 * They resolve through the people registry so the programme and the paper
 * pages can print a full byline, including their affiliations, but they hold
 * no country, portrait or page of their own. Author links skip them rather
 * than pointing at an empty profile.
 *
 * Order is meaningless here — a paper's byline order lives in its own
 * `authors` list.
 */
export const coAuthors: CoAuthor[] = [
	{
		id: 'adebanjo-oreoluwa-baderin',
		name: 'Adebanjo Oreoluwa Baderin',
		affiliation: {
			en: 'BIGSAS, University of Bayreuth',
			fr: 'BIGSAS, University of Bayreuth'
		}
	},
	{
		id: 'alawiye-basheer-adisa',
		name: 'Alawiye Basheer Adisa',
		affiliation: {
			en: 'Lagos State University, Nigeria (LASU)',
			fr: 'Lagos State University, Nigeria (LASU)'
		}
	},
	{
		id: 'elizabeth-olanike-adekoya',
		name: 'Elizabeth Olanike Adekoya',
		affiliation: {
			en: 'Lagos State University of Education, Nigeria (LASUED)',
			fr: 'Lagos State University of Education, Nigeria (LASUED)'
		}
	}
];
