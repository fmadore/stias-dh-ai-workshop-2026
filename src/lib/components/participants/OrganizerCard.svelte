<script lang="ts">
	import type { Organizer } from '$lib/types';
	import { t } from '$lib/utils/i18n';
	import Avatar from '$lib/components/shared/Avatar.svelte';
	import PersonLinks from '$lib/components/shared/PersonLinks.svelte';

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
				<h3 class="text-card-title text-ink dark:text-surface-50">{organizer.name}</h3>
				<p class="text-primary-700 dark:text-primary-300 mt-1 text-sm font-medium">
					{t(organizer.role)}
				</p>
				<p class="text-ink-muted dark:text-surface-400 mb-4 text-sm">
					{t(organizer.affiliation)}
				</p>

				<span class="bg-secondary-500/50 mx-auto mb-4 block h-px w-8 sm:mx-0" aria-hidden="true"
				></span>

				<p class="text-bio text-ink-muted dark:text-surface-300 mb-4">
					{t(organizer.bio)}
				</p>

				<PersonLinks website={organizer.website} orcid={organizer.orcid} />
			</div>
		</div>
	</div>
</article>
