<script lang="ts">
	import { page } from '$app/state';
	import { base } from '#lib/utils/base-path.ts';
	import * as m from '#lib/paraglide/messages.js';
	import { localePath } from '#lib/utils/i18n.ts';
	import { contactEmails } from '#lib/data/contacts.ts';
	import { organizerRefs } from '#lib/data/organizer-refs.ts';

	type Destination =
		'about' | 'programme' | 'papers' | 'participants' | 'venue' | 'cfp' | 'resources' | 'contact';

	// Six of eight routes used to end at a thin rule and the sponsor wall, so
	// every route out of a page depended on the navbar. Two onward links and a
	// way to reach the convenors cost nothing.
	//
	// Resources leads from the home page, the programme and the papers: a
	// reader who has just seen what was scheduled and submitted is a click from
	// what came out of the four days themselves — the slides and the writing.
	const ROUTE_EXITS: Record<string, Destination[]> = {
		'/[[lang]]': ['resources', 'about', 'contact'],
		'/[[lang]]/about': ['programme', 'papers', 'contact'],
		'/[[lang]]/programme': ['resources', 'papers', 'contact'],
		'/[[lang]]/papers': ['resources', 'programme', 'contact'],
		'/[[lang]]/papers/[slug]': ['programme', 'papers', 'contact'],
		'/[[lang]]/participants': ['papers', 'programme', 'contact'],
		'/[[lang]]/venue': ['programme', 'participants', 'contact'],
		'/[[lang]]/call-for-papers': ['papers', 'programme', 'contact'],
		'/[[lang]]/resources': ['papers', 'programme', 'contact']
	};

	const DEFAULT_EXITS: Destination[] = ['about', 'programme', 'contact'];

	// A mailto rather than a contact page nobody would maintain. Every convenor
	// is on the one address list, so a participant writes once instead of
	// choosing which of four people their question belongs to.
	const convenorMailto = organizerRefs
		.map((organizer) => contactEmails[organizer.id])
		.filter(Boolean)
		.join(',');

	function describe(destination: Destination) {
		switch (destination) {
			case 'about':
				return { href: localePath('/about'), title: m.nav_about(), desc: m.next_about_desc() };
			case 'programme':
				return {
					href: localePath('/programme'),
					title: m.nav_programme(),
					desc: m.next_programme_desc()
				};
			case 'papers':
				return { href: localePath('/papers'), title: m.nav_papers(), desc: m.next_papers_desc() };
			case 'participants':
				return {
					href: localePath('/participants'),
					title: m.nav_participants(),
					desc: m.next_participants_desc()
				};
			case 'venue':
				return { href: localePath('/venue'), title: m.nav_venue(), desc: m.next_venue_desc() };
			case 'cfp':
				return {
					href: localePath('/call-for-papers'),
					title: m.nav_cfp(),
					desc: m.next_cfp_desc()
				};
			case 'resources':
				return {
					href: localePath('/resources'),
					title: m.nav_resources(),
					desc: m.next_resources_desc()
				};
			case 'contact':
				return {
					href: `mailto:${convenorMailto}`,
					title: m.next_contact_title(),
					desc: m.next_contact_desc()
				};
		}
	}

	const routeId = $derived(page.route.id ?? '');
	const exits = $derived((ROUTE_EXITS[routeId] ?? DEFAULT_EXITS).map(describe));

	const labels = $derived([m.next_label_next(), m.next_label_also(), m.next_label_contact()]);

	// Prevent an infinite "Programme → Programme" loop if a route ever maps to
	// its own destination.
	const currentPath = $derived(page.url.pathname.replace(base, '') || '/');
</script>

<section class="page-exits bg-cream-dark border-subtle border-t" aria-labelledby="whats-next">
	<div class="container-page section-pad">
		<h2 id="whats-next" class="text-eyebrow mb-8">{m.whats_next()}</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each exits as exit, i (exit.href)}
				{#if exit.href.replace(base, '') !== currentPath}
					<a
						href={exit.href}
						class="card card-hover group block p-6 {i === 0 ? 'border-t-accent border-t-2' : ''}"
					>
						<span class="{i === 0 ? 'text-eyebrow' : 'text-meta'} mb-3 block">{labels[i]}</span>
						<span class="text-card-title text-strong mb-1.5 block">{exit.title}</span>
						<span class="text-muted text-caption block leading-snug">{exit.desc}</span>
					</a>
				{/if}
			{/each}
		</div>
	</div>
</section>
