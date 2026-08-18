import type { Accommodation } from '$lib/types';

/**
 * The two guest houses Point Sud books for participants. Array order is
 * display order on the venue page and in the map's place list.
 */
export const accommodations: Accommodation[] = [
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
	},
	{
		id: 'de-haas',
		name: 'De Haas Luxury Living',
		address: 'Die Laan 2',
		city: 'Stellenbosch',
		postalCode: '7600',
		country: 'ZA',
		coordinates: { lat: -33.93857, lng: 18.86494 },
		description: {
			en: 'Self-catering apartments on the banks of the Eerste River, a few minutes on foot from Dorp Street and the town centre.',
			fr: "Des appartements avec cuisine sur les rives de l'Eerste River, à quelques minutes à pied de Dorp Street et du centre-ville."
		},
		website: 'https://www.dehaasliving.co.za'
	}
];
