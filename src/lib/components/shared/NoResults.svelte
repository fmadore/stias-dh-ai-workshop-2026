<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { SearchX, X } from '@lucide/svelte';

	/**
	 * The filtered-empty state. It used to be one muted sentence — "No papers
	 * match your search." — which was wrong twice over: two of the three
	 * controls above it are not a search, and a dead end is not a state, it is
	 * a state plus the way out of it. The way out already existed in the filter
	 * bar; it just was not where the reader was looking.
	 */
	let { message, onclear }: { message: string; onclear: () => void } = $props();
</script>

<div class="py-14 text-center">
	<SearchX
		size={28}
		strokeWidth={1.25}
		class="text-ink-subtle mx-auto mb-4 opacity-60"
		aria-hidden="true"
	/>
	<p class="text-muted measure-prose mx-auto text-sm">{message}</p>
	<button type="button" class="btn btn-secondary btn-sm mt-5" onclick={onclear}>
		<X size={14} strokeWidth={1.75} aria-hidden="true" />
		{m.filter_clear()}
	</button>
</div>
