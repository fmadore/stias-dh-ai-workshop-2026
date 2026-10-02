import type { Participant } from '$lib/types';

const modules = import.meta.glob<Participant>(['./*.ts', '!./index.ts'], {
	eager: true,
	import: 'default'
});

export const participants: Participant[] = Object.values(modules).sort(
	(a, b) =>
		a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) || a.id.localeCompare(b.id, 'en')
);
