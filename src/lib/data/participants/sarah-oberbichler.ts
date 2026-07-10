import type { Participant } from '$lib/types';

const participant: Participant = {
	id: 'sarah-oberbichler',
	name: 'Sarah Oberbichler',
	affiliation: {
		en: 'University of Luxembourg',
		fr: 'Université du Luxembourg'
	},
	country: 'Luxembourg',
	image: '/images/participants/Sarah-Oberbichler.webp',
	bio: {
		en: 'Sarah Oberbichler is Assistant Professor of Artificial Intelligence and Data Mining in Digital History at the Centre for Contemporary and Digital History (C²DH) of the University of Luxembourg. Her interdisciplinary research lies at the intersection of environmental studies, transnational media studies, historical migration studies, NLP, and (critical) AI studies.',
		fr: 'Sarah Oberbichler is Assistant Professor of Artificial Intelligence and Data Mining in Digital History at the Centre for Contemporary and Digital History (C²DH) of the University of Luxembourg. Her interdisciplinary research lies at the intersection of environmental studies, transnational media studies, historical migration studies, NLP, and (critical) AI studies.'
	}
};

export default participant;
