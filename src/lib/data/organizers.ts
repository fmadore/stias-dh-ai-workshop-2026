import type { Organizer } from '$lib/types';

export const organizers: Organizer[] = [
	{
		id: 'madore',
		name: 'Frédérick Madore',
		role: { en: 'Organizer', fr: 'Organisateur' },
		affiliation: {
			en: 'University of Bayreuth',
			fr: 'Université de Bayreuth'
		},
		bio: {
			en: 'Frédérick Madore is a historian of Islam in Francophone West Africa and a Data Curator at the Cluster of Excellence "Africa Multiple," University of Bayreuth. His current work explores how AI and digital methods can transform the study of under-resourced African digital collections. He is developing the Islam West Africa Collection (IWAC), an open-access database of over 14,500 documents built on Omeka S. Using LLM-powered pipelines, he experiments with AI-assisted text extraction, named entity recognition, and sentiment analysis to process large documentary collections—while critically examining the risks of algorithmic opacity and Western-centric bias. He was previously a Research Fellow at Leibniz-Zentrum Moderner Orient (Berlin).',
			fr: "Frédérick Madore est historien de l'islam en Afrique de l'Ouest francophone et Data Curator au sein du Cluster d'excellence « Africa Multiple » de l'Université de Bayreuth. Ses travaux actuels explorent comment l'IA et les méthodes numériques peuvent transformer l'étude de collections numériques africaines sous-dotées. Il développe l'Islam West Africa Collection (IWAC), une base de données en accès ouvert de plus de 14 500 documents construite sur Omeka S. À l'aide de pipelines alimentés par des LLM, il expérimente l'extraction de texte assistée par l'IA, la reconnaissance d'entités nommées et l'analyse de sentiments pour traiter de vastes collections documentaires — tout en examinant de manière critique les risques d'opacité algorithmique et de biais occidentalo-centrés. Il a été précédemment chercheur au Leibniz-Zentrum Moderner Orient (Berlin)."
		},
		image: '/images/organizers/frederick-madore.jpg',
		country: 'Germany',
		coordinates: { lat: 49.9289, lng: 11.5801 },
		website: 'https://www.frederickmadore.com',
		orcid: '0000-0003-0959-2092'
	},
	{
		id: 'hiribarren',
		name: 'Vincent Hiribarren',
		role: { en: 'Organizer', fr: 'Organisateur' },
		affiliation: {
			en: "King's College London",
			fr: "King's College London"
		},
		bio: {
			en: 'Vincent Hiribarren is a historian of West Africa and has worked on several digitisation programmes on the African continent. He has recently created an undergraduate module on Digital History and is interested in the relationship between African Studies, Digital Humanities and AI.',
			fr: "Vincent Hiribarren est historien de l'Afrique de l'Ouest et a travaillé sur plusieurs programmes de numérisation sur le continent africain. Il a récemment créé un module de licence en histoire numérique et s'intéresse aux relations entre les études africaines, les humanités numériques et l'IA."
		},
		image: '/images/organizers/vincent-hiribarren.png',
		country: 'United Kingdom',
		coordinates: { lat: 51.5114, lng: -0.1160 },
		website: 'https://www.vincenthiribarren.com',
		orcid: '0000-0002-8742-9576'
	},
	{
		id: 'ngue-um',
		name: 'Emmanuel Ngue Um',
		role: { en: 'Organizer', fr: 'Organisateur' },
		affiliation: {
			en: 'University of Yaoundé 1',
			fr: 'Université de Yaoundé 1'
		},
		bio: {
			en: 'Emmanuel Ngue Um is an Associate Professor of African Languages and Linguistics at the University of Yaoundé 1. His current research focuses on developing speech technologies and machine translation services to support the teaching and revitalisation of Africa\'s indigenous languages. He is also involved in developing an ecomuseum to preserve and promote a section of the colonial railway in Cameroon.',
			fr: "Emmanuel Ngue Um est maître de conférences en langues et linguistique africaines à l'Université de Yaoundé 1. Ses recherches actuelles portent sur le développement de technologies vocales et de services de traduction automatique pour soutenir l'enseignement et la revitalisation des langues autochtones d'Afrique. Il participe également au développement d'un écomusée visant à préserver et promouvoir un tronçon du chemin de fer colonial au Cameroun."
		},
		image: '/images/organizers/emmanuel-ngue-um.jpg',
		country: 'Cameroon',
		coordinates: { lat: 3.8612, lng: 11.4984 },
		orcid: '0000-0002-8467-5990'
	},
	{
		id: 'van-zaanen',
		name: 'Menno van Zaanen',
		role: { en: 'Organizer', fr: 'Organisateur' },
		affiliation: {
			en: 'South African Centre for Digital Language Resources (SADiLaR)',
			fr: 'Centre sud-africain pour les ressources linguistiques numériques (SADiLaR)'
		},
		bio: {
			en: 'Menno van Zaanen is a professor in Digital Humanities at the South African Centre for Digital Language Resources. He is particularly interested in incorporating the use of computational techniques in the field of Humanities. His research background is in computer science and computational linguistics.',
			fr: "Menno van Zaanen est professeur en humanités numériques au South African Centre for Digital Language Resources. Il s'intéresse particulièrement à l'intégration des techniques computationnelles dans le domaine des humanités. Sa formation de recherche est en informatique et en linguistique computationnelle."
		},
		image: '/images/organizers/menno-van-zaanen.png',
		country: 'South Africa',
		coordinates: { lat: -26.6819, lng: 27.0946 },
		website: 'https://menno.abstractcow.com/',
		orcid: '0000-0003-1841-2444'
	}
];
