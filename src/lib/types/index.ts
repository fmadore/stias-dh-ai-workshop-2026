export interface LocalizedString {
	en: string;
	fr: string;
}

export type CountryCode =
	| 'BF'
	| 'CA'
	| 'CM'
	| 'DE'
	| 'FI'
	| 'GB'
	| 'GM'
	| 'KE'
	| 'LU'
	| 'NG'
	| 'NL'
	| 'SE'
	| 'SN'
	| 'TN'
	| 'US'
	| 'ZA';

export interface Organizer {
	id: string;
	name: string;
	role: LocalizedString;
	affiliation: LocalizedString;
	bio: LocalizedString;
	image: string;
	country: CountryCode;
	website?: string;
	orcid?: string;
	/** Taking part remotely — flags the person in the schedule. */
	online?: boolean;
}

export interface Participant {
	id: string;
	name: string;
	affiliation: LocalizedString;
	country: CountryCode;
	image?: string;
	website?: string;
	orcid?: string;
	/** Taking part remotely — flags the person in the schedule. */
	online?: boolean;
	/**
	 * Bios are stored bilingually. Until a real translation exists the source
	 * text is duplicated in both fields, so `t()` always has a defined branch.
	 */
	bio?: LocalizedString;
}

export interface Presentation {
	id: string;
	title: string;
	abstract?: string;
	language: 'en' | 'fr';
	/**
	 * Ordered person ids (participants or organizers). This is the single
	 * source of truth for authorship — a participant's papers are derived
	 * from it, never stored on the participant.
	 */
	authors: string[];
}

export interface ThematicAxis {
	id: string;
	number: number;
	title: LocalizedString;
	description: LocalizedString;
	icon: string;
}

export interface Session {
	id: string;
	time: string;
	/** Drives the badge label and colour. */
	type: 'keynote' | 'panel' | 'plenary' | 'discussion' | 'break' | 'social';
	/**
	 * Display heading. Optional — a keynote can instead derive its heading from a
	 * single referenced presentation (see `presentationIds`).
	 */
	title?: LocalizedString;
	/** Theme blurb shown under the title (used by panels). */
	description?: LocalizedString;
	/** People ids (participants or organizers) — e.g. keynote speakers. */
	speakers?: string[];
	/** Presentation ids — the papers in a panel, or a keynote's referenced abstract. */
	presentationIds?: string[];
	/** Person id (participant or organizer) chairing the session. */
	chair?: string;
	room?: string;
	/** Off-site venue name, e.g. the restaurant hosting a dinner. */
	venue?: string;
	/** External page for `venue` — rendered as a link on the venue name. */
	venueUrl?: string;
}

export interface ProgrammeDay {
	date: string;
	dayLabel: LocalizedString;
	sessions: Session[];
}

export interface VenueInfo {
	name: string;
	fullName: LocalizedString;
	address: string;
	city: string;
	postalCode: string;
	country: CountryCode;
	coordinates: { lat: number; lng: number };
	description: LocalizedString;
	website: string;
	logisticsInfo: LocalizedString;
}

export interface Sponsor {
	id: string;
	name: string;
	/** Path under static/, e.g. `/images/logos/….png`. */
	logo: string;
	url: string;
}

export interface CFPInfo {
	deadline: string;
	notificationDate: string;
	fullPapersDeadline: string;
	submissionUrl?: string;
	rationale: LocalizedString;
	guidelines: LocalizedString;
	selectionCriteria: LocalizedString;
	workshopFormat: LocalizedString;
	publication: LocalizedString;
}

export interface SiteConfig {
	title: LocalizedString;
	shortTitle: string;
	description: LocalizedString;
	dates: { start: string; end: string };
	location: string;
	url: string;
}
