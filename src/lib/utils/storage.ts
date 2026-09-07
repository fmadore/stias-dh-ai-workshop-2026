/** Storage is optional: privacy settings can deny even access to the object. */
export function readStorage(kind: 'localStorage' | 'sessionStorage', key: string): string | null {
	try {
		return window[kind].getItem(key);
	} catch {
		return null;
	}
}

export function writeStorage(
	kind: 'localStorage' | 'sessionStorage',
	key: string,
	value: string
): void {
	try {
		window[kind].setItem(key, value);
	} catch {
		// The current page still works when a preference cannot be persisted.
	}
}
