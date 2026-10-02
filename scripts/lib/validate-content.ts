import type { Presentation } from '../../src/lib/types/index.ts';

export const isSlug = (value: string): boolean => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

export function moduleIdentityErrors(
	modules: Array<{ file: string; value: { id: string } }>,
	kind: string
): string[] {
	const errors: string[] = [];
	for (const { file, value } of modules) {
		if (!isSlug(value.id)) errors.push(`${kind} ${file}: invalid URL slug '${value.id}'`);
		if (file !== `${value.id}.ts`)
			errors.push(`${kind} ${file}: filename must match id '${value.id}'`);
	}
	return errors;
}

export function presentationAuthorErrors(
	presentation: Pick<Presentation, 'id' | 'authors'>,
	people: ReadonlyMap<string, unknown>
): string[] {
	const errors: string[] = [];
	if (!presentation.authors.length)
		errors.push(`presentation ${presentation.id}: empty authors list`);
	const authors = new Set<string>();
	for (const author of presentation.authors) {
		if (!people.has(author))
			errors.push(`presentation ${presentation.id}: unknown author '${author}'`);
		if (authors.has(author))
			errors.push(`presentation ${presentation.id}: duplicate author '${author}'`);
		authors.add(author);
	}
	return errors;
}
