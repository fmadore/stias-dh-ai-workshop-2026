import type { Presentation } from '$lib/types';

const presentation: Presentation = {
	id: 'before-the-algorithm',
	language: 'en',
	authors: ['khaoula-stiti'],
	title:
		'Before the Algorithm: Decolonial Computing as a Methodological Prerequisite for AI-Assisted Heritage Research in Africa',
	abstract: `When researchers in African Studies reach for AI tools to document, classify, or analyse heritage, they inherit a problem that predates AI itself. This paper argues that the failures now emerging in AI-assisted heritage research are not new, they are the continuation of a pattern already visible in earlier digital heritage platforms, and that understanding this pattern is the first step toward designing against it.

The argument draws on a concrete case: the P@trimonia 2.0 project (Belgium–Tunisia, 2019–2024), a North South collaboration that attempted to build a heritage participatory platform. The project failed in instructive ways. Technologically, it was built on a platform designed for a Belgian open-air museum and then assumed to transfer to a non-heritagised urban landscape in Tunis, a one-size-fits-all logic that collapsed when confronted with a radically different heritage context. Culturally, it reproduced three overlapping problems: cultural bias, where Eurocentric design frameworks displaced local Tunisian knowledge and community input; power imbalance, where funding control remained with Belgian partners and development occurred physically distant from the Tunisian context; and technological solutionism, where the digital tool was treated as a universal fix that bypassed the social and historical complexity of colonial heritage.

These are not merely platform-design failures. They are methodological failures, and they map directly onto what AI systems now do at scale. AI models trained on already digitised, Western catalogued heritage data reproduce the same erasures as P@trimonia 2.0, only faster and with greater institutional authority. The infrastructural assumptions embedded in AI discourse mirror the power imbalances of North South research partnerships. And the apparent objectivity of AI classification systems is a more powerful form of the same technological solutionism that reduced the colonial heritage of Tunis to a set of material data points.

From this diagnosis, the paper derives a set of practical methodological criteria for African Studies researchers working with AI tools. These include: evaluating whether training data reflects the specific heritage context under study or merely the nearest digitised approximation; auditing infrastructural dependencies before adopting AI-assisted workflows; designing community co-creation into the process from the outset rather than retrofitting it; and treating local classification systems and knowledge structures as inputs to tool design, not as content to be processed by tools designed elsewhere. The paper concludes that decolonial computing is not a theoretical framework to be applied after methodology is settled, it is the methodology, and AI cannot be responsibly used in African heritage research without it.`
};

export default presentation;
