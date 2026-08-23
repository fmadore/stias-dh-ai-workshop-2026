import type { VenueInfo } from '$lib/types';

export const venueInfo: VenueInfo = {
	name: 'STIAS',
	fullName: {
		en: 'Stellenbosch Institute for Advanced Study',
		fr: "Stellenbosch Institute for Advanced Study (Institut d'études avancées de Stellenbosch)"
	},
	// Street only — the suburb is `district` and the town is `city`, because
	// every renderer joins them differently and one of them once printed
	// "Stellenbosch, Stellenbosch, South Africa". Use `venueStreet` below rather
	// than reaching for these two separately.
	address: '10 Marais Road',
	district: 'Mostertsdrift',
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
	// The call for papers said this as one 43-word sentence, and the venue page
	// repeated it: what the funder pays for, then "However," then what it does
	// not. The second half is the half a participant has to act on — it is the
	// money they must budget — and it was the half nobody read. Held as two
	// lists so the venue page can show them as two lists; `logisticsSentences()`
	// rebuilds the call's own prose from these, word for word, so the archival
	// page still reads as it was published and neither can drift from the other.
	logisticsCovered: {
		en: ['transportation', 'accommodation', 'visa costs', 'catering', 'local transport'],
		fr: [
			'le transport',
			"l'hébergement",
			'les frais de visa',
			'la restauration',
			'le transport local'
		]
	},
	logisticsNotCovered: {
		en: ['vaccinations', 'health insurance', 'meals during travel days to and from Stellenbosch'],
		fr: [
			'les vaccinations',
			"l'assurance maladie",
			'les repas pendant les jours de voyage vers et depuis Stellenbosch'
		]
	}
};

/**
 * Street and suburb as one line: "10 Marais Road, Mostertsdrift". Three places
 * need this exact pairing — the venue page, the map popup and schema.org's
 * `streetAddress`, which has no field of its own for a suburb — and each joins
 * what follows it differently.
 */
export const venueStreet = [venueInfo.address, venueInfo.district].filter(Boolean).join(', ');
