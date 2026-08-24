# Phase 1 findings backlog — 17 August 2026

Method: dual-agent critique (Assessment A design review · Assessment B detector and browser evidence, run isolated from each other) plus a five-dimension technical audit. Findings marked **[converged]** were reached independently by two or more assessments; those carry the highest confidence.

| Score                                 | Result                                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design health (Nielsen, renormalised) | **25 / 36** — Acceptable, just under Good. Error Prevention scored `n/a`: no forms, no auth, no destructive action, nothing a user can get wrong. |
| Audit health                          | **14 / 20** — Good                                                                                                                                |
| Issue counts                          | P0 **0** · P1 **8** · P2 **8** · P3 **11** (at diagnosis; later passes raised P2-9…P2-20 and P3-12…P3-33)                                         |

The site is well built. Nine routes carry exactly one `<h1>` each with zero heading-level skips, zero unlabelled controls, zero missing `alt`, zero positive `tabindex`, and zero horizontal overflow at 320px in **either** locale. Only two hard-coded hex values exist across all `.svelte` files. The defects that matter cluster in two places: **colour tokens that were never flipped for dark or inverse surfaces**, and **`lang` marking on mixed-language content** — two of the three binding constraints.

**Design specificity verdict: authored for this product, decisively.** The content model _is_ the interface — a paper resolves its session, siblings and authors; a participant resolves their paper and its anchor; panel numbers run continuously across four days from derived data. None of it is hand-maintained, which is why it is right on all 25 papers rather than on the three someone remembered. The one drift toward the anti-reference list is the home hero, discussed in P2-8.

---

## Status

**Fixed in `a97f92b` (17 August 2026)** — the four binding-constraint failures, chosen as the first Phase 2 pass: **P1-1** focus ring, **P1-3** `lang` markers, **P1-5** sticky day-bar, **P1-8** avatar initials. Each was measured before and after in the browser; the "before" figures below reproduce exactly, and the after figures are 10.95 / 8.63 / 6.87:1 for the ring, 5.34:1 for the day-bar label, and 7.80:1 for the initials.

**Fixed in `0e375db`** — **P1-2**, prompted by the French navbar wrapping to three lines. The horizontal nav switched on at `lg`, but the row needs 1205px of viewport in French and 1069px in English against a container that stops growing at 80rem, so both locales now switch at `xl`. Fixing that required fixing the two defects underneath it: the `lg:hidden` that never worked (now a media query inside the scoped block, where it can win) and the rule-plus-padding that sat outside the clipped area (now inside, so the closed state is genuinely 0px). The header is 73px at every width instead of 86px, and occlusion is down from 14px to the 1px hairline. Also closes the navbar half of **P3-2**: the brand qualifier was 10px, below the documented 11px floor.

**Fixed in the `typeset` pass (17 August 2026)** — **P1-4**, **P2-5** and the 10px-type P3 item, plus the mechanism under all three. Measured before and after in the browser at 1280px and 375px, EN and FR, both themes:

| Measurement                       | Before                         | After                            |
| --------------------------------- | ------------------------------ | -------------------------------- |
| Prose, full line (`/about`, EN)   | 102 characters                 | **68.4**                         |
| Prose, full line (paper page, FR) | 101.9                          | **68.5**                         |
| Prose, average across paragraphs  | 90                             | **61**                           |
| `h1.text-page-title`              | 1.04 / −0.025em (display step) | **1.08 / −0.022em** (documented) |
| `h2.text-section` ×17             | 1.12                           | **1.15**                         |
| `h3.text-card-title` ×5           | 1.20                           | **1.25**                         |
| `h2.text-card-title` (25 papers)  | 1.12                           | **1.25**                         |
| Label roles on heading tags ×7    | Instrument Serif, −0.018em     | **Outfit 500/600, +0.16–0.18em** |
| Type below the 11px floor         | 24 elements                    | **0**                            |
| Uppercase under 0.16em tracking   | 5 renderings of the EN/FR chip | **1** (0.16em everywhere)        |

P1-4's root cause is now measured rather than estimated: `ch` is the advance of "0", 0.6975em in Outfit, against a real prose average of 0.435em — a ratio of **1.50**, not the 1.46 first estimated. The tokens are `em` now, so they neither depend on a digit's width nor shift when the fallback font is in play (system-ui's "0" is 18% narrower than Outfit's).

P2-5 was **larger than recorded**: not three label sites but 37 headings. The unlayered `h1…h6` block outranked `@layer components` _and_ `@layer utilities`, so it was voiding `font-semibold` and `tracking-[0.16em]` in the footer as well as whole role classes. Moving the element defaults into `@layer base` fixed all 37 at once, and closes systemic pattern 1 for the typography half.

**Fixed in the `layout` pass (17 August 2026)** — **P1-6** and **P2-3**, plus four defects the pass found on its way. Measured before and after at 375px and 1280px, EN and FR:

| Measurement                       | Before             | After               |
| --------------------------------- | ------------------ | ------------------- |
| Programme content column @375px   | 213px              | **309px**           |
| Programme paper titles, full line | 23.7 chars         | **40.9**            |
| …lines per title (avg / worst)    | 4.81 / 7           | **3.43 / 5**        |
| Programme page height @375px      | 12.8 screens       | **11.7**            |
| `/about` axis prose @375px (FR)   | 213px, 29.8 chars  | **293px, 41 chars** |
| …lines per axis (FR)              | 32 / 38 / 38       | **24 / 26 / 27**    |
| Hero CTAs                         | 39 / 40 / 41px     | **44px**            |
| Day pills                         | 32.7px             | **44px**            |
| Segments @375px                   | 38px               | **44px**            |
| Session descriptions @1280px      | ~170 chars         | **57–64**           |
| Header vs `--nav-height`          | 73px vs 72px token | **72px = 72px**     |

Four found in passing, none in the Phase 1 backlog: `/about`'s thematic axes were the same defect as P1-6 on a route nobody had measured (a P1); interlude rows never carried `scroll-mt-28`, so break anchors landed 41px behind the sticky day bar; ten session→break boundaries stacked a dashed hairline directly on a solid one; and `+error.svelte`'s `max-w-xl` was silently voiding `.text-lede`'s measure — a fourth instance of the cascade-layer trap, this time layer order rather than unlayered CSS.

**Fixed in the `clarify` pass (18 August 2026)** — **P1-7**, the segmented-control P3, and the copy half of the backlog. Measured in the browser in both locales and both themes:

| Measurement                               | Before                           | After                                              |
| ----------------------------------------- | -------------------------------- | -------------------------------------------------- |
| Programme links with a resting affordance | 0 of 63                          | **63 of 63**                                       |
| …underline vs its surface, light          | n/a (none drawn)                 | **3.26:1**                                         |
| …underline vs its surface, dark           | n/a                              | **3.32:1**                                         |
| Tab stops in the participants filter row  | 8                                | **4**                                              |
| Segment semantics                         | `aria-pressed` on 6 buttons      | `role="radio"` + `aria-checked`                    |
| Filter count, EN / FR                     | "Showing 12 of 25" / "12 sur 25" | **"12 of 25 papers" / "12 sur 25 communications"** |
| Recovery in the filtered-empty state      | none                             | **one "Clear filters", 44px**                      |
| Dead message keys                         | 17                               | **0**                                              |

P1-7's first attempt was itself a defect worth recording: the fix as specified in this document — a 35% teal mix — measured **1.78:1** in light and 2.18:1 in dark on the tightest surface each theme puts it on. That is a resting cue you cannot resolve on a phone, which is the failure P1-7 names, reproduced in a new form. The shipped mixes are **65% light and 60% dark**, the first steps that clear 3:1. The two external links in a session row keep the icon and opt out of the underline (`.session-external`), because an underline runs straight through the glyph.

The chair line stopped being a label plus a placeholder. "Chair: To be determined" was a colon promising a name and then not supplying one, on nine of the ten sessions that render the line; it is now one statement, `session_chair_tbd` ("Chair to be confirmed" / "Présidence à confirmer"), with the labelled form kept for the sessions that have a chair. The excursion descriptions moved from "to be determined" to "to be confirmed" so the site has one phrase for "not settled yet", not two.

Two findings this pass did not expect to fix:

- **The Call for Papers page said nowhere that the call had closed.** It still opened "We invite proposals…" and listed four addresses to send them to, three and a half months after the 30 April deadline — the exact class of error PRODUCT.md's Principle 1 exists to prevent, on the one page where it is most legible to a stranger arriving from search. It now carries a notice derived from `isCfpOpen()`, and its key-dates list reads from `getMilestones()` so the same four dates that are flagged past/next on the home page are flagged here too. The authored call text is untouched, by decision: the page is a record of what was published. `getKeyDates()` had no other consumer once the list moved — the PDF and text exports build their own — so `key-dates.ts` went with it.
- **The footer claimed "All rights reserved"** against a repository that ships `LICENSE-CONTENT` granting CC BY 4.0. Replaced, by decision, with the split the licence actually records.

Also closed: the venue printed "Stellenbosch, Stellenbosch, South Africa" (the P3 item; the town sat in both `address` and `city`, which also made `address` a wrong schema.org `streetAddress`); the venue page's lede was its own meta description, restating a heading instead of adding to it; `milestone_done` read "Completed" in English against "Passé" in French, and a deadline does not complete; the countdown would have rendered **"1 DAYS REMAINING" on 30 August**; the footer's "Take part" invited an action the closed call cannot offer; and the language switcher's EN/FR now carry `lang`, so each is spoken with its own phonemes.

### New findings from the clarify pass

- **P2-14 · The error page renders its title in one locale and its body in another.** On `/fr/no-such-page` the document title is "Page introuvable" while the `<h1>` reads "Page not found". `+error.svelte` sits outside the `[[lang]]` route, so the head and the body resolve the locale at different moments. Pre-existing; the copy is correct in both languages, the selection is not. → `harden`
- **P2-2 is worse than recorded, on the same surface.** With the search emptied of results, the participants page still shows seven unfiltered people above the fold, and the "No participants match these filters" state renders **below** them — so the one honest signal is the piece the reader does not see. Scoping the filter to the unified `everyone` array fixes the count and the ordering together. → `harden`
- **P3-19 · The French catalogue uses two apostrophes.** 24 strings carry U+0027 (`l'atelier`), 11 carry U+2019 (`l’organisation`), none mixes both within one string; the content data files mix the same two ways. It is one find-and-replace plus a test run, but it spans `messages/fr.json` and `src/lib/data/`, so it belongs with the second typographic pass rather than here. The strings added in this pass use U+2019, which is where the newest copy already sat. → `typeset` (second pass)
- **P3-20 · The P1-7 treatment stops at the programme.** `PaperCard`'s title link and the paper page's `.author-link` share the identical `color: inherit` + hover-only pattern the finding describes. Both sit inside cards with their own affordances (a lifting card, a brass rule), which is why they were left out of a fix scoped to the programme — but "underlined on one surface, not on another" is now a consistency question the backlog should hold explicitly. → `polish`

**Fixed in the `harden` pass (18 August 2026)** — **P2-2**, **P2-6**, **P2-7**, **P2-14**, **P3-16**, the live-theme P3, and the roadmap's own edge-case list. Measured against the production build in headless Chromium:

| Measurement                | Before                                | After                                     |
| -------------------------- | ------------------------------------- | ----------------------------------------- |
| Directory filter scope     | 33 of 39 people                       | **39 of 39**                              |
| Search "Madore"            | "1 of 33", Madore unmatched on screen | **"2 of 39 people"**, both found          |
| Language switch without JS | inert                                 | **`<a href>` + `hreflang`**               |
| Map selection announced    | nothing                               | **location, place, count, names**         |
| Map without JS             | a spinner that never resolves         | **falls back; 18 locations still listed** |
| French 404                 | answered in English, `lang="en"`      | **French, `lang="fr"`**                   |
| Programme anchor offset    | hard-coded 112px                      | **derived; bar measures 61px = token**    |
| Live OS theme change       | ignored until reload                  | **followed, unless a choice is stored**   |
| Long unbroken token @320px | page widened to **518px**             | **320px**                                 |

**P2-2 was a structural problem, not a counting one.** The filter narrowed the `participants` array while the Organisers and Point Sud sections rendered raw above it, so the control governed a third of what it appeared to govern. `filterParticipants` is now `filterPeople`, a generic predicate over a structural `FilterablePerson` — organisers and Point Sud are separate types with the same searchable surface — and the FilterBar moved above all three sections, because a control that governs the page cannot sit two thirds of the way down it. Sections hide when they have no match, and one empty state replaces three. The count message is `filter_count_people`, since "39 participants" would have been the same class of untruth the fix exists to remove. **This changes the page's opening**: it now leads with the directory controls rather than with the Organisers heading. That is a consequence worth a second look.

**P2-14 was worse than the clarify pass recorded.** It was reported as a title/body mismatch in dev; against the build it is simpler and worse — `build/404.html` is an empty shell rendered entirely on the client, one document for the whole site, so _every_ bad French URL was answered in English with `lang="en"`. Fixed with `localeFromPath()`, which reads the locale from the URL instead of from a route parameter that by definition did not match, plus explicit `{ locale }` arguments on the error page's messages rather than the ambient global. Unit-covered, including `/papers/french-history`, which starts with `fr` but is not the locale segment.

**P3-16 is now genuinely derived.** `--day-bar-height` (3.8125rem) is declared once, consumed by the sticky bar as `min-height` so it cannot quietly stop being true, and consumed by days and sessions as `scroll-margin-top`. It composes with `scroll-padding-top` rather than duplicating it: the header offset stays in one place, the bar's in another. Measured in the build — the bar renders **61px**, exactly the token, and anchors land 16px below it.

Two things found in passing, neither in the backlog:

- **A single unbreakable word pushed the page to 518px inside a 320px viewport.** `OrganizerCard`'s text column lacked the `min-w-0` its Point Sud twin already carried, so a flex child's `min-width: auto` refused to shrink. Fixed there, and `overflow-wrap: break-word` added to `body` as a safety net — institution names, compound surnames and bare URLs are content the site does not control. It engages only for a word that would otherwise overflow, so the measured line lengths from the typographic pass are untouched.
- **The map's prerendered loading state was a promise nothing would keep.** Without JavaScript the spinner and "Loading the affiliations map…" render from static HTML and never resolve. A `<noscript>` fallback takes its place and the loader is hidden under `.no-js`; the 18-location list beside it was already static and works either way.

_Verified good, not changed:_ reduced motion genuinely surrenders — all three `.scroll-reveal` blocks render at opacity 1 with no transform, so the staggered `setTimeout` delays nothing visible. No broken images across the directory. No horizontal overflow at 320, 375 or 1280px across six routes in both locales and both themes.

Four regression guards were added to `tests/e2e/site.spec.ts` — the directory count, the switcher's `href`/`hreflang`, the French 404, and the no-JS directory — because each of these fails silently and none is visible to lint, `svelte-check` or the axe scan.

**Still open:** P2-1 (`optimize`), P2-8 (the home hero), and the rest of P3. **P1 is clear, and every P2 routed to `harden` is closed.** (P2-4 has since closed too — see the adapt pass below.)

### New findings from the layout pass

Raised by the isolated layout assessment, verified in the browser where noted. Deliberately **not** fixed in this pass — each needs its own bounded verification.

- ~~**P2-10 · Section rhythm runs on seven ad-hoc values while two of the four documented tokens are dead.**~~ **closed in the second `layout` pass, 21 August 2026.** `--space-block` (3.5rem) has zero consumers anywhere; `--space-stack` has one, inside `app.css` itself. Meanwhile 20/28/32/40/48/56/64px do the work across ~40 call sites, and section-to-section is a different number on every route (64px participants, 56px CFP, 48px programme, 64–96px about/home). Each page is internally consistent; the pages disagree with each other. → `layout` (second pass)
- ~~**P2-11 · The header-to-content interval is 40 / 48 / 56 / 64–96px across eight routes**~~ **closed in the second `layout` pass, 21 August 2026.** Was:, none of them a token — `PageHeader` sets `pt-14 pb-10` and then each route declares its own `pt-*`. One token consumed by `PageHeader` itself would end it. → `layout` (second pass)
- **P2-12 · Five distinct card-grid gaps and three breakpoint ladders** for equivalent card sizes: papers 24px @md, participants 16px @sm/lg, organisers and Point Sud 24px @lg, WhatNext 16px @sm/lg, key dates 1px. The two person grids on the same page switch at `lg` while the grid below them switches at `sm`. → `layout` (second pass)
- **P2-13 · Cards align on the outer box only.** _Organiser cards closed in `polish`, 24 August 2026; the paper-card half remains, and measures 28px rather than the ~75px below._ With paper titles running 46–184 characters, the meta row, the brass paper rule and the placement eyebrow land at a different y in every card of a row; excerpt tops can differ by three title lines (~75px). `grid-template-rows` on the card, or `mt-auto` on the last block, would give a row one shared baseline. → `polish`
- **P3-16 · `scroll-mt-28` is a hard-coded 112px** on sessions and days, not derived from `--nav-height` plus the day-bar. It works — every anchor type was measured clearing by 67px — but it is the one offset the Anchor Clearance Rule does not cover, and it drifts whenever the bar changes. → `harden`
- **P3-17 · Four bespoke `max-width` values on page wrappers** (`Hero.svelte`, the home thematic header, `AffiliationMap` ×2) against the Four Containers Rule; and `container-prose` (44rem) still has zero consumers while `/about`'s and `/papers/[slug]`'s abstracts are exactly what it was built for. → `distill`
- **P3-18 · Panel numbers print twice** — the eyebrow renders "PANEL 1" and the session title begins "Panel 1 · …". At 375px that duplication costs a line on all seven panels. → `distill`
- **Correction to the backlog:** the "TBD Day 4 excursion" named in P2 planning is wrong. `programme.ts` puts the two excursions on **Day 2** and **Day 3**, both `type: 'social'` with "Destination to be determined"; Day 4 ends with concluding remarks and a farewell dinner.

**Decided, not yet built:** the home hero (P2-8) is to be **quietened** — demote or drop the countdown, calm the gradient to a single tonal wash, and make the stat row's numbers real links. Scheduled after the remaining P1s.

### New findings from the typeset pass

Raised by the isolated typographic assessment, verified against font metrics and the compiled bundle. None were in the Phase 1 backlog.

- **P2-9 · Instrument Serif has no metric-compatible fallback, and Georgia sets 30% wider.** Mean advance: Instrument Serif 0.3366em, Georgia 0.4384em (+30.2%), Times New Roman 0.3979em (+18.2%). With `font-display: swap` and no preload, every heading lays out ~30% wide on first paint and then reflows — the English hero headline goes 3 lines → 4 in the fallback, French likewise. A `size-adjust` fallback is the wrong tool here (matching Instrument Serif's width would shrink Georgia's x-height from 0.481 to 0.37 and trade a width jump for a size jump); **preloading the two normal woff2 (32.6 KB) is the fix**. This promotes the existing P3 "no `rel=preload`" item — it is a layout-stability defect, not a latency nicety. → `optimize`
  _Verified good, by contrast:_ Outfit's fallback stack is within 0.6% of its own mean advance on both Segoe UI and Arial, so body text barely reflows. Do not "improve" that stack.
- **P3-12 · Thirteen undeclared display-serif sizes, five inside a 3px band.** At 375px, session headings (17px), paper-page author names (18px), footer (18px), `AvatarSmall` (18px), the map popup title (19.2px, now 19px) and the navbar wordmark (20px) are the same face at the same weight, indistinguishable. Above the scale, the numerals in `AtAGlance`, `Countdown`, `ThematicAxis` and `Avatar` (24–48px) are a legitimate distinct role that has never been named. Naming it is worth doing **after** the home-hero direction resolves, since `quieter` may remove the countdown. → `typeset` (second pass) or the home-hero work
- **P3-13 · The project `--text-*` steps carry no paired line-height**, while Tailwind's `text-sm` and friends set both. So `text-caption` appears with `leading-snug`, with `leading-relaxed`, and with nothing at all, and its leading silently inherits. Tailwind v4 supports `--text-caption--line-height`; adding them changes rendering at every consumer, so it needs its own bounded pass. → `layout`
- **P3-14 · `.text-eyebrow` hard-codes `color: var(--accent-ink)`**, so it cannot be used on the dark hero or footer and gets rebuilt from raw utilities there instead. That is the structural reason two label roles had eight tracking values. An `-on-inverse` colour variant would let the role travel. → `colorize`
- **P3-15 · `--font-mono` now has zero consumers.** The session times were the only real use and they are Outfit tabular-nums now; `.container-prose` (44rem) is likewise declared and documented with no consumers. Both join the dead-token list. → `distill`
- **Open question · `.text-lede` stays at Outfit 300** while prose was moved to 400 for exactly the reason that applies to the lede too ("Outfit Light reads washed out on cream"), and the lede additionally sits in `--ink-subtle` with antialiasing thinning it. Left alone because DESIGN.md records the 300 as a deliberate choice — worth a decision rather than a silent flip.

### New findings from the adapt pass

**Fixed in the `adapt` pass (18 August 2026)** — **P2-4**, plus one defect the backlog had never measured because nobody had measured the programme at 320px.

| Measurement                        | Before                      | After                     |
| ---------------------------------- | --------------------------- | ------------------------- |
| Day bar height @320px (FR)         | 113px, two rows             | **61px, one row = token** |
| Day heading clearance @320px       | **−35.8px, behind the bar** | **+15.8px**               |
| Session permalink target           | 12×12px                     | **24×24px**               |
| Permalink at rest, touch           | `opacity: 0`                | **visible**               |
| Permalink contrast, light          | 2.37:1                      | **3.26:1**                |
| Permalink contrast, dark           | 1.44:1                      | **3.32:1**                |
| Permalink x-positions, 20 sessions | 20 different                | **one rail at x=318**     |

**The day bar wrap is the same class of failure the `harden` pass thought it had closed.** `--day-bar-height` was made derived rather than guessed, and it is consumed as `min-height` so the bar cannot render _shorter_ than the token. Nothing stopped it rendering _taller_: at 320px the four day pills measure 290.7px (EN) and 293.6px (FR) against 288px of content, wrapped, and the bar became 113px while every day and session still offset by 61px. Jumping to a day put its `<h2>` 35.8px behind the bar — the one thing you asked to see was the one thing occluded. `flex-nowrap` makes the height constant by construction rather than by declaration; `overflow-x` is the escape valve if a fifth day or a longer locale ever exceeds the width. Below 360px the pills give back 5.6px of horizontal padding, which is what lets four days fit without scrolling; the 2.75rem touch floor is untouched.

**P2-4's dark-mode figure in this backlog was optimistic.** It was recorded as 2.69:1; measured on the dark card it is **1.44:1**. The first two attempts to measure it in this pass were also wrong — a contrast helper parsed the computed `oklab()` string as RGB and returned plausible nonsense in both directions. Every figure above was re-measured by compositing on a canvas and reading the pixel back, with a black-on-white sanity check returning 21:1 first.

Two regression guards added, since neither defect is visible to lint, `svelte-check` or the axe scan: the bar's rendered height against its own token at 320px in French, and the permalink's size and resting opacity under touch emulation. Both were confirmed to fail against the previous build before being kept.

_Verified good, not changed:_ no horizontal overflow at 320, 375, 640 or 1280px; the eyebrow row is still 18px after the permalink grew, so 20 sessions gained no height; session and day anchors both clear by 16px, matching the figure `harden` measured at 375px.

**Raised, not fixed:**

- **P2-15 · On a phone in landscape, 35.5% of the viewport is sticky chrome.** At 667×375 the fixed header (72px) and the sticky day bar (61px) leave 242px of reading area — about three lines of a session. Neither bar is wrong on its own and the page does not break; the cost is only visible when the two stack on a short viewport. Fixing it means deciding something about the _sitewide_ header (collapse on scroll-down, or shrink under `max-height`), which is outside a single surface's scope and should not be decided by the programme alone. → `adapt` (sitewide) or a header decision
- **P3-21 · The online badge's `title` is unreachable on touch.** `title="Taking part online"` sits on a badge that already reads "ONLINE". The visible text carries the meaning, so nothing is lost — but the clarification exists only for pointer users, on the surface most read by touch. Either the visible label says it or the `title` goes. → `clarify` or `distill`

**Deliberately not acted on:** open question 1 below (should `/programme` default to _today_ during the event?) is squarely an adapt question — a phone opened in a room on day 3 currently starts on Monday. It was left alone because auto-scrolling on load fights deep links, scroll restoration and the back button, and because the gold "today" pill and the "Happening now" badge already answer the wayfinding half of it. It wants a decision, not a default.

### New findings from the optimize pass

**Fixed in the `optimize` pass (18 August 2026)** — **P2-1**, **P2-9**, and the two font P3s. Measured against the production build.

| Measurement                         | Before                     | After                       |
| ----------------------------------- | -------------------------- | --------------------------- |
| `/participants` route stylesheet    | 89,906 raw / 11,905 gzip   | **7,038 / 1,646**           |
| `/participants` render-blocking CSS | 24.9 KiB gzip              | **14.9 KiB**                |
| MapLibre CSS at first paint         | in `<head>`                | **its own lazy asset**      |
| Instrument Serif on first paint     | fallback, then ~30% reflow | **preloaded (latin)**       |
| Outfit 700                          | 20.5 KB for one rule       | **removed**                 |
| CI CSS gate                         | sitewide total only        | **per-page 20 KiB ceiling** |

**P2-1 was a lazy component with an eager stylesheet.** The renderer sat correctly behind an `IntersectionObserver`; the `import 'maplibre-gl/dist/maplibre-gl.css'` beside it did not, so Vite hoisted 83,143 of the route stylesheet's 89,906 bytes — 92.5% — into the `<head>` of `/participants`, where every visitor waited for it including those who never scroll to the map and those whose browser never runs the initialiser. Moving it into the same dynamic `Promise.all` makes it its own asset. **The load-order risk was checked rather than assumed:** our `.maplibregl-*` overrides now parse before MapLibre's own, and all of them are more specific (0,2,0 against 0,1,0). The single true tie — `.affiliation-popup .maplibregl-popup-tip` against `.maplibregl-popup-anchor-* .maplibregl-popup-tip` — is safe because no MapLibre rule sets `display` on the tip. Confirmed in the built site: 18 markers, the custom 8px control radius and the teal-tinted shadow all render unchanged.

**The CI half of P2-1 needed a different number than the one that existed.** `check-bundle-size.mjs` already capped CSS sitewide at 45 KiB, and that total is blind to this defect by construction — moving bytes from a lazy asset into a render-blocking one does not change it. The gate now sums, per prerendered page, the gzip of the stylesheets its `<head>` blocks on, and caps the worst at 20 KiB. `/participants` is heaviest at 14.9 KiB; at 24.9 KiB it would have failed, so the ceiling would have caught P2-1 the day it landed. The href-to-asset mapping was verified to resolve on all 143 pages rather than silently summing zero — which is how a check like this fails quietly.

**P2-9's fix is narrower than the finding proposed.** The backlog called for preloading both normal subsets (32.6 KB). Only the latin one is preloaded: latin-ext is a further 11.6 KB and just **18 of the 143 built pages** contain a character that needs it, mostly Yorùbá diacritics in paper titles. Preloading it sitewide would push an unused font at 87% of page loads — against the brief's low-bandwidth constraint — and earn a "preloaded but not used" warning on each. It still loads on demand.

**`adapt participants` was assessed and found not to need work.** Measured on a Pixel 7 (412×839) against the build: markers 32×32 and map controls 40×40 (both clear SC 2.5.8's 24px, and neither is a new control the 2.75rem promise governs), the 18 affiliation buttons 378×69, `cooperativeGestures` active so the map cannot hijack page scroll on touch, and no horizontal overflow. This matches what the Phase 1 audit had already put on the Preserve list. The roadmap scoped `optimize` here to "only if the Phase 1 audit flags map bundle/interaction cost" — it flagged bundle cost, which is fixed, and not interaction cost. Nothing was changed for the sake of having changed something.

**Still open, with a reason:**

- **The uncapped tile requests to `tiles.openfreemap.org` stay uncapped.** It is the site's only external host and the requests are inherent to a real map; bounding them means self-hosting tiles, which is a hosting decision rather than a design one. A `preconnect` was considered and rejected on the same logic as latin-ext: it would open a third-party connection on every page for a resource only `/participants` uses, and only then if the visitor scrolls.
- **P2-13** (cards align on the outer box only) and **P3-20** (the link affordance stops at the programme) remain routed to `polish`.

---

### The quieter pass

**Fixed in the `quieter` pass (21 August 2026)** — **P2-8**, the whole of it. Measured against the dev build at 1280, 375 and 320px, EN and FR, both themes:

| Measurement                        | Before                                   | After                                 |
| ---------------------------------- | ---------------------------------------- | ------------------------------------- |
| Decorative layers on the hero      | 3 (3-stop diagonal, brass radial, grain) | **2** (one tonal wash, grain)         |
| Hero gradient stops                | 3, on a diagonal                         | **2, top to bottom, adjacent steps**  |
| Brass radial                       | 18% over 70% × 140%                      | **removed**                           |
| Strip overlay                      | `bg-black/20` (pure black over teal)     | **none — the wash deepens into it**   |
| Countdown numeral                  | 36px Instrument Serif, white             | **14px Outfit, in the strip's voice** |
| …its label                         | tracked uppercase badge                  | **the same 14px sentence text**       |
| Strip height, EN / FR @1280        | 73px                                     | **61px, one row in both**             |
| Strip @320px, FR                   | 136px                                    | **98px, no overflow**                 |
| Links in `<main>`                  | 4                                        | **7**                                 |
| At-a-glance figures that are links | 0 of 3                                   | **3 of 3**                            |
| …underline vs cream                | n/a (none drawn)                         | **3.20:1**                            |
| …underline vs the dark page        | n/a                                      | **3.55:1**                            |
| `#affiliations` anchor clearance   | n/a (no such id)                         | **+16px below the header**            |

**The countdown did not need removing; it needed a smaller voice.** Its premise in this backlog — that it "will be stale from 1 September" — had already been closed by an earlier pass: it reads `nextMilestone()`, so on 1 September it stops counting to full papers and starts counting to the workshop. What was left was the _treatment_: a display-serif numeral over a tracked uppercase label is the hero-metric template, and it made the second-largest thing on the page a number addressed to twenty-five authors. Set in the strip's own 14px sans, third in the same `label · value · count` row the dates line already uses, it says the same fact and stops asking for the eye.

**The gold radial went rather than shrank.** The hero already carries brass three ways — the italic serif deck, the strip's label, and `.btn-accent`, which is the page's one solid gold moment. A fourth as pure decoration is what the One Gold Moment Rule exists to prevent, and it was the only element on the surface with no informational job. Removing it also removes a rasterised paint layer, which the low-bandwidth constraint counts.

**Format stays plain.** Three of the four at-a-glance figures now link; the fourth ("Hybrid workshop") does not, because no page on this site _is_ the hybrid format. A fourth link invented to even up the row would have been the row lying about itself.

### The second layout pass

**Fixed in the second `layout` pass (21 August 2026)** — **P2-10** and **P2-11**, the pair the roadmap said to take together. Measured in the browser, EN and FR, with no horizontal overflow anywhere:

| Measurement                           | Before                 | After                                    |
| ------------------------------------- | ---------------------- | ---------------------------------------- |
| Header-to-content interval            | 40 / 48 / 56 / 64–96px | **56px wherever it means that**          |
| Subsection-to-subsection              | 40 / 48 / 56 / 64px    | **56px**                                 |
| Programme day → day                   | 48px                   | **56px**                                 |
| Filter bar → results, papers / people | 32px / 40px            | **32px / 32px**                          |
| `--space-block` consumers             | 0                      | **15** (7 `.page-body`, 8 `.block-flow`) |

**The fix was not a new value — it was reading the one the site had already converged on.** `--space-block` is 3.5rem, and 56px was the most common of the four numbers doing its work by hand: `pt-14` on five wrappers, `space-y-14` inside the call for papers, `mt-14` on the participant page. The other three (40, 48, 64) were drift around it, not decisions.

Two classes consume the token. `.page-body` is the header-to-content inset, **padding rather than margin** so it cannot collapse into the banded header above it. `.block-flow` puts the rhythm on the container the way `.prose` owns paragraph rhythm — which the participants directory and the paper page actually needed rather than preferred: with three sections behind `{#if}` and an unconditional map after them, a margin on each child either forgets a gap or doubles one depending on which sections render.

**Three intervals were deliberately left out, because one value repeated everywhere is the monotony this pass exists to avoid.** Chrome that belongs to what follows it stays tight at 32px — the filter bar, the back link, the paper page's badge row. The programme's 40px sits below its sticky day bar rather than below the header, so it is a different relationship. And `/about` opens with a banded `section-pad` section, whose padding is a band's own inset and not a gap at all.

**Closed in passing:** `/papers` and `/participants` spelled the same FilterBar-to-results relationship `mb-8` and `mb-10`. Same component, same job, two numbers; both are 32px now.

**Still open, and still `layout`:** **P2-12** (five card-grid gaps and three breakpoint ladders) and **P3-13** (the `--text-*` steps carry no paired line-height, so `text-caption` inherits a different leading at every call site). Neither is a rhythm question, and P3-13 changes rendering at every consumer, so it wants its own bounded pass.

### New findings from the second layout pass

- **P3-24 · `PageHeader`'s own band inset is `pt-14 pb-10`.** The top half is 56px — `--space-block`'s value again, arrived at independently, now the only place that number is still written as a utility. It is a band's internal padding rather than an interval between blocks, so it is a different role and was left alone; but if a fourth rhythm token is ever named, this is its consumer. → `polish`

---

### The colorize + distill pass

**Fixed in the `colorize` + `distill` pass (21 August 2026)** — **P3-14**, **P3-17** (in part), **P3-18**, **P3-21**, the four dead tokens, and the last of `colorize`'s reinstated list. Measured after a full load in each theme:

| Measurement                             | Before               | After                            |
| --------------------------------------- | -------------------- | -------------------------------- |
| Label roles hand-rebuilt on inverse     | 2 (hero, footer)     | **0 — both use `.text-eyebrow`** |
| Hero eyebrow vs the wash                | 8.54:1 (raw utility) | **8.54:1 (role)**                |
| Footer eyebrow, light / dark            | 70% alpha, unstated  | **8.54:1 / 10.25:1**             |
| Eyebrow on paper, dark                  | brass                | **unchanged, 8.77:1**            |
| Declared tokens with zero consumers     | 4                    | **0**                            |
| Panel titles duplicating their number   | 7 of 7               | **0 of 7**                       |
| …panels wrapping to 2 lines @375px      | 2 EN / 3 FR          | **0 / 0**                        |
| Page height saved @375px, EN / FR       | —                    | **41px / 61px**                  |
| `title` attributes unreachable on touch | 1                    | **0**                            |

**`colorize` is now finished, and one of its three items closed itself.** The language-switcher separator recorded at 1.74:1 no longer exists: the switcher was rewritten as a single anchor — "one control, not two" — so the separator was deleted rather than recoloured. What was left was P3-14, and its fix is the role the finding predicted. `--eyebrow-ink` inherits `--accent-ink`, so the theme flip is free and there is one declaration rather than two; `.focus-on-inverse` became `.on-inverse`, because a container that flips two roles should be named for the surface rather than for the first thing that followed from it.

**Two of the four dead tokens were dead for a reason, and one was dead because the system got better.** `--surface-inverse` / `--ink-on-inverse` name the surface the hero is, but their dark values are near-chroma-free and would have flattened the hero into the page behind it — so they were deleted rather than adopted. `.container-prose` is dead because the `typeset` pass moved the measure onto `.text-prose` itself, which caps 30em regardless of its container; a 44rem wrapper caps nothing the role does not.

**P3-18's measurement was wrong, and P3-17's premise does not survive inspection.**

- The duplicated panel number was recorded as costing "a line on all seven panels at 375px". Measured by putting the prefix back into the DOM and taking it out again: **2 of 7 in English and 3 of 7 in French**, worth 41px and 61px of page height. The duplication was still worth removing — numbering held in prose renumbers by hand while the eyebrow renumbers itself — but the figure was overstated.
- P3-17's "four bespoke `max-width` values on page wrappers" is three, and none of the three is a page wrapper: the hero's `max-w-3xl` and the map intro's are content columns _inside_ `container-wide`, the home thematic header's `max-w-xl` caps a centred section intro, and the fourth was a comment about MapLibre's popup width rather than a wrapper at all. The Four Containers Rule governs page wrappers; these cap content inside one. Left alone, deliberately — tokenising a column with one consumer is the thing this pass spent its time deleting.

### New findings from the colorize + distill pass

- **P3-23 · The footer's column headings are a third label variant.** `text-badge` size with `.text-meta`'s weight and tracking, in `secondary-300` — neither of the two declared label roles, and now the only label on an inverse surface still built from raw utilities. It was left alone because converting it would change its size (11 → 12px) and its colour, which is a design decision rather than a cleanup. → `typeset` (second pass) or `polish`
- **P3-12 gains a confirmed measurement.** The programme's session heading renders at **17px Instrument Serif** in a 309px column at 375px — one of the thirteen undeclared display-serif sizes the typeset pass recorded, now measured rather than inferred. → `typeset` (second pass)
- **A guard from the previous pass was itself a defect.** The at-a-glance test clicked through to `/participants` and evaluated immediately, so it read the old document on a loaded machine and passed on a fast one. Fixed by awaiting the destination. Worth recording because a guard that passes intermittently is worse than no guard: it makes the suite stop meaning what it says.

---

### New findings from the quieter pass

- **P3-22 · The reduced-motion block enumerates selectors instead of covering transitions.** `@media (prefers-reduced-motion: reduce)` names `.card`, `.btn`, `.btn-ghost`, `.mobile-navigation` and `.link-arrow svg` one by one. Every transition added since has had to remember to register itself, and two have not: `.session-link` (the clarify pass) and now `.stat-link`. Both are colour-only, so nothing moves and nothing fails — but the mechanism is a list that has to be maintained by hand, which is how the cascade-layer trap kept recurring. → `animate`
- **`--surface-inverse` and `--ink-on-inverse` are not dead by oversight.** The distill list has them as tokens with zero consumers, and the hero is the surface they are named for — but their dark values (`surface-950` and `surface-300`, near-chroma-free) would strip the teal out of the hero in dark mode and flatten it into the page behind it. They are unused because the only candidate consumer needs a different value, not because nobody got round to wiring them up. `distill` should delete them rather than adopt them. → `distill`
- **P3-20 narrows.** The link affordance now reaches the home page's figures as well as the programme; what remains inconsistent is `PaperCard`'s title link and the paper page's `.author-link`, both inside cards that carry their own affordances. → `polish`
- **Measurement note.** Computed styles read **stale** for one or more turns after a runtime theme toggle while the browser pane is not compositing: the class had flipped but `getComputedStyle` still returned the old theme's custom properties, which produced a 1.01:1 "contrast" for near-white ink on cream. Every figure above was taken after a **full page load** in the theme being measured, with the canvas sanity check returning 21:1 first — the same discipline the adapt pass adopted after its `oklab()` parsing error, for a different cause.

---

### The papers-detail pass

**Fixed in the papers-detail pass (23 August 2026)** — the roadmap's item 13 was a verification: had the typeset pass landed on the longest abstracts, in both languages? The measure had. The intervals had not. Measured against the build at 1280 / 375 / 320px, EN and FR, both themes:

| Measurement                               | Before          | After                           |
| ----------------------------------------- | --------------- | ------------------------------- |
| Interval between an abstract's paragraphs | **0px**         | **20px** (`--space-stack`)      |
| Longest abstract, unbroken lines @1280    | 66              | **13 blocks, 5 sections**       |
| Longest abstract, unbroken lines @320     | 110             | **13 blocks, 5 sections**       |
| Section heading, space above / below      | 0 / 1px         | **36 / 8px**                    |
| Section heading, treatment                | 17px Outfit 600 | **21.9px Instrument Serif 400** |
| Abstract body contrast, light / dark      | 11.61 / 10.79:1 | unchanged                       |
| Subhead contrast, light / dark            | 16.77 / 18.93:1 | **16.77 / 18.93:1**             |
| Longest paper page, height @1280          | 4.6 screens     | 4.9 screens                     |

**P2-16 · Every abstract on the site rendered as one unbroken column.** `.prose p { margin-block: 0 }` sat two lines below `.prose > * + *` and outranked it — (0,1,1) against (0,1,0) — so the paragraph interval the rule above declares never reached the page. It read as a UA reset; Tailwind's preflight already zeroes `*`, so it reset nothing and only voided its neighbour. Twenty-five paper pages, both locales, both themes, every viewport. This is the same family as the three cascade-layer findings the backlog already groups under _Systemic patterns_ — a declaration that looks inert and is not — except the mechanism here is plain specificity rather than layers, which is why the audit's layer sweep did not catch it.

**The typeset pass could not have found this, and that is worth naming.** It measured line length, font size, leading and tracking — all per-block properties, all correct here. Nothing in that vocabulary asks what sits _between_ two blocks. The defect was visible in a screenshot and invisible in every metric the pass was built around.

**One abstract carries author-written section headings, and the fix had to answer them.** `frugal-infrastructures` has five paragraphs whose whole content is one bold run — section headings in the only syntax to hand. Restoring the interval alone would have given each 20px above and 20px below, which says nothing about what they introduce. They are now tagged at render time and set at the card-title step in the display serif, 36px above against 8px below. Tagged at render time because the distinction cannot be selected: `p:has(> strong:only-child)` also matches a paragraph that merely _opens_ with a bold phrase, which `masakhane-4d-framework` does mid-sentence.

### New findings from the papers-detail pass

- **P3-25 · The five in-abstract section headings are invisible to the document outline.** They read as headings and are not ones: a screen-reader user cannot jump between the five sections of the site's longest text. Promoting them to `<h3>` needs the abstract to have a heading of its own first — otherwise they file under the preceding "Presented by", which is not what they belong to — and that heading is new copy in two locales ("Abstract" / "Résumé"). The visual fix landed; the semantic one is a copy decision that is the user's to make. → `polish`, pending a decision
- **P3-26 · Outfit has no italic, so every emphasis in an abstract is a synthesised oblique.** Nine of them across three abstracts — titles of works (_Une si longue lettre_), the 4D model's four stages, a research question. The site self-hosts a real Instrument Serif italic that nothing uses. **Inspected and deliberately left alone:** a serif italic inside a 17px sans paragraph needs a 1.12em size bump to match x-heights, and reads as a mismatch rather than as emphasis; Chrome's slant of Outfit is clean and legible. Recorded so the next typographic pass does not rediscover it as a defect.
- **P3-27 · `.prose` styles four things, and `marked` can emit a dozen.** `renderAbstract` runs GFM, so an author writing a list, a blockquote, a table or a `##` heading in a future abstract gets an unstyled one — a bare `h3` inside `.prose` renders as 17px Instrument Serif in body ink, which is not a heading. None of the 25 current abstracts uses any of these, so nothing is broken today; it is a gap between what the renderer accepts and what the stylesheet answers for. → `harden` (second pass) or `polish`
- **The unit suite named one file.** `test:unit` ran `tests/localized-paths.test.ts` by name, so a second test file would have been written, committed and never run. It globs `tests/*.test.ts` now.

---

### The venue onboard pass

**Fixed in the `onboard` pass (23 August 2026)** — the reinstated item, run four weeks before participants travel. Measured against the build at 1280 / 375 / 320px, EN and FR, both themes:

| Measurement                                      | Before               | After                           |
| ------------------------------------------------ | -------------------- | ------------------------------- |
| Funding arrangement                              | one 43-word sentence | **two labelled lists, 5 + 3**   |
| What a participant must budget for               | after a "However,"   | **its own list, its own label** |
| Distinct accessible names among the page's links | 1 of 3               | **3 of 3**                      |
| Sources of truth for the funding wording         | 3 (venue, CFP, PDF)  | **1, composed**                 |
| Page height, desktop / mobile                    | 3.5 / 5.1 screens    | 3.6 / 5.4 screens               |
| Horizontal overflow @320px, EN / FR              | none                 | none                            |

**P2-17 · The one fact a traveller has to act on was the one the sentence buried.** `logisticsInfo` read "The DFG Programme Point Sud will cover … However, vaccinations, health insurance and meals during travel days … cannot be covered." Two opposite things in one paragraph, with the actionable half in the subordinate clause. It is now `logisticsCovered` and `logisticsNotCovered` — the same words, as lists — and the archival call-for-papers page composes the published sentence back out of them via `joinLogisticsList`, unit-tested against the exact wording in both languages. `en-GB`, not `en`: `Intl.ListFormat('en')` adds the Oxford comma the call was published without.

**P3-28 · Three links named "Visit website", to three different places.** Not a violation — WCAG 2.4.4 is satisfied by programmatic context — but on a page where a traveller is looking for one specific guest house's site, a link list that says the same phrase three times is friction. Each now names its destination in `aria-label`, with the visible text unchanged so 2.5.3 still holds.

**The page never said whether you had to be there.** The workshop is hybrid; /venue is where that question gets asked, and only the call-for-papers page answered it. It says so now — **and the platform is Microsoft Teams, not Zoom**. The call announced Zoom, `cfp.ts` still says Zoom, and it should: that page is a record of what was published. PRODUCT.md, which is forward-looking, now says Teams and says explicitly which document holds which, so a future pass does not "correct" one into the other. No joining details exist yet, so none are promised.

**Deliberately not built: a "getting there" section.** No airport, transfer or arrival-day facts exist anywhere in the repository, and PRODUCT.md forbids sourcing or inventing them. Confirmed with the user rather than assumed.

### New findings from the venue onboard pass

- **P2-18 · /venue still cannot tell anyone how to get to Stellenbosch.** The single largest remaining content gap before the workshop: no airport, no transfer arrangement, no expected arrival or departure day, on the page whose title is "Venue & Travel". It is a content gap, not a design one — the structure to hold it now exists — and it can be closed the moment the facts do. → content, not a pass
- **P3-29 · The two logistics lists are load-bearing for an archival sentence, and P3-19 does not know it.** The French items use U+0027 (`l'hébergement`) because the sentence they compose was published with U+0027. When the apostrophe sweep runs, `tests/logistics.test.ts` will fail — correctly, because modernising the punctuation of an archived sentence is a decision, not a cleanup. Whoever runs P3-19 should expect that failure and update `AS_PUBLISHED` deliberately or leave both alone. → `typeset` (second pass)
- **The page's routes out were already there.** The first draft of this pass added a link to the programme and a contact line. Both were redundant: `WhatNext` already offers Programme, Participants and "Ask the convenors" on this exact route. Measuring the page before designing for it removed two additions that would have been noise — which is the argument for measuring, not for the additions.

---

### Phase 4 — the animate and delight passes

**Fixed in the `animate` pass (23 August 2026)** — **P3-22**, the skip-link P3, and three things the audit had not looked for. Measured against the build:

| Measurement                                                  | Before        | After               |
| ------------------------------------------------------------ | ------------- | ------------------- |
| Transitions surviving `prefers-reduced-motion`, `/programme` | **12**        | **0**               |
| Movement paths surviving it, sitewide                        | 3 of 11       | **0 of 11**         |
| Skip-link travel, property / duration                        | `top` / 220ms | `transform` / 150ms |
| CFP section reveal, lag after entering the viewport          | 141–378ms     | **0–6ms**           |
| `ScrollReveal` props / props with a call site                | 3 / 1         | **0 / 0**           |

**P3-22 was worse than recorded, and its mechanism is now a floor.** The reduced-motion block was a register: every transition had to remember to enrol. Two never did — the two the finding named — and a third, `.mobile-navigation`, had enrolled and still lost, because Svelte compiles its selector to `.mobile-navigation.svelte-xxxxxx`, which outranks the bare class the register names. **That is the cascade trap for the fourth time, this time inside the rule meant to be the safety net.** One universal `transition-duration` with the file's only `!important` replaces the register; animations stay named, because theirs is a real per-case decision — the map loader deliberately slows to 1.5s rather than freeze, and a blanket rule would have turned it into a strobe.

**Three movement paths could not be turned off by the readers most likely to want them off.** The skip link travelled 4rem over 220ms with no reduced-motion path at all — also on `top`, a layout property, at the routine-state-change tier, on the first thing a keyboard user touches. The back-to-top button lifted on hover. And its `scrollTo({ behavior: 'smooth' })` overrode `scroll-behavior: auto` from script, making the longest motion on the site the one that ignored the preference outright.

**P3-30 · `.back-to-top` was a selector for a class the button did not carry.** The print stylesheet has hidden it since the print stylesheet was written; the button printed on every page anyway. Found while looking for a hook for the hover rule. It carries the class now, and both rules land.

**P2-19 · `ScrollReveal`'s `delay` was latency wearing a stagger's name.** A stagger needs a group; the component observes one element and fires when that element enters, so `delay={7}` postponed a section that was already on screen. Ten sections on the call for papers passed `delay={0..9}`; eight appeared **361–378ms after the reader had arrived at them**. The cap the component applied had been quietly flattening seven of those nine values to the same number, which hid the worst of it. `delay` is gone, with `direction` (no call site ever set it, and it carried six CSS selectors) and `threshold` (none ever overrode 0.15).

**Fixed in the `delight` pass (23 August 2026)** — the roadmap's own item for it, found by time-travelling the build through its timeline: ten moments, both locales, the clock fixed at each.

**P2-20 · The countdown could never reach zero.** `daysUntil` divided the raw interval and rounded up, and every milestone lapses at 23:59:59 SAST on its own date — so each one's last hours read as "1 day remaining". Four hours before the full-papers deadline, and again **on 21 September at 08:00, an hour before the opening, where the home page told 33 people who had already flown in that the workshop was a day away.** It counts venue calendar days now. `m.countdown_today()` had sat unreachable in both locales since it was written, because `days === 0` could not occur while a milestone was still ahead; it is a fragment now rather than a sentence, since it sits third in the `label · value · count` row beside "1 day remaining".

**P3-31 · "Happening now" outlived the workshop by six hours.** The badge was keyed to the date alone, so on the fourth day it stayed until midnight — while the home page, keyed to `workshopPhase()`, already said the workshop had concluded. It asks the phase too now.

### New findings from Phase 4

- **P3-32 · `reuseExistingServer` will serve a stale build to the whole e2e suite.** `playwright.config.ts` sets `reuseExistingServer: !process.env.CI`, and `vite preview` caches its asset map at startup — so a preview server left running from an earlier build serves HTML that references hashes it will 404. This produced one spurious e2e failure during this pass and, separately, made the home page appear to be frozen at build time until the server was restarted. CI is unaffected. Worth a line in the working agreements: **restart the preview after every build**, and treat "the client looks dead" as a stale server until proven otherwise. → working agreements
- ~~**P3-33 · The countdown's hourly tick is now the only thing keeping `Countdown` reactive**~~ — **closed in the `polish` pass, 24 August 2026.** It existed for a value that changes at most once a day. A timer aligned to the next midnight at the venue is one wake-up instead of twenty-four. → `polish`
- **`countdown_event_started` still carries an exclamation mark** ("The workshop is underway!" / "L'atelier est en cours !"), the only one in the catalogue. It is the site's warmest line and it appears on exactly four days, so it was left — but it is a register decision someone should make deliberately rather than inherit. → `polish`

### Phase 5 — the polish pass

**Fixed in the `polish` pass (24 August 2026)** — `53a6b2c`, `cbeed48`, `a50eff8`. Nine defects from an independent walk of the five top surfaces in traffic order, both locales, both themes, at 320 / 375 / 1280. Closed **P3-33**, the ORCID half of **P2-3** and the organiser-card half of **P2-13**; the other six were new.

| Measurement                                                | Before                       | After                 |
| ---------------------------------------------------------- | ---------------------------- | --------------------- |
| Countries, home page vs the page its figure links to       | **16 vs 17**                 | **17 vs 17**          |
| Participants header groups vs the filter's own total       | 37 vs 39                     | **39 vs 39**          |
| Widths where the wordmark is clipped                       | **< 414px EN, < 480px FR**   | **none**              |
| Header height across 320–1280                              | 72px                         | 72px (unchanged)      |
| Organiser card link rows, bottom offsets across four cards | 29 / 224 / 48.6 / 29px       | **29 / 29 / 29 / 29** |
| The two links in a person's link row                       | 44px and **20px**            | **44px and 44px**     |
| Footer logos, bytes per page load                          | **279.7 KiB**                | **57.8 KiB**          |
| Footer logo row, reflow as the images arrive               | 7 boxes 0px → measured width | **none**              |
| `Countdown` wake-ups per day                               | 24                           | **1**                 |

**The site published three country counts for one workshop.** Home said 16, `/participants` said 17, and home's figure _linked to_ `/participants#affiliations`. Both numbers were true and neither was wrong on its own: `uniquePaperCountries` counts the countries of paper authors, `uniquePersonCountries` counts everyone present, and the seventeenth is Mali — Point Sud's co-director in Bamako, who presents nothing. The home row reads "25 papers · 33 participants · N countries" and its third figure points at a map of _people_, so it counts people now. `/papers` keeps its paper-scoped 16, corroborated by its own 16-option filter. **The invariant worth holding is not "one number sitewide" but "the figure agrees with the control beneath it"** — which `/papers` already satisfied and home did not.

**The participants header was the same failure from the other side.** `harden` widened the filter from 33 people to 39 and noted that this "changes the page's opening, worth a second look"; the header was never revisited. It listed 33 participants and 4 organisers — 37 — immediately above a control reading "39 of 39 people", with the Point Sud section it had grown to cover missing entirely. The guard asserts the groups **sum to** the filter's total rather than asserting 39, so adding a person cannot silently reintroduce it.

**The wordmark was clipped on every phone, and what it cut was the year.** `truncate` on the brand qualifier rendered "AFRICAN STUDIES · STIA…" below 414px in English and 480px in French — measured, not estimated: the string needs 200.7px (EN) / 216.5px (FR) against 170.8px available at 375px. The two-line stack exists precisely so the qualifier is present at every width, and the clip defeated it. It wraps now, and the reason this looked riskier than it was is `--nav-height`: three lines of 11px plus the 20px brand measure 57px inside a 71px row, so the header is 72px at every width from 320 to 1280, and `main`'s padding, `scroll-padding-top` and the day bar are all untouched. A no-break space binds STIAS to its year so the break never falls between them.

**A separator cannot be a sibling of the things it separates.** The page-header meta row interleaved hairline spans as flex children, so at 375px they wrapped independently and a line ended on a dangling rule — "21–24 SEPTEMBER 2026 |" with the place stranded below. The obvious fix, grouping each rule with the item it precedes, **reproduced the defect at the other end**: lines then _began_ with a rule. They are pseudo-elements in each item's left gutter now, which places them outside the row's box whenever their item starts a line, where `overflow: hidden` removes them. Verified across four routes × two locales × five widths; on one line — every page at desktop — the rendering is identical.

**Two pages opened by repeating themselves.** `/venue` and `/about` each set their first section's eyebrow to the same message their own `<h1>` renders 300px above — `m.section_venue()` is literally the string the venue page passes as its title. Both deleted. The home page keeps its "About" eyebrow, where it names which section you are in rather than which page you are on, which is the distinction that makes the difference.

**`a.link-arrow` got the touch floor in the `layout` pass; the link beside it did not.** "Visit website" measured 44px and the ORCID link 20px, in the same row, doing the same job. Its `title` became an `aria-label` at the same time: the tooltip named the destination for a pointer and for nobody else. And the row itself floated — the organiser half of **P2-13**, deferred from `layout` — because every level between `.card` and the links stopped at its content, so two organiser cards the grid had already stretched to a common height sat 195px apart on their footers.

**P2-13's other half is smaller than it was recorded and is left open.** Measured across the first six paper cards, four of six agree exactly (eyebrow 30, title 62, authors 127, excerpt 177) and the worst pair differs by **28px — one title line**, not the ~75px / three lines the finding describes. Whatever narrowed it, the residue is intrinsic: the block under a title moves when the title wraps, and the only fixes are clamping titles or pinning the blocks below them, both of which cost more than 28px of misalignment does. Recorded with the real figure so the next pass decides against it rather than against the old one.

**280 KiB of logo shipped on every page to draw seven 40px marks.** The funder logos were supplied at up to 2250×1175; the largest single file, Goethe at 1280×698, was 119 KiB. `npm run images` grows a logos pass at 120px tall — 3× the rendered height, the same reasoning that sets 256px for participant photos — taking the seven from 279.7 to 57.8 KiB. STIAS keeps its PNG, because at 374×135 it was already right-sized and WebP made it _larger_. None of them declared a width either, so seven lazy images were 0px wide until they arrived; `Sponsor` carries intrinsic dimensions now and the row's widths are byte-identical before and after loading. **Nothing in CI had ever looked at an image**: `check-bundle-size.mjs` has per-chunk, per-route and MapLibre ceilings and would not have noticed a 2 MB PNG. It reads the _built_ folder, so a source left behind beside its optimised twin still counts.

Three e2e guards, each confirmed to fail against the previous tree. None of these nine is visible to lint, `svelte-check` or axe: an ellipsis is a rendering rather than an error, a stranded rule is a line break, and a number that is true about the wrong population is still a number.

### New findings from the polish pass

- **P3-34 · The one-gold-moment rule is stretched to 25 on `/papers`.** Every paper card carries a 2px `#c49528` top rule at full opacity. DESIGN.md permits "a 2px rule" as one of brass's non-solid forms, so this is inside the letter of the rule — but the rule's stated reason is that "its rarity is what makes it read as gold rather than as yellow", and 25 of them on one page is not rarity. Inspected and deliberately left: `quieter` is the pass that owns brass on this site and has already run, and restyling 25 cards is a direction decision, not a defect fix. Recorded so the next pass does not rediscover it. → `quieter` (second pass), or accept and amend the rule's wording
- **P3-35 · "Programme" is the primary action twice in the home page's first viewport** — once as the navbar's solid teal button, once as the hero's solid brass one, ~600px apart and in different colours. Conventional (nav + hero CTA), and changing the navbar's promoted action is a sitewide decision rather than a home-page one, so it was not touched. → a navbar decision
- **P3-36 · A French-language browser loads the English page in full before redirecting.** The auto-detect runs in `onMount`, after hydration, so a French visitor pays for one complete page load and then a hard navigation to `/fr`. Correct in behaviour — the destination has no trailing slash and `localizedPath` is unit-covered — but it is two page loads on the connection type PRODUCT.md names as a binding constraint. → `optimize`, or accept
- **`countdown_event_started` still carries the catalogue's only exclamation mark**, carried forward from Phase 4 unchanged. It remains a register decision for the user rather than a pass: PRODUCT.md's fourth principle asks for scholarly restraint, and this is the site's single warmest line, live on exactly four days. → the user

### Phase 5 — the re-run audit

**Run 24 August 2026** — full report in [`docs/audit-2026-08-24.md`](audit-2026-08-24.md). **Audit health 16/20 (Good), up from 14/20 at diagnosis.** 156 instrumented page loads, 52 axe runs, a 195-stop keyboard trace, zoom at 200% and 400%, the detector over `src/`.

**No regressions from Phases 2–4.** Every figure those passes recorded was re-measured against this build and holds; the table is in the report. What the sweep found instead were two pre-existing defects that five passes had walked past, both on binding constraints, and both numbered below.

- **P0-1 · `ScrollReveal` can leave content permanently invisible.** Two failures from one mechanism. `threshold: 0.15` is unreachable for an element taller than ~6.7 viewports, so at **320 × 640** `/about`'s abstract — **4905px EN, 5703px FR**, max ratio **0.130 / 0.112** — never reveals at all on a normal top-to-bottom scroll. And the callback reveals only on `isIntersecting`, so anything a jump skips stays at `opacity: 0` forever: **9 of 9** sections on `/call-for-papers` after a reload with scroll restoration, **3 of 3** on `/about` after a back-navigation or the `End` key, **6 of 9** after a `scrollIntoView`. Gradual scrolling from the top works perfectly, `will-change` release included — **which is why nobody saw it: every check anyone has run scrolls from the top**, including Phase 1's, which inspected this component and praised its `will-change` handling. Not a regression; the `animate` pass restructured the condition without changing when it fires. → `harden`
- **P1-9 · `--ink-subtle` fails AA on raised surfaces in dark mode.** `oklch(0.62 0 0)` measures **4.65:1 on the page and 3.93:1 on `--surface-raised`** (#221f1b), so it passes where most muted text lives and fails where it sits on a card. axe reports **13 nodes on `/programme`, both locales, dark only** — every `Social` label, both excursion descriptions, two end-times and all three venue links. `oklch(0.66 0 0)` measures 4.63:1 on the card and clears both surfaces; the neutral hue is deliberate and documented at `app.css:60–62`, so only lightness should move. Set in `8f8d361`, which predates this roadmap. → `colorize`
- **P2-21 · Two targets under the 24px floor.** The home page's countries figure is **21.4 × 47px** at 375 and 320 (axe flags it); on `/programme`, 11 author links have **23px of safe clickable space against a required 24** — a 1px near-miss the inline-text exception plausibly covers. `.session-external` venue links are **not** violations: axe passes them, they are genuinely inline, and their nearest neighbour is 68–115px away. → `adapt`
- **P3-37 · A 6px legend inside an icon.** The PDF control on `/call-for-papers` contains the literal text "PDF" at 6px inside an `aria-hidden` 24×24 SVG, rendering 8.6 × 5px. Decorative and adjacent to a link that names the file, so nothing is lost — but it is the only text on the site below the documented 11px floor. → `distill`
- **P3-38 · `text-[2.75rem]` on the thematic-axis numeral** (`ThematicAxis.svelte:61`) is the only typographic literal not resolving to a named step. The detector's one true finding. → `typeset`

**All six were fixed the same day** — `c951643` (P0-1), `65ab9b0` (P1-9), `b280e21` (P2-21), `760a9f8` (P3-37 and P3-38). Re-measured against the rebuilt site: **0 axe violations across 52 runs**, **0 horizontal overflow and 0 reveals left hidden across 156 loads**. Two details worth carrying forward. P0-1's first fix — testing `boundingClientRect.top < 0` in the callback — closed the reload case and not the jump-mid-session one, because an element going from below the viewport to above it crosses no threshold and fires no callback at all; moving the root's top edge up instead makes "already passed" mean "intersecting", so the crossing is real. And P2-21's binding gap was **inside** each paper, not between them: widening the list spacing changed nothing, which only the axe run revealed.

**Worth keeping in view** — two patterns rather than two defects. **Every check anyone has run scrolls from the top**, which is why a jump-, restore- and narrow-shaped failure survived a five-dimension audit and six passes. And **a role token can pass on one surface and fail on another**: contrast has always been checked per token, never per token-on-surface, so the failing half of `--ink-subtle` was invisible to every previous scan. Both are cheap to fold into how the next audit is run.

---

## P1 — Fix before the workshop

### P1-1 · Focus ring fails WCAG 1.4.11 on every dark surface **[converged: A + audit]**

`src/app.css:297` — `:focus-visible { outline: 2px solid var(--color-primary-500) }` is one global ring calibrated for cream, with no variant for inverse surfaces. With `outline-offset: 3px` the ring draws on the _parent_ surface:

| Surface                   | Where                               | Ratio                |
| ------------------------- | ----------------------------------- | -------------------- |
| `primary-900` #042828     | Footer — **light mode, every page** | 2.79:1 ✗             |
| `primary-800` #063b3c     | Hero gradient mid-stop              | 2.20:1 ✗             |
| `#221f1b`                 | Dark-mode card                      | 2.92:1 ✗             |
| cream / white / dark page | elsewhere                           | 5.44 / 5.62 / 3.46 ✓ |

The footer carries roughly twenty focusable links on every page, so this is site-wide in **both** themes, not a dark-mode-only issue as first suspected. WCAG 2.2 AA is binding per PRODUCT.md.

**Fix:** a `--focus-ring` role that flips with surface context, or a companion outer ring so one edge always clears 3:1. `primary-300` (#4db7b9) measures 7.4:1 on `#221f1b` and is already a documented token. → `harden`

### P1-2 · `--nav-height` is 14px short, occluding content on every page **[synthesis: A + B, verified directly]**

One root cause, four symptoms — neither assessment connected them, so this is the synthesis's own finding.

`Navbar.svelte:183` sets `.mobile-navigation { display: grid }` inside a Svelte `<style>` block. Svelte-scoped styles are **unlayered**, and unlayered declarations beat `@layer utilities` regardless of specificity — so Tailwind's `lg:hidden` never wins. The collapsed menu therefore renders its `border-t` (1px) + `pt-3` (12px) at _every_ width.

Measured directly at both 375×812 and 1280×900:

| Measurement                    | Value                                                  |
| ------------------------------ | ------------------------------------------------------ |
| `--nav-height` token           | 72px                                                   |
| Inner nav bar                  | 72px ✓                                                 |
| `#mobile-navigation` at 1280px | `display: grid`, **13px** (should be `none`)           |
| **Real header height**         | **86px**                                               |
| `main` padding-top             | 72px → **14px of content sits under the fixed header** |
| Programme sticky day-bar `top` | 72px → sticks 14px behind the header                   |
| `scroll-padding-top`           | 88px → anchors clear by only 2px                       |

`app.css:364` already documents this exact hazard, explaining that component classes live in `@layer components` "so Tailwind utilities always win". The navbar's scoped style sits outside that protection. DESIGN.md's Anchor Clearance Rule names `--nav-height` as the single source of truth; it is currently the single _wrong_ source.

**Fix:** move `border-t pt-3` inside the collapsing grid row so the closed state is genuinely 0px, and hide the disclosure at `lg` from within the scoped block rather than relying on the utility. One change corrects all four measurements. → `harden`

### P1-3 · `lang` is missing wherever authored text is not a title **[converged: A + audit]**

Binding constraint. The rule internalised during development was "mark paper titles", not "mark any string whose language differs from the page":

- **Paper `<h1>` on all 25 paper pages** — `PageHeader.svelte` has no `lang` prop. On `/papers/ai-cybersecurity-burkina` the 118-character French title is the most prominent text on the page and is announced with English phonemes. The `<article>` beneath it _is_ correctly marked, which makes this an inconsistency rather than an oversight. WCAG 3.1.2.
- **31 of 32 participant bios carry byte-identical `en` and `fr` strings.** Five are French prose served to English readers (`aminata-kane`, `eliette-ngo-tjomb`, `evelyne-amana`, `falimatou-pemgbou`, `mohamadou-konate` — ~1,400 characters each); roughly 26 are English prose served to French readers. None carries a marker. `scripts/check-data.ts` validates affiliations but never inspects `bio`, so this passes the build gate silently.
- **Paper card excerpts** — `PaperCard.svelte:60` marks the chip and the title but not the excerpt, so seven cards on `/papers` read three lines of French in English phonemes.

**Fix:** a `lang` prop on `PageHeader`; `lang={presentation.language}` on the excerpt; a `bioLanguage` field or an `en === fr` heuristic for bios; and extend `check-data.ts` to warn when `bio.en === bio.fr` so the state stops being invisible. Translation itself is content work, not code. → `harden`, then `clarify`

### P1-4 · The Measure Rule is mis-calibrated by 1.46× **[converged: A + B, independent methods]**

`--measure-prose: 68ch` resolves to 758px. But `ch` measures the advance of "0" (10.5–11.15px in Outfit) while real running prose averages 7.2–7.6px per character — a ratio of about 1.46. The rendered result is **93–100 characters per line**, which is verbatim the problem `app.css:189` says the token was introduced to fix ("~100 characters against a comfortable 60–75").

Verified across surfaces: the `ai-cybersecurity-burkina` abstract at 93 cpl, `/about` averaging 91 cpl across ten paragraphs and peaking at 101.

This is the one defect touching the entire "wider scholarly public" audience on every reading surface, and it is invisible to inspection because the token appears to be doing exactly what it says.

**Fix:** recalibrate to roughly `46ch` / `31ch`, or better, express both in `em` so they stop depending on a digit's width. Nothing else changes. Re-verify by rendering, not by declaration. → `typeset`

### P1-5 · Programme sticky day-bar renders near-white in dark mode **[audit]**

`programme/+page.svelte:61` uses `bg-cream/90`. `app.css:919` deliberately leaves `.bg-cream` **unlayered** so it outranks the generated utility — but `bg-cream/90` is a _different class name_ that never matches the alias, falling through to the raw `--color-cream: #fdfbf7`, which has no dark variant. In dark mode a near-white stripe cuts across the page; the "Jump to day" label measures **2.85:1**.

This is the only in-page navigation on a four-day schedule, on the surface PRODUCT.md Principle 3 names as outranking everything else.

**Fix:** `bg-page/90`, matching the pattern `Navbar.svelte:75` already uses correctly. → `colorize`

### P1-6 · The programme is 23 characters per line on a phone **[A]**

At 375px, `SessionCard`'s fixed `w-20` time gutter consumes 80px — 21% of the viewport — before card padding. The content column collapses to 213px and paper titles render at roughly **23 characters per line**. Titles average 5.1 lines; the worst runs 8. The page totals 12.7 screens in English, 13.0 in French. At 640px the same component is fine at 46 cpl.

This is precisely the scenario PRODUCT.md Principle 3 says outranks every expressive consideration.

**Fix:** below 640px, promote the time to a tabular-nums line _above_ the title rather than a side gutter, giving content the full ~343px (~40 cpl, roughly 40% less title height). Keep the current layout from 640px up. → `layout`

### P1-7 · 67 of 91 programme links are visually indistinguishable from static text **[A]**

`SessionCard`'s `.session-link` and `.session-paper-link` both set `color: inherit` with `text-decoration: none`, changing colour only on `:hover`. Author names compute to the same `--ink-muted` as their surrounding line; paper titles to the same `--ink-strong` as the heading above.

Hover does not exist on touch. For a participant at the venue on a phone, the most link-dense page on the site offers **no resting affordance at all** that 91 destinations exist — worse than a colour-alone problem, because there is no cue to misread.

**Fix:** a resting underline in `color-mix(in oklab, var(--color-primary-600) 35%, transparent)` at `text-underline-offset: 0.2em`, going solid on hover and focus. Reads as scholarly citation styling rather than web-blue and stays inside the palette. → `clarify`

### P1-8 · Avatar fallback initials fail contrast in dark mode **[audit]**

`Avatar.svelte:35` and `AvatarSmall.svelte:36` use `text-primary-600` — a raw palette step with no dark variant — over a `primary-500/8` wash. Measured **2.56:1** at 24px and **2.14:1** at 18px in the grid. `primary-300` would measure 7.74:1.

Eight of 33 participants have no photograph, a state PRODUCT.md explicitly calls "real, visible… not an edge case". In dark mode their only visual identity is close to invisible.

**Fix:** `dark:text-primary-300`, or promote to a role token so it flips once. The two components also disagree on semantics — `AvatarSmall` correctly uses `alt=""` with `aria-hidden`; `Avatar` exposes the initials. Unify on the `AvatarSmall` treatment. → `colorize`

---

## P2 — Fix if the schedule allows

- ~~**P2-1 · MapLibre's stylesheet ships eagerly**~~ **[converged: A + B + audit]** — **closed in the `optimize` pass, 18 August 2026.** `AffiliationMap.svelte:9` statically imports `maplibre-gl.css`, so Vite hoists it into the route stylesheet: 89,822 bytes raw / **11.8 KiB gzip render-blocking**, 99% of that file and 47% of the route's CSS. The JS is correctly lazy behind an `IntersectionObserver`. Total map cost is **382 KiB gzip** — about 2.6× the entire rest of the site's JavaScript — plus uncapped tile requests to `tiles.openfreemap.org`, the site's only external host. Move the CSS into the dynamic path and add a per-route CSS ceiling to `check-bundle-size.mjs`, which currently gates JS only. → `optimize`
- **P2-2 · The participants search misreports its own results** **[A, confirmed in source]**. `+page.svelte:32` filters only the `participants` array while the Organisers and Point Sud sections iterate their raw arrays unfiltered, and the counter reads `totalCount={participants.length}`. Searching "Madore" reports "Showing 1 of 33" while seven people remain visible — and the one "match" is Mohamadou Konaté, hit on the string "Madore (2021)" inside his abstract, while Frédérick Madore sits unfiltered above it. A count that contradicts the screen is a trust failure on a Read-mode surface. Scope the filter to the same unified `everyone` array the people registry already exposes. → `harden`
- **P2-3 · The documented 2.75rem touch floor does not hold** **[converged: A + audit]**. Only `.btn-sm` declares `min-height`, so the _large_ buttons are shorter than the small ones: base `.btn` renders 39–41px (hero CTAs), `.day-pill` 33px, `.segment` 38px. All clear WCAG 2.5.8's 24px minimum, so this is a broken promise rather than a violation — on the two surfaces that matter most on a phone. → `layout`
- ~~**P2-4 · Session permalink is invisible on touch and 12×12px**~~ **[converged: A + audit]** — **closed in the `adapt` pass, 18 August 2026.** `opacity-0` until `group-hover`, below the 24×24 minimum (SC 2.5.8), with adjacent targets 10px away, and 1.44:1 in dark mode (recorded here as 2.69:1, which was optimistic). Keyboard handling via `focus-visible:opacity-100` was genuinely good; touch and dark mode were the gaps. → `adapt`
- **P2-5 · `.text-eyebrow` renders two different ways depending only on tag name** **[A]**. Unlayered base rules (`h1…h6 { font-family: var(--font-display) }`, `app.css:251`) beat `@layer components`, so the class renders correctly on a `<span>` but as **uppercase Instrument Serif at 11px with negative tracking** on an `<h2>` — the worst legibility combination available, and backwards, since uppercase needs positive tracking. Affects `Footer.svelte:50,70` and `WhatNext.svelte:82` on every page. Same cascade-layer root cause as P1-2 and P1-5. → `typeset`
- **P2-6 · Language switching is JavaScript-only** **[audit]**. `LanguageSwitcher` uses `<button onclick>` setting `window.location.href`, though the destination is fully computable at render time. The only path between the English and French sites is inert without JS, cannot be middle-clicked, copied, or opened in a new tab. Render an `<a href>` with `hreflang`; full page navigation still happens. → `harden`
- **P2-7 · Map popup opens with no announcement or focus management** **[audit]**. The keyboard path is otherwise sound — real buttons, `aria-pressed`, `role="region"`, live loading state. But selecting a location never announces who is there. Mirror the selection into the panel list rather than depending on the popup. → `harden`
- ~~**P2-8 · The home hero is the one screen that could belong to any event**~~ **[A]** — **closed in the `quieter` pass, 21 August 2026.** A three-stop teal gradient, a 36px "15 / DAYS REMAINING" countdown, and a four-up stat row — together, above the fold, this is the drift toward _conference-brand energy_ that DESIGN.md names outright. The countdown addresses only authors of accepted papers and will be stale from 1 September. Separately, the three most clickable-looking objects on the page ("25 Papers", "33 Participants", "16 Countries") are inert `<dd>` elements, and `<main>` contains only four links. → decide direction first (see Open questions)

---

## P3 — Polish

Skip-link motion not neutralised under `prefers-reduced-motion` (`animate`) · ~~dead `--surface-inverse` / `--ink-on-inverse` tokens with zero consumers~~ **closed in `distill`, 21 August 2026** · no `rel="preload"` for any woff2, so fonts wait a round trip on high-latency connections (`optimize`) · Outfit 700 ships 20.5 KB for a single map marker rule (`optimize`) · 10px type on the programme below the documented 11px floor (`typeset`) · ~~language-switcher separator at 1.74:1~~ **closed — the separator no longer exists, the switcher is one anchor** · nine identical "Chair: To be determined" where one line in the existing callout would do (`distill`) · two solid-brass elements on the programme during the event, against a documented one-gold-moment rule (`quieter`) · the venue address prints "Stellenbosch, Stellenbosch" (`polish`) · theme does not respond to a live OS theme change (`harden`) · segmented control uses `aria-pressed` toggles where `radiogroup` would convey exclusivity and collapse six tab stops to one (`clarify`).

---

## Systemic patterns

1. **Cascade layers are the site's recurring trap.** Three separate P1/P2 findings share one mechanism: unlayered CSS silently outranks `@layer` CSS. Svelte's scoped `<style>` beats Tailwind utilities (P1-2); the unlayered `.bg-cream` alias is escaped by its own alpha modifier (P1-5); unlayered `h1…h6` base rules beat `@layer components` label classes (P2-5). The codebase _documents_ the hazard at `app.css:364` and still lost to it three times. Worth a short convention note once the fixes land.
2. **`lang` was learned as a property of titles, not of authored text.** Every title-rendering site has it; every other authored-text site does not. A wrapper component or a `PageHeader` prop makes the correct behaviour the default rather than something to remember per call site.
3. **Raw palette steps without dark variants — exactly the failure DESIGN.md predicts.** Thirty such utilities exist; most sit on surfaces dark in both themes and are fine. The three that drifted are precisely the ones on theme-flipping surfaces. The rule is right; nothing enforces it.
4. **CI gates are shaped around JavaScript.** `check-bundle-size.mjs` has per-chunk and MapLibre ceilings; `check-data.ts` enforces referential integrity. Neither notices a 90 KB stylesheet riding one route, nor 31 untranslated bios. Both gaps sit on binding constraints and are cheap to close.

---

## Preserve — verified strengths

Reflow is genuinely excellent: zero horizontal overflow at 320px and 375px across eight English and seven French routes, with French running ~20% longer. `will-change` is set on pending reveals and released to `auto` on completion — the textbook pattern rather than the usual failure. Reduced-motion handling is well judged: the `0.01ms` durations remove the tween while preserving the end state, so feedback survives; the map's spinner slows to 1.5s rather than freezing, and `easeTo`/`fitBounds` re-read the media query at call time. The affiliation map ships a real non-visual alternative — 18 locations as labelled buttons, a reset, `role="region"`, `cooperativeGestures`, a 15-second failure timeout. The print stylesheet forces unscrolled reveals visible, resets both themes to white, and appends URLs after external links. Bilingual mechanics are substantive: 21 of 21 programme paper titles carry `lang`, every landmark nav is labelled in the active locale, and `/fr/programme` in dark mode returned zero contrast failures.

Two details deserve naming. The coffee break renders as a bare dashed rule — no card, no badge, no serif — which is a real editorial judgment about what deserves a container, and it is what lets a dense four-day grid breathe. And `--accent-ink` exists with a comment explaining that `secondary-600` measures 3.7:1 on cream and fails: a token born from a measurement rather than a mood board.

---

## Open questions for Phase 2 planning

1. **Should `/programme` default to _today_ during the event and to _the argument_ before it?** `milestones.ts` already computes `workshopPhase()`. One surface, two honest modes, no new pages.
2. **Is the A–Z papers index the wrong artefact?** Participants navigate by session; the scholarly public wants the shape of the argument. The seven named thematic panels are already in the data. A–Z is the one ordering that destroys the body of work.
3. **What deserves the hero's visual weight if not the countdown?** It addresses only accepted authors and goes stale on 1 September.
4. **The affiliation map is the workshop's strongest single argument — sixteen countries as evidence rather than assertion — and it sits 15.5 screens down on mobile.** Considered choice or authoring order?
