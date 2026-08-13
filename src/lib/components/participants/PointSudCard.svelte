<script lang="ts">
	import type { PointSudRepresentative } from '$lib/types';
	import { t, localePath } from '$lib/utils/i18n';
	import AvatarSmall from '$lib/components/shared/AvatarSmall.svelte';
	import PersonLinks from '$lib/components/shared/PersonLinks.svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { countryName } from '$lib/utils/country';

	let { person }: { person: PointSudRepresentative } = $props();
</script>

<!--
	Between the convenors' editorial card and the participant grid: these two
	carry a role but no paper and, so far, no bio — so the card stays a single
	row of identifying lines rather than pretending to an empty prose column.
-->
<article class="card flex items-start gap-4 p-5">
	<div class="flex-shrink-0">
		<AvatarSmall name={person.name} image={person.image} />
	</div>

	<div class="min-w-0 flex-1">
		<h3 class="text-card-title text-strong leading-tight">
			<a href={localePath(`/participants/${person.id}`)} class="person-link">
				{person.name}
			</a>
		</h3>
		<p class="text-link mt-1 text-sm font-medium">
			{t(person.role)}
		</p>
		<p class="text-muted text-caption mt-0.5 leading-snug">
			{t(person.affiliation)} · {countryName(person.country, getLocale())}
		</p>
		{#if person.website || person.orcid}
			<div class="mt-3">
				<PersonLinks website={person.website} orcid={person.orcid} align="start" />
			</div>
		{/if}
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
