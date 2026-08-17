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

## Phase 1 — Diagnosis (1–2 sessions)

Evaluate before treating. These two commands produce the findings backlog that decides which Phase 2–3 commands actually run and in what order.

4. **`/impeccable critique`** — heuristic UX review, one pass per main surface: home, programme, papers (index + one detail), participants (index + one detail of each group), about, venue. Run against the dev server in both locales; note per-surface mode from the table above so scoring is fair (e.g. programme is judged on scanability, not expressiveness).
5. **`/impeccable audit`** — technical quality sitewide:
   - **a11y:** keyboard operability of the AffiliationMap, FilterBar, SegmentedControl, language switcher; focus visibility; contrast in _both_ themes (gold-on-white is a known risk class); heading order; `lang` attributes on mixed-language content (FR abstracts on EN pages and vice versa).
   - **responsive:** 375 px programme day view, session cards, map, participant grid; tablet breakpoints.
   - **performance:** the participants map (only heavy JS on the site), image weights (participant webp photos), font loading, prerendered payload.

_Deliverable: a single prioritized findings backlog (severity × traffic), kept in `docs/`. Decision gate: the critique verdict on the home hero decides whether Phase 3 uses `bolder`, `quieter`, or neither._

## Phase 2 — Sitewide system passes (2–3 sessions)

Fix at the token/shell level before touching individual pages, so per-page work inherits the corrections instead of fighting them. Order matters: type → layout → copy → edge cases.

6. **`/impeccable typeset`** — typography hierarchy sitewide: serif display vs body pairing, scale consistency across PageHeader/section headings/cards, line lengths on abstract reading surfaces (papers detail is the main long-form page), FR typographic conventions (espaces insécables before `:` `;` `?` `!` — the programme already bakes one into `m.session_chair`).
7. **`/impeccable layout`** — spacing, rhythm, and alignment: section spacing consistency across pages, card grid gutters, PageHeader-to-content rhythm, the programme's panel/paper indentation logic.
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
| `onboard`         | No first-run flow, accounts, or activation — it's a content site                                                                             |
| `overdrive`       | Tone mismatch: an academic workshop site should not push past conventional limits                                                            |
| `colorize`        | The palette is committed (teal/gold); only revisit if the critique flags dead monochrome zones                                               |
| `extract`         | Small site, tokens already centralized in the theme; only if Phase 2 reveals real duplication                                                |
| `distill`         | No surface shows complexity overload; revisit only if the critique says otherwise                                                            |
| `craft` / `shape` | No new surfaces planned. If a "practical info / travel" page emerges before the workshop, `shape` it first — that's the one likely exception |

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
