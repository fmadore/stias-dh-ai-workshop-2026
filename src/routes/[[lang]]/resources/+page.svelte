<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { siteConfig } from '$lib/data/site-config';
	import { t } from '$lib/utils/i18n';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import ResourceEntry from '$lib/components/resources/ResourceEntry.svelte';

	let { data } = $props();

	const sections = $derived([
		...(data.slideDecks.length > 0
			? [
					{
						id: 'slides',
						title: m.resources_slides_title(),
						intro: m.resources_slides_intro(),
						resources: data.slideDecks
					}
				]
			: []),
		...data.sections.map((section) => ({
			id: section.id,
			title: t(section.title),
			intro: section.intro ? t(section.intro) : '',
			resources: section.resources
		}))
	]);
</script>

<SEO
	title="{m.nav_resources()} | {siteConfig.shortTitle}"
	description={m.seo_resources_description()}
/>

<PageHeader title={m.nav_resources()} subtitle={m.resources_page_subtitle()} />

<!-- A reading list rather than a card grid: each entry is a citation and a
     sentence, ruled off from the next, so the page reads like the end of a
     paper rather than a link directory. -->
<div class="page-end page-body">
	<div class="container-readable block-flow">
		<!-- The page is a long scroll on a phone, and someone looking for a
		     repository should not have to read past the archives to find one.
		     A label rather than a heading: the outline is the sections. -->
		<nav aria-label={m.resources_contents()}>
			<p class="text-meta mb-2">{m.resources_contents()}</p>
			<ul class="flex flex-wrap gap-x-5">
				{#each sections as section (section.id)}
					<li>
						<a href="#{section.id}" class="link-inline inline-flex min-h-6 items-center text-sm">
							{section.title}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		{#each sections as section (section.id)}
			<ScrollReveal>
				<section id={section.id} aria-labelledby="{section.id}-heading">
					<h2 id="{section.id}-heading" class="text-section text-strong">{section.title}</h2>
					{#if section.intro}
						<p class="text-prose mt-2">{section.intro}</p>
					{/if}
					<ul class="mt-5">
						{#each section.resources as resource (resource.id)}
							<li class="border-subtle border-t py-6 last:pb-0">
								<ResourceEntry {resource} />
							</li>
						{/each}
					</ul>
				</section>
			</ScrollReveal>
		{/each}
	</div>
</div>
