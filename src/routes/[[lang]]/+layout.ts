import { setLocale, baseLocale } from '$lib/paraglide/runtime';
import type { LayoutLoad } from './$types';

/**
 * Paraglide runs with the `globalVariable` strategy: `setLocale` writes a
 * module-level global that message functions read at render time.
 *
 * NOTE: during prerendering that global is process-wide, not per-request.
 * This is only correct because SvelteKit prerenders pages sequentially —
 * each page's layout load sets the locale immediately before the page
 * renders. If rendering ever becomes concurrent (SSR, parallel prerender),
 * migrate to Paraglide's `url` strategy. The post-build smoke test
 * (scripts/smoke-test.mjs) guards the "French pages contain French"
 * property in CI. It also means locale changes need a full page reload,
 * which is why LanguageSwitcher navigates with window.location.
 */
export const load: LayoutLoad = ({ params }) => {
	const lang = params.lang || baseLocale;
	setLocale(lang as 'en' | 'fr', { reload: false });
	return { lang };
};
