---
name: DH & AI in African Studies
description: A warm-paper scholarly reading room — cream, deep teal, and a single moment of brass per page.
colors:
  primary-50: '#e6f5f5'
  primary-100: '#b3e0e1'
  primary-200: '#80cccd'
  primary-300: '#4db7b9'
  primary-500: '#0d7377'
  primary-600: '#0b6163'
  primary-700: '#094e50'
  primary-900: '#042828'
  primary-950: '#021616'
  secondary-300: '#dcbe5c'
  secondary-400: '#d4a843'
  secondary-500: '#c49528'
  accent-ink: '#7a5c15'
  cream: '#fdfbf7'
  cream-dark: '#f6f1e5'
  paper: '#ffffff'
  paper-dark: '#1a1815'
  deep: '#0e0d0b'
  raised-dark: '#221f1b'
  ink: '#1d1a16'
  ink-body: '#3a3630'
  ink-muted: '#56514a'
  ink-muted-dark: 'oklch(0.66 0 0)'
  orcid: '#526b08'
typography:
  display:
    fontFamily: "'Instrument Serif', Georgia, 'Times New Roman', serif"
    fontSize: 'clamp(2.5rem, 1.2rem + 5.4vw, 5rem)'
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: '-0.025em'
  page-title:
    fontFamily: "'Instrument Serif', Georgia, 'Times New Roman', serif"
    fontSize: 'clamp(2.125rem, 1.4rem + 3vw, 3.25rem)'
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: '-0.022em'
  section:
    fontFamily: "'Instrument Serif', Georgia, 'Times New Roman', serif"
    fontSize: 'clamp(1.5rem, 1.1rem + 1.6vw, 2rem)'
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: '-0.018em'
  card-title:
    fontFamily: "'Instrument Serif', Georgia, 'Times New Roman', serif"
    fontSize: 'clamp(1.1875rem, 1.05rem + 0.4vw, 1.4375rem)'
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: '-0.012em'
  lede:
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif"
    fontSize: '1.0625rem'
    fontWeight: 300
    lineHeight: 1.65
  prose:
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif"
    fontSize: '1.0625rem'
    fontWeight: 400
    lineHeight: 1.72
  eyebrow:
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif"
    fontSize: '0.75rem'
    fontWeight: 500
    letterSpacing: '0.18em'
  meta:
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif"
    fontSize: '0.75rem'
    fontWeight: 600
    letterSpacing: '0.16em'
  badge:
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif"
    fontSize: '0.6875rem'
    fontWeight: 600
    letterSpacing: '0.16em'
rounded:
  xs: '0.25rem'
  sm: '0.375rem'
  md: '0.5rem'
  lg: '0.75rem'
  xl: '1rem'
  2xl: '1.25rem'
  3xl: '1.75rem'
  full: '9999px'
spacing:
  stack: '1.25rem'
  block: '3.5rem'
  section: 'clamp(4rem, 8vw, 6rem)'
  section-lg: 'clamp(5rem, 10vw, 8rem)'
components:
  button-primary:
    backgroundColor: '{colors.primary-600}'
    textColor: '#ffffff'
    rounded: '{rounded.lg}'
    padding: '0.75rem 1.25rem'
    height: '2.75rem'
  button-primary-hover:
    backgroundColor: '{colors.primary-700}'
  button-accent:
    backgroundColor: '{colors.secondary-500}'
    textColor: '{colors.ink}'
    rounded: '{rounded.lg}'
    padding: '0.75rem 1.25rem'
    height: '2.75rem'
  button-accent-hover:
    backgroundColor: '{colors.secondary-400}'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.primary-700}'
    rounded: '{rounded.lg}'
    padding: '0.75rem 1.25rem'
    height: '2.75rem'
  button-on-dark:
    backgroundColor: 'transparent'
    textColor: '{colors.primary-50}'
    rounded: '{rounded.lg}'
    padding: '0.75rem 1.25rem'
    height: '2.75rem'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.ink-muted}'
    rounded: '{rounded.full}'
    height: '2.75rem'
    width: '2.75rem'
  card:
    backgroundColor: '{colors.paper}'
    rounded: '{rounded.xl}'
  language-badge:
    backgroundColor: 'color-mix(in oklab, #0d7377 10%, transparent)'
    textColor: '{colors.primary-700}'
    rounded: '{rounded.full}'
    padding: '0.3rem 0.625rem'
    typography: '{typography.badge}'
  filter-input:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.lg}'
    height: '2.75rem'
    padding: '0 1rem'
  day-pill:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink-muted}'
    rounded: '{rounded.full}'
    padding: '0.35rem 0.85rem'
    height: '2.75rem'
  day-pill-today:
    backgroundColor: '{colors.secondary-500}'
    textColor: '{colors.ink}'
  callout:
    backgroundColor: 'color-mix(in oklab, #c49528 6%, transparent)'
    rounded: '{rounded.lg}'
    padding: '1rem 1.25rem'
---

# Design System: DH & AI in African Studies

## Overview

**Creative North Star: "The Reading Room"**

This is the visual language of an institute of advanced study: a quiet, warm room where the scholarship is the thing on display and the furniture knows it. The page is warm paper rather than screen-white, the display face is a serif that behaves like set type, and the interface withdraws until it is needed. Nothing here competes with an abstract, a paper title, or a participant's name.

The restraint is structural, not timid. Hierarchy is carried almost entirely by typography — fluid serif sizes with tightening negative tracking as they grow — so the layout needs very few boxes, rules, or shadows to stay legible. Colour follows the same logic: deep teal does the institutional work of links, actions, and focus, while brass appears solidly exactly once per page and otherwise survives as a hairline, a two-pixel rule, or a six-percent wash. A grain texture sits at 3.5% over dark surfaces to keep large fields of colour from reading as flat digital ink.

Withdrawing is not the same as being absent, and that distinction has cost this system more corrections than any other. An interface that recedes still has to announce that a link is a link, that a control can be tapped, that a permalink exists — and on a phone, where there is no hover, "revealed on hover" is a synonym for "not there". So the quiet is load-bearing rather than decorative: every affordance is legible at rest, at a measured contrast, at a measured size. Where the two goals genuinely conflict, the affordance wins and the ornament goes.

The system takes paper seriously in a literal sense too: there is a real print stylesheet, prose is capped by character measure rather than container width, numerals are tabular, and the call for papers is expected to be printed and circulated. Two constraints shape every decision — the site is fully bilingual with English and French as equals, and it must stay light enough for a participant on mobile data in Stellenbosch.

**Key Characteristics:**

- Warm cream page (#fdfbf7); screen-white is reserved for raised surfaces, so elevation reads as a lightness step
- Serif display at a single weight (400); hierarchy from fluid size and negative tracking, never from bold
- Brass used solidly once per page; everywhere else it is a hairline, rule, or wash
- Shadows tinted warm with teal-black (rgb 4 40 40), never neutral
- Semantic role tokens that flip once for dark mode instead of ~40 scattered `dark:` variants
- Measure-capped prose (30em ≈ 69 characters) and ledes (21em ≈ 48)
- Every affordance legible at rest at ≥3:1, and no interactive target below 24px
- Motion is short, eased, and switched off by a universal floor rather than a register of selectors

## Colors

A warm, low-chroma palette: paper and ink at the base, one deep institutional teal doing all the interactive work, and a brass second voice held in reserve.

### Primary

- **Deep Teal Ink** (`primary-500`, #0d7377): the brand voice. The light-mode focus ring, the active segment's text, the scrollbar thumb, badge washes. It is the colour the site is recognised by.
- **Teal, Pressed** (`primary-600`, #0b6163): the primary button's rest state and the inline link colour in light mode. One step darker than the brand tone because it usually carries white text or sits as small text on cream.
- **Teal, Deepest** (`primary-700`, #094e50): primary button hover, secondary button label, the skip link's background, arrow-link rest.
- **Pale Teal** (`primary-300`, #4db7b9): the dark-mode link, the dark-mode focus ring, the dark-mode secondary label. It exists because the light-mode teals go unreadable against near-black — `primary-500` measures 2.92:1 on a raised dark card, where `primary-300` measures 7.4:1.
- **Teal Mist** (`primary-100`, #b3e0e1) and **Teal Haze** (`primary-200`, #80cccd): the inks of last resort on the two surfaces that are dark in _both_ themes, the hero and the footer. `primary-100` measures ~10:1 on `primary-900` and is the focus ring inside `.on-inverse`; `primary-200` is that container's eyebrow, and the dark-mode language badge.
- **Teal Wash** (`primary-50`, #e6f5f5): the label of an outline button on the dark hero, and nothing else.
- **Night Teal** (`primary-900`, #042828) and **Deepest Night Teal** (`primary-950`, #021616): the hero's two-step tonal wash, and the footer's ground in light mode.

### Secondary

- **Brass** (`secondary-500`, #c49528): the accent rule, callout borders, the nav's active-page underline, the "happening now" day pill, and the one solid accent button.
- **Light Brass** (`secondary-400`, #d4a843): the hover state of the accent button, the dark-mode accent ink, the drop cap in dark mode.
- **Pale Brass** (`secondary-300`, #dcbe5c): brass as _text_ on an inverse surface — the hero's italic deck, the milestone label, the footer's column headings. The light-mode brass ink is far too dark against `primary-900`; this is its counterpart, and the two are never interchangeable.
- **Brass Ink** (`accent-ink`, #7a5c15): the only brass you may set text in on paper. It measures 5.5:1 on cream where `secondary-600` manages 3.7:1 and fails AA. Eyebrow labels use it.

### Neutral

- **Warm Paper** (`cream`, #fdfbf7): the page. Not white.
- **Warm Paper, Sunken** (`cream-dark`, #f6f1e5): recessed bands, alternating sections, and the banded header on every interior page.
- **Raised White** (`paper`, #ffffff): card and control surfaces in light mode — the lightness step that reads as "lifted".
- **Deep Night** (`deep`, #0e0d0b): the dark-mode page.
- **Raised Night** (`raised-dark`, #221f1b): the dark-mode card. Deliberately opaque, because translucency over the grain texture goes muddy.
- **Soft Black** (`ink`, #1d1a16): headings and strong text. Warm, never pure black.
- **Reading Ink** (`ink-body`, #3a3630): body prose at 400 weight — lighter than headings, darker than metadata.
- **Muted Ink** (`ink-muted`, #56514a): metadata, captions, placeholders, inactive segments.
- **Muted Ink, Dark** (`ink-muted-dark`, `oklch(0.66 0 0)`): the dark-mode counterpart, chosen against the harder of its two backgrounds rather than against the page — see the Contrast-On-Surface Rule. It stays a step of its own rather than collapsing into `surface-300`, which would leave no interval to `--ink-body`.

Surface, ink, border, accent, link, eyebrow and focus roles are declared once on `:root` and flipped once in `.dark`. The ramps in `@theme` are a palette; the roles are the API, and `@theme inline` re-exports them so `bg-page`, `text-body`, `text-muted` and `border-subtle` are dark-mode-aware on their own.

### Named Rules

**The One Gold Moment Rule.** Brass appears as a solid fill exactly once on any given page. It has two sanctioned forms, and they are mutually exclusive per page: the `.btn-accent` (the hero's primary action, the call for papers' download) and `.day-pill.is-today` (the programme, during the workshop only). Everywhere else brass is a 2px rule, a hairline border, or a 6–10% wash. Its rarity is what makes it read as gold rather than as yellow. Note the honest exception pressure, in two places. `/papers` gives every one of its 25 cards a 2px brass top rule at **full** opacity (`border-t-accent`), so the index carries 25 of them at once — that is **P3-34**, inside the letter of the rule and against the spirit of it. `/programme` then does the same thing a second way: a 2px brass left border on each of its 25 session papers, at 55%. Both are recorded rather than resolved; if either is revisited, the answer is a quieter treatment for the rule itself, not a licence for a second solid fill.

**The Gold-Is-Not-Text Rule.** `--accent` (#c49528) is a graphics colour. Brass _text_ uses `--accent-ink` — #7a5c15 on paper, `secondary-400` in dark — or `secondary-300` on an inverse surface. Setting body or label text in `secondary-500` or `secondary-600` on cream fails WCAG AA and is a defect, not a style choice.

**The Cream-Never-White Rule.** The page is #fdfbf7. Pure white is reserved for raised surfaces. A screen-white page background breaks the elevation model, because "lifted" is expressed as a step _toward_ white.

**The Contrast-On-Surface Rule.** A colour is measured against every surface it actually lands on, not against the page. `--ink-subtle` in dark mode had been checked once, on the page, at 4.65:1 — and shipped 3.93:1 on the raised card, which is where session cards put it: thirteen AA failures on `/programme`, in both locales, on the surface the workshop is actually read on. The failing half was invisible precisely because the passing half existed. Two corollaries: the accessibility sweep runs in **both** colour schemes, since a dark-only failure is a failure; and a role with two backgrounds takes the value that clears the harder one.

**The Inverse-Surface Rule.** The hero and the footer are dark in both themes, so the light _and_ dark values of several ink roles are both wrong against them. Do not hand-write teal utilities to compensate: put `.on-inverse` on the container and let `--focus-ring` and `--eyebrow-ink` inherit. The class is named for the surface, not for one of its consequences, because the next role that needs flipping there belongs in the same place.

## Typography

**Display Font:** Instrument Serif (with Georgia, Times New Roman fallbacks) — self-hosted, 400 and 400-italic only, latin subset preloaded.
**Body Font:** Outfit (with system-ui, -apple-system fallbacks) — self-hosted at 300/400/500/600.
**Numerals:** Outfit with `font-variant-numeric: tabular-nums` wherever figures align (filter counts, the milestone strip, session times).

**Character:** A high-contrast editorial serif against a geometric humanist sans. The serif is used at one weight and allowed to get very large; the sans does all the small, dense, functional work. Body text carries `font-feature-settings: 'ss01', 'cv11'` for a single-storey lowercase g and straight-sided digits, which keeps Outfit from reading generically.

### Hierarchy

- **Display** (400, `clamp(2.5rem, 1.2rem + 5.4vw, 5rem)`, 1.04, -0.025em): hero only, once per site.
- **Page Title** (400, `clamp(2.125rem, 1.4rem + 3vw, 3.25rem)`, 1.08, -0.022em): the `PageHeader` h1 on every route.
- **Section** (400, `clamp(1.5rem, 1.1rem + 1.6vw, 2rem)`, 1.15, -0.018em): section headings within a page.
- **Card Title** (400, `clamp(1.1875rem, 1.05rem + 0.4vw, 1.4375rem)`, 1.25, -0.012em): paper titles, participant names, session names, and an author's own section heading inside an abstract. Fluid rather than fixed, because at a fixed 1.25rem the step down from Section collapsed on wide screens.
- **Lede** (300, 1.0625rem, 1.65, max 21em ≈ 48 characters): the standfirst paragraph under a page title, in muted ink.
- **Prose** (400, 1rem rising to 1.0625rem at 640px, 1.72, max 30em ≈ 69 characters): all body copy and abstracts. 400 rather than 300 — Outfit Light reads washed out on cream at reading sizes.
- **Eyebrow** (500, 0.75rem, 0.18em, uppercase, `--eyebrow-ink`): the small label above a heading. Its ink is a role, not a colour: `--accent-ink` on paper, `primary-200` inside `.on-inverse`.
- **Meta** (600, 0.75rem, 0.16em, uppercase, muted ink): field labels, session times, card metadata.
- **Badge** (600, 0.6875rem, 0.16em, uppercase): the EN/FR language chip, session-type labels, the wordmark's qualifier.

Beneath the eight roles sits a small-end scale of six values, for the dense functional work that has no role of its own: **11px** (`--text-badge`, the floor), **12px** (Tailwind's `text-xs`, and the literal the eyebrow and meta roles set), **13px** (`--text-caption`: filter meta, session times, day pills, footer links), **14px** (`--text-ui-sm` _and_ Tailwind's `text-sm`, one value under two names — `text-sm` is the most-used size utility on the site, 33 call sites against 3), **15px** (`--text-ui`: buttons, inputs, card meta) and **17px** (`--text-reading`: prose). The project names deliberately avoid `--text-body` / `--text-meta` / `--text-eyebrow`, which would collide with the semantic colour utilities and the component classes of the same name. Above the roles, `text-lg` through `text-3xl` appear where a serif line needs a size between two roles: the hero's italic deck, the wordmark, an author's name. One ornamental numeral on `/about` sets its own `clamp()` locally, and stays local on purpose — the eight roles are for text that is read.

### Named Rules

**The Serif-Structures Rule.** Every heading level is Instrument Serif at 400. Hierarchy comes from fluid size and progressively tighter negative tracking — never from weight, and never from Outfit. A bold serif heading is off-system, including inside rendered markdown: `.prose-subhead strong` is returned to 400 for exactly this reason. The one exception is a **label** on a heading tag (an eyebrow, meta or badge role used as an `<h2>`/`<h3>` for document structure): those are Outfit by role, and must say so — see the Layered-Defaults Rule.

**The Measure Rule.** Reading text is capped by characters, not by container, and the cap is expressed in `em` — never `ch`. Prose is 30em (≈69 characters: measured 70 at 1280px, 52 at 375, 44 at 320, EN and FR alike), ledes 21em (≈48). `ch` is the advance of "0", which in Outfit is 0.6975em against a real prose average of 0.435em, so a `ch` cap renders about 1.5× the line length it claims and moves again under the fallback font. Verify a change by rendering and counting, not by reading the declaration. A container narrowed to fix line length is treating the symptom; the measure token is the fix. `.text-prose` and `.prose` carry the cap as part of their role; `.measure-prose` applies it alone, for text that has its own size and colour — session descriptions, page notices, section intros. A paragraph wide enough to read is wide enough to need the cap: uncapped, these ran 126–190 characters at 1280px.

**The Uppercase-Is-A-Label Rule.** Uppercase with wide tracking (0.16–0.18em) means "this is a label". It is never a heading, never a sentence, and never body copy. Uppercase with tracking below 0.16em is a defect, not a variant — one chip should not have three renderings.

**The Eleven-Pixel Floor.** No text on this site is smaller than 11px (`--text-badge`), and the floor holds for lettering drawn inside an SVG exactly as it does for text in the DOM. Two session labels shipped at 10px on the surface most often read on a phone; a hand-copied file icon baked the letters "PDF" into its artwork at 6px, rendering 8.6 × 5px beside a button whose label already said PDF. Icons come from the library and carry no lettering; a legend that has to be read is text.

**The Layered-Defaults Rule.** Element defaults (`body`, `h1…h6`) live in `@layer base`; role classes in `@layer components`; Tailwind utilities above both. Nothing typographic may sit **unlayered**, because unlayered declarations outrank every layer regardless of specificity — which is how a bare `h2 { line-height: 1.12 }` silently voided `.text-section`'s 1.15 on 37 headings, and how `font-semibold` and `tracking-[0.16em]` lost to an `h2` in the footer. Svelte's scoped `<style>` blocks are unlayered too: put a media query inside the block rather than a responsive utility on the element. This trap has been found five times now, and the fifth was inside the reduced-motion rule that exists to be the safety net — so treat "this rule looks inert" as a reason to check the cascade, not a reason to move on. Its plain-specificity cousin is the same family: `.prose p { margin-block: 0 }` at (0,1,1) outranked `.prose > * + *` at (0,1,0) two lines above it, and rendered every abstract on the site as one unbroken column — 66 lines without a paragraph break on the longest, 110 at 320px.

## Layout

Three containers, and nothing else: `container-page` (80rem) for full-width layouts and the programme, `container-wide` (72rem) for card grids and the hero, `container-readable` (56rem) for mixed content and long-form pages. A fourth, `container-prose` (44rem), was declared and never adopted; it is gone rather than aspirational. Inline padding steps 1rem → 1.5rem (640px) → 2rem (1024px).

Vertical rhythm runs on four tokens: `--space-stack` (1.25rem) between paragraphs, `--space-block` (3.5rem) between subsections, `--space-section` (`clamp(4rem, 8vw, 6rem)`) for section padding, and `--space-section-lg` (`clamp(5rem, 10vw, 8rem)`) for major breaks. Two classes carry the block token so no call site has to remember it: `.page-body` opens a page with a 56px interval below the banded header (padding, not margin, so it cannot collapse into the band), and `.block-flow` puts the interval on the container the way `.prose` owns paragraph rhythm — a section rendered behind an `{#if}` cannot forget its own gap, and the last one before an unconditional sibling cannot leave a doubled one behind. Every page terminates with `.page-end`.

Not everything is 56px, deliberately. Chrome intervals stay at 32px, the programme's post-bar gap at 40px, and `/about`'s banded section keeps its own: one value everywhere is monotony, not rhythm. The rhythm token governs the relationship between a page's own blocks.

The header is fixed at `--nav-height` (4.5rem = 72px) with a backdrop blur, and the programme's sticky day bar sits below it at `--day-bar-height` (3.8125rem = 61px in the build). Between them these two variables have seven consumers — the navbar's own row, `main`'s top padding, `scroll-padding-top`, the day bar's `top`, and the `scroll-margin-top` of every day, session and break — so an in-page anchor lands below both bars rather than under them.

Breakpoints are Tailwind's defaults, and three of them do real work: **640px**, where prose steps up a size, filter controls move from stacked to a row, control height tightens from 3rem to 2.75rem, the session time returns to a fixed 7rem gutter, and the venue's logistics lists go side by side; **1024px**, where container padding reaches 2rem; and **1280px** (`xl`), where the desktop nav appears — measured, not assumed, since the link row needs 1205px in French against 1069px in English, so `lg` was 181px too early. Controls are deliberately roomier on mobile because they are thumb targets there. Two breakpoints are content-driven rather than device-driven and say so in place: `max-width: 359px` returns 5.6px of horizontal padding to the day pills at the width where French stops fitting on one row, and `(any-hover: none)` — not `hover: none` — governs the session permalink, so a laptop with a touchscreen keeps the behaviour it has a mouse for.

### Named Rules

**The Three Containers Rule.** Pick one of the three containers. A bespoke `max-width` on a page wrapper is a system violation — if none of the three fits, the missing one is a token, not a one-off. This governs page wrappers; three inner copy blocks (the hero's, the map's intro, the home page's centred section intro) set their own width inside a container, which is a different thing and is fine.

**The Anchor Clearance Rule.** Anything that changes the height of fixed or sticky chrome changes its token, never a hard-coded offset. `--nav-height` is the header's **outer** height — the navbar's inner row is `calc(var(--nav-height) - 1px)`, so the header's own hairline is inside the number rather than added to it. `--day-bar-height` did the same job for the literal `scroll-mt-28` that used to guess at it.

**The Min-Height-Is-A-Floor Rule.** A token consumed as `min-height` is a promise the layout can still break: `min-height` holds a floor, not a ceiling. At 320px the day bar's four pills measured 293.6px against 288px of content, wrapped to a second row, and rendered 113px while `--day-bar-height` still said 61px — putting every day heading 36px _behind_ the bar meant to clear it. `flex-nowrap` plus `overflow-x: auto` makes the height true by construction and lets the row scroll instead of silently lying about its height. If a declared constant describes a rendered box, make the box unable to disagree.

## Elevation & Depth

A near-flat system with warm, tinted shadows used sparingly and almost always as a _response_ rather than a resting state. Depth comes primarily from tonal layering — the cream page against white raised surfaces, and deep night against #221f1b — with shadow as a secondary cue. Every shadow is tinted with teal-black (`rgb(4 40 40)`) rather than neutral black, so lifted surfaces stay in the palette's warmth instead of going grey.

A grain texture (`.grain`, an inline SVG fractal-noise data URI) sits at 3.5% opacity in light and 6% in dark over large dark fields, giving them the tooth of paper stock rather than flat digital ink.

### Shadow Vocabulary

- **xs** (`0 1px 2px 0 rgb(4 40 40 / 0.05)`): buttons at rest.
- **sm** (`0 1px 3px 0 rgb(4 40 40 / 0.06), 0 1px 2px -1px rgb(4 40 40 / 0.04)`): cards at rest, active segment.
- **md** (`0 4px 8px -2px rgb(4 40 40 / 0.08), 0 2px 4px -2px rgb(4 40 40 / 0.04)`): button hover.
- **lg** (`0 12px 20px -4px rgb(4 40 40 / 0.09), 0 4px 8px -4px rgb(4 40 40 / 0.04)`): card hover.
- **xl** (`0 24px 36px -8px rgb(4 40 40 / 0.12), 0 8px 12px -6px rgb(4 40 40 / 0.05)`): reserved for overlays.

### Named Rules

**The Rest-Is-Quiet Rule.** Surfaces sit at `xs`/`sm` at rest. The jump to `lg` plus a 2px lift belongs to hover alone. A card that is already lifted at rest has nowhere to go.

**The Warm Shadow Rule.** Shadows are tinted `rgb(4 40 40)`. A neutral or pure-black shadow is off-system and reads cold against cream — which is also why the hero's overlay is a second step of its own teal rather than `bg-black/20`.

**The One-Layer Rule.** A single surface carries one decorative treatment. The hero used to stack three — a three-stop teal gradient on a diagonal, a brass radial at 18% across 70% of the width, and the grain — and three layers on one surface is exactly the "conference brand" reading this system rejects. It is now one tonal wash between two adjacent steps of the same teal (`primary-900` → `primary-950`), plus the grain. Gradients are not banned; multi-stop, multi-hue, multi-layer ones are.

## Shapes

Radius scales with surface size: pills (`full`) for badges, chips, day pills and icon buttons; 1rem (`xl`) for cards and avatars; 0.75rem (`lg`) for buttons, inputs, selects, and the segmented tray; 0.5rem (`md`) for small buttons and the skip link; 0.25rem (`xs`) for the focus ring's own corner. Nested radii subtract their inset — the segmented control's inner segments use `calc(var(--radius-lg) - 0.25rem)` so the curve stays concentric with the 0.25rem-padded tray.

Borders are hairlines derived by `color-mix` from ink rather than from the grey ramp: `--border-subtle` at 10% ink (12% of `surface-50` in dark), `--border-strong` at 18% (20%), `--border-accent` at 45% brass. This keeps every edge in the palette's warmth and means both themes flip one definition.

The recurring silhouette is the **accent rule** — a 2.75rem × 2px brass bar with fully rounded ends, used as a section marker in place of the multi-colour gradient bars it replaced, and as the alternative to an eyebrow at the head of a page.

### Named Rules

**The Radius-By-Size Rule.** Bigger surface, bigger radius. A pill-shaped card or a sharp-cornered badge is off-system.

## Components

### Buttons

- **Shape:** gently curved (0.75rem), pill (`full`) for icon-only ghosts.
- **Size:** `min-height: 2.75rem` on `.btn` itself, so every variant inherits the touch floor. It used to sit only on `.btn-sm`, which made the small button 44px while the hero's three large CTAs rendered 39–41px — the floor held everywhere except where it mattered most.
- **Primary:** pressed teal (#0b6163) with white text, `xs` shadow, 0.75rem × 1.25rem padding.
- **Accent:** solid brass (#c49528) with **ink** text, not white — brass is a light tone and white on it fails contrast. The one gold moment.
- **Secondary:** transparent with a 1.5px teal border and deep-teal label; lightens to a 10% teal wash on hover, and the label goes `primary-300` in dark.
- **On-dark / quiet-on-dark:** transparent with a pale-teal border (or none), for the dark hero where the teal secondary has nothing to sit against.
- **Ghost:** 2.75rem square, fully round, muted ink, 6% ink wash on hover. Icon-only controls (theme, menu).
- **Hover:** background deepens, shadow steps up one, and the button lifts 1px. **Disabled:** 55% opacity, no transform, no shadow, `not-allowed`.
- **Small variant:** 14px label, tighter padding, 0.5rem radius — and the same 2.75rem floor.

Tailwind's preflight sets `cursor: default` on `button`, so a base rule restores the pointer for every `button` and `[role="button"]` that is not disabled. Without it, a control built from raw utilities rather than `.btn` silently lost its cursor.

### Cards

- **Corner:** 1rem (`xl`). **Background:** raised white (light) / #221f1b (dark). **Border:** 1px `--border-subtle`, owned by the card itself rather than by each consumer. **Shadow:** `sm` at rest.
- **`.card-hover`** is a modifier, not a clone: `lg` shadow, −2px translate, border shifts to brass at 45%.
- **`.card-link`** stretches a pseudo-element over the whole card so the lift is actually clickable, and carries the focus ring. Put it on the single real link inside the card; do not add a duplicate "read more" tab stop.
- A card whose footer must align with its siblings needs every level between the card and that footer to stretch, not just the grid. Two organiser cards the grid had already equalised sat 195px apart on their link rows because each intermediate wrapper stopped at its content.

### Inputs / Fields

- **Style:** raised-white fill, 1px subtle border, 0.75rem radius, height driven by `--control-h` (3rem mobile, 2.75rem from 640px) so input, select, and segmented tray share one baseline.
- **Search:** a 16px Lucide icon inset at 0.875rem with 2.5rem left padding.
- **Select:** native appearance stripped, replaced by an inline SVG chevron — with a separate dark-mode stroke colour, because a data-URI chevron cannot inherit `currentColor`.
- **Hover:** border shifts to 50% teal. **Focus:** the global 2px `--focus-ring` at 3px offset.

### Segmented Control

A labelled tray of mutually exclusive options — the shared idiom for every pick-one control on a listing page. Tray: 5% ink fill, subtle border, `lg` radius, 0.25rem padding. Segments are borderless and transparent; the active one takes a raised-white fill, deep-teal label, and `xs` shadow. Segments stretch to equal shares while stacked on mobile and shrink to intrinsic width from 640px. Semantics are `role="radiogroup"` with `aria-labelledby`, and `role="radio"` plus `aria-checked` on each segment. Exclusivity is the point of the control and `aria-pressed` conveyed none of it; a roving `tabindex` with arrow-key, Home and End handling also collapses the group to a single tab stop.

### Navigation

Fixed, backdrop-blurred, with a subtle bottom hairline. The wordmark is display serif over a tracked uppercase badge line, and it **wraps rather than truncates** — three lines at 320px, two at 375, one from 414 — because `truncate` had been cutting the year off the qualifier on every phone. Three lines of 11px plus the 20px brand still measure 57px inside a 71px row, so `--nav-height` is untouched at every width. Desktop links appear at `xl` and are small sans at 0.875rem; the **active page is marked by a 2px brass bar pinned to the link's bottom edge**, paired with a weight bump, since a 1px inset hairline on cream behind a blur disappeared. The primary action renders as `.btn-primary.btn-sm`. The mobile disclosure animates open via `grid-template-rows: 0fr → 1fr` rather than a height transition, and hides itself with a media query inside its own scoped block — a `xl:hidden` utility loses to the unlayered scoped rule.

### Page Header

A sunken band (`cream-dark`) with a bottom hairline, so interior pages get the banding the home page has and chrome is visibly separated from content. It opens with either an eyebrow **or** an accent rule, never both, and never an eyebrow that repeats the `<h1>` 300px below it. Below the title and lede sits an optional meta row of counts and facts at the meta role, separated by rules that are **pseudo-elements in each item's left gutter, not flex children**: as siblings they wrapped on their own and stranded a rule at the end of a line, and moving them inside the item only moved the orphan to the head of the next one. In the gutter they fall outside the row's box whenever their item starts a line, and `overflow: hidden` takes them from there.

### Rendered Prose (abstracts)

The one rich-text surface on the site: `marked` output rendered at build time into `.prose`. Paragraph rhythm is `--space-stack` via `.prose > * + *`; `strong` goes to 600 in strong ink, `em` to italic (Outfit has no true italic, so nine emphases render as a synthesised oblique — inspected and accepted, because the serif alternative reads worse here); links take the inline-link treatment with a 30% underline that goes solid on hover. An author's own section heading — a paragraph whose entire content is one bold run, which is the only syntax an abstract author had to hand — is tagged `.prose-subhead` at render time, because CSS cannot select "a paragraph that is _only_ a bold run" without also catching one that merely opens with a bold phrase. It sets at the card-title step in the display serif, with 2.25rem above against 0.5rem below, so the interval says which text the heading belongs to. It stays a `<p>`: promoting it to `<h3>` would file it under the preceding "Presented by" heading, which is not what it belongs to.

### Language Badge

The EN/FR chip on paper cards and paper detail pages: uppercase 0.6875rem at 0.16em tracking, deep-teal text on a 10% teal wash, fully rounded. Dark mode lightens the text to `primary-200` and the wash to 18%. The same badge role, tracking included, dresses the inline language tag on a session paper — one chip should not have three renderings.

### Callout

A bordered notice with brass at 45% on the border and a 6% brass wash behind — used for the programme's "preliminary" notice and, as a link, for a paper's place in the schedule. `lg` radius, 1rem × 1.25rem padding, 0.75rem gap to its icon.

### Day Pill

The programme's only in-page navigation, and the control most likely to be tapped while walking into a room: 13px semibold at 0.04em on a raised-white pill with a subtle border, `min-height: 2.75rem`. The bar's own padding gives 2px so the pill can honour the floor. `.is-today` fills it solid brass with ink text — the programme's one gold moment, and only during the workshop.

### Session Row

The densest object on the site, and rendered in **three treatments rather than six badge tints**: a `break` is a quiet dashed rule with no badge and no card, `social` is a muted label, and everything else is a full row with the serif. Panels are numbered continuously across the four days. Below 640px the two times sit on one line joined by an en dash; from 640px the start time returns to a fixed 7rem gutter with a hairline, which is what lets the eye run down a column of start times. Each paper is a 2px brass rule at 55% with 0.75rem of indent. The session permalink is a 1.5rem square anchor pushed to the right edge — visible at rest on coarse pointers, revealed on hover for fine ones, and lined up down the page as one rail rather than at twenty different x positions.

### Scroll Reveal

A single-element `IntersectionObserver` that adds `.visible` and unobserves. Two of its parameters are load-bearing and neither is obvious. `threshold: 0`, because a ratio is a fraction of the _element_: at 0.15 an element taller than ~6.7 viewports can never reach it, and `/about`'s abstract at 320px (4905px EN, 5703px FR) tops out at 0.130 and 0.112 — the workshop's central argument simply never appeared. And `rootMargin: '100000px 0px 0px 0px'`, which pushes the root's top edge far enough up that anything the reader has already scrolled past still counts as intersecting: without it a jump — a reload with scroll restoration, a back-navigation, the `End` key — left everything it skipped at `opacity: 0` permanently, because an element that goes from below the viewport to above it crosses no threshold and fires no callback. Only the top edge moves, so nothing reveals early. The hidden state is also gated on `.js` and lifted in `@media print`, so no-JS readers and printed pages get the content.

### Labelled List

The idiom for a pair of short factual lists that answer each other — what the funding covers, and what it does not. A meta-role heading over an icon-led list (a check or a minus at 15px, in link or muted ink), 0.625rem between items, stacked below 640px and two columns above it, because French items run long enough that a two-column grid at 375px breaks a phrase across four lines a word wide.

### Drop Cap

`.drop-cap::first-letter` floats a 3em display-serif capital in teal (brass in dark mode) with `ss01` enabled. Reserved for the opening paragraph of long-form editorial text.

### Named Rules

**The Resting Affordance Rule.** A link that carries no colour of its own carries a resting underline: `color-mix` at **65% of `primary-600`** in light and **60% of `primary-300`** in dark, 1px thick at a 0.2em offset, going solid `currentColor` on hover and focus. Those percentages are measured, not chosen — 35% light and 40% dark came out at 1.78:1 and 2.18:1, a resting cue you cannot resolve on a phone, which is the original defect wearing a fix's clothes. 65/60 clear 3:1 (measured 3.26:1 and 3.32:1 on the card, 3.20:1 and 3.55:1 under the home page's serif numerals, where the rule steps up to 2px because 1px under a 48px numeral reads as an artefact). **Hover is not an affordance.** 67 of the programme's 91 links had `color: inherit`, no underline, and a colour change on hover alone — no resting cue at all on the page most likely to be read on a phone in a conference room. A link that carries its own glyph (an external-link mark) may opt out; nothing else may. **Two places have not been brought up to this yet** — `PaperCard`'s title link and the paper page's `.author-link`, both still `color: inherit` with a hover-only colour change. That is **P3-20**, and it is a gap in the tree rather than an exemption in the rule: they sit inside cards that already carry a hover lift, which is the argument for their being last, not for their being different.

**The Target Floor Rule.** Two tiers, both declared as `min-height` / `min-width` rather than implied by padding. **2.75rem (44px)** for anything that is a page's own action or navigation: every `.btn` variant, `a.link-arrow`, the day pill, filter controls. **1.5rem (24px)** — WCAG 2.5.8 — for an inline affordance living inside a text row, where 44px would force spacing exceptions on the label beside it: the session permalink, an ORCID mark, a two-digit statistic whose glyphs are only 21.4px wide. Below 24px there is no third tier; there is a defect.

**The Motion Floor Rule.** Reduced motion is a floor, not a register. One universal `transition-duration: 0.01ms !important` — the only `!important` in the stylesheet — because the previous approach named the things that move one at a time, and every transition added afterwards had to remember to enrol. Two never did, and a third was enrolled and still lost, since Svelte compiles a scoped selector to `.name.svelte-hash` and outranks a bare class: twelve transitions were measured surviving the block on `/programme` alone. The floor is safe universally because a transition's answer under reduced motion is always the same — drop the tween, keep the end state, still fire `transitionend`. Movement stays enumerated, because `transform` is not only used for motion (MapLibre centres its markers with one), so `transform: none` cannot be a floor. **Animations** stay named too: `fade-rise` should not play, but the map loader deliberately slows to 1.5s rather than freeze, and a blanket rule would have made it a strobe.

**The Latency-Is-Not-Stagger Rule.** A stagger needs a group. A per-element observer that fires when that element enters the viewport cannot stagger anything — a `delay` prop on it postpones a section the reader has already arrived at. Ten call-for-papers sections passed `delay={0..9}` and eight of them appeared 361–378ms after the reader got there. If entrances should stagger, the group owns the timing; a single observed element gets 0.

## Do's and Don'ts

### Do:

- **Do** reach for a semantic role (`bg-page`, `text-body`, `text-muted`, `border-subtle`) rather than a palette step. The roles flip once for dark mode; a raw ramp value needs a hand-written `dark:` variant and will drift.
- **Do** set brass text in `--accent-ink` on paper and `secondary-300` on an inverse surface, and brass graphics in `--accent`.
- **Do** keep every heading in Instrument Serif at 400 and let size and tracking build the hierarchy.
- **Do** cap reading text with `--measure-prose` (30em) or `--measure-lede` (21em), and count the rendered characters before trusting a new value.
- **Do** give every affordance a resting state: a visible underline at ≥3:1 for a link that inherits its colour, and a control that is present on a coarse pointer without hover. Then check it on the surface it actually sits on, in both themes.
- **Do** declare touch targets as `min-height` / `min-width` — 2.75rem for actions and navigation, 1.5rem for inline affordances. Padding alone does not hold a floor, which is how the hero's large CTAs ended up shorter than `.btn-sm`.
- **Do** put motion behind the tokens (`--duration-base`, `--ease-standard`) and confirm it disappears under `prefers-reduced-motion` — the floor covers transitions, but a new `@keyframes` is a decision you have to make by hand.
- **Do** measure contrast per token **and** per surface, and run the accessibility sweep in both colour schemes. A role with two backgrounds takes the value that clears the harder one.
- **Do** check both locales and both themes before calling a change done, at 320, 375 and 1280. French runs roughly 20% longer, and 320px is where declared constants stop being true.
- **Do** budget page weight deliberately, and gate it: 100 KiB gzip for the largest core JS chunk, 300 KiB for core JS in total, 45 KiB for all CSS, **20 KiB of render-blocking CSS per page**, 90 KiB raw for the footer logo set, with MapLibre's renderer and worker held outside the core budget at their own ceilings. The per-page CSS gate exists because a sitewide total is blind to bytes moving from a lazy asset into a render-blocking one.
- **Do** ship images as WebP with intrinsic `width` and `height` attributes, so a row of logos holds its shape while they load instead of assembling itself out of zero-width boxes.
- **Do** derive workshop state from `milestones.ts` before designing anything that implies a phase. A countdown, a "today" marker or an archival notice that hard-codes its own assumption will be wrong on a date nobody is watching.

### Don't:

- **Don't** use pure white as a page background, or neutral-black shadows. Both break the warm-paper model.
- **Don't** add a second solid brass element to a page. One gold moment.
- **Don't** introduce a bespoke `max-width` on a page wrapper; use one of the three containers.
- **Don't** bold a serif heading or set a heading in Outfit.
- **Don't** hard-code an offset for fixed or sticky chrome; consume `--nav-height` and `--day-bar-height`.
- **Don't** leave a rule unlayered, and don't trust a rule that looks like an inert reset. Tailwind's preflight has already zeroed what you are about to re-zero, and your reset will outrank the rule above it.
- **Don't** rely on `:hover` to reveal a control, or on a `title` attribute to name one. Neither exists for a touch reader or a screen reader, and the programme is read on a phone.
- **Don't** stack decorative layers on one surface — a multi-stop gradient plus a radial plus grain is the conference-brand reading this system exists to avoid.
- **Don't** put lettering inside an icon, and don't set any text below 11px.
- **Don't** drift toward **conference-brand energy** — gradient heroes, urgency countdowns, "Register now" CTAs, sponsor tiers, stock photography of people at laptops. This is a scholarly record, not a commercial event site.
- **Don't** drift toward **tech-startup minimalism** — screen-white, electric blue, sans-only, oversized pills, everything centred. The cream-and-serif world exists in deliberate rejection of it.
- **Don't** drift toward **institutional heaviness** — crests, navy-and-maroon, justified dense serif, grey formal chrome. It would read as stuffy against an argument about equitable, forward-looking practice.
- **Don't** ever reach for **decorative Africanist or orientalist visual shorthand** — ochre-and-sunset palettes, mudcloth or kente pattern fills, silhouette maps of the continent, "ethnic" display faces, acacia-and-savannah imagery. This is an explicit, user-confirmed prohibition. The workshop argues against extractive and stereotyping representation; the design must not enact what the scholarship critiques. Regional specificity, when it is wanted, comes from real content — people, places, institutions, and their own words — never from ornament.
