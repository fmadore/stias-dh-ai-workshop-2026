import type { VenueInfo } from '$lib/types';

export const venueInfo: VenueInfo = {
	name: 'STIAS',
	fullName: {
		en: 'Stellenbosch Institute for Advanced Study',
		fr: "Stellenbosch Institute for Advanced Study (Institut d'études avancées de Stellenbosch)"
	},
	address: '10 Marais Street, Stellenbosch',
	city: 'Stellenbosch',
	country: 'South Africa',
	coordinates: { lat: -33.9321, lng: 18.8602 },
	description: {
		en: 'STIAS is an independent institute of advanced study located on the Mostertsdrift estate in Stellenbosch, South Africa. It provides a space for leading researchers from across the world to engage in fundamental research and intellectual exchange across disciplines.',
		fr: "Le STIAS est un institut indépendant d'études avancées situé sur le domaine de Mostertsdrift à Stellenbosch, en Afrique du Sud. Il offre un espace aux chercheurs de premier plan du monde entier pour s'engager dans la recherche fondamentale et l'échange intellectuel interdisciplinaire."
	},
	website: 'https://stias.ac.za',
	travelInfo: {
		en: 'Stellenbosch is located approximately 50 km east of Cape Town. Cape Town International Airport (CPT) is the nearest major airport. From the airport, Stellenbosch can be reached by rental car (approximately 30 minutes) or airport shuttle services. The town is also well connected by road to other major cities in the Western Cape.',
		fr: "Stellenbosch est situé à environ 50 km à l'est du Cap. L'aéroport international du Cap (CPT) est l'aéroport principal le plus proche. Depuis l'aéroport, Stellenbosch est accessible en voiture de location (environ 30 minutes) ou par des services de navette aéroport. La ville est également bien reliée par la route aux autres grandes villes du Cap-Occidental."
	},
	accommodationInfo: {
		en: 'Accommodation options in Stellenbosch range from guesthouses and boutique hotels to university residences. More details on recommended accommodation will be provided to accepted participants.',
		fr: "Les options d'hébergement à Stellenbosch vont des maisons d'hôtes et hôtels de charme aux résidences universitaires. Des informations supplémentaires sur l'hébergement recommandé seront fournies aux participants acceptés."
	}
};
