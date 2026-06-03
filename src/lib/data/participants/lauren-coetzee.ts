import type { Participant } from '$lib/types';

const participant: Participant = {
	id: 'lauren-coetzee',
	name: 'Lauren Coetzee',
	affiliation: {
		en: 'University of Luxembourg',
		fr: 'Université du Luxembourg'
	},
	country: 'Luxembourg',
	coordinates: { lat: 49.505, lng: 5.9486 },
	presentationId: 'precolonial-bead-trade',
	bio: 'Lauren Coetzee is a doctoral researcher at the Centre for Contemporary and Digital History (C²DH), University of Luxembourg, where she works on dynamic economic and social institutions in pre-colonial Africa (1500–1900). She holds an MA from Stellenbosch University and works within the Time Traveller Project. Her research integrates LLMs, GIS, and quantitative methods to analyse African trade networks from European traveller accounts. She teaches digital and computational methods in the Humanities, and is a member of the African Economic History Network, the Digital Humanities Association of Southern Africa, and the Economic History Society, and founder of the Colonial Digital History Network.'
};

export default participant;
