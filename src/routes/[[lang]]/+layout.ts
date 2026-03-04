import { setLocale, baseLocale } from '$lib/paraglide/runtime';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	const lang = params.lang || baseLocale;
	setLocale(lang as 'en' | 'fr', { reload: false });
	return { lang };
};
