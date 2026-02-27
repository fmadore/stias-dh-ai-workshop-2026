<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import { Menu, X, Sun, Moon } from 'lucide-svelte';

	let mobileMenuOpen = $state(false);
	let darkMode = $state(false);

	const navLinks = $derived([
		{ href: `${base}/`, label: m.nav_home() },
		{ href: `${base}/about`, label: m.nav_about() },
		{ href: `${base}/programme`, label: m.nav_programme() },
		{ href: `${base}/participants`, label: m.nav_participants() },
		{ href: `${base}/venue`, label: m.nav_venue() },
		{ href: `${base}/call-for-papers`, label: m.nav_cfp() }
	]);

	function toggleDarkMode() {
		darkMode = !darkMode;
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	function isActive(href: string): boolean {
		const pathname = page.url.pathname;
		if (href.endsWith('/') && !href.includes('/about') && !href.includes('/programme')) {
			return pathname === href || pathname === href.slice(0, -1);
		}
		return pathname.startsWith(href);
	}
</script>

<header class="fixed top-0 left-0 right-0 z-50 bg-surface-50/90 dark:bg-surface-900/90 backdrop-blur-sm border-b border-surface-200 dark:border-surface-700">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<!-- Logo / Title -->
			<a href="{base}/" class="flex items-center gap-2 font-bold text-primary-500 text-lg">
				DH+AI
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden md:flex items-center gap-1" aria-label="Main navigation">
				{#each navLinks as link}
					<a
						href={link.href}
						class="px-3 py-2 text-sm font-medium rounded-md transition-colors {isActive(link.href)
							? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
							: 'text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'}"
					>
						{link.label}
					</a>
				{/each}
			</nav>

			<!-- Right side: Language + Dark mode + Mobile toggle -->
			<div class="flex items-center gap-2">
				<LanguageSwitcher />
				<button
					onclick={toggleDarkMode}
					class="p-2 rounded-md text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
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
					class="md:hidden p-2 rounded-md text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
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

		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<nav class="md:hidden pb-4 border-t border-surface-200 dark:border-surface-700 pt-2" aria-label="Mobile navigation">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={() => (mobileMenuOpen = false)}
						class="block px-3 py-2 text-sm font-medium rounded-md transition-colors {isActive(link.href)
							? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
							: 'text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'}"
					>
						{link.label}
					</a>
				{/each}
			</nav>
		{/if}
	</div>
</header>
