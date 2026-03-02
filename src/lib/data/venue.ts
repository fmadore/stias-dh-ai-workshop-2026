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
	logisticsInfo: {
		en: 'The DFG Programme Point Sud will cover transportation, accommodation, visa costs, catering and local transport for all participants. However, vaccinations, health insurance and meals during travel days to and from Stellenbosch cannot be covered.',
		fr: "Le programme DFG Point Sud prendra en charge le transport, l'hébergement, les frais de visa, la restauration et le transport local pour tous les participants. Cependant, les vaccinations, l'assurance maladie et les repas pendant les jours de voyage vers et depuis Stellenbosch ne peuvent pas être couverts."
	}
};
