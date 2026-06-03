import type { Participant } from '$lib/types';

const participant: Participant = {
	id: 'rachel-maina',
	name: 'Rachel Maina',
	affiliation: {
		en: 'University of Wisconsin–Madison',
		fr: 'Université du Wisconsin–Madison'
	},
	country: 'United States',
	coordinates: { lat: 43.0766, lng: -89.4125 },
	image: '/images/participants/Rachel-Maina.jpg',
	presentationId: 'multimodal-call-african-languages',
	bio: 'Rachel Maina is a PhD candidate in African Cultural Studies at the University of Wisconsin–Madison, with a minor in Anthropology. Her research examines how Swahili-Chinese identities are constructed along the Kenyan coast, drawing on oral history, ethnographic methods, and comparative literary analysis. She is also developing work at the intersection of language pedagogy and technology, focusing on multimodal approaches to computer-assisted language learning (CALL) for African languages. Her forthcoming chapter in the edited volume A Handbook of African CALL advances this work. Her broader interests include African cultural and linguistic contexts, language pedagogies, and equitable language technologies. She has taught Kiswahili language and literature, as well as African culture, at multiple levels and previously held academic positions in Kenya.'
};

export default participant;
