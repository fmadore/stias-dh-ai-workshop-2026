import type { AffiliationLocation } from '$lib/types';

/**
 * Campus coordinates are stored with the content rather than geocoded in the
 * browser. This keeps the map deterministic, avoids sending visitor queries to
 * a geocoder, and lets distributed affiliations remain honestly unpinned.
 *
 * `personIds` covers organizers as well as participants — three of the four
 * convenors work at campuses the map already pins, so leaving them off read as
 * an omission rather than a distinction.
 */
export const affiliationLocations: AffiliationLocation[] = [
	{
		id: 'university-of-alberta',
		name: { en: 'University of Alberta', fr: 'Université de l’Alberta' },
		city: { en: 'Edmonton', fr: 'Edmonton' },
		country: 'CA',
		coordinates: { lat: 53.5232, lng: -113.5263 },
		personIds: ['augustine-farinola']
	},
	{
		id: 'university-of-helsinki',
		name: { en: 'University of Helsinki', fr: 'Université d’Helsinki' },
		city: { en: 'Helsinki', fr: 'Helsinki' },
		country: 'FI',
		coordinates: { lat: 60.1697, lng: 24.9501 },
		personIds: ['friederike-lupke']
	},
	{
		id: 'cheikh-anta-diop-university',
		name: { en: 'Cheikh Anta Diop University', fr: 'Université Cheikh Anta Diop de Dakar' },
		city: { en: 'Dakar', fr: 'Dakar' },
		country: 'SN',
		coordinates: { lat: 14.6928, lng: -17.4635 },
		personIds: ['aminata-kane', 'augustin-ndione']
	},
	{
		id: 'university-of-yaounde-1',
		name: { en: 'University of Yaoundé I', fr: 'Université de Yaoundé I' },
		city: { en: 'Yaoundé', fr: 'Yaoundé' },
		country: 'CM',
		coordinates: { lat: 3.8669, lng: 11.5004 },
		personIds: ['eliette-ngo-tjomb', 'evelyne-amana', 'ngue-um']
	},
	{
		id: 'university-of-ebolowa',
		name: { en: 'University of Ebolowa', fr: 'Université d’Ebolowa' },
		city: { en: 'Ebolowa', fr: 'Ebolowa' },
		country: 'CM',
		coordinates: { lat: 2.914, lng: 11.153 },
		personIds: ['falimatou-pemgbou']
	},
	{
		id: 'university-of-bayreuth',
		name: { en: 'University of Bayreuth', fr: 'Université de Bayreuth' },
		city: { en: 'Bayreuth', fr: 'Bayreuth' },
		country: 'DE',
		coordinates: { lat: 49.9282, lng: 11.5858 },
		personIds: ['durgesh-nandini', 'hammed-olalekan-lawal', 'jiayu-yang', 'madore']
	},
	{
		id: 'leiden-university',
		name: { en: 'Leiden University', fr: 'Université de Leyde' },
		city: { en: 'Leiden', fr: 'Leyde' },
		country: 'NL',
		coordinates: { lat: 52.157, lng: 4.481 },
		personIds: [
			'bruno-allahissem',
			'jelena-prokic',
			'luca-bruls',
			'matthew-sung',
			'mirjam-de-bruijn'
		]
	},
	{
		id: 'university-of-the-witwatersrand',
		name: { en: 'University of the Witwatersrand', fr: 'Université du Witwatersrand' },
		city: { en: 'Johannesburg', fr: 'Johannesbourg' },
		country: 'ZA',
		coordinates: { lat: -26.1929, lng: 28.0305 },
		personIds: [
			'christine-mataranyika',
			'iginio-gagliardone',
			'joshua-ward',
			'karabo-mohapeloa',
			'max-milella'
		]
	},
	{
		id: 'sadilar',
		name: {
			en: 'South African Centre for Digital Language Resources (SADiLaR)',
			fr: 'Centre sud-africain pour les ressources linguistiques numériques (SADiLaR)'
		},
		city: { en: 'Potchefstroom', fr: 'Potchefstroom' },
		country: 'ZA',
		coordinates: { lat: -26.7145, lng: 27.097 },
		personIds: ['benito-trollip', 'van-zaanen']
	},
	{
		id: 'university-of-ibadan',
		name: { en: 'University of Ibadan', fr: 'Université d’Ibadan' },
		city: { en: 'Ibadan', fr: 'Ibadan' },
		country: 'NG',
		coordinates: { lat: 7.4443, lng: 3.8994 },
		personIds: ['john-daniel']
	},
	{
		id: 'university-of-the-gambia',
		name: { en: 'University of the Gambia', fr: 'Université de Gambie' },
		city: { en: 'Faraba Banta', fr: 'Faraba Banta' },
		country: 'GM',
		coordinates: { lat: 13.2811, lng: -16.5833 },
		personIds: ['jules-mansaly']
	},
	{
		id: 'moi-university',
		name: { en: 'Moi University', fr: 'Université Moi' },
		city: { en: 'Eldoret', fr: 'Eldoret' },
		country: 'KE',
		coordinates: { lat: 0.286, lng: 35.287 },
		personIds: ['leonard-kirui']
	},
	{
		id: 'university-of-luxembourg',
		name: { en: 'University of Luxembourg', fr: 'Université du Luxembourg' },
		city: { en: 'Esch-sur-Alzette', fr: 'Esch-sur-Alzette' },
		country: 'LU',
		coordinates: { lat: 49.5042, lng: 5.9485 },
		personIds: ['lauren-coetzee', 'sarah-oberbichler']
	},
	{
		id: 'joseph-ki-zerbo-university',
		name: { en: 'Joseph Ki-Zerbo University', fr: 'Université Joseph Ki-Zerbo' },
		city: { en: 'Ouagadougou', fr: 'Ouagadougou' },
		country: 'BF',
		coordinates: { lat: 12.3808, lng: -1.4996 },
		personIds: ['mohamadou-konate']
	},
	{
		id: 'university-of-wisconsin-madison',
		name: { en: 'University of Wisconsin–Madison', fr: 'Université du Wisconsin–Madison' },
		city: { en: 'Madison', fr: 'Madison' },
		country: 'US',
		coordinates: { lat: 43.0731, lng: -89.4012 },
		personIds: ['rachel-maina']
	},
	{
		id: 'uppsala-university',
		name: { en: 'Uppsala University', fr: 'Université d’Uppsala' },
		city: { en: 'Uppsala', fr: 'Uppsala' },
		country: 'SE',
		coordinates: { lat: 59.8586, lng: 17.6389 },
		personIds: ['oreen-yousuf']
	},
	{
		id: 'university-of-cape-town-libraries',
		name: {
			en: 'University of Cape Town Libraries',
			fr: 'Bibliothèques de l’Université du Cap'
		},
		city: { en: 'Cape Town', fr: 'Le Cap' },
		country: 'ZA',
		coordinates: { lat: -33.9577, lng: 18.4612 },
		personIds: ['sanjin-muftic']
	},
	{
		id: 'five-hundred-year-archive',
		name: {
			en: 'Five Hundred Year Archive, University of Cape Town',
			fr: 'Five Hundred Year Archive, Université du Cap'
		},
		city: { en: 'Cape Town', fr: 'Le Cap' },
		country: 'ZA',
		coordinates: { lat: -33.9553, lng: 18.4613 },
		personIds: [
			'carolyn-hamilton',
			'grant-mcnulty',
			'steven-kotze',
			'debra-pryor',
			'makhosi-mkhize'
		]
	},
	{
		id: 'kings-college-london',
		name: { en: "King's College London", fr: "King's College London" },
		city: { en: 'London', fr: 'Londres' },
		country: 'GB',
		coordinates: { lat: 51.5115, lng: -0.116 },
		personIds: ['hiribarren']
	}
];
