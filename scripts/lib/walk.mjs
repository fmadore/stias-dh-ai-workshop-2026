import { readdir } from 'node:fs/promises';
import path from 'node:path';

/**
 * Every file below `directory`, recursively. Plain JavaScript rather than a
 * sibling `.ts` module because the postbuild checks that use it run under bare
 * `node`, without the tsx loader.
 *
 * @param {string} directory
 * @returns {Promise<string[]>}
 */
export async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((entry) => {
			const target = path.join(directory, entry.name);
			return entry.isDirectory() ? walk(target) : [target];
		})
	);
	return nested.flat();
}
