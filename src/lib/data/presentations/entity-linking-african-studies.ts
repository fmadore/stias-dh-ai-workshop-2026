import type { Presentation } from '$lib/types';

const presentation: Presentation = {
	id: 'entity-linking-african-studies',
	language: 'en',
	authors: ['jiayu-yang', 'durgesh-nandini'],
	title: 'Beyond Keywords: Entity Linking for Cross-Database Discovery in African Studies',
	abstract: `Research databases in African Studies accumulate rich metadata, including subject keywords, themes, geographic and cultural references, but much of this data remains largely isolated, making it difficult to retrieve and reuse across different databases. The key problem is semantic grounding: without stable identifiers, multiple databases describing the same cultural practice or geographic region have no way to know it, even if there is a semantic overlap in the underlying subjects.

Our paper addresses this research gap by presenting a cost efficient, multistage pipeline that combines an LLM based extraction and layered entity-linking to enable a semantically grounded, cross-database search across heterogenous data resources. We do this in three integrated steps.

Firstly, named entity recognition (NER) extracts and normalises subject-level entities from heterogeneous metadata, using locally deployed open-source LLM combined with rule-based processing. Secondly, entity linking maps recognised entities to Wikidata QIDs through a four-layer architecture. The first three layers rely entirely on rule-based processing and statistical signals, cross-lingual retrieval consensus (CRC), entity notability filtering, and record context relevance. Only genuinely ambiguous keywords are routed to the final layer, where a locally deployed LLM reasons agentically via tool use. This cost-aware design means the LLM is invoked only when lower-cost signals are insufficient, making the pipeline viable on modest institutional GPU resources. Thirdly, these enriched records make cross-database searches possible. Once entities are assigned common identifiers, connections between different African research databases can be clearly revealed through the construction of knowledge graphs.

Our pipeline is built to address the realities of multilingual African research metadata: variant spellings, transliterated terms, and culturally embedded concepts underrepresented in standard ontologies. A key advantage of the methodology is that low-confidence links are flagged for human review rather than silently propagated.

In addition to the pipeline itself, we contribute two resources to the broader community: a benchmark dataset of African research metadata for evaluating entity linking and disambiguation, a domain where evaluation sets are nearly absent. We also outline a pathway for creating new entries where no Wikidata items currently exist, contributing to the global knowledge infrastructure rather than working around its gaps.`
};

export default presentation;
