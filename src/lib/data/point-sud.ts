import type { PointSudRepresentative } from '$lib/types';

/**
 * Point Sud runs the DFG programme that funds this workshop. Its
 * representatives sit between the convenors and the participants on the
 * directory page: named hosts of the programme rather than presenters.
 *
 * Listed in this order deliberately — the array order is the display order,
 * not alphabetical like the participants directory.
 *
 * Roles read as functions ("Coordination du programme") in French rather than
 * agent nouns, so the listing does not assume anyone's gender.
 */
export const pointSud: PointSudRepresentative[] = [
	{
		id: 'marko-scholze',
		name: 'Marko Scholze',
		role: {
			en: 'Programme Coordinator',
			fr: 'Coordination du programme'
		},
		affiliation: {
			en: 'Goethe University Frankfurt',
			fr: 'Université Goethe de Francfort'
		},
		country: 'DE',
		image: '/images/point-sud/Marko-Scholze.webp',
		website:
			'https://www.uni-frankfurt.de/en/fachbereich-8/institute/institut-ethnologie/personen/marko-scholze'
	},
	{
		id: 'issa-fofana',
		name: 'Issa Fofana',
		role: {
			en: 'Co-director',
			fr: 'Codirection'
		},
		affiliation: {
			en: 'Point Sud, Bamako',
			fr: 'Point Sud, Bamako'
		},
		country: 'ML',
		image: '/images/point-sud/Issa-Fofana.webp',
		bio: {
			en: 'Issa Fofana is a lecturer and researcher at the University of Social Sciences and Management of Bamako (USSGB) and Co-Director of Point Sud, a research centre on local knowledge. He holds a PhD in Geography, specialising in urban spaces and societies, as well as an advanced degree in social work. His research focuses primarily on urbanisation dynamics, urban mobility, security, and the integration of agricultural markets through digital technologies. He is the author of several scientific publications, with particular interests in transformations in urban mobility, urban insecurity, and local strategies for building sustainable peace.',
			fr: 'Issa Fofana est enseignant-chercheur à l’Université des sciences sociales et de gestion de Bamako (USSGB) et codirecteur de Point Sud, centre de recherche sur les savoirs locaux. Titulaire d’un doctorat en géographie, spécialisé en espaces et sociétés urbaines, il est également diplômé d’études supérieures en travail social. Ses recherches portent principalement sur les dynamiques d’urbanisation, la mobilité urbaine, la sécurité et l’intégration des marchés agricoles par les technologies numériques. Il est l’auteur de plusieurs publications scientifiques, avec un intérêt particulier pour les transformations de la mobilité urbaine, l’insécurité urbaine et les stratégies locales de construction d’une paix durable.'
		}
	}
];
