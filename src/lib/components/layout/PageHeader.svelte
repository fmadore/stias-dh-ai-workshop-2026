<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle = '',
		/** Breadcrumb-ish context line above the title. */
		eyebrow = '',
		/** Counts and facts about what is on the page — rendered as a rule-separated row. */
		meta = [],
		/** Page-level actions (downloads, filters) that belong beside the title. */
		actions,
		/** Wide pages (the directory grid, the programme) need the full container. */
		width = 'readable',
		/**
		 * The language `title` is actually written in, when it differs from the
		 * page. A paper keeps its title in its language of delivery, so a French
		 * title appears on the English site and vice versa; without this a screen
		 * reader applies the page's phonemes to it. WCAG 3.1.2.
		 */
		titleLang = undefined
	}: {
		title: string;
		subtitle?: string;
		eyebrow?: string;
		meta?: string[];
		actions?: Snippet;
		width?: 'readable' | 'page';
		titleLang?: string;
	} = $props();
</script>

<!-- A sunken band, so interior pages get the banding the home page has and
     chrome is visibly separated from content. -->
<header class="bg-cream-dark border-subtle border-b">
	<div class="{width === 'page' ? 'container-page' : 'container-readable'} pt-14 pb-10">
		{#if eyebrow}
			<p class="text-eyebrow mb-4">{eyebrow}</p>
		{:else}
			<span class="accent-rule mb-6" aria-hidden="true"></span>
		{/if}

		<div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
			<div class="min-w-0">
				<h1 class="text-page-title text-strong" lang={titleLang}>{title}</h1>
				{#if subtitle}
					<p class="text-lede mt-3">{subtitle}</p>
				{/if}
			</div>
			{#if actions}
				<div class="flex flex-wrap items-center gap-3">{@render actions()}</div>
			{/if}
		</div>

		{#if meta.length > 0}
			<!-- The rules are pseudo-elements sitting in each item's left gutter, not
			     flex children, so that a wrapped line never begins or ends on one.
			     As siblings they wrapped on their own and a phone showed "21–24
			     SEPTEMBER 2026 |" with the place stranded on the line below; moving
			     them inside the item only moved the orphan to the front of the line.
			     Positioned in the gutter they fall outside the row's box whenever
			     their item starts a line, and `overflow: hidden` takes them from
			     there. On one line — every page at desktop — nothing changes. -->
			<div
				class="border-subtle meta-row mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-5"
			>
				{#each meta as item (item)}
					<span class="text-meta meta-item">{item}</span>
				{/each}
			</div>
		{/if}
	</div>
</header>

<style>
	.meta-row {
		overflow: hidden;
	}
	.meta-item {
		position: relative;
	}
	/* Half the row's 1rem column gap, so the rule sits centred between two
	   items. An item that starts a line has x = 0, which puts its rule at
	   -0.5rem — outside the row's box, where the clip removes it. */
	.meta-item + .meta-item::before {
		content: '';
		position: absolute;
		left: -0.5rem;
		top: 50%;
		width: 1px;
		height: 0.75rem;
		transform: translateY(-50%);
		background-color: var(--color-hairline);
	}
</style>
