---
name: DH & AI in African Studies
description: A warm-paper scholarly reading room — cream, deep teal, and a single moment of brass per page.
colors:
  primary-100: '#b3e0e1'
  primary-300: '#4db7b9'
  primary-500: '#0d7377'
  primary-600: '#0b6163'
  primary-700: '#094e50'
  primary-900: '#042828'
  secondary-400: '#d4a843'
  secondary-500: '#c49528'
  accent-ink: '#7a5c15'
  cream: '#fdfbf7'
  cream-dark: '#f6f1e5'
  paper: '#ffffff'
  paper-dark: '#1a1815'
  deep: '#0e0d0b'
  ink: '#1d1a16'
  ink-body: '#3a3630'
  ink-muted: '#56514a'
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
  button-primary-hover:
    backgroundColor: '{colors.primary-700}'
  button-accent:
    backgroundColor: '{colors.secondary-500}'
    textColor: '{colors.ink}'
    rounded: '{rounded.lg}'
    padding: '0.75rem 1.25rem'
  button-accent-hover:
    backgroundColor: '{colors.secondary-400}'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.primary-700}'
    rounded: '{rounded.lg}'
    padding: '0.75rem 1.25rem'
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

The system takes paper seriously in a literal sense too: there is a real print stylesheet, prose is capped by character measure rather than container width, numerals are tabular, and the call for papers is expected to be printed and circulated. Two constraints shape every decision — the site is fully bilingual with English and French as equals, and it must stay light enough for a participant on mobile data in Stellenbosch.

**Key Characteristics:**

- Warm cream page (#fdfbf7); screen-white is reserved for raised surfaces, so elevation reads as a lightness step
- Serif display at a single weight (400); hierarchy from fluid size and negative tracking, never from bold
- Brass used solidly once per page; everywhere else it is a hairline, rule, or wash
- Shadows tinted warm with teal-black (rgb 4 40 40), never neutral
- Semantic role tokens that flip once for dark mode instead of ~40 scattered `dark:` variants
- Measure-capped prose (30em ≈ 69 characters) and ledes (21em ≈ 48)
- Motion is short, eased, and fully surrendered under `prefers-reduced-motion`

## Colors

A warm, low-chroma palette: paper and ink at the base, one deep institutional teal doing all the interactive work, and a brass second voice held in reserve.

### Primary

- **Deep Teal Ink** (`primary-500`, #0d7377): the brand voice. Focus rings, the active segment's text, scrollbar thumb, badge washes. It is the colour the site is recognised by.
- **Teal, Pressed** (`primary-600`, #0b6163): the primary button's rest state and inline link colour in light mode. One step darker than the brand tone because it usually carries white text or sits as small text on cream.
- **Teal, Deepest** (`primary-700`, #094e50): primary button hover, secondary button label, the skip link's background, arrow-link rest.
- **Pale Teal** (`primary-300`, #4db7b9) and **Teal Mist** (`primary-100`, #b3e0e1): the dark-mode link and on-inverse ink. These exist because the light-mode teals go unreadable against near-black.

### Secondary

- **Brass** (`secondary-500`, #c49528): the accent rule, callout borders, the nav's active-page underline, and the one solid accent button.
- **Light Brass** (`secondary-400`, #d4a843): the hover state of the accent button, the dark-mode accent ink, and the drop cap in dark mode.
- **Brass Ink** (`accent-ink`, #7a5c15): the only brass you may set text in. It measures 5.5:1 on cream where `secondary-600` manages 3.7:1 and fails AA. Eyebrow labels use it.

### Neutral

- **Warm Paper** (`cream`, #fdfbf7): the page. Not white.
- **Warm Paper, Sunken** (`cream-dark`, #f6f1e5): recessed bands and alternating sections.
- **Raised White** (`paper`, #ffffff): card and control surfaces in light mode — the lightness step that reads as "lifted".
- **Deep Night** (`deep`, #0e0d0b): the dark-mode page.
- **Raised Night** (#221f1b): the dark-mode card. Deliberately opaque, because translucency over the grain texture goes muddy.
- **Soft Black** (`ink`, #1d1a16): headings and strong text. Warm, never pure black.
- **Reading Ink** (`ink-body`, #3a3630): body prose at 400 weight — lighter than headings, darker than metadata.
- **Muted Ink** (`ink-muted`, #56514a): metadata, captions, placeholders, inactive segments.

Surface, ink, and border roles are defined once on `:root` and flipped once in `.dark`. The ramps in `@theme` are a palette; the roles are the API.

### Named Rules

**The One Gold Moment Rule.** Brass appears as a solid fill exactly once on any given page — the `.btn-accent`. Everywhere else it is a 2px rule, a hairline border, or a 6% wash. Its rarity is what makes it read as gold rather than as yellow.

**The Gold-Is-Not-Text Rule.** `--accent` (#c49528) is a graphics colour. Any brass _text_ uses `--accent-ink` (#7a5c15). Setting body or label text in `secondary-500` or `secondary-600` fails WCAG AA on cream and is a defect, not a style choice.

**The Cream-Never-White Rule.** The page is #fdfbf7. Pure white is reserved for raised surfaces. A screen-white page background breaks the elevation model, because "lifted" is expressed as a step _toward_ white.

## Typography

**Display Font:** Instrument Serif (with Georgia, Times New Roman fallbacks) — self-hosted, 400 and 400-italic only.
**Body Font:** Outfit (with system-ui, -apple-system fallbacks) — self-hosted at 300/400/500/600/700.
**Numerals:** Outfit with `font-variant-numeric: tabular-nums` wherever figures align (filter counts, countdown, session times).

**Character:** A high-contrast editorial serif against a geometric humanist sans. The serif is used at one weight and allowed to get very large; the sans does all the small, dense, functional work. Body text carries `font-feature-settings: 'ss01', 'cv11'` for a single-storey lowercase g and straight-sided digits, which keeps Outfit from reading generically.

### Hierarchy

- **Display** (400, `clamp(2.5rem, 1.2rem + 5.4vw, 5rem)`, 1.04, -0.025em): hero only, once per site.
- **Page Title** (400, `clamp(2.125rem, 1.4rem + 3vw, 3.25rem)`, 1.08, -0.022em): the `PageHeader` h1 on every route.
- **Section** (400, `clamp(1.5rem, 1.1rem + 1.6vw, 2rem)`, 1.15, -0.018em): section headings within a page.
- **Card Title** (400, `clamp(1.1875rem, 1.05rem + 0.4vw, 1.4375rem)`, 1.25, -0.012em): paper titles, participant names, session names. Fluid rather than fixed, because at a fixed 1.25rem the step down from Section collapsed on wide screens.
- **Lede** (300, 1.0625rem, 1.65, max 21em ≈ 48 characters): the standfirst paragraph under a page title, in muted ink.
- **Prose** (400, 1rem rising to 1.0625rem at 640px, 1.72, max 30em ≈ 69 characters): all body copy and abstracts. 400 rather than 300 — Outfit Light reads washed out on cream at reading sizes.
- **Eyebrow** (500, 0.75rem, 0.18em, uppercase, brass ink): the small label above a heading.
- **Meta** (600, 0.75rem, 0.16em, uppercase, muted ink): field labels, session times, card metadata.
- **Badge** (600, 0.6875rem, 0.16em, uppercase): the EN/FR language chip and session-type labels.

Beneath the eight roles sit five **functional size steps** in `@theme`, for the small dense work that has no role of its own. They are named, not improvised, and nothing typographic should introduce a sixth: `--text-badge` 0.6875rem (11px, the floor — no text on this site is smaller), `--text-caption` 0.8125rem (13px: filter meta, session times, captions), `--text-ui-sm` 0.875rem (14px: `.btn-sm`, the skip link, map popup links), `--text-ui` 0.9375rem (15px: buttons, inputs, card meta), `--text-reading` 1.0625rem (17px: prose). They deliberately avoid the names `--text-body` / `--text-meta` / `--text-eyebrow`, which would collide with the semantic colour utilities and the component classes of the same name.

### Named Rules

**The Serif-Structures Rule.** Every heading level is Instrument Serif at 400. Hierarchy comes from fluid size and progressively tighter negative tracking — never from weight, and never from Outfit. A bold serif heading is off-system. The one exception is a **label** on a heading tag (an eyebrow, meta or badge role used as an `<h2>`/`<h3>` for document structure): those are Outfit by role, and must say so — see the Layered-Defaults Rule.

**The Measure Rule.** Reading text is capped by characters, not by container, and the cap is expressed in `em` — never `ch`. Prose is 30em (≈69 characters), ledes 21em (≈48). `ch` is the advance of "0", which in Outfit is 0.6975em against a real prose average of 0.435em, so a `ch` cap renders about 1.5× the line length it claims and moves again under the fallback font. Verify a change to these by rendering and counting, not by reading the declaration. A container narrowed to fix line length is treating the symptom; the measure token is the fix.

**The Uppercase-Is-A-Label Rule.** Uppercase with wide tracking (0.16–0.18em) means "this is a label". It is never a heading, never a sentence, and never body copy. Uppercase with tracking below 0.16em is a defect, not a variant — one chip should not have three renderings.

**The Layered-Defaults Rule.** Element defaults (`body`, `h1…h6`) live in `@layer base`; role classes in `@layer components`; Tailwind utilities above both. Nothing typographic may sit **unlayered**, because unlayered declarations outrank every layer regardless of specificity — which is how a bare `h2 { line-height: 1.12 }` silently voided `.text-section`'s 1.15 on 37 headings, and how `font-semibold` and `tracking-[0.16em]` lost to an `h2` in the footer. Svelte's scoped `<style>` blocks are unlayered too: use a media query inside the block rather than a responsive utility on the element.

## Layout

Four containers, and nothing else: `container-page` (80rem) for full-width layouts, `container-wide` (72rem) for card grids, `container-readable` (56rem) for mixed content pages, and `container-prose` (44rem) for long-form text. Inline padding steps 1rem → 1.5rem (640px) → 2rem (1024px).

Vertical rhythm runs on four tokens rather than ad-hoc utilities: `--space-stack` (1.25rem) between paragraphs, `--space-block` (3.5rem) between subsections, `--space-section` (`clamp(4rem, 8vw, 6rem)`) for section padding, and `--space-section-lg` (`clamp(5rem, 10vw, 8rem)`) for major breaks. Every page terminates with `.page-end` so page bottoms agree.

The header is fixed at `--nav-height` (4.5rem) with a backdrop blur. That one variable is consumed in three places — the navbar's own height, the main element's top padding, and `scroll-padding-top` — so in-page anchors (a programme session, a participant) land below the bar rather than under it.

Breakpoints are Tailwind's defaults; 640px is the meaningful one, where prose steps up a size, filter controls move from stacked to a row, and control height tightens from 3rem to 2.75rem. Controls are deliberately roomier on mobile because they are thumb targets there.

### Named Rules

**The Four Containers Rule.** Pick one of the four containers. A bespoke `max-width` on a page wrapper is a system violation — if none of the four fits, the missing one is a token, not a one-off.

**The Anchor Clearance Rule.** Anything that changes header height changes `--nav-height`, never a hard-coded offset. Four consumers depend on it staying the single source: the navbar's own row, `main`'s top padding, `scroll-padding-top`, and the programme's sticky day-bar `top`. The token is the header's **outer** height — the navbar's inner row is `calc(var(--nav-height) - 1px)` so the header's own hairline is inside the number rather than added to it. Sessions and days additionally carry `scroll-mt-28` to clear the day-bar; that literal is the one offset still not derived.

**The Measure Rule Applies To Any Reading Text.** `.text-prose` and `.prose` carry the cap as part of their role; `.measure-prose` applies it alone, for text that has its own size and colour — session descriptions, page notices, section intros. A paragraph wide enough to read is wide enough to need the cap: uncapped, these ran 126–190 characters at 1280px.

## Elevation & Depth

A near-flat system with warm, tinted shadows used sparingly and almost always as a _response_ rather than a resting state. Depth comes primarily from tonal layering — the cream page against white raised surfaces, and deep night against `#221f1b` — with shadow as a secondary cue. Every shadow is tinted with teal-black (`rgb(4 40 40)`) rather than neutral black, so lifted surfaces stay in the palette's warmth instead of going grey.

A grain texture (`.grain`, an inline SVG fractal-noise data URI) sits at 3.5% opacity in light and 6% in dark over large dark fields, giving them the tooth of paper stock rather than flat digital ink.

### Shadow Vocabulary

- **xs** (`0 1px 2px 0 rgb(4 40 40 / 0.05)`): buttons at rest.
- **sm** (`0 1px 3px 0 rgb(4 40 40 / 0.06), 0 1px 2px -1px rgb(4 40 40 / 0.04)`): cards at rest, active segment.
- **md** (`0 4px 8px -2px rgb(4 40 40 / 0.08), 0 2px 4px -2px rgb(4 40 40 / 0.04)`): button hover.
- **lg** (`0 12px 20px -4px rgb(4 40 40 / 0.09), 0 4px 8px -4px rgb(4 40 40 / 0.04)`): card hover.
- **xl** (`0 24px 36px -8px rgb(4 40 40 / 0.12), 0 8px 12px -6px rgb(4 40 40 / 0.05)`): reserved for overlays.

### Named Rules

**The Rest-Is-Quiet Rule.** Surfaces sit at `xs`/`sm` at rest. The jump to `lg` plus a 2px lift belongs to hover alone. A card that is already lifted at rest has nowhere to go.

**The Warm Shadow Rule.** Shadows are tinted `rgb(4 40 40)`. A neutral or pure-black shadow is off-system and reads cold against cream.

## Shapes

Radius scales with surface size: pills (`full`) for badges, chips, and icon buttons; 1rem (`xl`) for cards; 0.75rem (`lg`) for buttons, inputs, selects, and the segmented tray; 0.5rem (`md`) for small buttons and the skip link; 0.25rem (`xs`) for the focus ring's own corner. Nested radii subtract their inset — the segmented control's inner segments use `calc(var(--radius-lg) - 0.25rem)` so the curve stays concentric with the 0.25rem-padded tray.

Borders are hairlines derived by `color-mix` from ink rather than from the grey ramp: `--border-subtle` at 10% ink, `--border-strong` at 18%, `--border-accent` at 45% brass. This keeps every edge in the palette's warmth and means both themes flip one definition.

The recurring silhouette is the **accent rule** — a 2.75rem × 2px brass bar with fully rounded ends, used as a section marker in place of the multi-colour gradient bars it replaced.

### Named Rules

**The Radius-By-Size Rule.** Bigger surface, bigger radius. A pill-shaped card or a sharp-cornered badge is off-system.

## Components

### Buttons

- **Shape:** gently curved (0.75rem), pill (`full`) for icon-only ghosts.
- **Primary:** pressed teal (#0b6163) with white text, `xs` shadow, 0.75rem × 1.25rem padding.
- **Accent:** solid brass (#c49528) with **ink** text, not white — brass is a light tone and white on it fails contrast. The one gold moment.
- **Secondary:** transparent with a 1.5px teal border and deep-teal label; lightens to a 10% teal wash on hover.
- **On-dark / quiet-on-dark:** transparent with a pale-teal border, for the dark hero where the teal secondary has nothing to sit against.
- **Ghost:** 2.75rem square, fully round, muted ink, 6% ink wash on hover. Icon-only controls (theme, menu).
- **Hover:** background deepens, shadow steps up one, and the button lifts 1px. **Disabled:** 55% opacity, no transform, no shadow, `not-allowed`.
- **Small variant:** 2.75rem minimum height — a deliberate touch-target floor, not a visual choice.

### Cards

- **Corner:** 1rem (`xl`). **Background:** raised white (light) / #221f1b (dark). **Border:** 1px `--border-subtle`, owned by the card itself rather than by each consumer. **Shadow:** `sm` at rest.
- **`.card-hover`** is a modifier, not a clone: `lg` shadow, −2px translate, border shifts to brass at 45%.
- **`.card-link`** stretches a pseudo-element over the whole card so the lift is actually clickable, and carries the focus ring. Put it on the single real link inside the card; do not add a duplicate "read more" tab stop.

### Inputs / Fields

- **Style:** raised-white fill, 1px subtle border, 0.75rem radius, height driven by `--control-h` (3rem mobile, 2.75rem from 640px) so input, select, and segmented tray share one baseline.
- **Search:** a 16px Lucide icon inset at 0.875rem with 2.5rem left padding.
- **Select:** native appearance stripped, replaced by an inline SVG chevron — with a separate dark-mode stroke colour, because a data-URI chevron cannot inherit `currentColor`.
- **Hover:** border shifts to 50% teal. **Focus:** the global 2px teal focus ring at 3px offset.

### Segmented Control

A labelled tray of mutually exclusive options — the shared idiom for every pick-one control on a listing page. Tray: 5% ink fill, subtle border, `lg` radius, 0.25rem padding. Segments are borderless and transparent; the active one takes a raised-white fill, deep-teal label, and `xs` shadow. Segments stretch to equal shares while stacked on mobile and shrink to intrinsic width from 640px. Semantics are `role="radiogroup"` with `aria-labelledby`, and `role="radio"` plus `aria-checked` on each segment. Exclusivity is the point of the control, and `aria-pressed` conveyed none of it; a roving `tabindex` with arrow-key, Home and End handling also collapses the group to a single tab stop.

### Navigation

Fixed, backdrop-blurred, with a subtle bottom hairline. The wordmark is display serif over a tracked uppercase meta line. Desktop links are small sans at 0.875rem; the **active page is marked by a 2px brass bar pinned to the link's bottom edge** — the navbar's one use of the accent. The primary action renders as `.btn-primary.btn-sm`. Mobile menu animates open via `grid-template-rows: 0fr → 1fr` rather than a height transition.

### Language Badge

The EN/FR chip on paper cards and paper detail pages: uppercase 0.6875rem at 0.16em tracking, deep-teal text on a 10% teal wash, fully rounded. Dark mode lightens the text to `primary-200` and the wash to 18%.

### Callout

A bordered notice with brass at 45% on the border and a 6% brass wash behind — used for the programme's "preliminary" notice. `lg` radius, 1rem × 1.25rem padding, 0.75rem gap to its icon.

### Drop Cap

`.drop-cap::first-letter` floats a 3em display-serif capital in teal (brass in dark mode) with `ss01` enabled. Reserved for the opening paragraph of long-form editorial text.

## Do's and Don'ts

### Do:

- **Do** reach for a semantic role (`bg-page`, `text-body`, `border-subtle`) rather than a palette step. The roles flip once for dark mode; a raw ramp value needs a hand-written `dark:` variant and will drift.
- **Do** set brass text in `--accent-ink` (#7a5c15) and brass graphics in `--accent` (#c49528).
- **Do** keep every heading in Instrument Serif at 400 and let size and tracking build the hierarchy.
- **Do** cap reading text with `--measure-prose` (30em) or `--measure-lede` (21em), and count the rendered characters before trusting a new value.
- **Do** give any new interactive control a 2.75rem minimum touch target and confirm it against the existing `--control-h` baseline. Declare it as `min-height`; padding alone does not hold it, which is how the hero's large CTAs ended up shorter than `.btn-sm`.
- **Do** put motion behind the tokens (`--duration-base`, `--ease-standard`) and confirm it disappears under `prefers-reduced-motion`.
- **Do** check both locales and both themes before calling a change done. French runs roughly 20% longer, and several colours are defined only in the `.dark` block.
- **Do** budget page weight deliberately. A meaningful share of participants arrive on mobile data.

### Don't:

- **Don't** use pure white as a page background, or neutral-black shadows. Both break the warm-paper model.
- **Don't** add a second solid brass element to a page. One gold moment.
- **Don't** introduce a bespoke `max-width`; use one of the four containers.
- **Don't** bold a serif heading or set a heading in Outfit.
- **Don't** hard-code a header offset; consume `--nav-height`.
- **Don't** drift toward **conference-brand energy** — gradient heroes, urgency countdowns, "Register now" CTAs, sponsor tiers, stock photography of people at laptops. This is a scholarly record, not a commercial event site.
- **Don't** drift toward **tech-startup minimalism** — screen-white, electric blue, sans-only, oversized pills, everything centred. The cream-and-serif world exists in deliberate rejection of it.
- **Don't** drift toward **institutional heaviness** — crests, navy-and-maroon, justified dense serif, grey formal chrome. It would read as stuffy against an argument about equitable, forward-looking practice.
- **Don't** ever reach for **decorative Africanist or orientalist visual shorthand** — ochre-and-sunset palettes, mudcloth or kente pattern fills, silhouette maps of the continent, "ethnic" display faces, acacia-and-savannah imagery. This is an explicit, user-confirmed prohibition. The workshop argues against extractive and stereotyping representation; the design must not enact what the scholarship critiques. Regional specificity, when it is wanted, comes from real content — people, places, institutions, and their own words — never from ornament.
