export interface LocalizedString {
	en: string;
	fr: string;
}

/** The same, for content that is a list of things rather than a passage. */
export interface LocalizedList {
	en: string[];
	fr: string[];
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
	| 'ML'
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
	bioLanguage?: BioLanguage;
	image: string;
	country: CountryCode;
	website?: string;
	orcid?: string;
	/** Taking part remotely — flags the person in the schedule. */
	online?: boolean;
}

/**
 * The language an untranslated bio is actually written in. Only meaningful when
 * `bio.en === bio.fr` (the duplication described on `Participant.bio`); a bio
 * with genuinely different halves matches whichever page renders it. Defaults to
 * `'en'`, so only the French-authored bios have to declare it.
 */
export type BioLanguage = 'en' | 'fr';

/**
 * Someone speaking for the DFG programme Point Sud, which funds the workshop.
 * They are neither convenors nor presenters, so they list like organizers —
 * name, role, affiliation — but carry no bio or portrait unless one is supplied.
 */
export interface PointSudRepresentative {
	id: string;
	name: string;
	role: LocalizedString;
	affiliation: LocalizedString;
	country: CountryCode;
	image?: string;
	website?: string;
	orcid?: string;
	/** Taking part remotely — flags the person in the schedule. */
	online?: boolean;
	bio?: LocalizedString;
	bioLanguage?: BioLanguage;
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
	bioLanguage?: BioLanguage;
}

/**
 * Someone credited on a paper who is not otherwise taking part: the presenting
 * author is the one who travels, while a co-author is represented on the paper
 * byline with their name and affiliation. They carry no country, bio or page
 * of their own, so they are kept out of the directory, the map and every count
 * of who is attending — they exist so that a paper can name everyone who wrote
 * it.
 */
export interface CoAuthor {
	id: string;
	name: string;
	affiliation: LocalizedString;
	website?: string;
	orcid?: string;
}

/** A campus-based affiliation shown on the participants map. */
export interface AffiliationLocation {
	id: string;
	name: LocalizedString;
	city: LocalizedString;
	country: CountryCode;
	coordinates: { lat: number; lng: number };
	/**
	 * Ids from the people registry — organizers as well as participants, since
	 * the convenors work at campuses the map already pins.
	 */
	personIds: string[];
}

export interface Presentation {
	id: string;
	title: string;
	/**
	 * A plain string in the usual case: one text, in whichever language its
	 * author wrote it, shown to every reader whatever the page locale. A
	 * `LocalizedString` when the author supplied both halves — then it follows
	 * the reader, and the `lang` it renders under has to be resolved alongside
	 * it rather than read off `language` below. `resolveAbstract` does both.
	 */
	abstract?: string | LocalizedString;
	/**
	 * The language the paper is *presented* in. It drives the card's corner
	 * mark and the language filter, and it is not the language of the abstract:
	 * an English talk can carry a French translation of its abstract.
	 */
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
	/**
	 * External profile links for people named in `description` who have no page
	 * on this site (e.g. hosts giving a welcome address). Labels are names, so
	 * they are plain strings rather than `LocalizedString`.
	 */
	links?: { label: string; url: string }[];
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
	/**
	 * Suburb, between the street and the town. South African addresses carry one
	 * and STIAS's is load-bearing: "Marais Road, Mostertsdrift" is what tells a
	 * driver which end of a road that runs through two suburbs. schema.org has
	 * no field for it, so `event-schema.ts` folds it into `streetAddress`.
	 */
	district?: string;
	city: string;
	postalCode: string;
	country: CountryCode;
	coordinates: { lat: number; lng: number };
	description: LocalizedString;
	website: string;
	/**
	 * What the funder pays for, and what it does not — as two lists rather than
	 * one sentence, because the half a traveller must act on used to sit after
	 * a "However,". `logisticsSentences()` composes the prose the call for
	 * papers published from exactly these, so the two pages cannot drift.
	 */
	logisticsCovered: LocalizedList;
	logisticsNotCovered: LocalizedList;
}

/**
 * A guest house the workshop books for participants. Deliberately not a
 * `VenueInfo`: there is no `fullName` or `logisticsInfo` to carry, and the
 * venue page renders these beside the venue rather than in its place.
 */
export interface Accommodation {
	id: string;
	name: string;
	/** Street line only, as with `VenueInfo.address`. */
	address: string;
	city: string;
	postalCode: string;
	country: CountryCode;
	coordinates: { lat: number; lng: number };
	description: LocalizedString;
	website: string;
}

export interface Sponsor {
	id: string;
	name: string;
	/** Path under static/, e.g. `/images/logos/….webp`. */
	logo: string;
	/**
	 * Intrinsic pixel size of `logo`, so the footer reserves each mark's width
	 * before it loads. The row is `h-10 w-auto`: without these, seven lazy
	 * images are 0 px wide until they arrive and the row reflows around them.
	 * Omitted for SVGs, which have no intrinsic size to declare.
	 */
	width?: number;
	height?: number;
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
