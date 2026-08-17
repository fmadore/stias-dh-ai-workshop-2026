# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences of equal standing; no design may serve one at the cost of the other.

**Accepted participants and organisers** (33 participants, 4 organisers, 2 Point Sud representatives). Before the workshop they check the programme, find their own page and paper, read venue and logistics information, and confirm what is expected of them — pre-circulated draft papers, bilingual slides, a one-page terminology handout. During the workshop (21–24 September 2026) they consult the day's schedule, often on a phone, in a room at STIAS. Many are Africa-based and travelling internationally; some join remotely by Zoom.

**The wider scholarly public** — African Studies and digital humanities researchers who encounter the workshop through search, citation, or colleagues. They read the abstract and thematic axes, browse the 25 papers as a body of work, look up who is taking part, and decide whether to follow the event or attend remotely.

Funders and partner institutions (DFG, Point Sud, STIAS, and the partner universities) are a real but secondary audience: they need the programme and the acknowledgement of support to be legible, not a surface of their own.

## Product Purpose

The public site for the DFG Programme Point Sud workshop _Digital Humanities and Artificial Intelligence in African Studies: Towards Sustainable and Equitable Practices_, held at the Stellenbosch Institute for Advanced Study (STIAS), South Africa, 21–24 September 2026.

It exists to make the workshop findable, intelligible, and attendable: to present the intellectual argument, publish the programme and the papers, identify the people taking part, and give attendees what they need to arrive and participate. Success is that a participant never has to email an organiser to find out where to be or what is expected, and that a scholar who has never heard of the workshop can understand its argument and its contribution in a few minutes.

## Positioning

A bilingual (English/French) scholarly workshop site whose content model is the workshop itself: papers, people, and programme are typed data with referential integrity, cross-linked in both directions. A paper resolves its authors; a participant resolves their paper and its slot in the schedule; the programme references both by id. The site is a small, honest scholarly record rather than a conference marketing page — there is no registration funnel, no ticketing, no sponsorship tiers.

The bilingualism is substantive, not decorative: the workshop itself runs bilingually, papers are delivered in either language, and the site carries French and English as equals.

## Operating Context

- **Static and free to host.** SvelteKit 2 / Svelte 5, fully prerendered via `@sveltejs/adapter-static`, deployed to GitHub Pages under the `/stias-dh-ai-workshop-2026` base path. No server, no database, no runtime API.
- **Content lives in typed TypeScript files** under `src/lib/data/` — one file per participant and per presentation, auto-discovered by `import.meta.glob`. Editing content means editing code, and `scripts/check-data.mjs` enforces referential integrity (author ids, programme references, image paths) at build time.
- **Workshop state is derived, never hardcoded.** `src/lib/utils/milestones.ts` computes `isCfpOpen()`, `nextMilestone()`, and `workshopPhase()` from four dates in `cfp.ts` and `site-config.ts`, in South African Standard Time. Any design that implies a phase — an open call, a countdown, a "register now" — must read from these functions rather than assuming. A previous design review assumed the call for papers was open three months after it had closed; this indirection exists because of that.
- **Two locales, URL-prefixed.** English at the base path, French under `/fr/`. Both are fully prerendered; `scripts/smoke-test.mjs` verifies French pages are genuinely prerendered in French.
- **The workshop is hybrid** — in-person at STIAS with Zoom access — and operates bilingually, with near-real-time AI captioning and, where possible, a bilingual chair providing consecutive interpretation.

## Capabilities and Constraints

- Surfaces: home, about, programme, papers (index and per-paper), participants (index and per-person), venue, call for papers.
- The call for papers **closed on 30 April 2026**; that page is now an archival record of the call, not an invitation.
- The programme is **preliminary** and carries a last-updated date (`programmeLastUpdated`). It is 4 days: 7 thematic panels of 3 papers, 3 keynotes, 2 group discussions, 2 excursions. Chairs are largely unassigned and render as "To be determined"; the Day 4 excursion is unspecified.
- Content is language-mixed by design: paper titles and abstracts exist in the single language of delivery (7 of 25 in French, 18 in English), so a French abstract appears on an English page and vice versa. Participant affiliations are localised; biographies are single-language.
- **After the workshop the site becomes a frozen record.** No slides, recordings, or photo galleries are planned. The `after` phase needs only a modest copy shift, not new surfaces. (Confirmed decision, August 2026.)
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

1. **Derive workshop state; never assert it.** Every phase-dependent element reads from `milestones.ts`. The site must stay correct as dates pass without anyone editing it.
2. **Both languages are the site.** French is not a translation layer over an English product. A design that reads well in English and awkwardly in French is unfinished.
3. **The programme is the product during the event.** On 21–24 September, a participant with a phone and poor signal needs the day's schedule fast. That scenario outranks every expressive consideration on that surface.
4. **Scholarly restraint.** The register is an academic workshop, not a conference brand. Personality lives in precision and typography, not in ornament or persuasion tactics.
5. **Say only what is true.** Incomplete content — unassigned chairs, a TBD excursion, a missing photograph, a preliminary programme — is shown honestly rather than hidden or invented.

## Accessibility & Inclusion

Three constraints are binding (confirmed August 2026):

- **WCAG 2.2 AA.** Contrast in both light and dark themes, keyboard operability of the affiliation map, filter bar and segmented controls, visible focus, correct heading order. Audit findings against this standard are binding, not advisory.
- **Low-bandwidth and mobile-first.** A meaningful share of participants reach the site on mobile data or constrained connections, particularly Africa-based colleagues. Page weight, the affiliation map's JavaScript cost, and image budgets are hard constraints. The site is prerendered and static in part for this reason.
- **Bilingual parity.** Mixed-language content must carry correct `lang` attributes so assistive technology pronounces French abstracts on English pages correctly, and French text expansion (~20% longer) must not break layouts.

The workshop's own inclusion commitments — gender equity, support for early-career scholars based in sub-Saharan Africa, amplification of Francophone voices, equal opportunity regardless of gender, religion, or other sociocultural differences — are stated in the call for papers and are part of what the site represents.
