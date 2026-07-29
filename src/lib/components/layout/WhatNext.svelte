<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import { localePath } from '$lib/utils/i18n';
	import { contactEmails } from '$lib/data/contacts';
	import { organizers } from '$lib/data/organizers';

	type Destination =
		'about' | 'programme' | 'papers' | 'participants' | 'venue' | 'cfp' | 'contact';

	// Six of eight routes used to end at a thin rule and the sponsor wall, so
	// every route out of a page depended on the navbar. Two onward links and a
	// way to reach the convenors cost nothing.
	const ROUTE_EXITS: Record<string, Destination[]> = {
		'/[[lang]]': ['about', 'programme', 'contact'],
		'/[[lang]]/about': ['programme', 'papers', 'contact'],
		'/[[lang]]/programme': ['papers', 'participants', 'contact'],
		'/[[lang]]/papers': ['programme', 'participants', 'contact'],
		'/[[lang]]/papers/[slug]': ['programme', 'papers', 'contact'],
		'/[[lang]]/participants': ['papers', 'programme', 'contact'],
		'/[[lang]]/venue': ['programme', 'participants', 'contact'],
		'/[[lang]]/call-for-papers': ['papers', 'programme', 'contact']
	};

	const DEFAULT_EXITS: Destination[] = ['about', 'programme', 'contact'];

	// Four addresses, already in contacts.ts — mailto rather than a contact
	// page nobody would maintain.
	const convenorMailto = organizers
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

<section class="bg-cream-dark border-subtle border-t" aria-labelledby="whats-next">
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
