<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import { localePath } from '$lib/utils/i18n';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import { Menu, X, Sun, Moon } from '@lucide/svelte';

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
	class="border-surface-200/60 dark:border-surface-700/60 dark:bg-surface-900/85 fixed top-0 right-0 left-0 z-50 border-b bg-[color-mix(in_oklab,var(--color-cream)_88%,transparent)] backdrop-blur-md"
>
	<div class="container-page">
		<div class="flex h-[4.5rem] items-center justify-between">
			<!-- Brand -->
			<a
				href={localePath('/')}
				class="text-primary-700 dark:text-primary-300 font-display flex items-center gap-2 text-xl tracking-tight"
			>
				DH &amp; AI
				<span class="text-eyebrow hidden sm:inline">African Studies</span>
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden items-center gap-1 md:flex" aria-label="Main navigation">
				{#each navLinks as link}
					<a
						href={link.href}
						class="relative px-3 py-2 text-sm font-medium {isActive(link.href)
							? 'text-primary-700 dark:text-primary-300'
							: 'text-ink-muted dark:text-surface-400 hover:text-ink dark:hover:text-surface-100'}"
						style="transition: color var(--duration-fast) var(--ease-standard);"
					>
						{link.label}
						{#if isActive(link.href)}
							<span class="bg-secondary-500 absolute right-3 bottom-1 left-3 h-px rounded-full"
							></span>
						{/if}
					</a>
				{/each}
			</nav>

			<!-- Right side: Language + Dark mode + Mobile toggle -->
			<div class="flex items-center gap-1">
				<LanguageSwitcher />
				<button onclick={toggleDarkMode} class="btn-ghost" aria-label={m.dark_mode()}>
					{#if darkMode}
						<Sun size={18} />
					{:else}
						<Moon size={18} />
					{/if}
				</button>
				<button
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					class="btn-ghost md:hidden"
					aria-label={mobileMenuOpen ? m.menu_close() : m.menu_open()}
					aria-expanded={mobileMenuOpen}
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
		<nav
			class="overflow-hidden md:hidden {mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'}"
			style="transition: max-height var(--duration-slow) var(--ease-standard);"
			aria-label="Mobile navigation"
		>
			<div class="border-surface-200/60 dark:border-surface-700/60 border-t pt-3">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={() => (mobileMenuOpen = false)}
						class="block px-3 py-2.5 text-sm font-medium {isActive(link.href)
							? 'text-primary-700 dark:text-primary-300 border-secondary-500 border-l-2 pl-4'
							: 'text-ink-muted dark:text-surface-400 hover:text-ink dark:hover:text-surface-100'}"
					>
						{link.label}
					</a>
				{/each}
			</div>
		</nav>
	</div>
</header>
