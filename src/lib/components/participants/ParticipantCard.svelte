<script lang="ts">
	import type { Participant } from '$lib/types';
	import { t, localePath } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { getParticipantPresentations } from '$lib/data/presentations';
	import Avatar from '$lib/components/shared/Avatar.svelte';
	import PersonLinks from '$lib/components/shared/PersonLinks.svelte';

	let { participant }: { participant: Participant } = $props();

	const presentations = $derived(getParticipantPresentations(participant));

	const bio = $derived(participant.bio ? t(participant.bio) : '');
	// Long bios collapse to a few lines with a toggle so the page stays scannable.
	const isLongBio = $derived(bio.length > 480);
	let expanded = $state(false);
</script>

<article class="card overflow-hidden">
	<div class="p-6 sm:p-7">
		<div class="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
			<div class="flex-shrink-0">
				<Avatar name={participant.name} image={participant.image} />
			</div>

			<div class="flex-1 text-center sm:text-left">
				<h3 class="text-card-title text-ink dark:text-surface-50">{participant.name}</h3>
				{#each presentations as p (p.id)}
					<p class="mt-1 text-sm font-medium italic">
						<a href={localePath(`/papers/${p.id}`)} class="paper-link" lang={p.language}>
							{p.language === 'fr' ? '« ' : '“'}{p.title}{p.language === 'fr' ? ' »' : '”'}
						</a>
					</p>
				{/each}
				<p class="text-ink-muted dark:text-surface-400 mb-4 text-sm">
					{t(participant.affiliation)}
				</p>

				{#if bio}
					<span class="bg-secondary-500/50 mx-auto mb-4 block h-px w-8 sm:mx-0" aria-hidden="true"
					></span>

					<p
						class="text-bio text-ink-muted dark:text-surface-300 mb-2"
						class:line-clamp-4={isLongBio && !expanded}
					>
						{bio}
					</p>
					{#if isLongBio}
						<button
							type="button"
							class="text-primary-700 dark:text-primary-300 hover:text-primary-500 mb-4 cursor-pointer text-sm font-medium"
							aria-expanded={expanded}
							onclick={() => (expanded = !expanded)}
						>
							{expanded ? m.show_less() : m.read_more()}
						</button>
					{/if}
				{/if}

				<PersonLinks website={participant.website} orcid={participant.orcid} />
			</div>
		</div>
	</div>
</article>

<style>
	.paper-link {
		color: var(--color-primary-700);
		background-image: linear-gradient(currentColor, currentColor);
		background-position: 0 100%;
		background-repeat: no-repeat;
		background-size: 0% 1px;
		transition:
			color var(--duration-fast) var(--ease-standard),
			background-size var(--duration-base) var(--ease-standard);
	}

	:global(.dark) .paper-link {
		color: var(--color-primary-300);
	}

	.paper-link:hover {
		background-size: 100% 1px;
		color: var(--color-primary-600);
	}

	:global(.dark) .paper-link:hover {
		color: var(--color-primary-200);
	}
</style>
