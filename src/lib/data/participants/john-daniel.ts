import type { Participant } from '$lib/types';

const participant: Participant = {
	id: 'john-daniel',
	name: 'John Oluwafemi Daniel',
	affiliation: {
		en: 'University of Ibadan',
		fr: 'Université d’Ibadan'
	},
	country: 'Nigeria',
	coordinates: { lat: 7.4395, lng: 3.8979 },
	image: '/images/participants/John-Oluwafemi-Daniel.webp',
	presentationId: 'nigerian-town-question',
	bio: 'John Oluwafemi Daniel holds a B.A. and M.A. in History and International Studies from the University of Ilorin, Nigeria. He is currently a doctoral student in the Department of History at the University of Ibadan. His research focuses on digital archives and Digital Humanities practices, using digitised archival records on Ekiti Division in colonial Nigeria as a case study. His work explores issues of access, infrastructure, and community engagement in African historical scholarship. He is a recipient of the 2025 Digital Humanities PhD Scholarship awarded by the French Institute for Research in Africa–Nigeria (IFRA-Nigeria), which supports his ongoing doctoral research.'
};

export default participant;
