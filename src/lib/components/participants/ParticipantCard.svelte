<script lang="ts">
	import type { Participant } from '$lib/types';
	import { t, localePath } from '$lib/utils/i18n';
	import * as m from '$lib/paraglide/messages';
	import { base } from '$app/paths';
	import { ExternalLink } from '@lucide/svelte';
	import { getParticipantPresentations } from '$lib/data/presentations';

	let { participant }: { participant: Participant } = $props();

	const presentations = $derived(getParticipantPresentations(participant));

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<article class="card overflow-hidden">
	<div class="p-6 sm:p-7">
		<div class="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
			<div class="flex-shrink-0">
				<div
					class="bg-primary-500/8 ring-surface-200/50 dark:ring-surface-700/50 flex h-24 w-24 items-center justify-center overflow-hidden rounded-[var(--radius-xl)] ring-1 sm:h-28 sm:w-28"
				>
					{#if participant.image}
						<img
							src="{base}{participant.image}"
							alt={participant.name}
							class="h-full w-full object-cover"
							onerror={(e) => {
								const target = e.currentTarget as HTMLImageElement;
								target.style.display = 'none';
								target.nextElementSibling?.classList.remove('hidden');
							}}
						/>
						<span class="text-primary-600 font-display hidden text-2xl">
							{getInitials(participant.name)}
						</span>
					{:else}
						<span class="text-primary-600 font-display text-2xl">
							{getInitials(participant.name)}
						</span>
					{/if}
				</div>
			</div>

			<div class="flex-1 text-center sm:text-left">
				<h3 class="text-card-title text-ink dark:text-surface-50">{participant.name}</h3>
				{#each presentations as p}
					<p class="mt-1 text-sm font-medium italic">
						<a href={localePath(`/papers/${p.id}`)} class="paper-link">
							{p.language === 'fr' ? '« ' : '“'}{p.title}{p.language === 'fr' ? ' »' : '”'}
						</a>
					</p>
				{/each}
				<p class="text-ink-muted dark:text-surface-400 mb-4 text-sm">
					{t(participant.affiliation)}
				</p>

				{#if participant.bio}
					<span class="bg-secondary-500/50 mx-auto mb-4 block h-px w-8 sm:mx-0" aria-hidden="true"
					></span>

					<p
						class="text-ink-muted dark:text-surface-300 mb-4 text-[0.9375rem] leading-relaxed font-light"
					>
						{participant.bio}
					</p>
				{/if}

				{#if participant.website || participant.orcid}
					<div class="flex items-center justify-center gap-4 sm:justify-start">
						{#if participant.website}
							<a
								href={participant.website}
								target="_blank"
								rel="noopener noreferrer"
								class="link-arrow text-sm"
							>
								<ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
								{m.visit_website()}
							</a>
						{/if}
						{#if participant.orcid}
							<a
								href="https://orcid.org/{participant.orcid}"
								target="_blank"
								rel="noopener noreferrer"
								class="text-orcid hover:text-orcid-hover inline-flex items-center gap-1 text-sm transition-colors duration-[var(--duration-fast)]"
								title={m.view_orcid()}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 256 256"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zM86.3 186.2H70.9V79.1h15.4v107.1zm-8.8-121c-5.6 0-10.2-4.6-10.2-10.2s4.6-10.2 10.2-10.2c5.6 0 10.2 4.6 10.2 10.2s-4.6 10.2-10.2 10.2zM128.4 79.1h36.1c34.8 0 50 24.9 50 53.5 0 31.1-19.1 53.5-49.9 53.5h-36.2V79.1zm15.4 92.3h18.3c23.5 0 36.1-14.1 36.1-38.8 0-20.8-12.1-38.8-36.1-38.8h-18.3v77.6z"
									/>
								</svg>
								ORCID
							</a>
						{/if}
					</div>
				{/if}
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
