/**
 * Public online access to the workshop.
 *
 * Every session at STIAS also runs on the platform below, and the link is
 * deliberately public: anyone may follow the workshop, not only the people on
 * the programme. `joinUrl` is the single switch — while it is empty the site
 * says the link is coming, and filling it in turns on the buttons on the home
 * page, the programme and the venue page, and writes the meeting into the
 * generated calendar file.
 */
export interface OnlineAccess {
	/** Shown in the invitation copy, so it names the platform people will land in. */
	platform: string;
	/** The public join link. Empty until the convenors publish it. */
	joinUrl: string;
	/** Optional dial-in details, rendered under the button when present. */
	meetingId?: string;
	passcode?: string;
}

export const onlineAccess: OnlineAccess = {
	platform: 'Microsoft Teams',
	// The link carries its own passcode in `?p=`, so it is the whole of what a
	// reader needs. `meetingId` / `passcode` stay available for a room system
	// that can only join by ID, but publishing them beside a one-click link was
	// two lines of credentials nobody was going to type.
	joinUrl: 'https://teams.microsoft.com/meet/397912490941524?p=Dii7uI0Q2sCfeWh443'
};

/** Whether there is a link to publish yet. */
export const onlineAccessPublished = onlineAccess.joinUrl.trim().length > 0;
