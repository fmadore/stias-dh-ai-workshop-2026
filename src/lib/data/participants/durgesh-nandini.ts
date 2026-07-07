import type { Participant } from '$lib/types';

const participant: Participant = {
	id: 'durgesh-nandini',
	name: 'Durgesh Nandini',
	affiliation: {
		en: 'University of Bayreuth',
		fr: 'Université de Bayreuth'
	},
	country: 'Germany',
	coordinates: { lat: 49.9289, lng: 11.5801 },
	image: '/images/participants/Durgesh-Nandini.webp',
	presentationId: 'entity-linking-african-studies',
	bio: 'Durgesh Nandini is a Data Scientist at the University of Bayreuth, Germany, specializing in knowledge graphs, semantic technologies, large language models (LLMs), and natural language processing (NLP). Her current work centres on African Studies research data, where she develops methods that integrate these technologies to enhance the discoverability, interoperability, and long-term usability of research metadata and digital collections.'
};

export default participant;
