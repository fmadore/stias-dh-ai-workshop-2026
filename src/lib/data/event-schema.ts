import { siteConfig } from './site-config';
import { venueInfo } from './venue';
import { organizers } from './organizers';
import { sponsors } from './sponsors';
import { t } from '$lib/utils/i18n';

/**
 * The canonical schema.org Event for the workshop. Emitted on the home page
 * only — one page, one Event entity — so search engines see a single,
 * consistently named conference instead of a near-duplicate per page.
 */
export function buildEventSchema(ogImage: string): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'Event',
		name: t(siteConfig.title),
		description: t(siteConfig.description),
		// SAST is UTC+2 year-round.
		startDate: `${siteConfig.dates.start}T09:00:00+02:00`,
		endDate: `${siteConfig.dates.end}T18:00:00+02:00`,
		// The workshop runs hybrid: in person at STIAS with remote access.
		eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
		eventStatus: 'https://schema.org/EventScheduled',
		location: [
			{
				'@type': 'Place',
				name: `${venueInfo.name} — ${venueInfo.fullName.en}`,
				address: {
					'@type': 'PostalAddress',
					streetAddress: venueInfo.address,
					addressLocality: venueInfo.city,
					postalCode: venueInfo.postalCode,
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
		funder: [
			{
				'@type': 'Organization',
				name: 'Deutsche Forschungsgemeinschaft (DFG)',
				url: 'https://www.dfg.de/en'
			}
		],
		sponsor: sponsors.map((s) => ({
			'@type': 'Organization',
			name: s.name,
			url: s.url
		}))
	};
}
