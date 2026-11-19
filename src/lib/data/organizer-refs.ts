import type { Organizer } from '#lib/types/index.ts';

/**
 * The convenors without their biographies: who they are, where they work and
 * how to reach them.
 *
 * The footer (every page), the page exits (every page), the call for papers
 * and the Event JSON-LD need a convenor's name and affiliation, never the
 * 150-word bio beside it — but importing `organizers.ts` for the names put all
 * four bios, in both languages, into a chunk every page preloads. Re-exporting
 * a slimmer view from that module would not help: the bundler still carries
 * the module whole. So the dependency runs the other way. This file holds
 * everything but the bios, and `organizers.ts` imports it and adds them, which
 * leaves the bios only on the pages that render them.
 */
export type OrganizerRef = Omit<Organizer, 'bio' | 'bioLanguage'>;

/** Every convenor's id. `organizers.ts` keys its bios by this, so none can be missed. */
export type OrganizerId = 'madore' | 'hiribarren' | 'ngue-um' | 'van-zaanen';

export const organizerRefs: Array<OrganizerRef & { id: OrganizerId }> = [
	{
		id: 'madore',
		name: 'Frédérick Madore',
		role: { en: 'Organiser', fr: 'Organisateur' },
		affiliation: {
			en: 'University of Bayreuth',
			fr: 'Université de Bayreuth'
		},
		image: '/images/organizers/frederick-madore.webp',
		country: 'DE',
		website: 'https://www.frederickmadore.com',
		orcid: '0000-0003-0959-2092'
	},
	{
		id: 'hiribarren',
		name: 'Vincent Hiribarren',
		role: { en: 'Organiser', fr: 'Organisateur' },
		affiliation: {
			en: "King's College London",
			fr: "King's College London"
		},
		image: '/images/organizers/vincent-hiribarren.webp',
		country: 'GB',
		website: 'https://www.vincenthiribarren.com',
		orcid: '0000-0002-8742-9576',
		online: true
	},
	{
		id: 'ngue-um',
		name: 'Emmanuel Ngue Um',
		role: { en: 'Organiser', fr: 'Organisateur' },
		affiliation: {
			en: 'University of Yaoundé 1',
			fr: 'Université de Yaoundé 1'
		},
		image: '/images/organizers/emmanuel-ngue-um.webp',
		country: 'CM',
		orcid: '0000-0002-8467-5990'
	},
	{
		id: 'van-zaanen',
		name: 'Menno van Zaanen',
		role: { en: 'Organiser', fr: 'Organisateur' },
		affiliation: {
			en: 'South African Centre for Digital Language Resources (SADiLaR)',
			fr: 'Centre sud-africain pour les ressources linguistiques numériques (SADiLaR)'
		},
		image: '/images/organizers/menno-van-zaanen.webp',
		country: 'ZA',
		website: 'https://menno.abstractcow.com/',
		orcid: '0000-0003-1841-2444'
	}
];
