<script lang="ts">
	import { page } from '$app/state';
	import { getLocale } from '$lib/paraglide/runtime';
	import { siteConfig } from '$lib/data/site-config';
	import { organizers } from '$lib/data/organizers';
	import { t } from '$lib/utils/i18n';

	interface Props {
		title: string;
		description: string;
		type?: 'website' | 'article';
		image?: string;
		noindex?: boolean;
	}

	let { title, description, type = 'website', image, noindex = false }: Props = $props();

	const locale = $derived(getLocale());
	const altLocale = $derived(locale === 'en' ? 'fr' : 'en');
	const ogLocale = $derived(locale === 'en' ? 'en_US' : 'fr_FR');
	const ogAltLocale = $derived(locale === 'en' ? 'fr_FR' : 'en_US');

	// Extract route path from page.route.id (e.g., '/[[lang]]/about' → '/about')
	const routePath = $derived((page.route.id ?? '/').replace('/[[lang]]', '') || '/');
	const enUrl = $derived(`${siteConfig.url}${routePath}`);
	const frUrl = $derived(`${siteConfig.url}/fr${routePath}`);
	const canonicalUrl = $derived(locale === 'en' ? enUrl : frUrl);
	const ogImage = $derived(image ?? `${siteConfig.url}/images/og-default.png`);

	const jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Event',
			name: title,
			description: description,
			startDate: siteConfig.dates.start,
			endDate: siteConfig.dates.end,
			eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
			eventStatus: 'https://schema.org/EventScheduled',
			location: [
				{
					'@type': 'Place',
					name: 'STIAS — Stellenbosch Institute for Advanced Study',
					address: {
						'@type': 'PostalAddress',
						streetAddress: '10 Marais Street',
						addressLocality: 'Stellenbosch',
						postalCode: '7600',
						addressCountry: 'ZA'
					}
				},
				{
					'@type': 'VirtualLocation',
					url: siteConfig.url
				}
			],
			image: ogImage,
			url: siteConfig.url,
			organizer: organizers.map((o) => ({
				'@type': 'Person',
				name: o.name,
				...(o.website ? { url: o.website } : {}),
				affiliation: {
					'@type': 'Organization',
					name: t(o.affiliation)
				}
			})),
			performer: organizers.map((o) => ({
				'@type': 'Person',
				name: o.name,
				...(o.website ? { url: o.website } : {})
			})),
			offers: {
				'@type': 'Offer',
				url: `${siteConfig.url}/call-for-papers`,
				price: '0',
				priceCurrency: 'ZAR',
				availability: 'https://schema.org/InStock'
			}
		})
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
</svelte:head>
