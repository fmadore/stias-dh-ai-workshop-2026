<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { t } from '$lib/utils/i18n';
	import { getLocale } from '$lib/paraglide/runtime';

	const locale = $derived(getLocale());

	const abstractText = $derived(
		locale === 'fr'
			? `Cet atelier interdisciplinaire de quatre jours rassemble des chercheurs, des praticiens du numérique et des spécialistes de l'information travaillant à l'intersection des humanités numériques (HN), de l'intelligence artificielle (IA) et des études africaines. Alors que les méthodes computationnelles remodèlent de plus en plus la recherche en sciences humaines et sociales, cet atelier examine comment ces outils et approches sont déployés dans les contextes africains — et comment ils peuvent être façonnés par des perspectives et des systèmes de savoirs africains.

L'atelier s'organise autour de trois axes thématiques interconnectés qui abordent les dimensions méthodologiques, infrastructurelles et épistémologiques des HN et de l'IA en études africaines. Plutôt que de présupposer l'applicabilité universelle des cadres numériques occidentaux, nous visons à favoriser un dialogue critique sur les pratiques durables, équitables et épistémiquement justes pour la recherche numérique en Afrique et sur l'Afrique.`
			: `This four-day interdisciplinary workshop brings together researchers, digital practitioners, and information specialists working at the intersection of Digital Humanities (DH), Artificial Intelligence (AI), and African Studies. As computational methods increasingly reshape research across the humanities and social sciences, this workshop examines how these tools and approaches are being deployed in African contexts — and how they can be shaped by African perspectives and knowledge systems.

The workshop is organized around three interconnected thematic axes that address the methodological, infrastructural, and epistemological dimensions of DH and AI in African Studies. Rather than assuming the universal applicability of Western digital frameworks, we aim to foster a critical dialogue about sustainable, equitable, and epistemically just practices for digital research in and about Africa.`
	);
</script>

<section class="py-16 sm:py-20">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<h2 class="text-2xl sm:text-3xl font-bold mb-8">{m.section_about()}</h2>
		<div class="prose prose-lg dark:prose-invert max-w-none">
			{#each abstractText.split('\n\n') as paragraph}
				<p class="text-surface-700 dark:text-surface-200 leading-relaxed mb-4">{paragraph}</p>
			{/each}
		</div>
	</div>
</section>
