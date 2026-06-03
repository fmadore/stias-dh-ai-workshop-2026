import type { Participant } from '$lib/types';

const participant: Participant = {
	id: 'leonard-kirui',
	name: 'Leonard Kibet Kirui',
	affiliation: {
		en: 'Moi University',
		fr: 'Université Moi'
	},
	country: 'Kenya',
	coordinates: { lat: 0.2861, lng: 35.2891 },
	image: '/images/participants/Leonard-Kirui.png',
	presentationId: 'frugal-infrastructures',
	bio: 'Leonard Kibet Kirui serves as a Database Administrator in the ICT Directorate/Projects Office at Moi University, Kenya, where he supports the Moi University–Africa Multiple Research Centre (AMRC) on ICT–Digital Research Component. He also lectures part-time at the Department of Information Technology and Computing, Moi University. His research focuses on the Semantic Web and linked data. Kirui holds a PhD in Information Technology (Kibabii University, Kenya), an MSc in Information Technology (Moi University), and a BSc in Information Sciences. A member of ACPK, ISOC, and ACM, he bridges practical ICT infrastructure with academic innovation to advance sustainable digital research capacity.'
};

export default participant;
