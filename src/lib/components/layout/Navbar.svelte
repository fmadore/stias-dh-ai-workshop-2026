<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { getLocale, baseLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import { localePath } from '$lib/utils/i18n';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import { Menu, X, Sun, Moon } from 'lucide-svelte';

	let mobileMenuOpen = $state(false);
	let darkMode = $state(
		typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
	);

	const navLinks = $derived([
		{ href: localePath('/'), label: m.nav_home() },
		{ href: localePath('/about'), label: m.nav_about() },
		{ href: localePath('/programme'), label: m.nav_programme() },
		{ href: localePath('/participants'), label: m.nav_participants() },
		{ href: localePath('/venue'), label: m.nav_venue() },
		{ href: localePath('/call-for-papers'), label: m.nav_cfp() }
	]);

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

<header
	class="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-surface-900/90 backdrop-blur-md border-b border-surface-200/60 dark:border-surface-700/60"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-18">
			<!-- Logo / Title -->
			<a
				href={localePath('/')}
				class="flex items-center gap-2 text-primary-700 dark:text-primary-400 text-xl tracking-tight font-serif"
			>
				DH & AI <span
					class="text-surface-400 dark:text-surface-500 font-sans text-sm font-light tracking-wider uppercase"
					>African Studies</span
				>
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden md:flex items-center gap-1" aria-label="Main navigation">
				{#each navLinks as link}
					<a
						href={link.href}
						class="relative px-3 py-2 text-sm font-medium transition-colors {isActive(link.href)
							? 'text-primary-600 dark:text-primary-400'
							: 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'}"
					>
						{link.label}
						{#if isActive(link.href)}
							<span class="absolute bottom-0 left-3 right-3 h-0.5 bg-secondary-400 rounded-full"
							></span>
						{/if}
					</a>
				{/each}
			</nav>

			<!-- Right side: Language + Dark mode + Mobile toggle -->
			<div class="flex items-center gap-1">
				<LanguageSwitcher />
				<button
					onclick={toggleDarkMode}
					class="p-2 rounded-full text-surface-400 dark:text-surface-500 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
					aria-label={m.dark_mode()}
				>
					{#if darkMode}
						<Sun size={18} />
					{:else}
						<Moon size={18} />
					{/if}
				</button>
				<button
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					class="md:hidden p-2 rounded-full text-surface-400 dark:text-surface-500 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
					aria-label={mobileMenuOpen ? m.menu_close() : m.menu_open()}
				>
					{#if mobileMenuOpen}
						<X size={20} />
					{:else}
						<Menu size={20} />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Navigation with smooth transition -->
		<nav
			class="md:hidden overflow-hidden transition-all duration-300 ease-in-out {mobileMenuOpen
				? 'max-h-96 opacity-100 pb-4'
				: 'max-h-0 opacity-0'}"
			aria-label="Mobile navigation"
		>
			<div class="border-t border-surface-200/60 dark:border-surface-700/60 pt-3">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={() => (mobileMenuOpen = false)}
						class="block px-3 py-2.5 text-sm font-medium transition-colors {isActive(link.href)
							? 'text-primary-600 dark:text-primary-400 border-l-2 border-secondary-400 pl-4'
							: 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'}"
					>
						{link.label}
					</a>
				{/each}
			</div>
		</nav>
	</div>
</header>
