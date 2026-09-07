declare global {
	namespace App {
		interface PageState {
			/** Query string associated with a shallow directory-filter update. */
			directorySearch?: string;
		}
	}
}

export {};
