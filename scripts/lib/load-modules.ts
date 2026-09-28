import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Every content module in a directory, by default export — what the site's own
 * `import.meta.glob` loaders read, which is Vite's and not available to a plain
 * Node script.
 */
export async function loadDefaultModules<T>(
	directory: string
): Promise<Array<{ file: string; value: T }>> {
	const files = (await readdir(directory)).filter(
		(file) => file.endsWith('.ts') && file !== 'index.ts'
	);
	return Promise.all(
		files.map(async (file) => {
			const module = (await import(pathToFileURL(path.resolve(directory, file)).href)) as {
				default?: T;
			};
			if (!module.default) throw new Error(`${directory}/${file}: missing default export`);
			return { file, value: module.default };
		})
	);
}
