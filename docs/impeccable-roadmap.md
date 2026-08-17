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
7. ~~**`/impeccable layout`**~~ ✅ **complete (17 August 2026)** — `20af589`, plus a second commit for what the assessment found. Closed **P1-6** (the programme's content column at 375px, 213 → 309px, titles 23.7 → 40.9 characters and 4.81 → 3.43 lines) and **P2-3** (the 2.75rem touch floor, which only `.btn-sm` had ever declared). Found four defects in passing: `/about`'s thematic axes were **the same defect as P1-6 on a route nobody had measured**, break anchors landed 41px behind the sticky day bar, ten session→break boundaries stacked a dashed rule on a solid one, and `+error`'s `max-w-xl` was voiding `.text-lede`'s measure. `--nav-height` now equals the header's real outer height. **Deferred with reasons, not dropped:** the sitewide rhythm sweep (P2-10 — `--space-block` has zero consumers while seven ad-hoc values do its job across ~40 call sites), the header-to-content interval (P2-11), grid-gutter unification (P2-12) and card internal alignment (P2-13). Each is a bounded pass of its own; a second `layout` session should take P2-10 and P2-11 together.
8. **`/impeccable clarify`** — UX copy in **both locales**: labels, button text, empty states, the `session_tbd`/chair placeholders, filter labels, error/empty filter results. FR follows the médiane inclusive convention (`participant·es`) where it already applies — check the memory note for scope before extending it.
9. **`/impeccable harden`** — production edge cases: missing participant photos (Avatar fallback path), long names/affiliations (multi-line card behavior), FR text expansion (~20% longer), TBD content (Day 4 excursion, unset chairs), empty filter results, `prefers-reduced-motion` on ScrollReveal/Countdown, and the map's no-JS/slow-network state on a prerendered site.

_Each command = one focused session, one commit series, full pre-commit gate (see working agreements)._

## Phase 3 — Per-surface deep passes (2–3 sessions, worst-first per the Phase 1 backlog)

10. **Programme** — the highest-stakes surface for the actual event. `/impeccable layout programme` + `/impeccable adapt programme`: the 4-day schedule on a phone in a conference room is the single most important rendering on the site. Verify anchors (`session-{id}`) still land correctly after any spacing changes.
11. **Participants map** — `/impeccable adapt participants` for touch behavior, plus `/impeccable optimize` _only if_ the Phase 1 audit flags map bundle/interaction cost. (It's the one component with a repair history — map interactions broke once already.)
12. **Home hero** — per the Phase 1 critique verdict: `/impeccable live` for in-browser variant iteration on the hero/countdown block, or `/impeccable bolder` / `/impeccable quieter` if the critique says the whole surface needs a directional shift. Skip entirely if the critique scores it well.
13. **Papers detail** — verify the Phase 2 typeset pass landed well on the longest abstracts (both languages); spot-fix only.

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

| Command    | Why it's now needed                                                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `colorize` | Three dark-mode role tokens never flipped: the programme's sticky day-bar renders near-white, avatar initials measure 2.56:1, the language-switcher separator 1.74:1                       |
| `adapt`    | The session permalink is 12×12px, `opacity-0` until hover, and therefore unusable on touch — the device the programme is actually read on                                                  |
| `distill`  | Two small wins: nine identical "Chair: To be determined" lines where one callout sentence would do, and two dead role tokens (`--surface-inverse`, `--ink-on-inverse`) with zero consumers |
| `onboard`  | Not for a first-run flow — for `/venue`, which is 118 words five weeks before 33 people fly in from 16 countries. Structure and text only; PRODUCT.md forbids sourcing imagery unasked     |

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
