<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { getLocale } from '$lib/paraglide/runtime';
	import { siteConfig } from '$lib/data/site-config';
	import { localizedAbsoluteUrl, unlocalizedPath } from '$lib/utils/localized-paths';

	interface Props {
		title: string;
		description: string;
		type?: 'website' | 'article';
		image?: string;
		noindex?: boolean;
		/** Overrides the path read off the URL. Only needed if a page ever serves another's content. */
		canonicalPath?: string;
		additionalSchema?: object | object[];
	}

	let {
		title,
		description,
		type = 'website',
		image,
		noindex = false,
		canonicalPath,
		additionalSchema
	}: Props = $props();

	const locale = $derived(getLocale());
	const ogLocale = $derived(locale === 'en' ? 'en_US' : 'fr_FR');
	const ogAltLocale = $derived(locale === 'en' ? 'fr_FR' : 'en_US');

	// Read off the URL rather than the route id: for a dynamic route the id is
	// the pattern (`/papers/[slug]`), so a dynamic page that forgot to pass
	// `canonicalPath` would ship the literal brackets as its canonical, og:url
	// and both hreflang alternates.
	const routePath = $derived(canonicalPath ?? unlocalizedPath(page.url.pathname, locale, base));
	const enUrl = $derived(localizedAbsoluteUrl(siteConfig.url, routePath, 'en'));
	const frUrl = $derived(localizedAbsoluteUrl(siteConfig.url, routePath, 'fr'));
	const canonicalUrl = $derived(locale === 'en' ? enUrl : frUrl);
	const ogImage = $derived(image ?? `${siteConfig.url}/images/og-default.png`);

	// `JSON.stringify` leaves `<` alone, so a closing script tag anywhere in a
	// title, abstract or bio would end the block early and spill the rest into
	// the page as markup. `\u003c` is the same character to a JSON parser.
	const serialize = (value: object) => JSON.stringify(value).replaceAll('<', '\\u003c');

	// Every page describes itself as a WebPage. The Event entity for the
	// workshop is emitted once, on the home page, via `additionalSchema`
	// (see $lib/data/event-schema.ts).
	const jsonLd = $derived(
		serialize({
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: title,
			description: description,
			url: canonicalUrl,
			inLanguage: locale,
			isPartOf: {
				'@type': 'WebSite',
				name: siteConfig.shortTitle,
				url: siteConfig.url
			}
		})
	);

	const extraSchemas = $derived(
		additionalSchema
			? Array.isArray(additionalSchema)
				? additionalSchema
				: [additionalSchema]
			: []
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Hreflang -->
	<link rel="alternate" hreflang="en" href={enUrl} />
	<link rel="alternate" hreflang="fr" href={frUrl} />
	<link rel="alternate" hreflang="x-default" href={enUrl} />

	<!-- Open Graph -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={ogImage} />
	{#if !image}
		<!-- Dimensions of the default og-default.png -->
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}
	<meta property="og:site_name" content={siteConfig.shortTitle} />
	<meta property="og:locale" content={ogLocale} />
	<meta property="og:locale:alternate" content={ogAltLocale} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	<!-- JSON-LD Structured Data -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
	{@html '<script type="application/ld+json">' + jsonLd + '<\/script>'}

	{#each extraSchemas as schema}
		<!-- eslint-disable-next-line svelte/no-at-html-tags, no-useless-escape -->
		{@html '<script type="application/ld+json">' + serialize(schema) + '<\/script>'}
	{/each}
</svelte:head>
