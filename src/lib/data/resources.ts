import type { ResourceSection } from '$lib/types';

/**
 * The resources page: writing about the workshop, and the archives, models,
 * networks and meetings that came up in its discussions. Section order and
 * array order are display order; meetings run in date order.
 *
 * Every description was written against the resource's own site (checked
 * October 2026), and says what it offers rather than how good it is. A
 * resource's title stays in its own language on both locales — `lang` marks
 * which — so only the description and any link labels are translated.
 */
export const resourceSections: ResourceSection[] = [
	{
		id: 'writing',
		title: { en: 'Writing on the workshop', fr: "Écrits sur l'atelier" },
		intro: {
			en: 'Accounts of the four days by people who took part.',
			fr: 'Des récits des quatre jours par des personnes qui y ont pris part.'
		},
		resources: [
			{
				id: 'data-vineyard-data-jungle',
				title: 'A Digital Humanities and AI landscape: From data vineyard to data jungle',
				lang: 'en',
				url: 'https://lucabruls.substack.com/p/a-digital-humanities-and-ai-landscape',
				authors: ['luca-bruls'],
				source: ['Substack'],
				date: '2026-09-28',
				description: {
					en: 'A walk through the STIAS garden, from its ordered vineyard to its wilder corners, becomes a way of thinking about structured data and the messier material humanities scholars work with — and about whether AI curation leaves room to challenge the colonial biases archives carry.',
					fr: "Une promenade dans le jardin du STIAS, de son vignoble ordonné à ses recoins plus sauvages, devient une manière de penser l'écart entre données structurées et matériaux plus désordonnés des sciences humaines — et de se demander si la curation par l'IA laisse encore place à la critique des biais coloniaux que portent les archives."
				}
			}
		]
	},
	{
		id: 'archives',
		title: {
			en: 'Archives, data and digital projects',
			fr: 'Archives, données et projets numériques'
		},
		resources: [
			{
				id: 'slavevoyages',
				title: 'SlaveVoyages',
				lang: 'en',
				url: 'https://www.slavevoyages.org/',
				source: [{ en: 'Rice University', fr: 'Université Rice' }],
				description: {
					en: 'Databases of the voyages that carried more than twelve million enslaved Africans across the Atlantic and within the Americas, searchable by vessel, place and period, with records of the enslaved people and of their enslavers.',
					fr: "Des bases de données sur les voyages qui ont déporté plus de douze millions d'Africain·es réduit·es en esclavage à travers l'Atlantique et au sein des Amériques, consultables par navire, lieu et période, avec des registres des personnes asservies et de leurs propriétaires."
				}
			},
			{
				id: 'zamani',
				title: 'The Zamani Project',
				lang: 'en',
				url: 'https://www.zamaniproject.org/',
				source: [{ en: 'University of Cape Town', fr: 'Université du Cap' }],
				description: {
					en: 'Spatial documentation of heritage sites — more than 250 structures at some 65 sites in 18 countries across Africa, the Middle East and South-East Asia — together with training in the same methods.',
					fr: "La documentation spatiale de sites patrimoniaux — plus de 250 structures sur quelque 65 sites dans 18 pays d'Afrique, du Moyen-Orient et d'Asie du Sud-Est —, assortie de formations à ces mêmes méthodes."
				}
			},
			{
				id: 'struggles-for-freedom',
				title: 'Struggles for Freedom: Southern Africa',
				lang: 'en',
				url: 'https://www.jstor.org/site/struggles-for-freedom/southern-africa/',
				source: ['Aluka', 'JSTOR'],
				description: {
					en: 'Primary sources on the liberation, decolonisation and anti-apartheid movements of Botswana, Mozambique, Namibia, South Africa and Zimbabwe: periodicals, pamphlets, commission records, UN documents, personal papers, photographs and interviews.',
					fr: "Des sources primaires sur les mouvements de libération, de décolonisation et de lutte contre l'apartheid au Botswana, au Mozambique, en Namibie, en Afrique du Sud et au Zimbabwe : périodiques, brochures, rapports de commissions, documents de l'ONU, papiers personnels, photographies et entretiens."
				}
			},
			{
				id: 'nigerian-radicalism',
				title: 'Archives of Nigerian Radicalism',
				lang: 'en',
				url: 'https://nigerianradicalism.net/',
				source: ['Centre for Democracy and Development'],
				description: {
					en: "Digitised papers of Nigeria's radical and pro-democracy movements, including the Socialist Library and Archives (SOLAR) and the archives of Yusufu Bala Usman, Baba Omojola, and Ola and Kehinde Oni. The project is funded by the French Institute for Research in Africa (IFRA).",
					fr: "Les papiers numérisés des mouvements radicaux et démocratiques du Nigeria, dont la Socialist Library and Archives (SOLAR) et les archives de Yusufu Bala Usman, de Baba Omojola et d'Ola et Kehinde Oni. Le projet est financé par l'Institut français de recherche en Afrique (IFRA)."
				}
			},
			{
				id: 'unity-atlantic',
				title: 'Unity Atlantic Rhythm Map',
				lang: 'en',
				url: 'https://unityatlantic.org/',
				source: ['Deirdre C. Molloy'],
				description: {
					en: 'An interactive map of Black Atlantic rhythms, from precolonial times to the present, built from dance videos, audio and texts by culture-bearers. It accompanies the docu-fiction Drum Calls | Body Recalls.',
					fr: "Une carte interactive des rythmes de l'Atlantique noir, de l'époque précoloniale à nos jours, construite à partir de vidéos de danse, d'enregistrements et de textes de porteur·euses de culture. Elle accompagne la docufiction Drum Calls | Body Recalls."
				},
				links: [
					{
						label: { en: 'Video tour, in English', fr: 'Visite vidéo, en anglais' },
						url: 'https://doi.org/10.34847/NKL.515DH8N3',
						hreflang: 'en'
					},
					{
						label: { en: 'Guided tour, in French', fr: 'Visite guidée, en français' },
						url: 'https://doi.org/10.34847/NKL.CAC917F9',
						hreflang: 'fr'
					},
					{
						label: { en: 'The film', fr: 'Le film' },
						url: 'https://filmfreeway.com/DrumCallsBodyRecalls'
					}
				]
			},
			{
				id: 'noga-mo-jozi',
				title: 'Noga Mo Jozi Loop of Dreams',
				lang: 'en',
				url: 'https://vimeo.com/868332312/2f837b5f9b',
				source: ['Authentic Studio'],
				date: '2023-09',
				description: {
					en: "An eleven-minute film in which three architects use AI scripting to imagine spatial change in Johannesburg, working from the city's past and present towards a speculative design of its future.",
					fr: "Un film de onze minutes où trois architectes se servent de scripts d'IA pour imaginer les transformations spatiales de Johannesburg, en partant du passé et du présent de la ville pour en esquisser l'avenir par le design spéculatif."
				}
			},
			{
				id: 'mozilla-data-collective',
				title: 'Mozilla Data Collective',
				lang: 'en',
				url: 'https://mozilladatacollective.com/datasets',
				description: {
					en: 'Datasets for speech recognition, speech synthesis, machine translation and computer vision, many of them in low-resourced languages, Lingala and Swahili among them. Each carries its own licence, from CC0 to restricted terms. Incubated by the Mozilla Foundation.',
					fr: 'Des jeux de données pour la reconnaissance et la synthèse vocales, la traduction automatique et la vision par ordinateur, dont beaucoup dans des langues peu dotées, parmi lesquelles le lingala et le swahili. Chacun a sa propre licence, de CC0 à des conditions restreintes. Incubé par la Fondation Mozilla.'
				}
			},
			{
				id: 'history-of-philosophy',
				title: 'History of Philosophy: Summarized & Visualized',
				lang: 'en',
				url: 'https://www.denizcemonduygu.com/philo/',
				source: ['Deniz Cem Önduygu'],
				description: {
					en: 'Western philosophy set out as a network of summarised statements, with links marking where one idea agrees with or builds on another and where it disagrees.',
					fr: "La philosophie occidentale présentée comme un réseau d'énoncés résumés, reliés selon qu'une idée s'accorde avec une autre, la prolonge ou la contredit."
				}
			}
		]
	},
	{
		id: 'models',
		title: { en: 'Historical language models', fr: 'Modèles de langue historiques' },
		intro: {
			en: 'Models trained only on text written before a given date, so that they answer without hindsight.',
			fr: 'Des modèles entraînés uniquement sur des textes antérieurs à une date donnée, et qui répondent donc sans le savoir de ce qui a suivi.'
		},
		resources: [
			{
				id: 'talkie',
				title: 'talkie',
				lang: 'en',
				subtitle: 'A 13B vintage language model from 1930',
				url: 'https://talkie-lm.com/introducing-talkie',
				source: ['Nick Levine', 'David Duvenaud', 'Alec Radford'],
				date: '2026-04',
				description: {
					en: 'A 13-billion-parameter model trained on 260 billion tokens of English published before 1931 — books, newspapers, journals, patents and legal texts — to converse from within its period and to study how models generalise from the data of one era.',
					fr: "Un modèle de 13 milliards de paramètres entraîné sur 260 milliards de tokens de textes anglais publiés avant 1931 — livres, journaux, revues, brevets et textes juridiques —, pour converser depuis son époque et étudier comment un modèle généralise à partir des données d'une seule période."
				}
			},
			{
				id: 'history-llms',
				title: 'History LLMs',
				lang: 'en',
				url: 'https://github.com/DGoettlich/history-llms',
				source: ['Daniel Göttlich', 'Dominik Loibner', 'Guohui Jiang', 'Hans-Joachim Voth'],
				description: {
					en: 'The project behind Ranke-4B, a family of 4-billion-parameter models each trained on 80 billion tokens of time-stamped text, with knowledge cutoffs of 1913, 1929, 1933, 1939 and 1946.',
					fr: "Le projet à l'origine de Ranke-4B, une famille de modèles de 4 milliards de paramètres, chacun entraîné sur 80 milliards de tokens de textes datés, avec des dates limites de connaissance en 1913, 1929, 1933, 1939 et 1946."
				}
			}
		]
	},
	{
		id: 'ai-tools',
		title: { en: 'Tools for AI assistants', fr: 'Outils pour les assistants IA' },
		resources: [
			{
				id: 'agent-skills',
				title: 'Agent Skills',
				lang: 'en',
				url: 'https://agentskills.io/home',
				description: {
					en: 'The open format behind SKILL.md files. A skill is a folder of instructions, with optional scripts and reference material, that an AI agent loads only when a task calls for it. Developed by Anthropic and released as an open standard, it is supported by a wide range of agents.',
					fr: "Le format ouvert des fichiers SKILL.md. Une skill est un dossier d'instructions, accompagné au besoin de scripts et de documents de référence, qu'un agent IA ne charge que lorsqu'une tâche l'exige. Conçu par Anthropic puis publié comme standard ouvert, il est pris en charge par de nombreux agents."
				}
			},
			{
				id: 'zotero-mcp',
				title: 'Zotero MCP',
				lang: 'en',
				url: 'https://github.com/54yyyu/zotero-mcp',
				description: {
					en: "Connects a Zotero library to AI assistants through the Model Context Protocol, so that they can search it by title, author, tag or meaning and read items' metadata and annotations.",
					fr: "Relie une bibliothèque Zotero aux assistants IA par le Model Context Protocol, pour qu'ils puissent y chercher par titre, auteur·e, mot-clé ou sens, et lire les métadonnées et annotations des références."
				}
			}
		]
	},
	{
		id: 'publishing',
		title: { en: 'Publishing and sharing research', fr: 'Publier et diffuser la recherche' },
		intro: {
			en: 'Identifiers, repositories and open-access venues for making work findable and citable, and two takes on who gets credit for it.',
			fr: "Identifiants, dépôts et revues en accès ouvert pour rendre ses travaux repérables et citables, et deux regards sur la manière d'en attribuer le crédit."
		},
		resources: [
			{
				id: 'orcid',
				title: 'ORCID',
				lang: 'en',
				url: 'https://orcid.org/',
				description: {
					en: 'A free, persistent identifier for researchers, which keeps a record of their work attached to them across name changes, institutions and publishers.',
					fr: "Un identifiant pérenne et gratuit pour les chercheur·euses, qui leur rattache leurs travaux quels que soient les changements de nom, d'institution ou d'éditeur."
				}
			},
			{
				id: 'zenodo',
				title: 'Zenodo',
				lang: 'en',
				url: 'https://zenodo.org/',
				source: ['CERN'],
				description: {
					en: 'A general-purpose open repository for papers, data, software, slides and more. Every upload receives a DOI.',
					fr: 'Un dépôt ouvert généraliste pour les articles, données, logiciels, diapositives et autres travaux. Chaque dépôt reçoit un DOI.'
				}
			},
			{
				id: 'hal',
				title: 'HAL',
				lang: 'fr',
				url: 'https://hal.science/',
				source: [
					{
						en: 'Centre for Direct Scientific Communication (CCSD)',
						fr: 'Centre pour la communication scientifique directe (CCSD)'
					}
				],
				description: {
					en: "France's multidisciplinary open archive, for depositing and freely sharing articles, theses and other scholarly work.",
					fr: "L'archive ouverte pluridisciplinaire nationale française, pour déposer et diffuser librement articles, thèses et autres travaux scientifiques."
				}
			},
			{
				id: 'nakala',
				title: 'NAKALA',
				lang: 'fr',
				url: 'https://nakala.fr/',
				source: ['Huma-Num'],
				description: {
					en: "A repository for humanities and social science data that gives each deposit a DOI. The Unity Atlantic Rhythm Map's video tours, listed above, are published there.",
					fr: "Un entrepôt de données en sciences humaines et sociales qui attribue un DOI à chaque dépôt. Les visites vidéo de l'Unity Atlantic Rhythm Map, citées plus haut, y sont publiées."
				}
			},
			{
				id: 'kcworks',
				title: 'Knowledge Commons Works',
				lang: 'en',
				url: 'https://works.hcommons.org/',
				source: ['Knowledge Commons'],
				description: {
					en: 'The open repository of Knowledge Commons, a non-profit scholarly network affiliated with Michigan State University. Papers, datasets, presentations and software each receive a DOI.',
					fr: "Le dépôt ouvert de Knowledge Commons, réseau scientifique à but non lucratif affilié à l'Université d'État du Michigan. Articles, jeux de données, présentations et logiciels y reçoivent chacun un DOI."
				}
			},
			{
				id: 'doaj',
				title: 'Directory of Open Access Journals (DOAJ)',
				lang: 'en',
				url: 'https://doaj.org/',
				description: {
					en: 'A community-curated index of peer-reviewed open-access journals, searchable by subject and language: a way to find a venue in your field.',
					fr: 'Un index, tenu par sa communauté, des revues en accès ouvert à comité de lecture, consultable par discipline et par langue : de quoi trouver une revue dans son domaine.'
				}
			},
			{
				id: 'open-research-europe',
				title: 'Open Research Europe',
				lang: 'en',
				url: 'https://open-research-europe.ec.europa.eu/',
				description: {
					en: 'An open-access platform launched by the European Commission, where articles are published first and peer-reviewed openly afterwards, with no fees for eligible authors. From autumn 2026, research organisations in eleven countries extend fee-free publishing to their own researchers.',
					fr: "Une plateforme en accès ouvert lancée par la Commission européenne, où les articles sont publiés d'abord puis évalués ouvertement, sans frais pour les auteur·es éligibles. À partir de l'automne 2026, des organismes de recherche de onze pays ouvrent la publication gratuite à leurs propres chercheur·euses."
				}
			},
			{
				id: 'credit',
				title: 'CRediT: Contributor Role Taxonomy',
				lang: 'en',
				url: 'https://credit.niso.org/',
				source: ['NISO'],
				description: {
					en: 'Fourteen standard roles, from conceptualisation and data curation to software and writing, for stating who did what on a piece of research rather than leaving it to the order of names.',
					fr: "Quatorze rôles normalisés, de la conceptualisation et la curation des données au logiciel et à la rédaction, pour dire qui a fait quoi dans un travail de recherche plutôt que de s'en remettre à l'ordre des noms."
				}
			},
			{
				id: 'authorship-misappropriation',
				title:
					'You Put my name, I Put your name: exploring unethical practices in academic publishing using the authorship misappropriation Diamond framework',
				lang: 'en',
				subtitle: 'Ethics & Behavior',
				url: 'https://doi.org/10.1080/10508422.2026.2661701',
				source: [
					'Michael Oyedele Oyenuga',
					'Stella Bolanle Apata',
					'Thomas Oyetunde Oladele',
					'Solomon Jeresa'
				],
				date: '2026-04-21',
				description: {
					en: 'Interviews with eighteen Nigerian lecturers on gifted, padded and exchanged authorship, and a model of how such practices come to be treated as normal. Behind a paywall.',
					fr: 'Des entretiens avec dix-huit universitaires nigérian·es sur les signatures offertes, gonflées ou échangées, et un modèle de la manière dont ces pratiques finissent par passer pour normales. Article en accès payant.'
				}
			}
		]
	},
	{
		id: 'networks',
		title: { en: 'Networks and associations', fr: 'Réseaux et associations' },
		resources: [
			{
				id: 'dhasa',
				title: 'Digital Humanities Association of Southern Africa (DHASA)',
				lang: 'en',
				url: 'https://digitalhumanities.org.za/',
				description: {
					en: "Southern Africa's digital humanities association and a member of ADHO. It publishes the Journal of the Digital Humanities Association of Southern Africa (JDHASA).",
					fr: "L'association des humanités numériques d'Afrique australe, membre de l'ADHO. Elle publie le Journal of the Digital Humanities Association of Southern Africa (JDHASA)."
				}
			},
			{
				id: 'dh-africa',
				title: 'Network for Digital Humanities in Africa',
				lang: 'en',
				url: 'https://dhafrica.blog/',
				description: {
					en: "Founded by the participants and facilitators of the 2019 workshop 'Digital Humanities: the perspective of Africa', its blog gathers news, events and resources on digital humanities across the continent.",
					fr: "Fondé par les participant·es et animateur·rices de l'atelier « Digital Humanities: the perspective of Africa » de 2019, son blog rassemble actualités, événements et ressources sur les humanités numériques sur le continent."
				}
			},
			{
				id: 'humanistica',
				title: 'Humanistica',
				lang: 'fr',
				subtitle: 'Association francophone des humanités numériques',
				url: 'https://www.humanisti.ca/',
				description: {
					en: 'The francophone digital humanities association and a member of ADHO. It holds an annual conference and publishes the journal Humanités numériques.',
					fr: "L'association francophone des humanités numériques, membre de l'ADHO. Elle organise un colloque annuel et publie la revue Humanités numériques."
				}
			},
			{
				id: 'adho',
				title: 'Alliance of Digital Humanities Organizations (ADHO)',
				lang: 'en',
				url: 'https://adho.org/',
				description: {
					en: 'The global coalition of digital humanities associations, DHASA and Humanistica among them. It organises the annual Digital Humanities conference, which goes to Ireland in 2027 and to South Africa in 2028.',
					fr: "La coalition mondiale des associations d'humanités numériques, dont DHASA et Humanistica. Elle organise le congrès annuel Digital Humanities, qui se tiendra en Irlande en 2027 et en Afrique du Sud en 2028."
				}
			}
		]
	},
	{
		id: 'meetings',
		title: { en: 'Meetings', fr: 'Rencontres' },
		resources: [
			{
				id: 'dh-summit-2026',
				title: 'Digital Humanities (DH) Summit 2026',
				lang: 'en',
				url: 'https://sadilar.org/en/digital-humanities-dh-summit-2026/',
				source: ['SADiLaR', 'UNISA', 'Nelson Mandela University', 'North-West University'],
				date: '2026-10-07',
				endDate: '2026-10-09',
				place: {
					en: 'University of South Africa, Pretoria, and online',
					fr: "Université d'Afrique du Sud (UNISA), Pretoria, et en ligne"
				},
				description: {
					en: 'A national working summit rather than a conference of papers: eight working groups bring their drafts towards a South African position paper on the state of digital humanities.',
					fr: "Un sommet national de travail plutôt qu'un colloque de communications : huit groupes de travail y apportent leurs contributions à un document de position sud-africain sur l'état des humanités numériques."
				}
			},
			{
				id: 'dh2027',
				title: 'DH2027',
				lang: 'en',
				url: 'https://dh2027.adho.org/',
				source: ['ADHO'],
				date: '2027-06-28',
				endDate: '2027-07-03',
				place: { en: 'University of Galway, Ireland', fr: 'Université de Galway, Irlande' },
				description: {
					en: "The 37th annual conference of the Alliance of Digital Humanities Organizations, on the theme 'Creativity'.",
					fr: "Le 37ᵉ congrès annuel de l'Alliance of Digital Humanities Organizations, sur le thème « Creativity »."
				}
			},
			{
				id: 'humanistica-2027',
				title: 'Colloque Humanistica 2027',
				lang: 'fr',
				url: 'https://www.humanisti.ca/rendez-vous-a-nancy-en-2027/',
				source: ['Archives Henri-Poincaré'],
				date: '2027-07-07',
				endDate: '2027-07-09',
				place: { en: 'Nancy, France', fr: 'Nancy, France' },
				description: {
					en: "The francophone digital humanities conference, on the theme 'Patrimoine & Durabilité' (heritage and sustainability), with pre-conference workshops on 5 and 6 July.",
					fr: "Le colloque francophone des humanités numériques, sur le thème « Patrimoine & Durabilité », précédé d'ateliers les 5 et 6 juillet."
				}
			}
		]
	}
];
