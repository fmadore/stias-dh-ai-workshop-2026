import type { Sponsor } from '$lib/types';

/**
 * Single source of truth for the funders/supporters shown in the footer,
 * embedded in the CFP PDF, and listed in the Event JSON-LD.
 */
export const sponsors: Sponsor[] = [
	{
		id: 'point-sud',
		name: 'Point Sud',
		logo: '/images/logos/point-sud-logo.svg',
		url: 'https://www.pointsud.org'
	},
	{
		id: 'stias',
		name: 'STIAS — Stellenbosch Institute for Advanced Study',
		logo: '/images/logos/STIAS.png',
		url: 'https://stias.ac.za'
	},
	{
		id: 'dfg',
		name: 'Deutsche Forschungsgemeinschaft (DFG)',
		logo: '/images/logos/dfg_logo.gif',
		url: 'https://www.dfg.de/en'
	},
	{
		id: 'goethe',
		name: 'Goethe University Frankfurt',
		logo: '/images/logos/Goethe-Logo.svg.png',
		url: 'https://www.uni-frankfurt.de/en'
	},
	{
		id: 'bayreuth',
		name: 'University of Bayreuth / Africa Multiple',
		logo: '/images/logos/uni-bayreuth-africa-multiple-logo.jpeg',
		url: 'https://www.africamultiple.uni-bayreuth.de/en/index.html'
	},
	{
		id: 'kcl',
		name: "King's College London",
		logo: "/images/logos/King's_College_London_logo.svg",
		url: 'https://www.kcl.ac.uk'
	},
	{
		id: 'sadilar',
		name: 'SADiLaR',
		logo: '/images/logos/SADiLaR-1024x487.png',
		url: 'https://sadilar.org'
	}
];
