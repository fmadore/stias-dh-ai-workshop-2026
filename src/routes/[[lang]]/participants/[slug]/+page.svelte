<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import { t, localePath } from '$lib/utils/i18n';
	import { siteConfig } from '$lib/data/site-config';
	import SEO from '$lib/components/SEO.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import Avatar from '$lib/components/shared/Avatar.svelte';
	import PersonLinks from '$lib/components/shared/PersonLinks.svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { countryName } from '$lib/utils/country';
	import { localizedAbsoluteUrl } from '$lib/utils/localized-paths';

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

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: person.name,
		affiliation: { '@type': 'Organization', name: t(person.affiliation) },
		url: localizedAbsoluteUrl(siteConfig.url, canonicalPath, getLocale()),
		...(person.orcid ? { identifier: person.orcid } : {}),
		...(person.website ? { sameAs: [person.website] } : {})
	});

	function placementLabel(placement: (typeof presentationItems)[number]['placement']): string {
		if (!placement) return '';
		const sessionLabel =
			placement.sessionType === 'panel'
				? `${m.session_panel()} ${placement.panelNumber}`
				: placement.sessionType === 'keynote'
					? m.session_keynote()
					: placement.sessionType === 'discussion'
						? m.session_discussion()
						: placement.sessionType === 'plenary'
							? m.session_plenary()
							: placement.sessionType === 'social'
								? m.session_social()
								: m.session_break();
		const day = new Date(`${placement.date}T12:00:00Z`).toLocaleDateString(
			getLocale() === 'fr' ? 'fr-FR' : 'en-GB',
			{ weekday: 'short', day: 'numeric', timeZone: 'UTC' }
		);
		return `${sessionLabel} · ${day} · ${placement.time.split(/[–—-]/)[0].trim()}`;
	}
</script>

<SEO
	title="{person.name} | {siteConfig.shortTitle}"
	description={bio || `${person.name} — ${t(person.affiliation)}`}
	{canonicalPath}
	additionalSchema={schema}
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
											{placementLabel(placement)}
										</span>
									{/if}
									<span class="text-card-title text-strong block" lang={presentation.language}>
										{presentation.title}
									</span>
								</a>
								{#if placement}
									<a
										href="{localePath('/programme')}#session-{placement.sessionId}"
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
