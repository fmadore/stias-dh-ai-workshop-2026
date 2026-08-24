import type { Sponsor } from '$lib/types';

/**
 * Single source of truth for the funders/supporters shown in the footer,
 * embedded in the CFP PDF, and listed in the Event JSON-LD.
 *
 * The five raster marks are WebP at 120 px tall, which covers the footer's
 * 40 CSS px on a 3× screen; `npm run images` regenerates them from anything
 * dropped into `static/images/logos/`. They were supplied at up to 2250 px
 * wide — 271 kB shipped on every page to draw seven 40 px marks. `width` and
 * `height` are each file's intrinsic size, so the row holds its shape while
 * they load rather than expanding out of seven zero-width boxes.
 */
export const sponsors: Sponsor[] = [
	{
		id: 'point-sud',
		name: 'Point Sud',
		logo: '/images/logos/point-sud-logo.svg',
		width: 183,
		height: 100,
		url: 'https://www.pointsud.org'
	},
	{
		id: 'stias',
		name: 'STIAS — Stellenbosch Institute for Advanced Study',
		// Kept as PNG: at 374×135 it was already the right size, and re-encoding
		// it to WebP made it larger.
		logo: '/images/logos/STIAS.png',
		width: 374,
		height: 135,
		url: 'https://stias.ac.za'
	},
	{
		id: 'dfg',
		name: 'Deutsche Forschungsgemeinschaft (DFG)',
		logo: '/images/logos/dfg_logo.webp',
		width: 475,
		height: 120,
		url: 'https://www.dfg.de/en'
	},
	{
		id: 'goethe',
		name: 'Goethe University Frankfurt',
		logo: '/images/logos/Goethe-Logo.svg.webp',
		width: 220,
		height: 120,
		url: 'https://www.uni-frankfurt.de/en'
	},
	{
		id: 'bayreuth',
		name: 'University of Bayreuth / Africa Multiple',
		logo: '/images/logos/uni-bayreuth-africa-multiple-logo.webp',
		width: 231,
		height: 120,
		url: 'https://www.africamultiple.uni-bayreuth.de/en/index.html'
	},
	{
		id: 'kcl',
		name: "King's College London",
		logo: "/images/logos/King's_College_London_logo.svg",
		width: 923,
		height: 703,
		url: 'https://www.kcl.ac.uk'
	},
	{
		id: 'sadilar',
		name: 'SADiLaR',
		logo: '/images/logos/SADiLaR-1024x487.webp',
		width: 252,
		height: 120,
		url: 'https://sadilar.org'
	}
];
