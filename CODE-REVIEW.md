# Repository & Website Review — July 2026

A full-repo examination covering architecture, maintainability, performance, SEO, accessibility, and visual design. Findings were verified against the actual code (file:line references throughout) and against a local production build rendered in a headless browser (desktop 1440px, tablet 768px, mobile 390px, light + dark, EN + FR).

**Overall assessment:** this is a well-engineered site. The data-driven programme (sessions reference presentations/people by id), the `import.meta.glob` collections for participants/presentations, the design-token system in `app.css`, the CI pipeline (format + lint + svelte-check + build on every PR), and the bilingual prerender/hreflang/sitemap plumbing are all genuinely solid. The findings below are ranked by impact; the top tier contains a handful of real bugs, the rest are refactoring and polish opportunities.

---

## Tier 1 — Correctness bugs

### 1.1 Countdown targets the viewer's timezone, not South Africa's

`src/lib/components/home/Countdown.svelte:8-9`:

```ts
const startDate = new Date(siteConfig.dates.start + 'T09:00:00').getTime();
const endDate = new Date(siteConfig.dates.end + 'T18:00:00').getTime();
```

An ISO datetime **without an offset** is parsed in the visitor's local timezone. A visitor in UTC−7 counts down to 09:00 *their* time — nine hours late — and the "started"/"ended" state transitions fire at the wrong moment. Fix is one line: append `+02:00` (SAST has no DST, so a fixed offset is safe). The same pattern exists in `DownloadCFPButton.svelte:25-43`, where `new Date('2026-04-30')` is parsed as UTC midnight and can render as "29 April" for negative-offset users.

### 1.2 ScrollReveal makes content invisible whenever the IntersectionObserver never fires

`src/app.css:501-518` sets `.scroll-reveal { opacity: 0; transform: translateY(16px) }`; the `.visible` class is only ever added by JS (`ScrollReveal.svelte`). With JS disabled, blocked, or failed (hydration error, print-to-PDF, some crawlers/preview tools), the SSR'd HTML is present but permanently invisible. This is not hypothetical: in full-page browser captures of the built site, **Days 2–3 of the programme and nearly the entire Call for Papers page render as blank regions**. The `prefers-reduced-motion` rescue at `app.css:522-529` doesn't cover the no-JS case.

**Fix (small):** add a `no-js` class on `<html>` in `app.html`, swap it to `js` in the existing inline theme script, and scope the hidden state to `.js .scroll-reveal`. Or simply add `<noscript><style>.scroll-reveal{opacity:1;transform:none}</style></noscript>`.

### 1.3 Unkeyed `{#each}` + imperative image fallback = stale avatars after filtering

- `ParticipantGrid.svelte:10` — `{#each participants as participant}` has **no key** (compare `PaperGrid.svelte:10`, which correctly keys by `presentation.id`).
- `ParticipantCard.svelte:35-39` / `OrganizerCard.svelte:31-35` — the `onerror` handler mutates the DOM (`target.style.display = 'none'`, un-hides the sibling initials span).

When the filter changes the array, Svelte reuses card DOM by position, so a card that hid its broken image can be recycled for a person *with* a valid photo — showing initials instead of the photo (or vice versa). Fix: key the each block by `participant.id`, and replace the imperative fallback with declarative state (`let failed = $state(false)` + `{#if image && !failed}`).

### 1.4 The build depends on a CDN fetch of an unpinned plugin

`project.inlang/settings.json:4` loads the message-format plugin from `https://cdn.jsdelivr.net/npm/@inlang/plugin-message-format@latest/dist/index.js` at **build time**, pinned to `@latest`. Two problems, both experienced first-hand during this review:

- If the fetch fails or jsdelivr serves something unexpected, Paraglide logs a WARN but still reports "Compilation complete" with **zero messages**, and the build later dies with a cryptic `TypeError: (void 0) is not a function` during prerender. A breaking release of the plugin would take down deploys the same way.
- Builds are not reproducible offline.

**Fix:** add `@inlang/plugin-message-format` as a devDependency and reference it locally — `"modules": ["./node_modules/@inlang/plugin-message-format/dist/index.js"]` (verified working). At minimum, pin an exact version in the CDN URL.

---

## Tier 2 — High-impact maintainability (duplication)

### 2.1 `ParticipantFilter` and `PaperFilter` are the same component twice (~590 duplicated lines)

`src/lib/components/participants/ParticipantFilter.svelte` and `src/lib/components/papers/PaperFilter.svelte` (296 lines each) differ only in prop names, one data-source import, and the search placeholder — a mechanical diff confirms the entire ~195-line `<style>` block is byte-identical. `PaperFilter` even reuses the participants' message keys (`m.participants_filter_country_all()` etc., lines 50-96). Extract a single `FilterBar.svelte` taking `items`, `countries`, bindable `query/country/language`, and a placeholder; rename the shared message keys to neutral `filter_*`.

The supporting utils duplicate too: `participant-filter.ts` and `paper-filter.ts` both define an identical `normalize()` (diacritic stripping) and identical filter-options interfaces. Move to a shared `utils/filter.ts`.

### 2.2 `ParticipantCard` / `OrganizerCard` share ~70% of their markup

Identical: `getInitials()` (13-20 / 10-17), the avatar container, the 20-line inline ORCID SVG (89-110 / 72-93), the website-link block, and the image-fallback logic from finding 1.3. Extract `Avatar.svelte`, `OrcidLink.svelte`, and move `getInitials` to utils — then the two cards become thin variants (or one `PersonCard`). Similarly, the `.language-badge` style block is defined identically in `PaperCard.svelte:59-71` and `papers/[slug]/+page.svelte:94-111` — promote to `app.css` or a tiny component.

### 2.3 The sponsor/funder list is maintained in three places

`Footer.svelte:6-42`, `generate-cfp-pdf.ts:138-146`, and `SEO.svelte:90-118` each hand-maintain the same seven organizations in different shapes (and the SEO copy already lists DFG twice, in `funder` and `sponsor`). Create `src/lib/data/sponsors.ts` as the single source; map it into the footer, the PDF, and the JSON-LD.

### 2.4 Smaller duplications

- `formatDate`/`formatDateRange` and the four-item `keyDates` array exist in both `CFPSection.svelte:28-56` and `DownloadCFPButton.svelte:25-43,84-95` → `utils/date.ts`.
- Seven `+page.ts` files repeat `export const entries = () => [{ lang: '' }, { lang: 'fr' }]` → export once and re-export.
- `people.ts:10-42` hand-copies six fields into `Person`; use `Pick<Organizer, …> & { isOrganizer: boolean }` and object spread.
- `cfp_funding_text` (messages) duplicates `venueInfo.logisticsInfo` (`venue.ts:19`) verbatim — decide a rule: long-form bilingual prose lives in data files as `LocalizedString`, short UI chrome lives in Paraglide.

---

## Tier 3 — Data model

### 3.1 Participant bios bypass i18n entirely

`types/index.ts:28` declares `bio?: string` for participants (vs `LocalizedString` for organizers), and `ParticipantCard.svelte:72` renders it raw. The result is visible on the live pages: some bios are French, some English, regardless of the page language (e.g. Eliette Ngo Tjomb's French bio on the English participants page). Make `bio` a `LocalizedString` and render with `t()`; where a translation doesn't exist yet, duplicate the source text so both branches are defined.

### 3.2 Authorship is dual-sourced

Papers declare `authors: string[]` (14 of 26 do) while participants declare a reverse `presentationId`; `getPresentationAuthors` (`presentations/index.ts:38-45`) merges both. Editing one side but not the other silently produces mismatched author lists between paper pages and participant cards. Make the presentation's `authors` array canonical and derive the reverse link — this deletes 30+ hand-maintained back-references.

### 3.3 Dead schema fields and missing integrity checks

- `coordinates` is **required** on every Participant/Organizer (36 hand-maintained lat/lng pairs) but read exactly once — for the venue, not people (`MapEmbed.svelte:4`). Remove it from person types unless a participant map is planned.
- Nothing validates that `presentationId` / `authors[]` / `speakers[]` / `chair` ids resolve. A typo fails silently. A ~20-line build-time check (or CI script) would catch every cross-reference bug.

---

## Tier 4 — Performance

| Issue | Where | Fix |
|---|---|---|
| Organizer photos up to **939 KB** for a 112px avatar (`emmanuel-ngue-um.jpg`; 4 images ≈ 1.45 MB, over half of `static/`) — participants are already 3–39 KB WebP | `static/images/organizers/` | Convert to ~256px WebP like the participants |
| `sharp` is a devDependency but no script uses it | `package.json:30` | Add `scripts/optimize-images.mjs` + npm script, or drop the dep |
| ~35 `<img>` tags load eagerly | `ParticipantCard.svelte:31`, `OrganizerCard.svelte:27`, `Footer.svelte:63` | `loading="lazy" decoding="async"` (+ width/height) |
| Render-blocking Google Fonts CDN; meanwhile `static/fonts/Outfit-*.ttf` (151 KB) sit unused — no `@font-face` anywhere | `app.html:12-15` | Self-host both families as woff2 with `font-display: swap` (also a GDPR consideration given DFG funding), delete the orphan .ttf files |
| `marked` is bundled into client chunks although abstracts are prerendered; `abstract.ts` also drags `marked` into the papers *list* page, which only needs `abstractToPlainText` | `utils/abstract.ts:1`, `papers/[slug]/+page.svelte:15` | Render markdown in `load()` (build time); split plain-text helpers into a marked-free module |
| `@skeletonlabs/skeleton-svelte` is never imported anywhere; `@skeletonlabs/skeleton` is used only for its `--color-surface-*` theme scale, and `app.css` deliberately fights its `.btn`/`.card` utilities | `package.json:41-42`, `app.css:3-5` | Drop `skeleton-svelte` outright; consider inlining the ~11 surface color tokens and dropping `skeleton` too, which also removes the unlayered-override hacks (`app.css:179`, `:308`, `:341`, `:587`) |

Already done right: jsPDF is dynamically imported only on click, so its ~340 KB stays out of the initial load.

---

## Tier 5 — SEO & i18n architecture

### 5.1 The `Event` JSON-LD is emitted on every page under that page's title

`SEO.svelte:40-127` unconditionally injects a full `schema.org/Event` with `name: title` — so `/papers/[slug]` publishes an Event named after a paper (alongside its own, correct, `ScholarlyArticle`), and every other page adds a near-duplicate Event entity. Emit the Event only on the home page (the `additionalSchema` prop already exists for this); other pages should stay `WebPage`/`ScholarlyArticle` with `isPartOf`. While there: `MixedEventAttendanceMode` + `VirtualLocation` claims hybrid attendance (verify that's true), `offers` advertises free `InStock` tickets pointing at the CFP page, and `startDate` lacks a time/offset.

### 5.2 The `globalVariable` Paraglide strategy works by accident of sequential prerendering

The locale is a module-level global set in `[[lang]]/+layout.ts:6`; prerendered FR pages come out correct only because SvelteKit renders pages sequentially. Consequences today: language switching requires full page reloads (`LanguageSwitcher.svelte:18` and the layout's browser-language redirect both use `window.location.href`), and `<html lang>` is never updated on client-side navigation. Consequence tomorrow: any concurrent rendering would cross-contaminate EN/FR. Moving to Paraglide's `url` strategy (locale derived from the `[[lang]]` path you already have) fixes all three. If you keep `globalVariable`, document the sequential-prerender assumption and add a post-build smoke test (`build/fr/index.html` exists and contains a French string) so CI catches regressions.

### 5.3 Smaller SEO items

- No `+error.svelte` — unknown URLs get SvelteKit's unbranded, English-only default shell via `404.html`.
- Sitemap lacks `<lastmod>`; `og:image` lacks `og:image:width/height`; no `theme-color` meta, `apple-touch-icon`, or web manifest.
- Correct and worth preserving: canonical + hreflang + `x-default`, per-locale prerender `entries`, the bilingual sitemap with `xhtml:link` alternates, `robots.txt`.

---

## Tier 6 — Accessibility

1. **Filter results are never announced** — no `aria-live` region exists anywhere; typing in search silently changes the list. Add `role="status"`/`aria-live="polite"` to the "showing X of Y" count (`ParticipantFilter.svelte:89-92`, `PaperFilter.svelte:89-92`).
2. **Collapsed mobile menu stays tab-reachable** — it's hidden with `max-h-0` + `overflow-hidden` (`Navbar.svelte:107-125`), so keyboard users tab through invisible links. Add `inert` when closed, plus `aria-controls` on the toggle.
3. **Heading levels skip** — programme, participants, and papers pages jump h1 → h3/h4 (e.g. `ScheduleDay.svelte:11` h3, `SessionCard.svelte:83` h4, no h2 anywhere on the page). Add (visually-hidden if needed) h2 section headings.
4. **Contrast** — `.text-eyebrow` uses `secondary-600` `#a47d22` on cream ≈ 3.7:1 at 12px (below AA 4.5:1); used site-wide. `secondary-700` passes. Countdown labels `text-white/50` at 11px and the low-opacity session-type badges (`SessionCard.svelte:16-18`) are also borderline.
5. **Dark-mode toggle** — no `aria-pressed`, and SSR always renders the moon icon so dark-preference users see an icon flip on hydration (`Navbar.svelte:11-13`).
6. Untranslated `title="STIAS Location Map"` on the map iframe (`MapEmbed.svelte:10`).

---

## Tier 7 — Visual / design observations (from rendered screenshots)

1. **The navbar breaks at the 768px breakpoint even in English**: the brand wordmark wraps to three lines, "Venue & Travel" and "Call for Papers" wrap internally, and the language switcher clips off the right edge. French labels ("Appel à contributions", "Participant·es") are longer still. Move the desktop nav from `md:` to `lg:` (hamburger up to 1024px) — cheapest reliable fix.
2. **Open mobile menu sits on a translucent panel over the hero**, so hero text bleeds through behind the links. Legible but messy; increase panel opacity or give the open menu a solid surface.
3. **The participants page is a ~13,000px single-column scroll.** With 30+ people and some very long bios, consider: truncating bios with an expand control, an A–Z jump index, or a denser two-column layout for the bio cards. (Fixing 3.1 will also shorten the French/English duplication feel.)
4. **The venue page is noticeably thin** — one paragraph, logistics, and a map. Given an international audience flying to Stellenbosch: airport/transfer guidance, accommodation notes, a photo of STIAS, and a link to visa info would earn the "& Travel" in the page title.
5. `about/+page.svelte:22-25` renders the same string twice in a row (eyebrow and h2 both use `m.section_thematic_axes()`); the participants page's h1 is "Organisers" though the page contains everyone (`participants/+page.svelte:26`).
6. Dark mode is generally well executed (no-flash inline script, thorough per-component overrides). Typography system (Instrument Serif display + Outfit) is distinctive and consistent — worth keeping as-is.

---

## Tier 8 — Project hygiene

- **README** (7 lines) has no setup instructions — Node 24 requirement, `npm install` / `npm run dev`, the Paraglide `prepare` step, deployment notes, license. This is the main onboarding gap.
- **`implementation-plan.md`** (24 KB, repo root) is stale — it says Skeleton v3; the repo uses v4. Move to `docs/` and mark historical, or delete.
- **Unused i18n keys**: `footer_organised_by`, `footer_hosted_by` (defined in both languages, referenced nowhere); `session_workshop` is wired into `SessionCard` but no session has `type: 'workshop'`.
- **Testing**: none exists; for a static site the highest-value guardrail is a small post-build smoke test (FR page contains French, sitemap lists all papers, no zero-byte HTML) — it directly protects the two fragile properties found above (1.4 and 5.2).
- `.nvmrc` pins only the major (`24`); consider an exact pin for reproducible builds.
- CI itself is in good shape: format/lint/check/build all run as PR gates, Node from `.nvmrc`, npm cache, deploy correctly gated off PRs.

---

## Suggested sequencing

1. **Bugs first** (small diffs): countdown `+02:00`; ScrollReveal no-JS fallback; key the participant `{#each}` + declarative image fallback; pin/vendor the inlang plugin.
2. **Quick wins**: organizer images → WebP; `loading="lazy"`; `aria-live` on filter counts; `inert` mobile menu; scope Event JSON-LD to home; drop `@skeletonlabs/skeleton-svelte`; delete unused fonts/keys; nav breakpoint `md:` → `lg:`.
3. **Refactors**: unify the two filters; extract Avatar/OrcidLink; `sponsors.ts`; date utils; shared `entries`.
4. **Data model**: localize participant bios; single-source authorship; drop `coordinates`; add an id-integrity check.
5. **Deliberate architecture change**: Paraglide `url` strategy (removes reload-based language switching and the prerender fragility) + a build smoke test.
6. **Content**: expand the venue page; README.
