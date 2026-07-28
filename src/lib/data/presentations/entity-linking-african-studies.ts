import type { Presentation } from '$lib/types';

const presentation: Presentation = {
	id: 'entity-linking-african-studies',
	language: 'en',
	authors: ['jiayu-yang', 'durgesh-nandini'],
	title: 'Beyond Keywords: Entity Linking for Cross-Database Discovery in African Studies',
	abstract: `Research databases in African Studies accumulate rich metadata, including subject keywords, themes, geographic and cultural references, but much of this data remains isolated, difficult to retrieve and reuse across databases. The key problem is semantic grounding: without stable identifiers, two databases describing the same cultural practice or geographic region have no way to know it, even when the underlying subjects overlap. Our work draws on 3,975 metadata records from five partner institutions across Africa, Europe, and South America, spanning disciplines from musicology to social anthropology.

Our paper addresses this gap with CAREL (Context-Aware Routing for Entity Linking), a training-free, cost-aware pipeline that links research metadata keywords to Wikidata QIDs, the shared identifiers that make cross-database search and, in the longer term, knowledge graph construction possible. An LLM extraction stage first identifies concept-level entities from titles, abstracts, and keyword fields. Linking then runs through a four-layer cascade. The first three layers are rule-based, built around Cross-lingual Retrieval Consensus (CRC), a novel signal that reads the agreement of retrieval ranks across English, French, Portuguese, and German queries as a measure of linking confidence. Only genuinely ambiguous keywords reach the final layer, where a locally deployed open-source LLM reasons over the record context using live Wikidata tools. Local deployment is a deliberate choice: research metadata never leaves the institution, and the communities behind the data keep control over how it is used.

The pipeline is built for the realities of African research metadata: variant spellings, transliterated terms, and culturally embedded concepts underrepresented in standard ontologies. On two manually verified benchmarks constructed from our corpus, authority-anchored subject headings and free researcher tags, CAREL reaches between 88.8% and 90.9% linking accuracy with two open-source models, against 53.6% for Wikidata's native ranking and 68.0% for OpenRefine reconciliation, the established cultural heritage workflow. Equally important, the pipeline recognises when a concept has no Wikidata entity at all, detecting these cases at an F1 of 88 rather than forcing a wrong link, and low-confidence links are flagged for human review rather than silently propagated.

The evaluation also surfaces a structural asymmetry. The research materials are often in African languages; their descriptive metadata is predominantly English; and the label spaces used for grounding are European. The pipeline inherits this asymmetry rather than corrects it. Grounding in language-neutral QIDs is a partial counterweight, since a linked record becomes reachable through every language label its entities carry, and extending the search languages to Swahili and Yoruba is a concrete next step.

Beyond the pipeline, we contribute two resources to the community: the benchmarks themselves, in a domain where evaluation sets are nearly absent, and a pathway from NIL detection to the creation of missing Wikidata entries, so that culturally specific African concepts enter the global knowledge infrastructure rather than remaining outside it.`
};

export default presentation;
