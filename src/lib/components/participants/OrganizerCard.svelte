<script lang="ts">
	import type { Organizer } from '$lib/types';
	import { t, localePath } from '$lib/utils/i18n';
	import Avatar from '$lib/components/shared/Avatar.svelte';
	import PersonLinks from '$lib/components/shared/PersonLinks.svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { countryName } from '$lib/utils/country';

	let { organizer }: { organizer: Organizer } = $props();
</script>

<!-- Full height, carried all the way down to the text column, so `mt-auto` on
     the link row has something to push against. The grid already stretches
     sibling cards to a common height; every level between the card and the
     links used to stop at its content, so the links floated wherever the bio
     happened to end and two cards in the same row sat 195px apart on their
     footers. `self-start` keeps the avatar its own size once the row stretches. -->
<article class="card flex h-full flex-col overflow-hidden">
	<div class="flex flex-1 flex-col p-6 sm:p-7">
		<div class="flex flex-1 flex-col items-center gap-5 sm:flex-row sm:items-stretch">
			<div class="flex-shrink-0 self-center sm:self-start">
				<!-- Organizers render at the top of the page, so load eagerly. -->
				<Avatar name={organizer.name} image={organizer.image} loading="eager" />
			</div>

			<!-- min-w-0: a flex child defaults to min-width:auto, so without this the
			     column refuses to shrink below its longest word and widens the card
			     instead. PointSudCard already carried it; this one did not. -->
			<div class="flex min-w-0 flex-1 flex-col text-center sm:text-left">
				<h3 class="text-card-title text-strong">
					<a href={localePath(`/participants/${organizer.id}`)} class="person-link">
						{organizer.name}
					</a>
				</h3>
				<p class="text-link mt-1 text-sm font-medium">
					{t(organizer.role)}
				</p>
				<p class="text-muted mb-4 text-sm">
					{t(organizer.affiliation)} · {countryName(organizer.country, getLocale())}
				</p>

				<span class="bg-secondary-500/50 mx-auto mb-4 block h-px w-8 sm:mx-0" aria-hidden="true"
				></span>

				<p class="text-bio mb-4">
					{t(organizer.bio)}
				</p>

				<div class="mt-auto">
					<PersonLinks website={organizer.website} orcid={organizer.orcid} />
				</div>
			</div>
		</div>
	</div>
</article>

<style>
	.person-link {
		color: inherit;
		transition: color var(--duration-fast) var(--ease-standard);
	}
	.person-link:hover {
		color: var(--color-primary-700);
	}
	:global(.dark) .person-link:hover {
		color: var(--color-primary-300);
	}
</style>
