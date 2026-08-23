# Impeccable design roadmap

A phased plan for running the `/impeccable` skill (v4.1.1) over the STIAS DH+AI Workshop 2026 site to improve design quality and consistency before the workshop.

**Hard constraints that shape this plan:**

- **The workshop is 21–24 September 2026.** As of mid-August that leaves ~5 weeks. The site's audience right now is accepted participants checking the programme, their own pages, and travel info — plus the interested public. Content freeze should land ~14 September.
- **This is refinement, not redesign.** The July 2026 design audit was already implemented in full (token layer, home/shell, content pages, dark variants). The visual identity — cerberus base, teal `#0D7377` primary, gold `#D4A843` secondary, serif display type — is the incumbent world and every impeccable command must preserve it. No command in this plan replaces the visual world.
- **No impeccable artifacts exist yet.** There is no `PRODUCT.md` and no `DESIGN.md`, so Phase 0 is a prerequisite: without them, every later command re-derives context from scratch and risks drifting from the incumbent identity.
- **Everything ships in two locales** (EN base, FR under `/fr/`), two themes (light/dark), and must survive mobile. Every command's verification pass covers all of these.

---

## Surface inventory and modes

Impeccable assigns each surface a _mode_ (what visitor success looks like). Getting these right up front keeps critiques calibrated:

| Surface         | Route                                           | Mode                                | Notes                                                                                                           |
| --------------- | ----------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Home            | `/`                                             | **Persuade** → shifting to **Read** | Hero, countdown, at-a-glance, key dates. CFP closed, so the "act" is now "attend/explore", not "submit"         |
| Programme       | `/programme`                                    | **Read**                            | Densest UI on the site: 4 days, 7 panels, keynotes, discussions, anchors. Highest-traffic page for participants |
| Papers          | `/papers`, `/papers/[slug]`                     | **Read**                            | Index with FilterBar + grid; detail pages are long-form abstract reading surfaces                               |
| Participants    | `/participants`, `/participants/[slug]`         | **Read**                            | Three groups (organisers, Point Sud, participants), affiliation map, bio pages                                  |
| About           | `/about`                                        | **Read**                            | Abstract + thematic axes                                                                                        |
| Venue           | `/venue`                                        | **Read**                            | Map embed + practical info; increasingly important as travel approaches                                         |
| Call for papers | `/call-for-papers`                              | **Read** (archival)                 | Closed since 30 April; should read as record, not invitation                                                    |
| Shell           | Navbar, Footer, PageHeader, WhatNext, BackToTop | —                                   | Cross-cutting; touched by sitewide passes, not per-surface ones                                                 |

---

## Phase 0 — Foundations ✅ complete (17 August 2026)

Goal: give every later command durable, correct context.

**Done:** [`PRODUCT.md`](../PRODUCT.md), [`DESIGN.md`](../DESIGN.md), the `.impeccable/design.json` sidecar, and live-mode config (`.impeccable/live/config.json`; no CSP in this project, so no patch was needed). Decisions confirmed in the interviews, which later phases must honour:

- **Two audiences of equal standing** — accepted participants and the wider scholarly public. Neither may be served at the other's cost, so no surface gets optimised purely for discovery or purely for logistics.
- **After 24 September the site is a frozen record.** No slides, recordings, or galleries. The `after` phase needs a copy shift, not new surfaces — this removes any argument for building post-event surfaces now.
- **Three binding constraints:** WCAG 2.2 AA (audit findings are binding, not advisory), low-bandwidth/mobile-first, and bilingual parity. These make the Phase 1 audit a gate rather than a report.
- **Creative North Star: "The Reading Room."** Warm paper, serif structure, one brass moment per page, interface recedes.
- **Confirmed anti-references** (the Don'ts): conference-brand energy, tech-startup minimalism, institutional heaviness, and — explicitly user-confirmed — any decorative Africanist or orientalist visual shorthand. The last is absolute: the design must not enact what the workshop's scholarship critiques.

1. **`/impeccable init`** → writes `PRODUCT.md`. Key facts to capture: bilingual academic workshop site; static (GitHub Pages, adapter-static); audiences by phase; **workshop state is derived from `src/lib/utils/milestones.ts`** — any design work that assumes a phase (CFP open, registration, post-workshop) must check the four dates in `cfp.ts` + `site-config.ts` first. This exact mistake (a stale open-call premise) had to be caught in the July audit.
2. **`/impeccable document`** → generates `DESIGN.md` from existing code. This records the incumbent world — tokens, type scale, component patterns, the three-treatment session rendering, card conventions — so later commands _preserve_ rather than reinvent. Watch for the known Tailwind token namespace collision (`--text-*` sizes vs `--color-*` roles both emitting `text-<name>`).
3. **`/impeccable hooks on`** (optional, recommended) → enables the design-detector hook so any UI edit in later phases gets auto-scanned.

_Exit criteria: `PRODUCT.md` and `DESIGN.md` exist, reviewed by us for factual accuracy (dates, phase logic, palette)._

## Phase 1 — Diagnosis ✅ complete (17 August 2026)

Evaluate before treating. These two commands produce the findings backlog that decides which Phase 2–3 commands actually run and in what order.

**Done:** [`docs/design-findings-2026-08.md`](design-findings-2026-08.md) is the prioritised backlog; the critique snapshot is archived at `.impeccable/critique/` for `/impeccable polish` to inherit. Scores: design health **25/36** (Acceptable, Error Prevention `n/a`), audit health **14/20** (Good). Counts: **P0 0 · P1 8 · P2 8 · P3 11**.

Three findings changed the plan below:

- **Cascade layers are the recurring trap**, not a one-off. Unlayered CSS silently outranks `@layer` CSS in three separate places — Svelte scoped styles beating Tailwind utilities, the `.bg-cream` alias escaped by its own alpha modifier, and unlayered `h1…h6` rules beating `@layer components` label classes. Phase 2 must fix the mechanism, not just the three instances.
- **`colorize` is now required** — it was originally "not scheduled". Three dark-mode colour defects (sticky day-bar, avatar initials, language-switcher separator) are role tokens that were never flipped.
- **The home-hero decision gate resolved toward `quieter`, pending the user's call** — the gradient, countdown and stat row together are the one screen that reads as generic conference branding, and the countdown goes stale on 1 September.

4. **`/impeccable critique`** — heuristic UX review, one pass per main surface: home, programme, papers (index + one detail), participants (index + one detail of each group), about, venue. Run against the dev server in both locales; note per-surface mode from the table above so scoring is fair (e.g. programme is judged on scanability, not expressiveness).
5. **`/impeccable audit`** — technical quality sitewide:
   - **a11y:** keyboard operability of the AffiliationMap, FilterBar, SegmentedControl, language switcher; focus visibility; contrast in _both_ themes (gold-on-white is a known risk class); heading order; `lang` attributes on mixed-language content (FR abstracts on EN pages and vice versa).
   - **responsive:** 375 px programme day view, session cards, map, participant grid; tablet breakpoints.
   - **performance:** the participants map (only heavy JS on the site), image weights (participant webp photos), font loading, prerendered payload.

_Deliverable: a single prioritized findings backlog (severity × traffic), kept in `docs/`. Decision gate: the critique verdict on the home hero decides whether Phase 3 uses `bolder`, `quieter`, or neither._

## Phase 2 — Sitewide system passes (2–3 sessions)

Fix at the token/shell level before touching individual pages, so per-page work inherits the corrections instead of fighting them. Order matters: type → layout → copy → edge cases.

Two a11y-first passes ran ahead of `typeset` because they were binding constraints: `a97f92b` (P1-1, P1-3, P1-5, P1-8) and `0e375db` (P1-2, half of P3-2).

6. ~~**`/impeccable typeset`**~~ ✅ **complete (17 August 2026)** — `23fe95e`, `e0c45c0`, `f2e270e`. Closed **P1-4**, **P2-5** and the 10px-type P3. The pass found that P2-5 was not three label sites but **37 headings**: element defaults sat unlayered and were outranking `@layer components` _and_ `@layer utilities`, so the documented leading and tracking never reached the page. One structural move (`@layer base`) fixed all 37. The measure went from `ch` to `em` — 102 → 68.4 rendered characters — and every literal font-size now resolves to a named step. French no-break spaces landed for the site's own voice (18 strings); **authors' titles, abstracts and bios were left untouched, pending a decision that is the user's to make**. Five new findings were raised and recorded, chief among them P2-9 (Instrument Serif has no metric-compatible fallback; Georgia sets 30% wider), which promotes the font-preload item into `optimize` as a layout-stability fix.
7. ~~**`/impeccable layout`**~~ ✅ **complete (17 August 2026)** — `20af589`, plus a second commit for what the assessment found. Closed **P1-6** (the programme's content column at 375px, 213 → 309px, titles 23.7 → 40.9 characters and 4.81 → 3.43 lines) and **P2-3** (the 2.75rem touch floor, which only `.btn-sm` had ever declared). Found four defects in passing: `/about`'s thematic axes were **the same defect as P1-6 on a route nobody had measured**, break anchors landed 41px behind the sticky day bar, ten session→break boundaries stacked a dashed rule on a solid one, and `+error`'s `max-w-xl` was voiding `.text-lede`'s measure. `--nav-height` now equals the header's real outer height. **Deferred with reasons, not dropped:** the sitewide rhythm sweep (P2-10 — `--space-block` has zero consumers while seven ad-hoc values do its job across ~40 call sites), the header-to-content interval (P2-11), grid-gutter unification (P2-12) and card internal alignment (P2-13). Each is a bounded pass of its own; a second `layout` session should take P2-10 and P2-11 together. — **done, 21 August 2026** (`0abe20e`): **P2-10** and **P2-11** closed together as the roadmap prescribed. `--space-block` went from zero consumers to 15 through two classes, `.page-body` and `.block-flow`; the header-to-content interval and every subsection gap are 56px, which is the value 56px the site had already converged on in five places without reading the token. Chrome intervals (32px), the programme's post-bar 40px and `/about`'s banded section were deliberately left out — one value everywhere is monotony, not rhythm. **P2-12** and **P3-13** remain, and are not rhythm questions.
8. ~~**`/impeccable clarify`**~~ ✅ **complete (18 August 2026)** — closed the last open **P1** (P1-7: 0 of 63 programme links had a resting affordance; now 63, at 3.26:1 light and 3.32:1 dark) and the segmented-control **P3** (`aria-pressed` → `role="radiogroup"`, which also took the participants filter row from 8 tab stops to 4). The pass's own first attempt at P1-7 is recorded as a defect: the 35% mix this backlog specified measured 1.78:1, reproducing the failure it was meant to fix. Copy landed in both locales — the chair line became one statement instead of a colon promising a name, the filter count named its noun and regained EN/FR parity, and the filtered-empty state gained the recovery it never had. Three things the audit did not expect: **the Call for Papers page said nowhere that the call had closed** (now derived from `isCfpOpen()`, authored prose untouched by decision), the footer claimed "All rights reserved" against the repository's own CC BY 4.0 grant (replaced by decision), and the countdown would have rendered "1 DAYS REMAINING" on 30 August. Also cleared 17 dead message keys and the orphaned `key-dates.ts`. Four new findings recorded, chief among them **P2-14** (the error page picks its locale twice, differently) and a reinforced **P2-2**.
9. ~~**`/impeccable harden`**~~ ✅ **complete (18 August 2026)** — closed **P2-2**, **P2-6**, **P2-7**, **P2-14**, **P3-16** and the live-theme P3. **P2-2 turned out to be structural**: the filter governed the participants array while two sections rendered raw above it, so the control moved above all three and now runs one predicate over 39 people rather than 33 — which also changes the page's opening, worth a second look. **P2-14 was worse than recorded**: against the build, `404.html` is a client-rendered shell serving the whole site, so _every_ bad French URL answered in English; the locale now comes from the path, unit-covered. `--day-bar-height` makes the programme's anchor offset derived at last, measured at exactly 61px in the build. Two found in passing: a single unbreakable word pushed the page to 518px inside a 320px viewport, and the map's prerendered spinner never resolved without JavaScript. Reduced motion and image fallbacks verified good and left alone. Four regression guards added to the e2e suite, since each of these fails silently.

_Each command = one focused session, one commit series, full pre-commit gate (see working agreements)._

## Phase 3 — Per-surface deep passes (2–3 sessions, worst-first per the Phase 1 backlog)

10. ~~**Programme**~~ ✅ **`adapt` complete (18 August 2026)** — `3a7819e`, `0463189`. Closed **P2-4**: the session permalink was `opacity-0` until hover on a 12×12 box at 1.44:1 in dark mode, which is three separate failures on the one device the programme is actually read on. It is now 24×24, visible at rest on coarse pointers only, and 3.26 / 3.32:1 — and all 20 land on a single x rather than 20. The pass also found what nobody had measured: **at 320px the sticky day bar wrapped to two rows and rendered 113px while `--day-bar-height` still said 61px**, so jumping to a day put its heading 35.8px _behind_ the bar — the same class of silent failure `harden` thought it had closed, since `min-height` holds a floor and not a ceiling. `flex-nowrap` makes the height true by construction. Anchors re-verified: both day and session land 16px clear, matching the 375px figure. Two guards added; both confirmed to fail against the previous build. **Raised, not fixed: P2-15** — on a phone in landscape, 35.5% of the viewport is sticky chrome, which cannot be fixed without a decision about the _sitewide_ header. The `layout programme` half of this item was largely absorbed by the Phase 2 layout pass (P1-6).
11. ~~**Participants map**~~ ✅ **complete (18 August 2026)** — `ed193b0`, `4797f77`, `0ffa078`. Closed **P2-1**, **P2-9** and the two font P3s. The map was a lazy component with an eager stylesheet: 92.5% of `/participants`' route stylesheet was MapLibre's CSS, blocking first paint for every visitor including those who never scroll to it. Render-blocking CSS on that route went **24.9 → 14.9 KiB gzip**. The CI half needed a different metric than the one that existed — a sitewide CSS total is blind to bytes moving from a lazy asset into a render-blocking one — so the gate now caps **per-page** blocking CSS, at a ceiling P2-1 would have failed. Fonts: Instrument Serif is preloaded (latin only — latin-ext is 11.6 KB that 87% of pages never use), and Outfit 700 is gone, having shipped 20.5 KB for the single rule that set a digit in a map marker. **The `adapt` half was assessed and needed nothing**: markers 32×32, controls 40×40, affiliation buttons 378×69, `cooperativeGestures` active, no overflow — which is what the Phase 1 audit had already put on its Preserve list. The roadmap's own condition for `optimize` here was a flagged bundle _or_ interaction cost; only bundle cost was ever flagged.
12. ~~**Home hero**~~ ✅ **`quieter` complete (21 August 2026)** — `05ac0bd`, `f47f9c9`. Closed **P2-8** entire. The hero carried three decorative layers on one surface — a three-stop teal gradient on a diagonal, a brass radial at 18% over 70% of the width, and the grain — and a 36px display-serif numeral counting down under them. It is now one tonal wash between two adjacent steps of the same teal, with the grain; the strip's `bg-black/20` went with the radial, because the wash already deepens into it and a pure-black overlay on teal was off-system against the warm-shadow rule. The count is a clause in the strip's own 14px sans, third in the `label · value · count` row the dates line above already uses — the strip goes 73 → 61px at 1280 and 136 → 98px at 320px in French. **The backlog's premise for dropping the countdown was already stale**: it reads `nextMilestone()`, so it stops counting to full papers on 1 September and starts counting to the workshop. What needed fixing was the treatment, not the element. The three at-a-glance figures became links to what they count — `<main>` goes from 4 links to 7 — carrying the same resting affordance the programme got in `clarify`, measured at 3.20:1 on cream and 3.55:1 dark, with the countries figure landing on a new `#affiliations` anchor 16px clear of the header. One guard added, confirmed to fail against the previous tree. **Raised, not fixed: P3-22** (the reduced-motion block is a hand-maintained list of selectors, and two colour transitions are not on it) and a correction for `distill` — `--surface-inverse` / `--ink-on-inverse` are unused because the hero, the one surface they are named for, needs a different dark value, so they should be deleted rather than adopted.
13. ~~**Papers detail**~~ ✅ **complete (23 August 2026)** — `a014c0a`. The verification found what per-block measurement cannot see: `.prose p { margin-block: 0 }` outranked `.prose > * + *` two lines above it — (0,1,1) against (0,1,0) — so **every abstract on the site rendered as one unbroken column**, 66 lines with no paragraph break on the longest and 110 at 320px. It looked like a UA reset and reset nothing: Tailwind's preflight already zeroes `*`. Recorded as **P2-16**, and it is the fourth member of the backlog's cascade family — the first whose mechanism is plain specificity rather than layers, which is why the audit's layer sweep missed it. **The typeset pass could not have found it**: it measured line length, size, leading and tracking, all per-block and all correct here. Intervals are 20px now; the measure it did fix is untouched (70 characters at 1280, 52 at 375, 44 at 320, EN and FR alike). The longest abstract's five author-written section headings — `**bold**` paragraphs, the only syntax to hand — needed answering too, since a restored interval alone gives a heading equal space above and below; they are tagged at render time (CSS cannot select "a paragraph that is _only_ a bold run") and set at the card-title step in the display serif, 36px above against 8px below. Two guards, both confirmed to fail against the previous tree. **Raised, not fixed: P3-25** (those five headings are still absent from the document outline, and fixing that needs an "Abstract" heading — new copy in two locales, so the user's call), **P3-26** (Outfit has no italic; nine emphases render as a synthesised oblique — inspected and deliberately left, the serif alternative reads worse) and **P3-27** (`.prose` styles four elements; `marked` can emit a dozen).

## Phase 4 — Motion and personality (1 session)

Only after structure settles — animating a layout that's about to change is wasted work.

14. **`/impeccable animate`** — purposeful motion: audit existing ScrollReveal usage for consistency (durations, easings, thresholds), entrance staggers on card grids, countdown ticks, map pin transitions. Everything behind `prefers-reduced-motion`.
15. **`/impeccable delight`** — restrained, academic-appropriate touches only: think map pin hover states, day-tab transitions, the countdown reaching zero during the workshop. This is a scalpel pass, not a confetti pass.

## Phase 5 — Ship gate (1–2 sessions, complete by ~14 September)

16. **`/impeccable polish`** — final quality pass per top surface in traffic order: programme, home, participants, papers, venue.
17. **Re-run `/impeccable audit`** — confirm no regressions from Phases 2–4; a11y and responsive findings must be zero-or-accepted.
18. **`/impeccable document`** — refresh `DESIGN.md` to match the shipped state, so post-workshop work (photo galleries, slides archive?) inherits accurate context.

---

## Commands deliberately not scheduled

| Command           | Why skipped                                                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `overdrive`       | Tone mismatch: an academic workshop site should not push past conventional limits                                                            |
| `extract`         | Small site, tokens already centralized in the theme; only if Phase 2 reveals real duplication                                                |
| `craft` / `shape` | No new surfaces planned. If a "practical info / travel" page emerges before the workshop, `shape` it first — that's the one likely exception |

**Reinstated after Phase 1** (the diagnosis overruled the original call):

| Command                                         | Why it's now needed                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~`colorize`~~ ✅ **complete (21 August 2026)** | Day bar and avatar initials closed in `a97f92b`; the separator closed itself when the switcher became a single anchor. What was left was **P3-14** — `.text-eyebrow` hard-coded to brass, so the hero and footer rebuilt it by hand. `--eyebrow-ink` is a role now and `.focus-on-inverse` is `.on-inverse`, since it flips two roles, not one                                               |
| `adapt`                                         | The session permalink is 12×12px, `opacity-0` until hover, and therefore unusable on touch — the device the programme is actually read on                                                                                                                                                                                                                                                    |
| ~~`distill`~~ ✅ **complete (21 August 2026)**  | The chair lines were absorbed by `clarify`. Four tokens deleted, not two — `--font-mono` and `.container-prose` had also outlived their consumers. Plus **P3-18** (seven panel titles carrying a number the eyebrow computes) and **P3-21** (a `title` reachable only by pointer). **P3-17 did not survive inspection**: its four bespoke `max-width`s are three, and none is a page wrapper |
| `onboard`                                       | Not for a first-run flow — for `/venue`, which is 118 words five weeks before 33 people fly in from 16 countries. Structure and text only; PRODUCT.md forbids sourcing imagery unasked                                                                                                                                                                                                       |

## Working agreements (every session)

- **Setup once per session:** the skill's `context.mjs` runs first; don't rerun it mid-session.
- **Verify in bounded passes:** build fully, one batched inspection round (desktop + mobile, EN + FR, light + dark), fix everything it shows, at most one confirmation round. No open-ended polish loops — that's what the Phase 5 gate is for.
- **Pre-commit gate:** `npm run lint && npm run check && npm run format:check && npm run test` — the e2e specs assert on visible copy and counts, so they are the check that catches what design edits break (renamed labels, added rows). CI runs prettier separately; don't burn a CI round on formatting.
- **One command per commit series**, conventional messages (`design(typeset): …`), so any pass can be reverted independently.
- **The brief wins:** if any impeccable output wants to replace the teal/gold identity, the serif display, or factual copy — that's out of scope; refinement preserves.

## Suggested calendar

| Week of | Phase                                                               |
| ------- | ------------------------------------------------------------------- |
| 17 Aug  | Phase 0 (foundations) + Phase 1 (diagnosis)                         |
| 24 Aug  | Phase 2 (typeset, layout, clarify)                                  |
| 31 Aug  | Phase 2 (harden) + Phase 3 (programme, map)                         |
| 7 Sept  | Phase 3 (home, papers) + Phase 4 (motion)                           |
| 14 Sept | Phase 5 (polish, final audit, document) → **freeze before 21 Sept** |

Total: roughly 8–12 focused sessions. Phases 0–2 are the highest-leverage two-thirds; if time runs short, Phase 4 is the first thing to drop, then Phase 3's home-hero item — the programme and map passes should not be dropped.
