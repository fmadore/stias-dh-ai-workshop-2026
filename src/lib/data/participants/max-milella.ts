import type { Participant } from '$lib/types';

const participant: Participant = {
	id: 'max-milella',
	name: 'Max Milella',
	affiliation: {
		en: 'University of the Witwatersrand',
		fr: 'Université du Witwatersrand'
	},
	country: 'South Africa',
	coordinates: { lat: -26.1929, lng: 28.0305 },
	presentationId: 'decolonising-citations',
	bio: 'Max Milella is completing his Masters in e-Science (Data Science and the Humanities) at the University of the Witwatersrand. His research is on computational approaches to traditional discourse analysis, and he is currently applying it to examine how Nelson Mandela has historically been invoked symbolically in South Africa’s parliamentary discourses.'
};

export default participant;
