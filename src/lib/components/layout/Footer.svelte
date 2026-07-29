<script lang="ts">
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import { organizers } from '$lib/data/organizers';
	import { sponsors } from '$lib/data/sponsors';
	import { siteConfig } from '$lib/data/site-config';
	import { localePath } from '$lib/utils/i18n';
	import { getMilestones } from '$lib/utils/milestones';

	// The footer used to be logos and a copyright line, so every route out of
	// a page depended on the navbar and the sponsor row read as terminal.
	const columns = $derived([
		{
			heading: m.footer_workshop(),
			links: [
				{ href: localePath('/about'), label: m.nav_about() },
				{ href: localePath('/programme'), label: m.nav_programme() },
				{ href: localePath('/papers'), label: m.nav_papers() }
			]
		},
		{
			heading: m.footer_take_part(),
			links: [
				{ href: localePath('/call-for-papers'), label: m.nav_cfp() },
				{ href: localePath('/participants'), label: m.nav_participants() },
				{ href: localePath('/venue'), label: m.nav_venue() }
			]
		}
	]);

	const milestones = $derived(getMilestones());
</script>

<footer class="bg-primary-900 dark:bg-surface-950 relative mt-auto overflow-hidden text-white">
	<div class="grain absolute inset-0"></div>

	<div class="container-page relative z-10 py-14">
		<div class="grid grid-cols-2 gap-x-8 gap-y-10 pb-10 md:grid-cols-4">
			<div class="col-span-2 md:col-span-1">
				<p class="font-display mb-2 text-lg leading-snug text-white">
					{siteConfig.shortTitle}
				</p>
				<p class="text-primary-200/60 text-sm leading-relaxed">
					{m.hero_dates()}<br />{m.hero_location()}
				</p>
			</div>

			{#each columns as column (column.heading)}
				<nav aria-label={column.heading}>
					<h2 class="text-secondary-300 text-badge mb-3 font-semibold tracking-[0.16em] uppercase">
						{column.heading}
					</h2>
					<ul class="space-y-2">
						{#each column.links as link (link.href)}
							<li>
								<a
									href={link.href}
									class="text-primary-200/75 text-caption hover:text-white"
									style="transition: color var(--duration-fast) var(--ease-standard);"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			{/each}

			<div>
				<h2 class="text-secondary-300 text-badge mb-3 font-semibold tracking-[0.16em] uppercase">
					{m.key_dates()}
				</h2>
				<ul class="space-y-2">
					{#each milestones as milestone (milestone.id)}
						<li
							class="text-caption {milestone.past ? 'text-primary-200/40' : 'text-primary-200/75'}"
						>
							<span class="block">{milestone.label}</span>
							<time datetime={milestone.datetime} class="text-primary-200/50">
								{milestone.value}
							</time>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="border-primary-800/60 dark:border-surface-800 border-t pt-10">
			<p
				class="text-primary-200/70 mb-8 text-center font-sans text-xs font-medium tracking-[0.18em] uppercase"
			>
				{m.footer_supported_by()}
			</p>
			<div class="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
				{#each sponsors as sponsor (sponsor.id)}
					<a
						href={sponsor.url}
						target="_blank"
						rel="noopener noreferrer"
						class="bg-paper rounded-md px-4 py-2 opacity-75 transition-opacity duration-300 ease-out hover:opacity-100"
					>
						<img
							src="{base}{sponsor.logo}"
							alt={sponsor.name}
							class="h-10 w-auto object-contain"
							loading="lazy"
							decoding="async"
						/>
					</a>
				{/each}
			</div>
		</div>

		<div class="border-primary-800/60 dark:border-surface-800 mt-10 border-t pt-8 text-center">
			<p class="text-primary-200/60 dark:text-surface-500 text-sm font-light">
				&copy; {new Date().getFullYear()}
				{organizers.map((o) => o.name).join(', ')}. {m.footer_rights()}
			</p>
		</div>
	</div>
</footer>
