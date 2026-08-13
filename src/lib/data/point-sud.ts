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
		country: 'ML'
	}
];
