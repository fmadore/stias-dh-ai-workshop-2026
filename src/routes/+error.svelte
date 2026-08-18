<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import { localizedPath, localeFromPath } from '$lib/utils/localized-paths';
	import { ArrowLeft } from '@lucide/svelte';

	// This route sits outside [[lang]], so no layout load has set the locale for
	// it. Messages take an explicit one rather than reading the global, which on
	// a cold load of a bad French URL still held the base locale — and after a
	// client navigation held the previous page's, which is how the document
	// title and the heading ended up in different languages.
	const locale = $derived(localeFromPath(page.url.pathname, base));
	const homeHref = $derived(localizedPath('/', locale, base));
</script>

<svelte:head>
	<title
		>{page.status === 404
			? m.error_404_title({}, { locale })
			: m.error_generic_title({}, { locale })}</title
	>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="section-pad-lg">
	<div class="container-readable text-center">
		<p class="text-eyebrow mb-4">{page.status}</p>
		<h1 class="text-page-title text-strong mb-5">
			{page.status === 404
				? m.error_404_title({}, { locale })
				: m.error_generic_title({}, { locale })}
		</h1>
		<!-- No max-w-xl: a physical max-width utility outranks .text-lede's own
		     logical max-inline-size (utilities layer beats components), so the
		     lede rendered at 576px ≈ 80 characters against the role's 48.

		     The non-404 branch used to render nothing here: a heading saying
		     something went wrong, and no account of what to do about it. -->
		<p class="text-lede mx-auto mb-10">
			{page.status === 404
				? m.error_404_text({}, { locale })
				: m.error_generic_text({}, { locale })}
		</p>
		<a href={homeHref} class="btn btn-primary" data-sveltekit-reload>
			<ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
			{m.error_back_home({}, { locale })}
		</a>
	</div>
</div>
