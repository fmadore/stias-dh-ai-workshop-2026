<script lang="ts">
	import { page } from '$app/state';
	import { getLocale } from '$lib/paraglide/runtime';
	import { siteConfig } from '$lib/data/site-config';

	interface Props {
		title: string;
		description: string;
		type?: 'website' | 'article';
		image?: string;
		noindex?: boolean;
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

	const routePath = $derived(
		canonicalPath ?? ((page.route.id ?? '/').replace('/[[lang]]', '') || '/')
	);
	const enUrl = $derived(`${siteConfig.url}${routePath}`);
	const frUrl = $derived(`${siteConfig.url}/fr${routePath}`);
	const canonicalUrl = $derived(locale === 'en' ? enUrl : frUrl);
	const ogImage = $derived(image ?? `${siteConfig.url}/images/og-default.png`);

	// Every page describes itself as a WebPage. The Event entity for the
	// workshop is emitted once, on the home page, via `additionalSchema`
	// (see $lib/data/event-schema.ts).
	const jsonLd = $derived(
		JSON.stringify({
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
		{@html '<script type="application/ld+json">' + JSON.stringify(schema) + '<\/script>'}
	{/each}
</svelte:head>
