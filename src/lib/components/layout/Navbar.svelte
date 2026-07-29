<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import { localePath } from '$lib/utils/i18n';
	import { isCfpOpen } from '$lib/utils/milestones';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import { Menu, X, Sun, Moon } from '@lucide/svelte';

	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);
	let darkMode = $state(
		typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
	);

	// Seven equal links and no primary. The last one is promoted to a filled
	// button — the call while it is open, the programme once it has closed —
	// which also relieves the lg crowding that pushed the hamburger to 1024px.
	const cfpOpen = $derived(isCfpOpen());

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
		darkMode = !darkMode;
		if (darkMode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}

	function isActive(href: string): boolean {
		const pathname = page.url.pathname;
		const pathWithoutBase = pathname.replace(base, '') || '/';
		const hrefWithoutBase = href.replace(base, '') || '/';
		if (hrefWithoutBase === '/') {
			const locale = getLocale();
			return pathWithoutBase === '/' || pathWithoutBase === `/${locale}` || pathWithoutBase === '';
		}
		return pathWithoutBase.startsWith(hrefWithoutBase);
	}
</script>

<!-- Over the cream page an 88%-opacity blur is almost undetectable, so content
     slid under an invisible edge. A hairline shadow appears once scrolled. -->
<svelte:window onscroll={() => (scrolled = window.scrollY > 8)} />

<!-- The header goes fully opaque while the mobile menu is open so page
     content doesn't bleed through the link list. -->
<header
	class="border-subtle fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md {mobileMenuOpen
		? 'bg-cream dark:bg-surface-900'
		: 'dark:bg-surface-900/85 bg-[color-mix(in_oklab,var(--color-cream)_88%,transparent)]'} {scrolled
		? 'shadow-md'
		: ''}"
	style="transition: box-shadow var(--duration-base) var(--ease-standard);"
>
	<div class="container-page">
		<div class="flex h-[var(--nav-height)] items-center justify-between gap-4">
			<!-- Two stacked lines, so the qualifier is present at every width
			     instead of appearing only at xl. "DH & AI" alone is cryptic. -->
			<a href={localePath('/')} class="flex min-w-0 flex-col leading-none">
				<span class="text-primary-700 dark:text-primary-300 font-display text-xl tracking-tight">
					DH &amp; AI
				</span>
				<span class="text-meta mt-1 truncate text-[0.625rem] tracking-[0.14em]">
					{m.brand_qualifier()}
				</span>
			</a>

			<!-- Desktop navigation (lg and up — the French labels don't fit at md) -->
			<nav class="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
				{#each navLinks as link (link.href)}
					<a
						href={link.href}
						aria-current={isActive(link.href) ? 'page' : undefined}
						class="relative px-3 py-2 text-sm {isActive(link.href)
							? 'text-primary-700 dark:text-primary-300 font-semibold'
							: 'text-muted hover:text-strong font-medium'}"
						style="transition: color var(--duration-fast) var(--ease-standard);"
					>
						{link.label}
						{#if isActive(link.href)}
							<!-- 2px, full item width, paired with the weight bump: a 1px
							     inset hairline on cream behind a blur disappeared. -->
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

			<!-- Right side: Language + Dark mode + Mobile toggle -->
			<div class="flex items-center gap-1">
				<LanguageSwitcher />
				<button
					onclick={toggleDarkMode}
					class="btn-ghost"
					aria-label={m.dark_mode()}
					aria-pressed={darkMode}
				>
					{#if darkMode}
						<Sun size={18} />
					{:else}
						<Moon size={18} />
					{/if}
				</button>
				<button
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					class="btn-ghost lg:hidden"
					aria-label={mobileMenuOpen ? m.menu_close() : m.menu_open()}
					aria-expanded={mobileMenuOpen}
					aria-controls="mobile-navigation"
				>
					{#if mobileMenuOpen}
						<X size={20} />
					{:else}
						<Menu size={20} />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Navigation. `inert` removes the collapsed menu from the tab
		     order and accessibility tree — with only max-height:0 its links
		     would remain keyboard-focusable while invisible. -->
		<nav
			id="mobile-navigation"
			class="overflow-hidden lg:hidden {mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'}"
			style="transition: max-height var(--duration-slow) var(--ease-standard);"
			aria-label="Mobile navigation"
			inert={!mobileMenuOpen}
		>
			<div class="border-subtle border-t pt-3">
				{#each allLinks as link (link.href)}
					<a
						href={link.href}
						onclick={() => (mobileMenuOpen = false)}
						aria-current={isActive(link.href) ? 'page' : undefined}
						class="block px-3 py-2.5 text-sm {isActive(link.href)
							? 'text-primary-700 dark:text-primary-300 border-secondary-500 border-l-2 pl-4 font-semibold'
							: 'text-muted hover:text-strong font-medium'}"
					>
						{link.label}
					</a>
				{/each}
			</div>
		</nav>
	</div>
</header>
