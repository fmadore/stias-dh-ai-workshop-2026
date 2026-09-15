import type { Accommodation } from '$lib/types';

/**
 * The three guest houses Point Sud books for participants. Array order is
 * display order on the venue page and in the map's place list.
 *
 * Two of them are De Haas properties. De Haas runs a third, Die Laan 2, which
 * is the address their homepage leads with and is *not* one of ours — do not
 * "correct" Die Laan 40 to it.
 */
export const accommodations: Accommodation[] = [
	{
		id: 'villa-grande',
		name: 'De Haas at Villa Grande',
		address: '1 Keerom Street',
		city: 'Stellenbosch',
		postalCode: '7600',
		country: 'ZA',
		coordinates: { lat: -33.93825, lng: 18.86592 },
		description: {
			en: 'A Tuscan-style villa of the 1920s at the end of a quiet cul-de-sac, with twelve en-suite rooms, alongside the Stellenbosch University Botanical Garden.',
			fr: "Une villa de style toscan des années 1920, au bout d'une impasse tranquille, avec douze chambres avec salle de bains, en bordure du Jardin botanique de l'Université de Stellenbosch."
		},
		website: 'https://www.dehaasliving.co.za/villa-grande/'
	},
	{
		id: 'de-haas',
		name: 'De Haas at Die Laan 40',
		address: 'Die Laan 40',
		city: 'Stellenbosch',
		postalCode: '7600',
		country: 'ZA',
		coordinates: { lat: -33.93743, lng: 18.86872 },
		description: {
			en: 'A five-bedroom guest house and a two-bedroom pool cottage, opposite the Coetzenburg sports grounds on the eastern edge of the historic centre.',
			fr: "Une maison d'hôtes de cinq chambres et un cottage de deux chambres avec piscine, face au complexe sportif de Coetzenburg, en bordure est du centre historique."
		},
		website: 'https://www.dehaasliving.co.za/die-laan-40/'
	},
	{
		id: 'roosenwijn',
		name: 'Roosenwijn Guest House',
		address: '14 Van Riebeeck Street',
		city: 'Stellenbosch',
		postalCode: '7600',
		country: 'ZA',
		coordinates: { lat: -33.9365, lng: 18.86622 },
		description: {
			en: 'A Victorian house of 1904, declared a national monument, on the edge of the historic centre and next to the Stellenbosch University Botanical Garden.',
			fr: "Une maison victorienne de 1904, classée monument national, en bordure du centre historique et attenante au Jardin botanique de l'Université de Stellenbosch."
		},
		website: 'https://www.roosenwijn.co.za'
	}
];
