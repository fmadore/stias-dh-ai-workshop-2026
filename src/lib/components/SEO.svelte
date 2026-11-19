<script lang="ts">
	import { page } from '$app/state';
	import { base } from '#lib/utils/base-path.ts';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import * as m from '#lib/paraglide/messages.js';
	import { siteConfig } from '#lib/data/site-config.ts';
	import { localizedAbsoluteUrl, unlocalizedPath } from '#lib/utils/localized-paths.ts';
	import { websiteId } from '#lib/utils/structured-data.ts';

	interface Props {
		/** The page's own title. The " | site name" suffix is added here, once. */
		title: string;
		/**
		 * The title is already complete and takes no suffix — the home page,
		 * whose title is the site name plus what it is.
		 */
		fullTitle?: boolean;
		description: string;
		type?: 'website' | 'article';
		image?: string;
		/** Required with `image`; the default card has its own. */
		imageAlt?: string;
		noindex?: boolean;
		/** Overrides the path read off the URL. Only needed if a page ever serves another's content. */
		canonicalPath?: string;
		/**
		 * The page's own schema.org type and what it is about — `ProfilePage`
		 * and its Person on a participant page. Merged into the WebPage node,
		 * so a page never describes itself twice.
		 */
		pageType?: 'WebPage' | 'ProfilePage';
		mainEntity?: object;
		additionalSchema?: object | object[];
		/** Extra `<meta name content>` pairs: the Highwire and Dublin Core tags of a paper. */
		meta?: readonly { name: string; content: string }[];
	}

	let {
		title,
		fullTitle = false,
		description,
		type = 'website',
		image,
		imageAlt,
		noindex = false,
		canonicalPath,
		pageType = 'WebPage',
		mainEntity,
		additionalSchema,
		meta = []
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
	const ogImageAlt = $derived(image ? (imageAlt ?? '') : m.seo_og_image_alt());

	// The suffix lives here rather than in every route: when each page spelled
	// it out, the site name was a hard-coded English string in all of them.
	// Social cards get the bare title — `og:site_name` already carries the
	// site, and a card has no room to say it twice.
	const siteName = $derived(siteConfig.shortTitle[locale]);
	const documentTitle = $derived(fullTitle ? title : `${title} | ${siteName}`);

	// `JSON.stringify` leaves `<` alone, so a closing script tag anywhere in a
	// title, abstract or bio would end the block early and spill the rest into
	// the page as markup. `\u003c` is the same character to a JSON parser.
	const serialize = (value: object) => JSON.stringify(value).replaceAll('<', '\\u003c');

	// Every page describes itself as a WebPage. The Event entity for the
	// workshop and the WebSite node are emitted once, on the home page, via
	// `additionalSchema` (see #lib/data/event-schema.ts); `isPartOf` names the
	// WebSite by `@id` and repeats its name and URL, so a page read on its own
	// still says what it belongs to.
	const jsonLd = $derived(
		serialize({
			'@context': 'https://schema.org',
			'@type': pageType,
			'@id': canonicalUrl,
			name: title,
			description: description,
			url: canonicalUrl,
			inLanguage: locale,
			isPartOf: {
				'@type': 'WebSite',
				'@id': websiteId(siteConfig.url),
				name: siteName,
				url: siteConfig.url
			},
			...(mainEntity ? { mainEntity } : {})
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
	<title>{documentTitle}</title>
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
	{#if ogImageAlt}
		<meta property="og:image:alt" content={ogImageAlt} />
	{/if}
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content={ogLocale} />
	<meta property="og:locale:alternate" content={ogAltLocale} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	{#if ogImageAlt}
		<meta name="twitter:image:alt" content={ogImageAlt} />
	{/if}

	{#each meta as tag, index (index)}
		<meta name={tag.name} content={tag.content} />
	{/each}

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
