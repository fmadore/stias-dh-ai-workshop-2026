# Phase 1 findings backlog — 17 August 2026

Method: dual-agent critique (Assessment A design review · Assessment B detector and browser evidence, run isolated from each other) plus a five-dimension technical audit. Findings marked **[converged]** were reached independently by two or more assessments; those carry the highest confidence.

| Score                                 | Result                                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design health (Nielsen, renormalised) | **25 / 36** — Acceptable, just under Good. Error Prevention scored `n/a`: no forms, no auth, no destructive action, nothing a user can get wrong. |
| Audit health                          | **14 / 20** — Good                                                                                                                                |
| Issue counts                          | P0 **0** · P1 **8** · P2 **8** · P3 **11**                                                                                                        |

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

**Still open:** all P2s except P2-3 and P2-5, and the rest of P3. **P1 is now clear.**

### New findings from the layout pass

Raised by the isolated layout assessment, verified in the browser where noted. Deliberately **not** fixed in this pass — each needs its own bounded verification.

- **P2-10 · Section rhythm runs on seven ad-hoc values while two of the four documented tokens are dead.** `--space-block` (3.5rem) has zero consumers anywhere; `--space-stack` has one, inside `app.css` itself. Meanwhile 20/28/32/40/48/56/64px do the work across ~40 call sites, and section-to-section is a different number on every route (64px participants, 56px CFP, 48px programme, 64–96px about/home). Each page is internally consistent; the pages disagree with each other. → `layout` (second pass)
- **P2-11 · The header-to-content interval is 40 / 48 / 56 / 64–96px across eight routes**, none of them a token — `PageHeader` sets `pt-14 pb-10` and then each route declares its own `pt-*`. One token consumed by `PageHeader` itself would end it. → `layout` (second pass)
- **P2-12 · Five distinct card-grid gaps and three breakpoint ladders** for equivalent card sizes: papers 24px @md, participants 16px @sm/lg, organisers and Point Sud 24px @lg, WhatNext 16px @sm/lg, key dates 1px. The two person grids on the same page switch at `lg` while the grid below them switches at `sm`. → `layout` (second pass)
- **P2-13 · Cards align on the outer box only.** With paper titles running 46–184 characters, the meta row, the brass paper rule and the placement eyebrow land at a different y in every card of a row; excerpt tops can differ by three title lines (~75px). `grid-template-rows` on the card, or `mt-auto` on the last block, would give a row one shared baseline. → `polish`
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

- **P2-1 · MapLibre's stylesheet ships eagerly** **[converged: A + B + audit]**. `AffiliationMap.svelte:9` statically imports `maplibre-gl.css`, so Vite hoists it into the route stylesheet: 89,822 bytes raw / **11.8 KiB gzip render-blocking**, 99% of that file and 47% of the route's CSS. The JS is correctly lazy behind an `IntersectionObserver`. Total map cost is **382 KiB gzip** — about 2.6× the entire rest of the site's JavaScript — plus uncapped tile requests to `tiles.openfreemap.org`, the site's only external host. Move the CSS into the dynamic path and add a per-route CSS ceiling to `check-bundle-size.mjs`, which currently gates JS only. → `optimize`
- **P2-2 · The participants search misreports its own results** **[A, confirmed in source]**. `+page.svelte:32` filters only the `participants` array while the Organisers and Point Sud sections iterate their raw arrays unfiltered, and the counter reads `totalCount={participants.length}`. Searching "Madore" reports "Showing 1 of 33" while seven people remain visible — and the one "match" is Mohamadou Konaté, hit on the string "Madore (2021)" inside his abstract, while Frédérick Madore sits unfiltered above it. A count that contradicts the screen is a trust failure on a Read-mode surface. Scope the filter to the same unified `everyone` array the people registry already exposes. → `harden`
- **P2-3 · The documented 2.75rem touch floor does not hold** **[converged: A + audit]**. Only `.btn-sm` declares `min-height`, so the _large_ buttons are shorter than the small ones: base `.btn` renders 39–41px (hero CTAs), `.day-pill` 33px, `.segment` 38px. All clear WCAG 2.5.8's 24px minimum, so this is a broken promise rather than a violation — on the two surfaces that matter most on a phone. → `layout`
- **P2-4 · Session permalink is invisible on touch and 12×12px** **[converged: A + audit]**. `opacity-0` until `group-hover`, below the 24×24 minimum (SC 2.5.8), with adjacent targets 10px away, and 2.69:1 in dark mode. Keyboard handling via `focus-visible:opacity-100` is genuinely good; touch and dark mode are the gaps. → `adapt`
- **P2-5 · `.text-eyebrow` renders two different ways depending only on tag name** **[A]**. Unlayered base rules (`h1…h6 { font-family: var(--font-display) }`, `app.css:251`) beat `@layer components`, so the class renders correctly on a `<span>` but as **uppercase Instrument Serif at 11px with negative tracking** on an `<h2>` — the worst legibility combination available, and backwards, since uppercase needs positive tracking. Affects `Footer.svelte:50,70` and `WhatNext.svelte:82` on every page. Same cascade-layer root cause as P1-2 and P1-5. → `typeset`
- **P2-6 · Language switching is JavaScript-only** **[audit]**. `LanguageSwitcher` uses `<button onclick>` setting `window.location.href`, though the destination is fully computable at render time. The only path between the English and French sites is inert without JS, cannot be middle-clicked, copied, or opened in a new tab. Render an `<a href>` with `hreflang`; full page navigation still happens. → `harden`
- **P2-7 · Map popup opens with no announcement or focus management** **[audit]**. The keyboard path is otherwise sound — real buttons, `aria-pressed`, `role="region"`, live loading state. But selecting a location never announces who is there. Mirror the selection into the panel list rather than depending on the popup. → `harden`
- **P2-8 · The home hero is the one screen that could belong to any event** **[A]**. A three-stop teal gradient, a 36px "15 / DAYS REMAINING" countdown, and a four-up stat row — together, above the fold, this is the drift toward _conference-brand energy_ that DESIGN.md names outright. The countdown addresses only authors of accepted papers and will be stale from 1 September. Separately, the three most clickable-looking objects on the page ("25 Papers", "33 Participants", "16 Countries") are inert `<dd>` elements, and `<main>` contains only four links. → decide direction first (see Open questions)

---

## P3 — Polish

Skip-link motion not neutralised under `prefers-reduced-motion` (`animate`) · dead `--surface-inverse` / `--ink-on-inverse` tokens with zero consumers (`distill`) · no `rel="preload"` for any woff2, so fonts wait a round trip on high-latency connections (`optimize`) · Outfit 700 ships 20.5 KB for a single map marker rule (`optimize`) · 10px type on the programme below the documented 11px floor (`typeset`) · language-switcher separator at 1.74:1 with its dark variant moving the wrong way (`colorize`) · nine identical "Chair: To be determined" where one line in the existing callout would do (`distill`) · two solid-brass elements on the programme during the event, against a documented one-gold-moment rule (`quieter`) · the venue address prints "Stellenbosch, Stellenbosch" (`polish`) · theme does not respond to a live OS theme change (`harden`) · segmented control uses `aria-pressed` toggles where `radiogroup` would convey exclusivity and collapse six tab stops to one (`clarify`).

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
