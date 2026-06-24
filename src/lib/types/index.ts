export interface LocalizedString {
	en: string;
	fr: string;
}

export interface Organizer {
	id: string;
	name: string;
	role: LocalizedString;
	affiliation: LocalizedString;
	bio: LocalizedString;
	image: string;
	country: string;
	coordinates: { lat: number; lng: number };
	website?: string;
	orcid?: string;
}

export interface Participant {
	id: string;
	name: string;
	affiliation: LocalizedString;
	country: string;
	coordinates: { lat: number; lng: number };
	image?: string;
	website?: string;
	orcid?: string;
	bio?: string;
	presentationId?: string | string[];
}

export interface Presentation {
	id: string;
	title: string;
	abstract?: string;
	language: 'en' | 'fr';
	authors?: string[];
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
	type: 'keynote' | 'panel' | 'workshop' | 'plenary' | 'discussion' | 'break' | 'social';
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
	country: string;
	coordinates: { lat: number; lng: number };
	description: LocalizedString;
	website: string;
	logisticsInfo: LocalizedString;
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
