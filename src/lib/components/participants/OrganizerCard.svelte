<script lang="ts">
	import type { Organizer } from '$lib/types';
	import { t, localePath } from '$lib/utils/i18n';
	import Avatar from '$lib/components/shared/Avatar.svelte';
	import PersonLinks from '$lib/components/shared/PersonLinks.svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { countryName } from '$lib/utils/country';

	let { organizer }: { organizer: Organizer } = $props();
</script>

<article class="card overflow-hidden">
	<div class="p-6 sm:p-7">
		<div class="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
			<div class="flex-shrink-0">
				<!-- Organizers render at the top of the page, so load eagerly. -->
				<Avatar name={organizer.name} image={organizer.image} loading="eager" />
			</div>

			<div class="flex-1 text-center sm:text-left">
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

				<PersonLinks website={organizer.website} orcid={organizer.orcid} />
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
