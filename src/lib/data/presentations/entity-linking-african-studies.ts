import type { Presentation } from '$lib/types';

const presentation: Presentation = {
	id: 'entity-linking-african-studies',
	language: 'en',
	authors: ['jiayu-yang', 'durgesh-nandini'],
	title: 'Linking African Studies Metadata to Wikidata: A Training-Free Pipeline and the Gaps It Measures',
	abstract: `Research databases in African Studies accumulate rich metadata, including subject keywords, themes, geographic and cultural references, but much of this description remains isolated. The key problem is semantic grounding: without shared identifiers, two databases describing the same cultural practice or geographic region have no way to recognise the overlap. Our work draws on 3,975 metadata records from five African Studies institutions across three continents.

We present CAREL (Context-Aware Routing for Entity Linking), a training-free pipeline that links research metadata keywords to Wikidata identifiers through a four-layer cascade. The first three layers are rule-based, using cross-lingual retrieval signals to measure linking confidence without any model inference. Only genuinely ambiguous keywords reach the final layer, where a locally deployed open-source LLM disambiguates among the candidates using the record's own context and live Wikidata tools. Local deployment is a deliberate choice: research metadata never leaves the institution, and the communities behind the data keep control over how it is used.

On two manually verified benchmarks, one covering subject headings mapped to a controlled vocabulary and one covering free researcher tags, CAREL reaches 86.6% to 90.9% accuracy across three open-source LLMs, against 68.0% to 76.8% for the OpenRefine reconciliation service. The pipeline also recognises when no suitable Wikidata entity exists, detecting these cases at an F1 of 88 rather than forcing a wrong link.

Among the entities we could link, those associated with Africa are labelled in African languages more thoroughly than the rest of the knowledge base, though that coverage rests on a few major lingua francas. The gap that matters is not translation but existence: more than a quarter of the keywords researchers could not fit into a controlled vocabulary have no Wikidata entity either. Linking works best for concepts that are already well represented globally, and least well for the culturally specific vocabulary that African Studies exists to study.

Beyond the pipeline, we contribute two resources: the benchmarks themselves, in a domain where evaluation sets are nearly absent, and a verified list of NIL annotations with their record context, documenting concepts that Wikidata does not yet hold so that the gap is visible rather than silently absorbed.`
};

export default presentation;
