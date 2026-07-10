import type { Presentation } from '$lib/types';

const presentation: Presentation = {
	id: 'enriching-the-invisible',
	language: 'en',
	authors: ['sanjin-muftic'],
	title:
		'Enriching the Invisible: AI-Assisted Metadata Generation and the Findability of Southern African Heritage Collections',
	abstract: `Heritage collections from the Global South face a compounding discovery problem. Sparse or inconsistent metadata limits findability, and the AI tools that could help address this gap are trained predominantly on Global North data, meaning the collections are the least well served by the tools available to describe them. This paper asks a practical question: how can AI-assisted metadata enrichment make Southern African heritage collections more findable, and what happens when we turn that question around, using these same collections to improve the tools that describe them?

The empirical starting point is the Banned Persons Project, a collection of video interviews documenting individuals subjected to apartheid-era banning orders, hosted on UCT’s Ibali Digital Collections platform. Using Microsoft Copilot, available through UCT’s institutional licensing, the DSS team processed existing English-language interview transcripts to generate descriptive keywords, evaluating whether AI assistance could meaningfully improve the discoverability of video content that has historically been difficult to surface. I report on what this process revealed, where it worked, where it fell short, and what the quality of source material had to do with the quality of output.

From this starting point, I map out two directions for extending the work. The first is multilingual keyword generation. English-only metadata excludes significant communities of potential users, and the communities most connected to these collections are often not English-speaking ones. Generating and translating keywords into isiXhosa, Afrikaans, or other relevant languages is technically feasible with current tools, but raises immediate questions about accuracy, cultural appropriateness, and who gets to validate what the machine produces. The second direction involves visual collections, specifically, a planned evaluation of Wise (University of Oxford), a computer vision tool for heritage object identification, applied to the Jagger Library Fire Photography Collection, with the question of whether approaches that work there can scale to older and more historically complex photographic archives.

Underlying both directions is what I consider the more significant argument. When a collection is well-described and made FAIR-compliant, it does not only serve researchers working with it now, it becomes reusable data that can feed back into training and fine-tuning the models that were potentially too limited to describe it well initially. The act of enrichment is not just a service to the present; it builds capacity for the future, creating a feedback loop between heritage description and model improvement that could, over time, shift the balance of which collections AI handles well.

This raises a question I argue deserves more attention. Commercial language models routinely crawl open heritage platforms, extracting content to train systems that offer little back to the communities whose histories they draw on. If Southern African institutions are going to invest in making their collections FAIR and machine-actionable, licensing frameworks should reflect that, prioritising reuse by models developed for and by African research communities, rather than simply contributing to infrastructures built elsewhere.`
};

export default presentation;
