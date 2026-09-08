/**
 * Papers whose id changed after their URL had already been published.
 *
 * A paper's id is its URL, so renaming one to match a retitled submission
 * strands every link that was already handed out. Each legacy id listed here
 * keeps being prerendered, as a redirect to the id that replaced it — the
 * static host has no rewrite rules of its own, so the redirect has to be a
 * page. Entries are permanent: the point is that the old link never breaks.
 */
export const paperRedirects: Record<string, string> = {
	// Retitled from 'Fulani Networks: A Computational Ethnography of Social
	// Media in the Sahel' to 'Difference in Similarity', September 2026.
	'computational-ethnography-fulani': 'visual-narratives-fulani-whatsapp'
};
