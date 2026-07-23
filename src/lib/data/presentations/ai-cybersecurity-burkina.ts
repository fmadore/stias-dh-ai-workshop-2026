import type { Presentation } from '$lib/types';

const presentation: Presentation = {
	id: 'ai-cybersecurity-burkina',
	language: 'fr',
	authors: ['mohamadou-konate'],
	title:
		'L’IA générique face aux réalités africaines : défis structurels et voies alternatives pour la recherche en cybersécurité au Burkina Faso',
	abstract: `Lorsqu’un chercheur burkinabè en cybersécurité cherche des données sur les incidents cyber touchant les infrastructures critiques de son pays, il ne trouve pratiquement rien. Les bases de données de référence internationales comme KDD Cup 99, CICIDS 2017 et UNSW-NB15 se basent principalement sur des environnements réseau nord-américains ou occidentaux. Les modèles d’IA produits à partir de ces données sont souvent présentés comme universels, mais appliqués au contexte africain, ils reposent sur des hypothèses qui ne reflètent pas la réalité locale. Cette communication, basée sur une recherche doctorale sur la cybersécurité des infrastructures critiques au Burkina Faso, identifie trois défis structurels et propose des voies alternatives.

Le premier défi est le manque de données de référence africaines et l’inadéquation des protocoles représentés. Une revue systématique de 89 datasets de détection d’intrusions (Goldschmidt & Chudá, 2025) confirme qu’aucun ne provient d’Afrique. Le trafic africain diffère structurellement : 73 % des connexions restaient sur 3G et moins en 2023 (Cisco, 2020), le protocole USSD non chiffré domine le mobile money, et les attaques par SIM swap (43 % des fraudes) et fraudes par agents (38 %), responsables de 1,5 milliard de dollars de pertes en 2022 (Adongo, 2025), sont absentes des trois datasets de référence.

Le deuxième défi est le fossé entre les exigences infrastructurelles des frameworks d’IA et les capacités réelles des institutions africaines. Les systèmes de détection d’intrusions reposant sur le deep learning nécessitent des GPU NVIDIA, entre 16 et 32 Go de RAM, ainsi qu’une connexion Internet constante (Dietz et al., 2024) — des exigences inaccessibles pour de nombreuses universités et centres de recherche africains. La vitesse médiane fixe au Burkina Faso était de 42,46 Mbps début 2024, en baisse de 5,3 % sur un an (Ookla/DataReportal, 2024). Les universités d’Afrique de l’Ouest disposent de 10 à 100 Mbps, contre 3 Gbps recommandés aux États-Unis (Banque mondiale, 2020), avec une bande passante coûtant 50 fois plus cher qu’en Europe (Bandwidth Consortium, 2005).

Le troisième défi est l’invisibilité épistémique des jeunes chercheurs du continent. Contraints de travailler sur des données étrangères et des outils hors de portée, ils produisent structurellement une science décontextualisée — rejoignant les constats de Buolamwini & Gebru (2018) sur les biais algorithmiques et de Cremer et al. (2022) sur la pénurie de données en cybersécurité.

La méthodologie repose sur une revue systématique de 89 ensembles de données, une analyse comparative des protocoles et des vecteurs d’attaque entre l’Occident et l’Afrique, ainsi qu’une confrontation avec les défis réels du contexte burkinabè et africain.

Trois pistes sont envisagées : la création collaborative de datasets africains, inspirée par le modèle de Masakhane pour le traitement du langage naturel ; la conception d’architectures légères (lightweight AI) entraînables hors ligne ; et un plaidoyer pour des benchmarks africains reconnus internationalement.

Cette communication s’inscrit dans la continuité des travaux de Madore (2021) sur les humanités numériques au Burkina Faso et de Madore & Hiribarren (2025) concernant l’IA et les archives africaines. La décolonisation de l’IA évolue de la critique vers la construction.`
};

export default presentation;
