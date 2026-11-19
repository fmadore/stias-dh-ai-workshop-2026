/**
 * Convert people photos to compact WebP. Avatars are displayed at most
 * 112 CSS px wide (Avatar.svelte's large size, on the person page and the
 * organizer cards), so 256 px wide covers 2× screens with room to spare.
 *
 * Usage: npm run images
 * Converts every .jpg/.jpeg/.png in the folders below to a same-named .webp,
 * 256 px wide, aspect ratio kept, never enlarged. A source whose .webp already
 * exists is skipped, but every existing .webp is also checked: one wider than
 * 256 px is re-encoded in place, and kept only if the result is smaller. (The
 * old "skip if the .webp exists" rule alone let photos supplied directly as
 * 400 px WebP through untouched.) Source files are left in place — delete them
 * once the data files point at the .webp versions.
 *
 * Funder logos get their own pass. They render at 40 CSS px tall in the footer
 * of every page, and the supplied files were up to 2250 px wide: 271 kB of
 * raster art on every page load, against a stated hard constraint on image
 * budgets for participants on mobile data. 120 px tall covers 3× screens.
 * Resizing and re-encoding is not recolouring or restyling — the marks are
 * untouched. SVGs are left alone; they are already resolution-independent.
 */
import { readFile, readdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const FOLDERS = [
	'static/images/organizers',
	'static/images/participants',
	'static/images/point-sud'
];
/** Stored width: ≥ 2× the largest displayed avatar (112 CSS px). */
const SIZE = 256;
const QUALITY = 80;

const LOGO_FOLDER = 'static/images/logos';
/** Rendered height in the footer is 40 CSS px; 120 covers a 3× screen. */
const LOGO_HEIGHT = 120;

/** `withoutEnlargement` so a small supplied photo is never upscaled. */
const resizePhoto = (input) =>
	sharp(input).resize({ width: SIZE, withoutEnlargement: true }).webp({ quality: QUALITY });

for (const folder of FOLDERS) {
	let entries;
	try {
		entries = await readdir(folder);
	} catch {
		continue;
	}
	for (const file of entries) {
		const src = path.join(folder, file);
		if (/\.webp$/i.test(file)) {
			const { width = 0 } = await sharp(src).metadata();
			if (width <= SIZE) continue;
			// Read into memory first: sharp cannot write over its own input file.
			const original = await readFile(src);
			const resized = await resizePhoto(original).toBuffer();
			if (resized.byteLength >= original.byteLength) {
				console.log(`keep   ${src} (${width} px; re-encoding would not be smaller)`);
				continue;
			}
			await writeFile(src, resized);
			console.log(
				`shrunk ${src} ${width} → ${SIZE} px (${(original.byteLength / 1024).toFixed(0)} kB → ${(resized.byteLength / 1024).toFixed(0)} kB)`
			);
			continue;
		}
		if (!/\.(jpe?g|png)$/i.test(file)) continue;
		const dest = src.replace(/\.(jpe?g|png)$/i, '.webp');
		try {
			await stat(dest);
			console.log(`skip   ${dest} (exists)`);
			continue;
		} catch {
			// dest doesn't exist — convert
		}
		const before = (await stat(src)).size;
		await resizePhoto(src).toFile(dest);
		const after = (await stat(dest)).size;
		console.log(
			`wrote  ${dest} (${(before / 1024).toFixed(0)} kB → ${(after / 1024).toFixed(0)} kB)`
		);
	}
}

let logoEntries;
try {
	logoEntries = await readdir(LOGO_FOLDER);
} catch {
	logoEntries = [];
}
for (const file of logoEntries) {
	if (!/\.(jpe?g|png|gif)$/i.test(file)) continue;
	const src = path.join(LOGO_FOLDER, file);
	const dest = src.replace(/\.(jpe?g|png|gif)$/i, '.webp');
	try {
		await stat(dest);
		console.log(`skip   ${dest} (exists)`);
		continue;
	} catch {
		// dest doesn't exist — convert
	}
	const before = (await stat(src)).size;
	// `inside` so a wide mark is never cropped, and no enlargement of a source
	// that is already shorter than the target.
	await sharp(src)
		.resize({ height: LOGO_HEIGHT, fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 90 })
		.toFile(dest);
	const { width, height } = await sharp(dest).metadata();
	const after = (await stat(dest)).size;
	// STIAS.png is already small enough that WebP comes out larger; without
	// this, every run would leave a heavier unused twin beside it.
	if (after >= before) {
		await unlink(dest);
		console.log(`keep   ${src} (WebP would not be smaller)`);
		continue;
	}
	console.log(
		`wrote  ${dest} ${width}×${height} (${(before / 1024).toFixed(0)} kB → ${(after / 1024).toFixed(0)} kB)`
	);
}
