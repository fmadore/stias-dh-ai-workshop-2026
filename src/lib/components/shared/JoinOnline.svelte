<script lang="ts">
	import { venueClock } from '$lib/utils/venue-clock';
	import * as m from '$lib/paraglide/messages';
	import { onlineAccess, onlineAccessPublished } from '$lib/data/online-access';
	import { workshopPhase } from '$lib/utils/milestones';
	import { ExternalLink, Video } from '@lucide/svelte';

	interface Props {
		/**
		 * `band` is the home page's full-width section; `callout` sits inside a
		 * page body, on the programme; `inline` is a single link line for prose
		 * that has already said the workshop is hybrid.
		 */
		variant?: 'band' | 'callout' | 'inline';
	}

	let { variant = 'band' }: Props = $props();

	// Prerendered output makes no live claim, so the static HTML always carries
	// the invitation. Once the clock is live it withdraws the moment the
	// workshop closes, rather than inviting people into a meeting that ended.
	const show = $derived(!$venueClock.live || workshopPhase($venueClock.now) !== 'after');

	const joinLabel = $derived(m.online_join({ platform: onlineAccess.platform }));
</script>

<!-- The join control and whatever qualifies it. One snippet, so the three
     variants cannot drift on the only thing a reader came for. -->
{#snippet joinAction(size: 'md' | 'sm')}
	{#if onlineAccessPublished}
		<a
			href={onlineAccess.joinUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="btn btn-primary {size === 'sm' ? 'btn-sm' : ''}"
		>
			<Video size={size === 'sm' ? 15 : 16} strokeWidth={1.75} aria-hidden="true" />
			{joinLabel}
			<ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
		</a>
		{#if onlineAccess.meetingId || onlineAccess.passcode}
			<p class="text-muted text-caption">
				{#if onlineAccess.meetingId}
					<span class="tabular-nums">{m.online_meeting_id({ id: onlineAccess.meetingId })}</span>
				{/if}
				{#if onlineAccess.meetingId && onlineAccess.passcode}
					<span aria-hidden="true">·</span>
				{/if}
				{#if onlineAccess.passcode}
					<span class="tabular-nums">{m.online_passcode({ code: onlineAccess.passcode })}</span>
				{/if}
			</p>
		{/if}
	{:else}
		<!-- No disabled button standing in for a link that does not exist yet:
		     a control that cannot be pressed is a worse promise than a sentence. -->
		<p class="text-muted text-sm">{m.online_pending()}</p>
	{/if}
{/snippet}

{#if show}
	{#if variant === 'band'}
		<section class="join-band border-subtle border-b">
			<div class="container-page py-10 sm:py-12">
				<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
					<div class="max-w-2xl">
						<span class="text-eyebrow mb-3 inline-flex items-center gap-2">
							<Video size={14} strokeWidth={2} aria-hidden="true" />
							{m.online_eyebrow()}
						</span>
						<h2 class="text-section text-strong mb-2">
							{m.online_title({ platform: onlineAccess.platform })}
						</h2>
						<p class="text-body">{m.online_open_to_all()}</p>
					</div>
					<div class="flex flex-col items-start gap-2 md:shrink-0 md:items-end">
						{@render joinAction('md')}
						<p class="text-muted text-caption">{m.online_timezone()}</p>
					</div>
				</div>
			</div>
		</section>
	{:else if variant === 'callout'}
		<div class="callout">
			<Video
				size={18}
				strokeWidth={1.75}
				class="text-accent-ink mt-0.5 shrink-0"
				aria-hidden="true"
			/>
			<div class="flex flex-col items-start gap-3">
				<div>
					<p class="text-strong font-medium">
						{m.online_title({ platform: onlineAccess.platform })}
					</p>
					<p class="text-body text-sm">{m.online_open_to_all()}</p>
				</div>
				{@render joinAction('sm')}
			</div>
		</div>
	{:else if onlineAccessPublished}
		<a
			href={onlineAccess.joinUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="link-arrow text-sm"
		>
			<Video size={14} strokeWidth={1.75} aria-hidden="true" />
			{joinLabel}
		</a>
	{:else}
		<p class="text-muted text-sm">{m.online_pending()}</p>
	{/if}
{/if}

<style>
	/* The band sits directly under the dark hero and above the cream At a
	   glance. Paper white between the two read as a gap rather than a thing, so
	   it takes a wash of the brand teal over the raised surface — visible at a
	   glance, and not a second solid gold beside the hero's one. */
	.join-band {
		background-color: color-mix(in oklab, var(--color-primary-500) 8%, var(--surface-raised));
	}
	:global(.dark) .join-band {
		background-color: color-mix(in oklab, var(--color-primary-400) 12%, var(--surface-raised));
	}
</style>
