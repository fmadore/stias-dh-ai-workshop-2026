import { siteConfig } from './site-config';
import { venueInfo, venueStreet } from './venue';
import { organizers } from './organizers';
import { sponsors } from './sponsors';
import { onlineAccess, onlineAccessPublished } from './online-access';
import { t } from '$lib/utils/i18n';
import { workshopEnd, workshopStart } from '$lib/utils/milestones';

/**
 * The canonical schema.org Event for the workshop. Emitted on the home page
 * only — one page, one Event entity — so search engines see a single,
 * consistently named conference instead of a near-duplicate per page.
 */
export function buildEventSchema(ogImage: string): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'Event',
		'@id': `${siteConfig.url}#event`,
		name: t(siteConfig.title),
		description: t(siteConfig.description),
		// The same instants the site's own clock uses (`siteConfig.hours`). This
		// said 08:30–17:00 while the clock said 09:00–18:00.
		startDate: workshopStart(),
		endDate: workshopEnd(),
		// The workshop runs hybrid: in person at STIAS with remote access.
		eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
		eventStatus: 'https://schema.org/EventScheduled',
		location: [
			{
				'@type': 'Place',
				name: `${venueInfo.name} — ${venueInfo.fullName.en}`,
				address: {
					'@type': 'PostalAddress',
					streetAddress: venueStreet,
					addressLocality: venueInfo.city,
					postalCode: venueInfo.postalCode,
					addressCountry: 'ZA'
				}
			},
			{
				'@type': 'VirtualLocation',
				// The public join link once there is one; until then the site itself,
				// which is where the link will be announced.
				name: onlineAccess.platform,
				url: onlineAccessPublished ? onlineAccess.joinUrl : siteConfig.url
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
