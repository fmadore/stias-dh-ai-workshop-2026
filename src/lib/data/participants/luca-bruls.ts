import type { Participant } from '$lib/types';

const participant: Participant = {
	id: 'luca-bruls',
	name: 'Luca Bruls',
	affiliation: {
		en: 'Leiden University',
		fr: 'Université de Leyde'
	},
	country: 'Netherlands',
	coordinates: { lat: 52.1571, lng: 4.4854 },
	image: '/images/participants/Luca-Bruls.webp',
	presentationId: 'computational-ethnography-fulani',
	bio: 'Luca Bruls is a PhD candidate in anthropology and history at Leiden University and a member of the Nomadesahel research team (funded by NWO, 406.21.SW.009), based between the Institute for History and the Leiden University Centre for Digital Humanities (LUCDH).'
};

export default participant;
