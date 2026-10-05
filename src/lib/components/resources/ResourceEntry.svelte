<script lang="ts">
	import type { ResourceListing } from '$lib/types';
	import * as m from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { t, localePath } from '$lib/utils/i18n';
	import { formatDateRange, formatPartialDate } from '$lib/utils/date';
	import { ArrowRight, ExternalLink } from '@lucide/svelte';

	let { resource }: { resource: ResourceListing } = $props();

	const locale = $derived(getLocale() as 'en' | 'fr');

	// "A, B and C" / "A, B et C" — the conjunction belongs to the page, not the data.
	const listFormat = $derived(
		new Intl.ListFormat(locale === 'fr' ? 'fr' : 'en-GB', { type: 'conjunction' })
	);

	// The same phrase for the authors, but cut into parts so each name can be
	// its own link: linked when the author has a page here, which a credited
	// co-author does not.
	const authorParts = $derived.by(() => {
		const people = resource.authors;
		let next = 0;
		return listFormat.formatToParts(people.map((person) => person.name)).map((part) => {
			if (part.type === 'literal') return { text: part.value };
			const person = people[next++];
			return {
				text: part.value,
				href: person.group === 'co-author' ? undefined : localePath(`/participants/${person.id}`)
			};
		});
	});

	const source = $derived(
		resource.source
			? listFormat.format(
					resource.source.map((name) => (typeof name === 'string' ? name : t(name)))
				)
			: ''
	);

	const when = $derived(
		resource.date
			? resource.endDate
				? formatDateRange(resource.date, resource.endDate)
				: formatPartialDate(resource.date)
			: ''
	);

	// A meeting is read for when and where, so its dates lead, above the title;
	// anything else is cited the usual way — who, where published, when.
	const isMeeting = $derived(Boolean(resource.place));
	const facts = $derived.by(() => {
		const list: { text: string; isDate?: boolean }[] = isMeeting
			? [{ text: resource.place ? t(resource.place) : '' }, { text: source }]
			: [{ text: source }, { text: when, isDate: true }];
		return list.filter((fact) => fact.text);
	});
</script>

<article>
	{#if isMeeting && when}
		<p class="text-eyebrow mb-2">
			<time datetime={resource.date}>{when}</time>
		</p>
	{/if}

	<h3 class="text-card-title text-strong">
		<a
			href={resource.url}
			target="_blank"
			rel="noopener noreferrer"
			class="link-underline resource-title"
		>
			<!-- `lang` on the title alone: the new-tab note after it is in the
			     page's language, and would be voiced as the title's. -->
			<span lang={resource.lang}>{resource.title}</span><ExternalLink
				size={15}
				strokeWidth={1.75}
				class="text-muted ml-1.5 inline-block align-[-0.0625em]"
				aria-hidden="true"
			/><span class="sr-only">{m.opens_new_tab()}</span>
		</a>
	</h3>

	{#if resource.subtitle}
		<p class="text-body text-caption mt-1 leading-snug" lang={resource.lang}>
			{resource.subtitle}
		</p>
	{/if}

	<!-- Flex rather than inline text, so the separators are items with a gap on
	     either side instead of spaces that depend on how the markup is wrapped,
	     and a long place name wraps whole rather than mid-phrase. The author
	     phrase is one item: its own commas and "and" come from the formatter. -->
	{#if authorParts.length > 0 || facts.length > 0}
		<p class="text-muted text-caption mt-1.5 flex flex-wrap items-baseline gap-x-2 leading-snug">
			{#if authorParts.length > 0}
				<span
					>{#each authorParts as part, i (i)}{#if part.href}<a href={part.href} class="link-inline"
								>{part.text}</a
							>{:else}{part.text}{/if}{/each}</span
				>
			{/if}
			{#each facts as fact, i (i)}
				{#if i > 0 || authorParts.length > 0}<span aria-hidden="true">·</span>{/if}
				{#if fact.isDate}
					<time datetime={resource.date}>{fact.text}</time>
				{:else}
					<span>{fact.text}</span>
				{/if}
			{/each}
		</p>
	{/if}

	{#if resource.description}
		<p class="text-bio measure-prose mt-3">{t(resource.description)}</p>
	{/if}

	{#if resource.paper || resource.links?.length}
		<ul class="mt-1 flex flex-wrap gap-x-6">
			{#if resource.paper}
				<li>
					<a href={localePath(`/papers/${resource.paper}`)} class="link-arrow text-sm">
						{m.resources_read_abstract()}
						<ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
					</a>
				</li>
			{/if}
			{#each resource.links ?? [] as link (link.url)}
				<li>
					<a
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						hreflang={link.hreflang}
						class="link-arrow text-sm"
					>
						<ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
						{t(link.label)}<span class="sr-only">{m.opens_new_tab()}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</article>

<style>
	/* The shared resting underline (.link-underline, app.css), stepped up to
	   1.5px at the card-title size as on PaperCard, where 1px reads as a
	   hairline artefact. The external glyph says where the link goes; it does
	   not stand in for the underline. */
	.resource-title {
		--link-underline-weight: 1.5px;
		--link-underline-offset: 0.18em;
	}
</style>
