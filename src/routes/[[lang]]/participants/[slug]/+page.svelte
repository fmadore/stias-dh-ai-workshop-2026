<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import { t, localePath } from '$lib/utils/i18n';
	import { siteConfig } from '$lib/data/site-config';
	import { getParticipantPresentations } from '$lib/data/presentations';
	import { getPlacements, sessionAnchor } from '$lib/utils/placement';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Avatar from '$lib/components/shared/Avatar.svelte';
	import PersonLinks from '$lib/components/shared/PersonLinks.svelte';

	let { data } = $props();

	const person = $derived(data.person);
	const bio = $derived(person.bio ? t(person.bio) : '');
	const presentations = $derived(getParticipantPresentations(person));
	const placements = $derived(getPlacements());
	const canonicalPath = $derived(`/participants/${person.id}`);

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: person.name,
		affiliation: { '@type': 'Organization', name: t(person.affiliation) },
		url: `${siteConfig.url}${canonicalPath}`,
		...(person.orcid ? { identifier: person.orcid } : {}),
		...(person.website ? { sameAs: [person.website] } : {})
	});
</script>

<SEO
	title="{person.name} | {siteConfig.shortTitle}"
	description={bio || `${person.name} — ${t(person.affiliation)}`}
	{canonicalPath}
	additionalSchema={schema}
/>

<PageHeader
	title={person.name}
	eyebrow={data.isOrganizer ? m.section_organisers() : m.nav_participants()}
	subtitle={t(person.affiliation)}
	meta={[person.country]}
/>

<div class="page-end pt-12">
	<div class="container-readable">
		<div class="mb-8">
			<a href={localePath('/participants')} class="link-arrow text-sm">
				<ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" />
				{m.participant_back()}
			</a>
		</div>

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
					<p class="text-prose">{bio}</p>
				{/if}
			</div>
		</div>

		{#if presentations.length > 0}
			<section class="mt-14">
				<h2 class="text-eyebrow mb-5">
					{presentations.length === 1
						? m.participant_papers_label()
						: m.participant_papers_label_plural()}
				</h2>
				<ul class="space-y-4">
					{#each presentations as presentation (presentation.id)}
						{@const placement = placements.get(presentation.id)}
						<li>
							<a href={localePath(`/papers/${presentation.id}`)} class="card card-hover block p-5">
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
									href="{localePath('/programme')}#{sessionAnchor(placement.session.id)}"
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
