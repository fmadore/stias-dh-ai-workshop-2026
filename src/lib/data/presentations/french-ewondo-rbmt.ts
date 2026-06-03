import type { Presentation } from '$lib/types';

const presentation: Presentation = {
	id: 'french-ewondo-rbmt',
	language: 'fr',
	title:
		'Traduire sans équivalence : enjeux épistémologiques du transfert linguistique dans un système de traduction automatique à base de règles pour la paire français-ewondo',
	abstract: `La traduction automatique des langues africaines peu dotées fait face à des défis qui dépassent largement l’ingénierie linguistique. Cet article s’appuie sur le développement d’un système de traduction automatique à base de règles (RBMT) construit dans une architecture FLEx/FlexTrans/Apertium et testé sur un corpus parallèle de 124 paires de phrases alignées, pour la paire français-ewondo, une langue bantoue du Cameroun.

L’étude des transferts structurels met en évidence un premier type de problèmes, tels que la concordance allitérative des classes nominales bantoues, l’expression de la possession via le connectif génitif, l’absence d’inversion sujet-verbe dans les interrogatives ainsi que le réordonnancement des constituants, qui ont tous requis la formalisation de règles computationnelles dédiées. Ces phénomènes illustrent que la modélisation d’une langue à richesse morphologique et agglutinante requiert une description contrastive préalable, laquelle ne peut être précisément assurée par les grands modèles de langage contemporains pour l’ewondo.

Par ailleurs, l’analyse des transferts lexicaux et sémantiques révèle des défis encore plus sérieux. Trois types de non-correspondances ont été identifiés : les lacunes lexicales, où les concepts juridiques et administratifs français n’ont pas d’équivalent en ewondo et exigent des stratégies de compensation impliquant chacune une décision épistémologique ; les divergences aspectuelles, puisque l’ewondo encode dans sa morphologie verbale des oppositions statiques/dynamiques absentes en français ; et les constructions existentielles impersonnelles, dont la restructuration syntaxique et le choix du verbe existentiel approprié en ewondo dépendent des traits sémantiques du nom thème et résistent à une réduction à une règle générale.

L’évaluation du système à l’aide des métriques BLEU et ChrF++ confirme ces observations. Le score BLEU de 30,79 % reflète une couverture solide des transferts structurels, tandis que la baisse progressive selon l’ordre des n-grammes (56,0 % au niveau unigramme contre 16,4 % au niveau 4-grammes) révèle la difficulté du système à reproduire des séquences longues où s’accumulent les non-correspondances lexicales et sémantiques. Ces résultats montrent que les non-correspondances profondes définissent une limite structurelle. Là où les deux langues ne partagent pas les mêmes catégories conceptuelles, la traduction automatique atteint une frontière que seul le jugement du linguiste-locuteur peut franchir. Cette limite est un indicateur épistémologique, cartographiant les points où les systèmes de savoir encodés en ewondo résistent à la formalisation computationnelle et, ce faisant, remettent en question les présupposés intégrés dans les infrastructures numériques conçues pour d’autres langues.`
};

export default presentation;
