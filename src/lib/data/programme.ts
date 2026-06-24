import type { ProgrammeDay } from '$lib/types';

/**
 * Date the programme was last revised (ISO `yyyy-mm-dd`). Bump this whenever you
 * change the sessions below — it is shown as "Last updated" on the page.
 */
export const programmeLastUpdated = '2026-06-24';

/**
 * Workshop programme — STIAS, Stellenbosch, 21–24 September 2026.
 *
 * The schedule is fully data-driven: panels reference their papers by id
 * (`presentationIds`) and keynotes reference their speakers by id (`speakers`),
 * so titles, abstracts, authors and links all resolve from the existing
 * participants / organizers / presentations data — nothing is duplicated here.
 *
 * Panels are grouped by theme and language-mixed (each of the five French
 * papers sits in a different panel, so no panel is French-only).
 */
export const programme: ProgrammeDay[] = [
	{
		date: '2026-09-21',
		dayLabel: { en: 'Day 1 · Monday 21 September', fr: 'Jour 1 · Lundi 21 septembre' },
		sessions: [
			{
				id: 'd1-welcome',
				time: '09:00 – 09:15',
				type: 'plenary',
				title: { en: 'Welcome addresses', fr: 'Mots de bienvenue' },
				description: {
					en: 'Welcome addresses from STIAS and Point Sud, followed by a brief framing of the workshop: its goals, themes and practical information.',
					fr: "Mots de bienvenue du STIAS et de Point Sud, suivis d'un cadrage de l'atelier : objectifs, thèmes et informations pratiques."
				}
			},
			{
				id: 'd1-icebreaker',
				time: '09:15 – 10:00',
				type: 'plenary',
				title: { en: 'Ice-breaker', fr: 'Brise-glace' },
				description: {
					en: 'An interactive ice-breaker activity and round of introductions to help participants get to know one another.',
					fr: 'Une activité brise-glace interactive et un tour de présentations pour permettre aux participant·es de faire connaissance.'
				}
			},
			{
				id: 'd1-panel-a',
				time: '10:00 – 11:45',
				type: 'panel',
				title: {
					en: 'Panel 1 · Centring African Knowledge Systems',
					fr: 'Panel 1 · Centrer les systèmes de savoirs africains'
				},
				description: {
					en: 'These papers ground digital and AI methods in African epistemologies — reading folktales, Yorùbá thought and literary emotion as knowledge systems that reshape the very tools used to study them.',
					fr: "Ces communications ancrent les méthodes numériques et l'IA dans les épistémologies africaines — lisant contes, pensée yorùbá et émotion littéraire comme des systèmes de savoirs qui reconfigurent les outils mêmes qui les étudient."
				},
				presentationIds: [
					'moral-ecology-folktales',
					'recoding-yoruba-epistemologies',
					'non-dit-emotions'
				]
			},
			{
				id: 'd1-coffee-1',
				time: '11:45 – 12:15',
				type: 'break',
				title: { en: 'Coffee break', fr: 'Pause-café' }
			},
			{
				id: 'd1-keynote',
				time: '12:15 – 13:15',
				type: 'keynote',
				speakers: ['sarah-oberbichler'],
				presentationIds: ['sustainable-responsible-ai-history']
			},
			{
				id: 'd1-lunch',
				time: '13:15 – 14:30',
				type: 'break',
				title: { en: 'Lunch', fr: 'Déjeuner' }
			},
			{
				id: 'd1-panel-b',
				time: '14:30 – 16:15',
				type: 'panel',
				title: {
					en: 'Panel 2 · Decolonial Methods & Epistemic Justice',
					fr: 'Panel 2 · Méthodes décoloniales et justice épistémique'
				},
				description: {
					en: 'From decolonial computing to the measurement of citation practices and the digital life of Ajami manuscripts, these contributions move decolonisation from critique to method and infrastructure.',
					fr: "Du calcul décolonial à la mesure des pratiques de citation et à la vie numérique des manuscrits ajami, ces contributions font passer la décolonisation de la critique à la méthode et à l'infrastructure."
				},
				presentationIds: ['before-the-algorithm', 'decolonising-citations', 'ajami-manuscripts']
			},
			{
				id: 'd1-dinner',
				time: '18:00',
				type: 'social',
				title: { en: 'Welcome dinner', fr: "Dîner d'ouverture" }
			}
		]
	},
	{
		date: '2026-09-22',
		dayLabel: { en: 'Day 2 · Tuesday 22 September', fr: 'Jour 2 · Mardi 22 septembre' },
		sessions: [
			{
				id: 'd2-panel-c',
				time: '09:00 – 10:45',
				type: 'panel',
				title: {
					en: 'Panel 3 · Digital Archives, Metadata & Discovery',
					fr: 'Panel 3 · Archives numériques, métadonnées et découvrabilité'
				},
				description: {
					en: 'AI-assisted metadata, entity linking and protocol-based access converge on a shared problem: making African heritage collections findable, connected and usable across institutions.',
					fr: "Métadonnées assistées par l'IA, liage d'entités et accès fondé sur des protocoles convergent vers un même enjeu : rendre les collections patrimoniales africaines repérables, connectées et exploitables d'une institution à l'autre."
				},
				presentationIds: [
					'enriching-the-invisible',
					'entity-linking-african-studies',
					'mcp-servers-african-glams'
				]
			},
			{
				id: 'd2-coffee-1',
				time: '10:45 – 11:15',
				type: 'break',
				title: { en: 'Coffee break', fr: 'Pause-café' }
			},
			{
				id: 'd2-panel-d',
				time: '11:15 – 13:00',
				type: 'panel',
				title: {
					en: 'Panel 4 · Language AI: Translation & Learning',
					fr: 'Panel 4 · IA des langues : traduction et apprentissage'
				},
				description: {
					en: 'Scaling language technologies for African languages — from a framework for inclusive language AI to rule-based machine translation and multimodal computer-assisted learning under infrastructural constraint.',
					fr: "Passer à l'échelle les technologies langagières pour les langues africaines — d'un cadre pour une IA linguistique inclusive à la traduction automatique à base de règles et à l'apprentissage multimodal assisté par ordinateur en contexte de contraintes infrastructurelles."
				},
				presentationIds: [
					'masakhane-4d-framework',
					'french-ewondo-rbmt',
					'multimodal-call-african-languages'
				]
			},
			{
				id: 'd2-lunch',
				time: '13:00 – 14:15',
				type: 'break',
				title: { en: 'Lunch', fr: 'Déjeuner' }
			},
			{
				id: 'd2-discussion',
				time: '14:15 – 15:15',
				type: 'discussion',
				speakers: ['van-zaanen'],
				presentationIds: ['networking-strategies']
			},
			{
				id: 'd2-visit-a',
				time: '15:15 – 19:00',
				type: 'social',
				title: { en: 'Visit A', fr: 'Visite A' },
				description: { en: 'Destination to be determined.', fr: 'Destination à déterminer.' }
			},
			{
				id: 'd2-dinner',
				time: '19:00',
				type: 'social',
				title: { en: 'Joint dinner', fr: 'Dîner commun' }
			}
		]
	},
	{
		date: '2026-09-23',
		dayLabel: { en: 'Day 3 · Wednesday 23 September', fr: 'Jour 3 · Mercredi 23 septembre' },
		sessions: [
			{
				id: 'd3-keynote',
				time: '09:00 – 10:00',
				type: 'keynote',
				speakers: ['ngue-um'],
				title: {
					en: 'African Languages and Large Language Models',
					fr: 'Langues africaines et grands modèles de langue'
				}
			},
			{
				id: 'd3-coffee-1',
				time: '10:00 – 10:30',
				type: 'break',
				title: { en: 'Coffee break', fr: 'Pause-café' }
			},
			{
				id: 'd3-panel-e',
				time: '10:30 – 12:15',
				type: 'panel',
				title: {
					en: 'Panel 5 · Documenting & Sustaining African Languages',
					fr: 'Panel 5 · Documenter et pérenniser les langues africaines'
				},
				description: {
					en: 'FAIR data practices, generative AI for multilingual literacy and strategies for long-term sustainability: how African linguistic heritage is documented, taught and kept alive in the digital era.',
					fr: "Pratiques de données FAIR, IA générative pour la littératie multilingue et stratégies de pérennisation : comment documenter, enseigner et maintenir vivant le patrimoine linguistique africain à l'ère numérique."
				},
				presentationIds: [
					'fair-indigenous-languages',
					'alphabet-without-borders',
					'sustaining-african-languages'
				]
			},
			{
				id: 'd3-lunch',
				time: '12:15 – 13:30',
				type: 'break',
				title: { en: 'Lunch', fr: 'Déjeuner' }
			},
			{
				id: 'd3-panel-f',
				time: '13:30 – 15:15',
				type: 'panel',
				title: {
					en: 'Panel 6 · Manuscripts, Histories & Computational Methods',
					fr: 'Panel 6 · Manuscrits, histoires et méthodes computationnelles'
				},
				description: {
					en: 'HTR for Ajami manuscripts, large language models reading historical codebooks and computational ethnography of Sahelian social media show what computation makes legible in African textual and social archives.',
					fr: "HTR des manuscrits ajami, grands modèles de langue lisant des codebooks historiques et ethnographie computationnelle des réseaux sociaux sahéliens : ce que le calcul rend lisible dans les archives textuelles et sociales africaines."
				},
				presentationIds: [
					'ajami-nlp-infrastructure',
					'precolonial-bead-trade',
					'computational-ethnography-fulani'
				]
			},
			{
				id: 'd3-visit-b',
				time: 'From 15:30',
				type: 'social',
				title: { en: 'Visit B', fr: 'Visite B' },
				description: { en: 'Destination to be determined.', fr: 'Destination à déterminer.' }
			},
			{
				id: 'd3-evening',
				time: '18:00',
				type: 'social',
				title: {
					en: 'Return to Stellenbosch & free evening',
					fr: 'Retour à Stellenbosch et soirée libre'
				}
			}
		]
	},
	{
		date: '2026-09-24',
		dayLabel: { en: 'Day 4 · Thursday 24 September', fr: 'Jour 4 · Jeudi 24 septembre' },
		sessions: [
			{
				id: 'd4-keynote',
				time: '09:30 – 10:30',
				type: 'keynote',
				speakers: ['ngue-um'],
				presentationIds: ['que-sait-une-machine']
			},
			{
				id: 'd4-coffee-1',
				time: '10:30 – 11:00',
				type: 'break',
				title: { en: 'Coffee break', fr: 'Pause-café' }
			},
			{
				id: 'd4-panel-g',
				time: '11:00 – 12:45',
				type: 'panel',
				title: {
					en: 'Panel 7 · Sustainable Infrastructures & Frugal Innovation',
					fr: 'Panel 7 · Infrastructures durables et innovation frugale'
				},
				description: {
					en: 'Frugal infrastructures, South–South ecologies, community co-production and the limits of generic AI in African settings: what it takes to build research capacity that lasts.',
					fr: "Infrastructures frugales, écologies Sud-Sud, co-production communautaire et limites de l'IA générique en contexte africain : ce qu'exige une capacité de recherche durable."
				},
				presentationIds: [
					'frugal-infrastructures',
					'nigerian-town-question',
					'ai-cybersecurity-burkina'
				]
			},
			{
				id: 'd4-lunch',
				time: '12:45 – 14:00',
				type: 'break',
				title: { en: 'Lunch', fr: 'Déjeuner' }
			},
			{
				id: 'd4-discussion',
				time: '14:00 – 15:00',
				type: 'discussion',
				speakers: ['hiribarren'],
				presentationIds: ['teaching-digital-methods-african-histories']
			},
			{
				id: 'd4-concluding',
				time: '15:00 – 16:00',
				type: 'plenary',
				title: { en: 'Concluding remarks & synthesis', fr: 'Remarques finales et synthèse' },
				description: {
					en: 'Closing discussion: shared takeaways, open questions, and next steps — including plans for the joint publication arising from the workshop.',
					fr: "Discussion de clôture : acquis partagés, questions ouvertes et prochaines étapes — y compris les plans pour la publication collective issue de l’atelier."
				}
			},
			{
				id: 'd4-evening',
				time: 'From 16:00',
				type: 'social',
				title: { en: 'Free evening', fr: 'Soirée libre' }
			}
		]
	}
];
