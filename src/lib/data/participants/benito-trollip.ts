import type { Participant } from '$lib/types';

const participant: Participant = {
	id: 'benito-trollip',
	name: 'Benito Trollip',
	affiliation: {
		en: 'South African Centre for Digital Language Resources (SADiLaR)',
		fr: 'Centre sud-africain pour les ressources linguistiques numériques (SADiLaR)'
	},
	country: 'South Africa',
	coordinates: { lat: -26.6819, lng: 27.0946 },
	presentationId: 'fair-indigenous-languages',
	bio: 'Benito Trollip is a Digital Humanities researcher, specialising in Afrikaans, at the South African Centre for Digital Language Resources (SADiLaR). He completed his PhD in 2022 in which he described morphological evaluative constructions in Afrikaans based on usage data in a written corpus of Afrikaans. Besides his background in Afrikaans linguistics, he is also passionate about open science and data management. His role at SADiLaR also involves presenting data management workshops and managing resource submissions to the SADiLaR repository.'
};

export default participant;
