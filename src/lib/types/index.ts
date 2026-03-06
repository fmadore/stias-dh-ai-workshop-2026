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
	presentationTitle?: LocalizedString;
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
	title: LocalizedString;
	type: 'keynote' | 'panel' | 'workshop' | 'break' | 'social';
	speakers?: string[];
	description?: LocalizedString;
	room?: string;
}

export interface ProgrammeDay {
	date: string;
	dayLabel: LocalizedString;
	title: LocalizedString;
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
