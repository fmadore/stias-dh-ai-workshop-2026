import type { Participant } from '$lib/types';

const participant: Participant = {
	id: 'jelena-prokic',
	name: 'Jelena Prokic',
	affiliation: {
		en: 'Leiden University',
		fr: 'Université de Leyde'
	},
	country: 'Netherlands',
	image: '/images/participants/Jelena-Prokic.webp',
	bio: {
		en: 'Jelena Prokic is a computational linguist at the Leiden University Centre for Digital Humanities (LUCDH) and a member of the Nomadesahel research team (funded by NWO, 406.21.SW.009), based between the LUCDH and the Institute for History.',
		fr: 'Jelena Prokic is a computational linguist at the Leiden University Centre for Digital Humanities (LUCDH) and a member of the Nomadesahel research team (funded by NWO, 406.21.SW.009), based between the LUCDH and the Institute for History.'
	}
};

export default participant;
