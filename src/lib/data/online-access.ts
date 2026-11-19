/**
 * Public online access to the workshop.
 *
 * Every session at STIAS also ran on the platform below, and the link was
 * deliberately public: anyone could follow the workshop, not only the people
 * on the programme. `joinUrl` is the single switch — filled in, it writes the
 * meeting into the generated calendar files and names it as the Event's
 * virtual location. Empty, neither happens.
 *
 * Emptied after the workshop closed on 24 September 2026: an open link that
 * carries its own passcode, to a meeting series that has ended, is an
 * invitation to misuse it, and it was in the static HTML, both calendar files
 * and the JSON-LD. The on-page invitation it also drove (a band on the home
 * page, a callout on the programme, a line on the venue page) was removed
 * with the rest of the live-event machinery once the site became an archive.
 */
export interface OnlineAccess {
	/** Shown in the invitation copy, so it names the platform people will land in. */
	platform: string;
	/** The public join link. Empty before it is published and after the workshop. */
	joinUrl: string;
	/** Optional dial-in details, rendered under the button when present. */
	meetingId?: string;
	passcode?: string;
}

export const onlineAccess: OnlineAccess = {
	platform: 'Microsoft Teams',
	// When set, the link carried its own passcode in `?p=`, so it was the whole
	// of what a reader needed. `meetingId` / `passcode` stay available for a
	// room system that can only join by ID, but publishing them beside a
	// one-click link was two lines of credentials nobody was going to type.
	joinUrl: ''
};

/** Whether there is a link to publish yet. */
export const onlineAccessPublished = onlineAccess.joinUrl.trim().length > 0;
