# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences of equal standing; no design may serve one at the cost of the other.

**Participants and organisers named in the programme** (33 participant records, 4 organisers, 2 Point Sud representatives). They can revisit their pages, abstracts, programme slots and workshop information. These are programme records, not verified attendance figures. The original mobile and low-bandwidth use cases still matter for readers consulting the record.

**The wider scholarly public** — African Studies and digital humanities researchers who encounter the workshop through search, citation, or colleagues. They read the abstract and thematic axes, browse the 25 paper records as a body of work, and follow the relationships between authors, people and programme sessions.

Funders and partner institutions (DFG, Point Sud, STIAS, and the partner universities) are a real but secondary audience: they need the programme and the acknowledgement of support to be legible, not a surface of their own.

## Product Purpose

The public site for the DFG Programme Point Sud workshop _Digital Humanities and Artificial Intelligence in African Studies: Towards Sustainable and Equitable Practices_, held at the Stellenbosch Institute for Advanced Study (STIAS), South Africa, 21–24 September 2026.

It preserves a findable, intelligible scholarly record: the intellectual argument, programme, paper abstracts and people named in the workshop materials. A scholar who has never heard of the workshop should be able to understand its scope and locate a paper or contributor in a few minutes. The practical information remains part of that record, not an invitation to a future event.

## Positioning

A bilingual (English/French) scholarly workshop site whose content model is the workshop itself: papers, people, and programme are typed data with referential integrity, cross-linked in both directions. A paper resolves its authors; a participant resolves their paper and its slot in the schedule; the programme references both by id. The site is a small, honest scholarly record rather than a conference marketing page — there is no registration funnel, no ticketing, no sponsorship tiers.

The bilingualism is substantive, not decorative: the workshop materials include papers in either language, and the site carries French and English as equals.

## Operating Context

- **Static and free to host.** SvelteKit 3 / Svelte 5, fully prerendered via `@sveltejs/adapter-static`, deployed to GitHub Pages under the `/stias-dh-ai-workshop-2026` base path. No server, no database, no runtime API.
- **Content lives in typed TypeScript files** under `src/lib/data/` — one file per participant and per presentation, auto-discovered by `import.meta.glob`. Editing content means editing code, and `scripts/check-data.ts` enforces referential integrity (author ids, programme references, image paths) at build time.
- **Build-time server views keep page payloads small.** `src/lib/server/views.ts` and route server loaders derive the counts, listings, bylines and session casts each page renders. Full abstracts and biographies stay off unrelated routes; directory search loads the full-text index on demand. These modules run during prerendering, not on a deployed server.
- **Workshop state is final, and baked into the build.** Until November 2026 every phase-dependent element (open call, countdown, "happening now", the join invitation) was decided by a client-side clock after hydration, so the prerendered HTML that crawlers and no-JS readers receive always showed the workshop before it happened. All four milestones have now passed for good: the call is closed, the workshop is over, and the pages state that statically. `src/lib/utils/milestones.ts` keeps only the four dates as a plain record (`getMilestones()`) and the opening and closing instants (`workshopStart()`, `workshopEnd()`) in South African Standard Time. Nothing implies a future phase — no open call, no countdown, no "register now" — and a design that reintroduces one is wrong by construction.
- **Two locales, URL-prefixed.** English at the base path, French under `/fr/`. Both are fully prerendered; `scripts/smoke-test.mjs` verifies French pages are genuinely prerendered in French.
- **The hybrid workshop information names Microsoft Teams.** The call for papers said Zoom, and `cfp.ts` still does: that page is an archival record of the call as published, so it keeps the platform the call named. The public Teams joining details were removed after the workshop closed; `online-access.ts` keeps the platform metadata with an empty `joinUrl`. Do not republish expired meeting credentials.

## Capabilities and Constraints

- Surfaces: home, about, programme, papers (index and per-paper), participants (index and per-person), venue, resources, call for papers.
- The call for papers **closed on 30 April 2026**; that page is now an archival record of the call, not an invitation.
- The programme preserves the published schedule and carries a last-updated date (`programmeLastUpdated`). The downloadable PDF is the hand-made programme circulated on 15 September; it cannot be regenerated, disagrees with the final data in places, and is labelled as the printed programme rather than offered as the record. It covers 4 days: 7 thematic panels of 3 papers, 2 keynotes, 2 group discussions, and 2 excursions. These are scheduled activities, not independently verified outcomes. Unassigned chairs render as "To be determined".
- Content is language-mixed by design: paper titles retain their language of delivery; abstracts can have bilingual variants, so a French abstract appears on an English page and vice versa. Participant affiliations and biography fields are localised; where no biography translation exists, both fields retain the supplied source text and its language.
- **The site is now a frozen workshop record.** No recordings or photo galleries are planned. Maintenance fixes and supported content corrections remain appropriate; new outcome claims need evidence. (Scope confirmed August 2026.) The one new surface, added October 2026, is **resources**: presenters' slides, listed from `Presentation.slides` (an external URL that also puts a button on the paper's page), and a reading list of outside links in `src/lib/data/resources.ts` — writing on the workshop by people who took part, software made for it, and the archives, data, AI tools, publishing venues, networks and meetings that came up in its discussions. The software is Live Translation & Subtitles, which captioned the sessions in English and French (confirmed by the organisers, October 2026); `/about` says so in a short "Two working languages" section after the thematic axes, the page's only past-tense account of how the four days ran, and links to its entry under Resources.
- Licensing is split: code MIT, content CC BY 4.0, **except** paper titles, abstracts, and biographies, which belong to their authors, and participant photographs and funder logos, which are used by permission only.

## Brand Commitments

- Name and titles are fixed in `site-config.ts` in both languages; the short form is "DH & AI in African Studies".
- Funder and institutional logos (Point Sud, STIAS, DFG, Goethe University Frankfurt, University of Bayreuth / Africa Multiple, King's College London, SADiLaR) must remain visible and correctly attributed. They are supplied assets in mixed formats and may not be recoloured or restyled.
- French follows inclusive writing with the median point (`participant·es`, `chercheur·euses`), already applied consistently across content data.
- The existing visual world — teal primary, gold secondary, serif display type, custom token layer in `src/app.css` — is the incumbent identity and is to be preserved. Design work is refinement.

## Evidence on Hand

Real, in the repository:

- 25 paper records with genuine titles and abstracts; 33 participant records; 4 organisers; 2 Point Sud representatives; a fully populated 4-day programme.
- 31 photographs (25 participants, 4 organisers, 2 Point Sud), as 256 px WebP generated by `npm run images`.
- Seven funder/institution logos; a generated Open Graph card (`npm run og`).
- Substantive scholarly prose already written in both languages: workshop rationale, submission guidelines, selection criteria, publication plan, workshop format, venue description, and logistics.

Absences that must not be invented:

- **No venue or Stellenbosch photography exists.** A previous audit recommended venue imagery; the alternative it offered was a graphic system. Nothing has been supplied since. Do not fabricate or source imagery without asking.
- **8 of the 33 participants have no photograph, and one has no biography.** The avatar fallback is a real, visible state, not an edge case.
- No testimonials, attendance figures, press coverage, or outcome claims exist. The JDHASA special issue is an intention subject to editorial agreement, not a fact.

## Product Principles

1. **State the record as it stands, in the HTML.** The workshop is over; the site says so in what it prerenders, not in what a script inserts afterwards. Copy about the event is in the past tense, and documents of record (the call for papers, the printed programme) are kept as published and labelled as such.
2. **Both languages are the site.** French is not a translation layer over an English product. A design that reads well in English and awkwardly in French is unfinished.
3. **The programme remains easy to consult.** Readers on phones and constrained connections need dates, sessions and paper links quickly. That scenario outranks every expressive consideration on that surface.
4. **Scholarly restraint.** The register is an academic workshop, not a conference brand. Personality lives in precision and typography, not in ornament or persuasion tactics.
5. **Say only what is true.** Incomplete content — unassigned chairs, a missing biography or a missing photograph — is shown honestly. Programme records do not establish attendance or prove that a scheduled activity occurred.

## Accessibility & Inclusion

Three constraints are binding (confirmed August 2026):

- **WCAG 2.2 AA.** Contrast in both light and dark themes, keyboard operability of the affiliation map, filter bar and segmented controls, visible focus, correct heading order. Audit findings against this standard are binding, not advisory.
- **Low-bandwidth and mobile-first.** A meaningful share of participants reach the site on mobile data or constrained connections, particularly Africa-based colleagues. Page weight, the affiliation map's JavaScript cost, and image budgets are hard constraints. The site is prerendered and static in part for this reason.
- **Bilingual parity.** Mixed-language content must carry correct `lang` attributes so assistive technology pronounces French abstracts on English pages correctly, and French text expansion (~20% longer) must not break layouts.

The workshop's own inclusion commitments — gender equity, support for early-career scholars based in sub-Saharan Africa, amplification of Francophone voices, equal opportunity regardless of gender, religion, or other sociocultural differences — are stated in the call for papers and are part of what the site represents.
