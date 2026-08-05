/**
 * Renders the social preview cards from the site's own design system.
 *
 * The card is the homepage hero, cropped to a share-card canvas: same
 * gradient, same grain, same gold radial, same Instrument Serif / Outfit
 * pairing loaded from the very @fontsource files the site ships. Title,
 * dates and location come from the data modules and the message catalogue,
 * so the cards cannot drift from the site the way a hand-made PNG does.
 *
 * Run with `npm run og` after changing the title, the dates or the theme.
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { siteConfig } from '../src/lib/data/site-config.ts';

type Locale = 'en' | 'fr';

interface Target {
	/** Output path, relative to the repo root. */
	out: string;
	width: number;
	height: number;
	locale: Locale;
}

/** 1200×630 is the Open Graph canvas; 1280×640 is GitHub's social preview. */
const TARGETS: Target[] = [
	{ out: 'static/images/og-default.png', width: 1200, height: 630, locale: 'en' },
	{ out: '.github/social-preview.png', width: 1280, height: 640, locale: 'en' }
];

/** GitHub rejects social previews above 1 MB; crawlers dislike heavy cards. */
const MAX_BYTES = 1024 * 1024;

const FONT_FILES = {
	serif: '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2',
	serifItalic: '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2',
	sans: '@fontsource/outfit/files/outfit-latin-400-normal.woff2',
	sansMedium: '@fontsource/outfit/files/outfit-latin-500-normal.woff2'
} as const;

/* Brand tokens, mirrored from the @theme block in src/app.css. */
const PRIMARY_900 = '#042828';
const PRIMARY_800 = '#063b3c';
const PRIMARY_950 = '#021616';
const PRIMARY_200 = '#80cccd';
const PRIMARY_100 = '#b3e0e1';
const SECONDARY_300 = '#dcbe5c';
const SECONDARY_500 = '#c49528';

/** The grain texture from the .grain utility in src/app.css. */
const GRAIN =
	"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")";

async function fontDataUrl(specifier: string): Promise<string> {
	const file = path.resolve('node_modules', specifier);
	const buffer = await readFile(file);
	return `data:font/woff2;base64,${buffer.toString('base64')}`;
}

async function messages(locale: Locale): Promise<Record<string, string>> {
	return JSON.parse(await readFile(path.resolve('messages', `${locale}.json`), 'utf8'));
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/**
 * The hero splits the title on its colon into a display line and an italic
 * serif deck; the card does the same so the two read as one design.
 */
function splitTitle(title: string): { headline: string; deck: string } {
	const parts = title.split(/\s*:\s*/);
	return { headline: parts[0], deck: parts.slice(1).join(': ') };
}

interface Fonts {
	serif: string;
	serifItalic: string;
	sans: string;
	sansMedium: string;
}

function card(target: Target, m: Record<string, string>, fonts: Fonts): string {
	const { width, height, locale } = target;
	const { headline, deck } = splitTitle(siteConfig.title[locale]);
	/* Everything scales off the canvas height so both aspect ratios hold. */
	const u = height / 630;
	const px = (value: number) => `${(value * u).toFixed(2)}px`;
	const meta = [m.hero_dates, m.hero_location, m.hero_format].filter(Boolean);
	const host = siteConfig.url.replace(/^https?:\/\//, '');

	return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8" />
<style>
@font-face { font-family: 'Instrument Serif'; font-style: normal; font-weight: 400; src: url('${fonts.serif}') format('woff2'); }
@font-face { font-family: 'Instrument Serif'; font-style: italic; font-weight: 400; src: url('${fonts.serifItalic}') format('woff2'); }
@font-face { font-family: 'Outfit'; font-style: normal; font-weight: 400; src: url('${fonts.sans}') format('woff2'); }
@font-face { font-family: 'Outfit'; font-style: normal; font-weight: 500; src: url('${fonts.sansMedium}') format('woff2'); }

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${width}px; height: ${height}px; }
body {
  font-family: 'Outfit', system-ui, sans-serif;
  background: linear-gradient(to bottom right, ${PRIMARY_900}, ${PRIMARY_800} 52%, ${PRIMARY_950});
  color: #fff;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
/* Gold radial, as on the hero: off-canvas top right, barely there. */
.glow {
  position: absolute;
  top: -33%; right: -25%;
  width: 70%; height: 140%;
  border-radius: 9999px;
  opacity: 0.18;
  background: radial-gradient(closest-side, ${SECONDARY_500}, transparent 70%);
}
.grain { position: absolute; inset: 0; opacity: 0.035; background-image: ${GRAIN}; background-repeat: repeat; background-size: 256px 256px; }
.body { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 0 ${px(78)}; }
.eyebrow {
  font-size: ${px(19)};
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${PRIMARY_200};
  margin-bottom: ${px(26)};
}
h1 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-weight: 400;
  font-size: ${px(72)};
  line-height: 1.04;
  letter-spacing: -0.025em;
  max-width: ${px(1000)};
}
.deck {
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-size: ${px(40)};
  line-height: 1.25;
  color: ${SECONDARY_300};
  margin-top: ${px(20)};
  max-width: ${px(940)};
}
.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 ${px(14)};
  margin-top: ${px(34)};
  font-size: ${px(21)};
  color: ${PRIMARY_100};
  opacity: 0.85;
}
.dot { opacity: 0.4; }
/* The hero's deadline strip, reused as the card's footer rule. */
.strip {
  position: relative;
  z-index: 2;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.2);
  padding: ${px(20)} ${px(78)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${px(24)};
}
.url { font-size: ${px(18)}; color: ${PRIMARY_100}; opacity: 0.8; }
.hosts {
  font-size: ${px(15)};
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${SECONDARY_300};
}
</style>
</head>
<body>
<div class="glow"></div>
<div class="grain"></div>
<div class="body">
  <p class="eyebrow">${escapeHtml(m.hero_subtitle ?? '')}</p>
  <h1>${escapeHtml(headline)}</h1>
  ${deck ? `<p class="deck">${escapeHtml(deck)}</p>` : ''}
  <div class="meta">
    ${meta.map((part, i) => `${i ? '<span class="dot">·</span>' : ''}<span>${escapeHtml(part)}</span>`).join('')}
  </div>
</div>
<div class="strip">
  <span class="url">${escapeHtml(host)}</span>
  <span class="hosts">Point Sud · STIAS · DFG</span>
</div>
</body>
</html>`;
}

/**
 * Full-colour PNG first; the grain is incompressible noise, so a 2× card
 * lands around 3.5 MB. Quantising is what brings it back under budget — on
 * a near-monochrome teal gradient the grain doubles as dithering, so even
 * 128 colours is visually indistinguishable from truecolour.
 */
async function fitToBudget(shot: Buffer, label: string): Promise<Buffer> {
	const full = await sharp(shot).png({ compressionLevel: 9 }).toBuffer();
	if (full.byteLength <= MAX_BYTES) return full;

	for (const colours of [256, 192, 128, 96, 64]) {
		const quantised = await sharp(shot)
			.png({ palette: true, colours, dither: 1, compressionLevel: 9 })
			.toBuffer();
		if (quantised.byteLength <= MAX_BYTES) {
			console.log(`og: ${label} — quantised to ${colours} colours to fit the 1 MB budget`);
			return quantised;
		}
	}
	throw new Error(`${label}: cannot get under ${MAX_BYTES} bytes — simplify the card`);
}

const fonts: Fonts = {
	serif: await fontDataUrl(FONT_FILES.serif),
	serifItalic: await fontDataUrl(FONT_FILES.serifItalic),
	sans: await fontDataUrl(FONT_FILES.sans),
	sansMedium: await fontDataUrl(FONT_FILES.sansMedium)
};

const catalogues = new Map<Locale, Record<string, string>>();
const browser = await chromium.launch();

try {
	for (const target of TARGETS) {
		if (!catalogues.has(target.locale)) {
			catalogues.set(target.locale, await messages(target.locale));
		}
		const page = await browser.newPage({
			viewport: { width: target.width, height: target.height },
			deviceScaleFactor: 2
		});
		await page.setContent(card(target, catalogues.get(target.locale)!, fonts), {
			waitUntil: 'load'
		});
		await page.evaluate(() => document.fonts.ready);
		const shot = await page.screenshot({ type: 'png' });
		await page.close();

		const optimised = await fitToBudget(shot, target.out);
		await writeFile(path.resolve(target.out), optimised);

		const kb = (optimised.byteLength / 1024).toFixed(0);
		console.log(`og: ${target.out} — ${target.width}×${target.height} @2x, ${kb} kB`);
	}
} finally {
	await browser.close();
}
