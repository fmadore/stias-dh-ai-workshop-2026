<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import { t, localePath } from '#lib/utils/i18n.ts';
	import { siteConfig } from '#lib/data/site-config.ts';
	import SEO from '#lib/components/SEO.svelte';
	import PageHeader from '#lib/components/layout/PageHeader.svelte';
	import Avatar from '#lib/components/shared/Avatar.svelte';
	import PersonLinks from '#lib/components/shared/PersonLinks.svelte';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { countryName } from '#lib/utils/country.ts';
	import { localizedAbsoluteUrl } from '#lib/utils/localized-paths.ts';
	import { truncate } from '#lib/utils/text.ts';
	import {
		META_DESCRIPTION_LENGTH,
		detailBreadcrumbs,
		personId
	} from '#lib/utils/structured-data.ts';

	let { data } = $props();

	const person = $derived(data.person);
	const bio = $derived(person.bio ? t(person.bio) : '');
	/**
	 * Most bios duplicate one language into both fields (see `Participant.bio`),
	 * so the text a reader gets is often not in the page's language. Mark it when
	 * that happens; a genuinely translated bio always matches and needs nothing.
	 */
	const bioLang = $derived.by(() => {
		if (!person.bio || person.bio.en !== person.bio.fr) return undefined;
		const source = person.bioLanguage ?? 'en';
		return source === getLocale() ? undefined : source;
	});
	const presentationItems = $derived(data.presentationItems);
	const canonicalPath = $derived(`/participants/${person.id}`);

	const description = $derived(
		bio ? truncate(bio, META_DESCRIPTION_LENGTH) : `${person.name} — ${t(person.affiliation)}`
	);

	// The page is a ProfilePage whose subject is this Person (merged into the
	// WebPage node by SEO). The `@id` is the one bylines and the Event's
	// organiser list use too (#lib/utils/structured-data.ts), so all three are
	// one person in the graph. ORCID goes in `sameAs` as a URL — the form
	// Google and ORCID's own guidance expect — where a bare `identifier`
	// string was an unlabelled number.
	const personSchema = $derived({
		'@type': 'Person',
		'@id': personId(siteConfig.url, person.id),
		name: person.name,
		url: localizedAbsoluteUrl(siteConfig.url, canonicalPath, getLocale()),
		affiliation: { '@type': 'Organization', name: t(person.affiliation) },
		...(person.image ? { image: `${siteConfig.url}${person.image}` } : {}),
		...(bio ? { description } : {}),
		...(person.orcid
			? {
					identifier: {
						'@type': 'PropertyValue',
						propertyID: 'ORCID',
						value: person.orcid
					}
				}
			: {}),
		...(person.orcid || person.website
			? {
					sameAs: [
						...(person.orcid ? [`https://orcid.org/${person.orcid}`] : []),
						...(person.website ? [person.website] : [])
					]
				}
			: {})
	});

	const breadcrumbs = $derived(
		detailBreadcrumbs(
			siteConfig.url,
			getLocale(),
			m.nav_home(),
			{ name: m.nav_participants(), path: '/participants' },
			{ name: person.name, path: canonicalPath }
		)
	);
</script>

<SEO
	title={person.name}
	{description}
	pageType="ProfilePage"
	mainEntity={personSchema}
	additionalSchema={breadcrumbs}
/>

<PageHeader
	title={person.name}
	eyebrow={data.group === 'organizer'
		? m.section_organisers()
		: data.group === 'point-sud'
			? m.section_point_sud()
			: m.nav_participants()}
	subtitle={t(person.affiliation)}
	meta={[countryName(person.country, getLocale())]}
/>

<div class="page-end page-body">
	<div class="container-readable">
		<div class="mb-8">
			<a href={localePath('/participants')} class="link-arrow text-sm">
				<ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" />
				{m.participant_back()}
			</a>
		</div>

		<div class="block-flow">
			<div class="flex flex-col gap-8 sm:flex-row sm:items-start">
				<div class="flex flex-shrink-0 flex-col items-center gap-4 sm:items-start">
					<Avatar name={person.name} image={person.image} loading="eager" />
					<PersonLinks website={person.website} orcid={person.orcid} />
				</div>

				<div class="min-w-0 flex-1">
					{#if data.role}
						<p class="text-eyebrow mb-4">{t(data.role)}</p>
					{/if}
					{#if bio}
						<p class="text-prose" lang={bioLang}>{bio}</p>
					{/if}
				</div>
			</div>

			{#if presentationItems.length > 0}
				<section>
					<h2 class="text-eyebrow mb-5">
						{presentationItems.length === 1
							? m.participant_papers_label()
							: m.participant_papers_label_plural()}
					</h2>
					<ul class="space-y-4">
						{#each presentationItems as item (item.presentation.id)}
							{@const presentation = item.presentation}
							{@const placement = item.placement}
							<li>
								<a
									href={localePath(`/papers/${presentation.id}`)}
									class="card card-hover block p-5"
								>
									{#if placement}
										<span class="text-meta mb-2 block">
											{placement.sessionLabel} · {placement.slotLabel}
										</span>
									{/if}
									<span class="text-card-title text-strong block" lang={presentation.language}>
										{presentation.title}
									</span>
								</a>
								{#if placement}
									<a
										href="{localePath('/programme')}#{placement.anchor}"
										class="link-arrow mt-2 inline-flex text-sm"
									>
										{m.paper_in_programme()}
										<ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
									</a>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/if}
		</div>
	</div>
</div>
