<script lang="ts">
	import { venueClock } from '$lib/utils/venue-clock';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { unlocalizedPath } from '$lib/utils/localized-paths';
	import { readStorage, writeStorage } from '$lib/utils/storage';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import { localePath } from '$lib/utils/i18n';
	import { isCfpOpen } from '$lib/utils/milestones';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import { Menu, X, Sun, Moon } from '@lucide/svelte';

	let mobileMenuOpen = $state(false);
	let menuToggle: HTMLElement;
	let explicitTheme = false;
	let scrolled = $state(false);
	let darkMode = $state(
		typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
	);

	// Promote the action appropriate to the current workshop phase.
	const cfpOpen = $derived($venueClock.live && isCfpOpen($venueClock.now));

	const primaryAction = $derived(
		cfpOpen
			? { href: localePath('/call-for-papers'), label: m.nav_cfp() }
			: { href: localePath('/programme'), label: m.nav_programme() }
	);

	const navLinks = $derived(
		[
			{ href: localePath('/'), label: m.nav_home() },
			{ href: localePath('/about'), label: m.nav_about() },
			{ href: localePath('/programme'), label: m.nav_programme() },
			{ href: localePath('/participants'), label: m.nav_participants() },
			{ href: localePath('/papers'), label: m.nav_papers() },
			{ href: localePath('/venue'), label: m.nav_venue() },
			{ href: localePath('/call-for-papers'), label: m.nav_cfp() }
		].filter((link) => link.href !== primaryAction.href)
	);

	/** Every link, including the promoted one — the mobile menu keeps one list. */
	const allLinks = $derived([...navLinks, primaryAction]);

	function toggleDarkMode() {
		explicitTheme = true;
		darkMode = !darkMode;
		document.documentElement.classList.toggle('dark', darkMode);
		writeStorage('localStorage', 'theme', darkMode ? 'dark' : 'light');
	}

	$effect(() => {
		const query = window.matchMedia('(prefers-color-scheme: dark)');
		function applySystemPreference(event: MediaQueryListEvent) {
			if (explicitTheme || readStorage('localStorage', 'theme')) return;
			darkMode = event.matches;
			document.documentElement.classList.toggle('dark', event.matches);
		}
		query.addEventListener('change', applySystemPreference);
		return () => query.removeEventListener('change', applySystemPreference);
	});

	function dismissMenu(event: KeyboardEvent) {
		if (event.key !== 'Escape' || !mobileMenuOpen) return;
		mobileMenuOpen = false;
		menuToggle?.focus();
	}

	$effect(() => {
		const desktop = window.matchMedia('(min-width: 80rem)');
		const closeOnDesktop = () => {
			if (desktop.matches) mobileMenuOpen = false;
		};
		desktop.addEventListener('change', closeOnDesktop);
		return () => desktop.removeEventListener('change', closeOnDesktop);
	});

	function isActive(href: string): boolean {
		const path = unlocalizedPath(page.url.pathname, getLocale(), base);
		const target = unlocalizedPath(href, getLocale(), base);
		return path === target || (target !== '/' && path.startsWith(`${target}/`));
	}
</script>

<svelte:window onscroll={() => (scrolled = window.scrollY > 8)} onkeydown={dismissMenu} />

<header
	class="border-subtle fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md {mobileMenuOpen
		? 'bg-cream dark:bg-surface-900'
		: 'dark:bg-surface-900/85 bg-[color-mix(in_oklab,var(--color-cream)_88%,transparent)]'} {scrolled
		? 'shadow-md'
		: ''}"
	style="transition: box-shadow var(--duration-base) var(--ease-standard);"
>
	<div class="container-page">
		<div class="flex h-[calc(var(--nav-height)-1px)] items-center justify-between gap-4">
			<a href={localePath('/')} class="flex min-w-0 flex-col leading-none">
				<span class="text-link font-display text-xl tracking-tight"> DH &amp; AI </span>

				<span class="text-meta text-badge mt-1 line-clamp-3 tracking-[0.14em]">
					{m.brand_qualifier()}
				</span>
			</a>

			<nav class="hidden items-center gap-0.5 xl:flex" aria-label={m.nav_main_label()}>
				{#each navLinks as link (link.href)}
					<a
						href={link.href}
						aria-current={isActive(link.href) ? 'page' : undefined}
						class="relative px-3 py-2 text-sm {isActive(link.href)
							? 'text-link font-semibold'
							: 'text-muted hover:text-strong font-medium'}"
						style="transition: color var(--duration-fast) var(--ease-standard);"
					>
						{link.label}
						{#if isActive(link.href)}
							<span
								class="bg-secondary-500 absolute right-0 bottom-0 left-0 h-0.5 rounded-full"
								aria-hidden="true"
							></span>
						{/if}
					</a>
				{/each}
				<a
					href={primaryAction.href}
					aria-current={isActive(primaryAction.href) ? 'page' : undefined}
					class="btn btn-primary btn-sm ml-2"
				>
					{primaryAction.label}
				</a>
			</nav>

			<div class="flex items-center gap-1">
				<LanguageSwitcher />
				<button
					onclick={toggleDarkMode}
					class="btn-ghost theme-toggle"
					aria-label={m.dark_mode()}
					aria-pressed={darkMode}
				>
					{#if darkMode}
						<Sun size={18} />
					{:else}
						<Moon size={18} />
					{/if}
				</button>
				<details class="mobile-menu" bind:open={mobileMenuOpen}>
					<summary
						bind:this={menuToggle}
						class="btn-ghost"
						aria-label={m.nav_mobile_label()}
						aria-controls="mobile-navigation"
					>
						<Menu size={20} class="menu-open-icon" aria-hidden="true" />
						<X size={20} class="menu-close-icon" aria-hidden="true" />
					</summary>
					<nav id="mobile-navigation" aria-label={m.nav_mobile_label()}>
						<div class="container-page py-3">
							{#each allLinks as link (link.href)}
								<a
									href={link.href}
									onclick={() => (mobileMenuOpen = false)}
									aria-current={isActive(link.href) ? 'page' : undefined}
									class="block rounded-md px-3 py-3.5 text-sm {isActive(link.href)
										? 'text-link bg-sunken font-semibold'
										: 'text-muted hover:text-strong font-medium'}">{link.label}</a
								>
							{/each}
						</div>
					</nav>
				</details>
			</div>
		</div>
	</div>
</header>

<style>
	.mobile-menu summary {
		list-style: none;
		cursor: pointer;
	}
	.mobile-menu summary::-webkit-details-marker {
		display: none;
	}
	.mobile-menu :global(.menu-close-icon),
	.mobile-menu[open] :global(.menu-open-icon) {
		display: none;
	}
	.mobile-menu[open] :global(.menu-close-icon) {
		display: block;
	}
	#mobile-navigation {
		position: fixed;
		top: var(--nav-height);
		inset-inline: 0;
		max-height: calc(100dvh - var(--nav-height));
		overflow-y: auto;
		overscroll-behavior: contain;
		background: var(--surface-page);
		border-bottom: 1px solid var(--border-subtle);
		box-shadow: var(--shadow-md);
	}
	:global(.no-js) .theme-toggle {
		display: none;
	}
	@media (min-width: 80rem) {
		.mobile-menu {
			display: none;
		}
	}
</style>
