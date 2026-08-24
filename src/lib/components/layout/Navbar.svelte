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

	/**
	 * The boot script in app.html reads prefers-color-scheme once and never
	 * again, so a visitor who flips their system theme while the page is open —
	 * which is exactly what a scheduled light/dark switch does at dusk — sat on
	 * the old one until a reload. Follow the OS only while no explicit choice is
	 * stored: pressing the toggle writes `theme`, and that has to keep winning.
	 */
	$effect(() => {
		const query = window.matchMedia('(prefers-color-scheme: dark)');

		function applySystemPreference(event: MediaQueryListEvent) {
			if (localStorage.getItem('theme')) return;
			darkMode = event.matches;
			document.documentElement.classList.toggle('dark', event.matches);
		}

		query.addEventListener('change', applySystemPreference);
		return () => query.removeEventListener('change', applySystemPreference);
	});

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
		<!-- The inner row is --nav-height minus the header's own hairline, so the
		     header's outer height IS --nav-height. It was 73px against a 72px
		     token, which left main's padding and the programme's sticky day-bar
		     each 1px short of the thing they are derived from. -->
		<div class="flex h-[calc(var(--nav-height)-1px)] items-center justify-between gap-4">
			<!-- Two stacked lines, so the qualifier is present at every width
			     instead of appearing only at xl. "DH & AI" alone is cryptic. -->
			<a href={localePath('/')} class="flex min-w-0 flex-col leading-none">
				<span class="text-link font-display text-xl tracking-tight"> DH &amp; AI </span>
				<!-- Wraps rather than truncates. `truncate` clipped it below 414px in
				     English and 480px in French — every phone — and what it cut was
				     the year: "AFRICAN STUDIES · STIA…". It takes two lines from
				     375px down and three at 320px, where the column is 116px wide;
				     three lines of 11px plus the 20px brand still measure 57px inside
				     a 71px row, so --nav-height is untouched at every width. The clamp
				     is a guard against a future qualifier long enough to burst the
				     header, not something the current strings reach. -->
				<span class="text-meta text-badge mt-1 line-clamp-3 tracking-[0.14em]">
					{m.brand_qualifier()}
				</span>
			</a>

			<!-- Desktop navigation at xl and up. Measured: the row needs 1205px of
			     viewport in French and 1069px in English, against a container that
			     stops growing at 80rem. Below that the French labels wrap to two and
			     three lines ("Lieu & Accès", "Appel à contributions"), so lg was
			     181px too early. One breakpoint for both locales, set by the wider. -->
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
					class="btn-ghost xl:hidden"
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

		<!-- `inert` removes the collapsed disclosure from the tab order and
		     accessibility tree while the grid-row transition closes it. -->
		<div
			id="mobile-navigation"
			class="mobile-navigation"
			class:is-open={mobileMenuOpen}
			inert={!mobileMenuOpen}
		>
			<nav class="min-h-0 overflow-hidden" aria-label={m.nav_mobile_label()}>
				<!-- The rule and the top padding live INSIDE the clipped area. On the
				     outer element they are not part of its height, so the collapsed
				     menu still painted a 13px strip under the bar at every width. -->
				<div class="border-subtle border-t pt-3">
					{#each allLinks as link (link.href)}
						<a
							href={link.href}
							onclick={() => (mobileMenuOpen = false)}
							aria-current={isActive(link.href) ? 'page' : undefined}
							class="block px-3 py-3.5 text-sm {isActive(link.href)
								? 'text-link border-secondary-500 border-l-2 pl-4 font-semibold'
								: 'text-muted hover:text-strong font-medium'}"
						>
							{link.label}
						</a>
					{/each}
				</div>
			</nav>
		</div>
	</div>
</header>

<style>
	.mobile-navigation {
		display: grid;
		grid-template-rows: 0fr;
		transition:
			grid-template-rows var(--duration-slow) var(--ease-standard),
			padding-bottom var(--duration-slow) var(--ease-standard);
	}

	.mobile-navigation.is-open {
		grid-template-rows: 1fr;
		padding-bottom: 1rem;
	}

	/* Hidden here rather than with an `xl:hidden` utility. Svelte's scoped styles
	   are unlayered, and unlayered rules beat @layer utilities whatever their
	   specificity — so the `display: grid` above silently won and the disclosure
	   rendered at every width. Same trap app.css documents for its component
	   classes; a utility cannot override a rule in this block. */
	@media (min-width: 80rem) {
		.mobile-navigation {
			display: none;
		}
	}
</style>
