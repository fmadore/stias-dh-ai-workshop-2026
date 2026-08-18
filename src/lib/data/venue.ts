import type { VenueInfo } from '$lib/types';

export const venueInfo: VenueInfo = {
	name: 'STIAS',
	fullName: {
		en: 'Stellenbosch Institute for Advanced Study',
		fr: "Stellenbosch Institute for Advanced Study (Institut d'études avancées de Stellenbosch)"
	},
	// Street only. It is also schema.org streetAddress in event-schema.ts, and
	// the page renders it beside `city` — which is how the venue printed
	// "Stellenbosch, Stellenbosch, South Africa".
	address: '10 Marais Road',
	city: 'Stellenbosch',
	postalCode: '7600',
	country: 'ZA',
	// OpenStreetMap's node for the institute (Marais Road, Mostertsdrift). The
	// previous pair sat 1.3 km west on Merriman Avenue, which nothing revealed
	// while the map was a single-marker iframe zoomed to those same numbers —
	// the pin was centred, so it looked right. It stops looking right the moment
	// the guest houses share the frame and the walking distances are printed.
	coordinates: { lat: -33.93497, lng: 18.87406 },
	description: {
		en: 'STIAS is an independent institute of advanced study located on the Mostertsdrift estate in Stellenbosch, South Africa. It provides a space for leading researchers from across the world to engage in fundamental research and intellectual exchange across disciplines.',
		fr: "Le STIAS est un institut indépendant d'études avancées situé sur le domaine de Mostertsdrift à Stellenbosch, en Afrique du Sud. Il offre un espace aux chercheur·euses de premier plan du monde entier pour s'engager dans la recherche fondamentale et l'échange intellectuel interdisciplinaire."
	},
	website: 'https://stias.ac.za',
	logisticsInfo: {
		en: 'The DFG Programme Point Sud will cover transportation, accommodation, visa costs, catering and local transport for all selected participants. However, vaccinations, health insurance and meals during travel days to and from Stellenbosch cannot be covered.',
		fr: "Le programme DFG Point Sud prendra en charge le transport, l'hébergement, les frais de visa, la restauration et le transport local pour tou·tes les participant·es sélectionné·es. Cependant, les vaccinations, l'assurance maladie et les repas pendant les jours de voyage vers et depuis Stellenbosch ne peuvent pas être couverts."
	}
};
