/**
 * Convert people photos to compact WebP (participant photos are displayed at
 * ≤112 CSS px, so 256 px covers 2× screens).
 *
 * Usage: npm run images
 * Converts every .jpg/.jpeg/.png in the folders below to a same-named .webp
 * (skipping files whose .webp already exists) and reports potential savings.
 * Source files are left in place — delete them once the data files point at
 * the .webp versions.
 *
 * Funder logos get their own pass. They render at 40 CSS px tall in the footer
 * of every page, and the supplied files were up to 2250 px wide: 271 kB of
 * raster art on every page load, against a stated hard constraint on image
 * budgets for participants on mobile data. 120 px tall covers 3× screens.
 * Resizing and re-encoding is not recolouring or restyling — the marks are
 * untouched. SVGs are left alone; they are already resolution-independent.
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const FOLDERS = ['static/images/organizers', 'static/images/participants'];
const SIZE = 256;
const QUALITY = 80;

const LOGO_FOLDER = 'static/images/logos';
/** Rendered height in the footer is 40 CSS px; 120 covers a 3× screen. */
const LOGO_HEIGHT = 120;

for (const folder of FOLDERS) {
	let entries;
	try {
		entries = await readdir(folder);
	} catch {
		continue;
	}
	for (const file of entries) {
		if (!/\.(jpe?g|png)$/i.test(file)) continue;
		const src = path.join(folder, file);
		const dest = src.replace(/\.(jpe?g|png)$/i, '.webp');
		try {
			await stat(dest);
			console.log(`skip   ${dest} (exists)`);
			continue;
		} catch {
			// dest doesn't exist — convert
		}
		const before = (await stat(src)).size;
		await sharp(src)
			.resize(SIZE, SIZE, { fit: 'cover', position: 'attention' })
			.webp({ quality: QUALITY })
			.toFile(dest);
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
	console.log(
		`wrote  ${dest} ${width}×${height} (${(before / 1024).toFixed(0)} kB → ${(after / 1024).toFixed(0)} kB)`
	);
}
