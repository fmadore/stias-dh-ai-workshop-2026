import type { Organizer } from '$lib/types';

export const organizers: Organizer[] = [
	{
		id: 'madore',
		name: 'Frédérick Madore',
		role: { en: 'Organizer', fr: 'Organisateur' },
		affiliation: {
			en: 'University of Bayreuth',
			fr: 'Université de Bayreuth'
		},
		bio: {
			en: 'Historian of Islam in West Africa and digital humanities researcher. His work focuses on computational approaches to the study of religion, media, and society in francophone Africa.',
			fr: "Historien de l'islam en Afrique de l'Ouest et chercheur en humanités numériques. Ses travaux portent sur les approches computationnelles pour l'étude de la religion, des médias et de la société en Afrique francophone."
		},
		image: '/images/organizers/frederick-madore.jpg',
		website: 'https://www.frederickmadore.com',
		orcid: '0000-0003-0959-2092'
	},
	{
		id: 'hiribarren',
		name: 'Vincent Hiribarren',
		role: { en: 'Organizer', fr: 'Organisateur' },
		affiliation: {
			en: "King's College London",
			fr: "King's College London"
		},
		bio: {
			en: 'Historian and specialist in African digital humanities, with a focus on spatial history and mapping in West Africa.',
			fr: "Historien et spécialiste des humanités numériques africaines, avec un intérêt particulier pour l'histoire spatiale et la cartographie en Afrique de l'Ouest."
		},
		image: '/images/organizers/vincent-hiribarren.png'
	},
	{
		id: 'ngue-um',
		name: 'Emmanuel Ngue Um',
		role: { en: 'Organizer', fr: 'Organisateur' },
		affiliation: {
			en: 'University of Yaoundé 1',
			fr: 'Université de Yaoundé 1'
		},
		bio: {
			en: 'Linguist specializing in Cameroonian languages and digital language documentation, working at the intersection of computational linguistics and African language preservation.',
			fr: "Linguiste spécialisé dans les langues camerounaises et la documentation linguistique numérique, travaillant à l'intersection de la linguistique computationnelle et de la préservation des langues africaines."
		},
		image: '/images/organizers/emmanuel-ngue-um.jpg'
	},
	{
		id: 'van-zaanen',
		name: 'Menno van Zaanen',
		role: { en: 'Organizer', fr: 'Organisateur' },
		affiliation: {
			en: 'South African Centre for Digital Language Resources (SADiLaR)',
			fr: 'Centre sud-africain pour les ressources linguistiques numériques (SADiLaR)'
		},
		bio: {
			en: 'Computational linguist and director of SADiLaR, working on digital language resources and infrastructure for South African languages.',
			fr: "Linguiste computationnel et directeur du SADiLaR, travaillant sur les ressources linguistiques numériques et l'infrastructure pour les langues sud-africaines."
		},
		image: '/images/organizers/menno-van-zaanen.png'
	}
];
