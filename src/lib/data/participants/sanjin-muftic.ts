import type { Participant } from '$lib/types';

const participant: Participant = {
	id: 'sanjin-muftic',
	name: 'Sanjin Muftić',
	affiliation: {
		en: 'University of Cape Town Libraries',
		fr: 'Bibliothèques de l’Université du Cap'
	},
	country: 'South Africa',
	coordinates: { lat: -33.9577, lng: 18.4612 },
	image: '/images/participants/Sanjin-Muftic.webp',
	presentationId: ['fair-indigenous-languages', 'enriching-the-invisible'],
	bio: 'Sanjin Muftić is a Digital Scholarship Specialist at the University of Cape Town Libraries, working at the intersection of digital humanities, data curation, and research infrastructure. His work focuses on designing metadata frameworks, developing digital collections platforms using Omeka S, and supporting interdisciplinary research through scalable, structured data systems. He has led large-scale digital collection migrations and the development of UCT’s Ibali platform, supporting tens of thousands of digital objects and users. His interests include digital archives, linked data, and the ethical stewardship and accessibility of cultural heritage materials.'
};

export default participant;
