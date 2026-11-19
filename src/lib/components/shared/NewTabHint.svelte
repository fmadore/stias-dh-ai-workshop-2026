<script lang="ts" module>
	import * as m from '#lib/paraglide/messages.js';

	/**
	 * For a link whose `aria-label` replaces its text: the label never reads
	 * the hint inside the link, so the hint has to be part of the label.
	 */
	export function withNewTabHint(label: string): string {
		return `${label} ${m.opens_new_tab()}`;
	}
</script>

<!--
	"(opens in a new tab)", for screen readers only. Every link that leaves in a
	new tab carries it (WCAG 3.2.5 advisory, G201): the external-link glyph says
	so to sighted readers and is aria-hidden. Three links had this and eleven did
	not; one piece rather than fourteen copies. Place it inside the link, last.

	The leading space is deliberate: without it the accessible name runs the
	link text into the hint ("View slides(opens in a new tab)").
-->
<span class="sr-only">{' ' + m.opens_new_tab()}</span>
