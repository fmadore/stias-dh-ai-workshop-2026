/**
 * Convert people photos to compact WebP (participant photos are displayed at
 * ≤112 CSS px, so 256 px covers 2× screens).
 *
 * Usage: npm run images
 * Converts every .jpg/.jpeg/.png in the folders below to a same-named .webp
 * (skipping files whose .webp already exists) and reports potential savings.
 * Source files are left in place — delete them once the data files point at
 * the .webp versions.
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const FOLDERS = ['static/images/organizers', 'static/images/participants'];
const SIZE = 256;
const QUALITY = 80;

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
