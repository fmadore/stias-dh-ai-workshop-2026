# Repository Review — 25 July 2026

A follow-up to `code-review-2026-07.md`. That review's findings have been almost
entirely implemented; this one starts from the current tree and looks for what is
left, with an emphasis on refactoring, modularity and layering.

Everything below was verified against the source and against a real production
build (`npm run build`, 32 participants / 4 organizers / 25 presentations).
Baseline health is good: `npm run check` reports **0 errors, 0 warnings across
4666 files**, `npm run lint` is clean, and both post-build guards pass.

**State of the previous review:** all four Tier‑1 bugs are fixed (countdown
offset pinned, `.js`/`no-js` gate on scroll-reveal, keyed `{#each}` + declarative
`Avatar` fallback, inlang plugin vendored locally). `FilterBar`, `Avatar`,
`PersonLinks`, `sponsors.ts`, `utils/date.ts`, `utils/filter.ts`, `langEntries`,
`+error.svelte`, `check-data.mjs` and `smoke-test.mjs` all exist. Skeleton is
gone, fonts are self-hosted, `marked` is confirmed absent from every client
chunk, jsPDF is confirmed lazy (0 preload references on the CFP page), organizer
photos are 5–8 KB WebP, participant bios are `LocalizedString`, authorship is
single-sourced, and there are no unused message keys (91 in each locale, no
drift). This is a healthy codebase; the items below are genuine but incremental.

---

## 1. Bugs

### 1.1 The countdown prints the number twice

`src/lib/components/home/Countdown.svelte:21-26` builds each unit as:

```ts
{ value: days, label: m.countdown_days({ count: days.toString() }) },
```

but the messages already interpolate the count (`messages/en.json:17-20`):

```json
"countdown_days": "{count} days",
"countdown_hours": "{count} hours",
```

The template then renders the value _and_ the label (lines 51-58), so the built
home page contains:

```html
<div class="…tabular-nums…">58</div>
<div class="…uppercase…">58 days</div>
```

Visible on the live hero as **`58` over `58 DAYS`**, in both locales
(`build/fr.html`: `58` / `58 jours`). All four units are affected.

**Fix:** drop the interpolation — the labels should be bare unit nouns
(`"days"` / `"jours"`, `"hours"` / `"heures"`, `"min"`, `"sec"`) and the
components should call `m.countdown_days()` with no argument. If singular forms
matter for the final day, use the message-format variant syntax rather than
re-adding `{count}`.

### 1.2 Invalid `<ol>` nesting in the CFP key-dates timeline

`src/lib/components/cfp/CFPSection.svelte:189-211` puts a `<span>` (the vertical
rule) and a `<div class="space-y-5">` directly inside `<ol>`, with the `<li>`
elements one level further down. Confirmed in `build/call-for-papers.html`:

```html
<ol class="relative">
  <span class="…absolute…"></span>
  <div class="space-y-5"><li …></li></div>
</ol>
```

Only `<li>`, `<script>` and `<template>` are valid children of `<ol>`. Browsers
render it, but the list semantics are lost for assistive technology and the
ordinal relationship between the four key dates disappears.

**Fix:** move `space-y-5` onto the `<ol>` itself and drop the wrapper `<div>`;
the absolutely-positioned rule can move to the `<ol>`'s `::before` or to a
wrapping `<div>` _outside_ the list.

### 1.3 JSON-LD is injected without escaping `<`

`src/lib/components/SEO.svelte:103` and `:107` do
`{@html '<script type="application/ld+json">' + jsonLd + '<\/script>'}`.
`JSON.stringify` does not escape `<`, so a `</script` sequence anywhere in a
title, abstract or bio would terminate the block early.

No current data file contains `<` (verified), so this is latent rather than live
— but it is a one-line hardening on a path that concatenates 25 author-supplied
abstracts and 36 bios:

```ts
const safe = (o: object) => JSON.stringify(o).replace(/</g, '\\u003c');
```

---

## 2. Performance — the abstracts are in three client bundles that never show them

This is the largest single win available.

`src/lib/data/presentations/index.ts` eagerly globs all 25 presentation modules,
and `abstract` is **87 % of that source** (54 KB of 63 KB). The resulting client
chunk is 105 KB raw / ~33 KB gzip, and it is `modulepreload`ed on three pages:

| Page                 | Total raw JS | Ships abstracts? | Renders abstracts?              |
| -------------------- | ------------ | ---------------- | ------------------------------- |
| `papers.html`        | 232 KB       | yes              | only a 200-char excerpt         |
| `participants.html`  | 237 KB       | yes              | no                              |
| `programme.html`     | 241 KB       | yes              | no                              |
| `index.html`         | 143 KB       | no               | —                               |
| `papers/[slug].html` | —            | **no**           | yes — rendered in a server load |

The detail page already gets its abstract HTML from `+page.server.ts`, so the
full markdown has no client-side consumer at all. Participants and programme
need only titles, ids, languages and authors. The papers list needs a short
excerpt plus something searchable.

**Refactor:** move `abstract` out of the eagerly-globbed module — e.g. a
sibling `presentations/abstracts/<id>.ts` imported only by the server load — and
have the build derive two small fields onto each presentation: `excerpt` (the
200 chars `PaperCard` already truncates) and `searchText` (the normalised
plain-text form §3 wants anyway). That removes ~105 KB raw / ~33 KB gzip from
three pages, roughly a 45 % cut to the papers page's JS, while _improving_
search (see below).

---

## 3. Search recomputes a static index on every keystroke

`src/lib/utils/filter.ts:29-51`:

```ts
return participants.filter((p) => {
  if (country && p.country !== country) return false;
  const papers = getParticipantPresentations(p);          // O(25) scan, always runs
  …
  const haystack = normalize([ p.name, p.affiliation.en, p.affiliation.fr,
    p.country, p.bio?.en ?? '', p.bio?.fr ?? '',
    ...papers.flatMap((pp) => [pp.title, pp.abstract ?? '']) ].join(' '));
```

Every keystroke re-joins and NFD-normalises both bios plus every co-authored
abstract for all 32 participants — on the order of 10⁵ characters of regex work
per character typed, to produce a string that never changes.
`getParticipantPresentations` (a linear scan over all 25 presentations) runs
unconditionally, even when only the country select changed.
`filterPresentations:64-82` has the same shape.

**Refactor:** build the normalised haystack and a `Map<personId, Presentation[]>`
once at module load, then the filter is a `Map` lookup plus `String.includes`.
This composes with §2 — the precomputed `searchText` _is_ the index — and it
shrinks `filter.ts` rather than growing it.

---

## 4. Modularity and layering

### 4.1 `utils/` depends on `data/`, and `data/` depends on `utils/`

```
utils/filter.ts          → data/presentations
utils/key-dates.ts       → data/cfp, data/site-config, paraglide/messages
utils/generate-cfp-pdf.ts→ data/sponsors
data/event-schema.ts     → utils/i18n
```

`utils/` reads as "pure helpers" (`text.ts`, `date.ts`, `markdown.ts` genuinely
are), but half its modules are really domain logic bound to specific content,
and `event-schema.ts` is a builder living in the content folder. The dependency
arrow points both ways, which is what makes it hard to say where a new helper
belongs.

**Suggestion** — three explicit layers, no new files beyond moves:

- `data/` — pure content and config, imports only `$lib/types`.
- `lib/domain/` (or `lib/queries/`) — derivations over content: `people.ts`,
  the presentation lookups, `filter.ts`, `key-dates.ts`, `event-schema.ts`.
  May import `data/` and `utils/`.
- `utils/` — pure, no `data/` imports: `text.ts`, `date.ts`, `markdown.ts`,
  `i18n.ts`, and a new `language.ts` (§4.3).

`generate-cfp-pdf.ts` / `generate-cfp-text.ts` are exporters, not utils — they
would sit naturally in `lib/export/`.

### 4.2 The canonical-URL derivation is a trap for the next dynamic route

`SEO.svelte:30-32`:

```ts
const routePath = $derived(
  canonicalPath ?? ((page.route.id ?? '/').replace('/[[lang]]', '') || '/')
);
```

For a dynamic route this yields the literal pattern — `/papers/[slug]` — and
would emit `…/papers/[slug]` as `<link rel="canonical">`, `og:url` and both
hreflang alternates. Today's output is correct _only_ because
`papers/[slug]/+page.svelte:40` remembers to pass `canonicalPath`. The next
dynamic route that forgets it ships broken canonicals silently.

**Fix:** derive from `page.url.pathname` (strip `base`, strip a leading
`/<locale>`), which is always the real URL. The `canonicalPath` prop then
becomes an override rather than a requirement, and the paper page can drop it.

### 4.3 Language labels are open-coded in four places

| Location                                 | Expression                                              |
| ---------------------------------------- | ------------------------------------------------------- |
| `papers/PaperCard.svelte:25`             | `language === 'fr' ? 'Français' : 'English'`            |
| `papers/[slug]/+page.svelte:50`          | same, duplicated                                        |
| `programme/SessionCard.svelte:125`       | `language === 'fr' ? 'FR' : 'EN'`                       |
| `participants/ParticipantCard.svelte:31` | `language === 'fr' ? '« ' : '“'` (and the closing pair) |

A `utils/language.ts` exporting `languageName()`, `languageCode()` and
`quote(title, lang)` collapses all four and puts the typographic-quote rule in
one place.

### 4.4 The locale list is hardcoded in four more

`utils/i18n.ts:20` (`langEntries` → `[{ lang: '' }, { lang: 'fr' }]`),
`papers/[slug]/+page.server.ts:10` (`const langs = ['', 'fr']` — the same list,
duplicated because `langEntries` doesn't fit the two-param signature),
`utils/date.ts:4` (`getLocale() === 'fr' ? 'fr-FR' : 'en-GB'`), and the
`as 'en' | 'fr'` cast in `[[lang]]/+layout.ts:19`.

Paraglide already exports `locales` and `baseLocale`. Deriving from them — and
adding a `Locale` type alias plus an `intlLocale` map — means adding a third
language touches `project.inlang/settings.json`, the messages, and one map.
`programme/+page.svelte:12-17` also re-implements `formatDate` inline with the
same `fr-FR`/`en-GB` ternary; it should call `utils/date.ts` (note it uses
`T12:00:00` rather than the UTC anchoring the shared helper standardised on).

### 4.5 `ThematicAxis.icon` is a bare `string`

`types/index.ts:51` types it `string`; `about/ThematicAxis.svelte:16` casts to
`keyof typeof iconMap` and guards with `{#if IconComponent}`. A typo in a data
file silently renders no icon. Typing the field as the icon-name union (or
storing the component reference in the data file) makes it a build error and
lets both `{#if}` guards go.

### 4.6 `check-data.mjs` parses TypeScript with regexes

The guard is valuable and it works, but it is coupled to formatting — every
pattern hardcodes tab depth (`/\n\tid: '([^']+)'/`, `/\n\t\tid: '…'/` for the
nested organizers). A Prettier config change or one nested object breaks it, and
it cannot see anything structural: an orphan presentation, a participant nobody
references, an id colliding across the participant and organizer pools.

Since `import.meta.glob(..., { eager: true })` already loads every module as a
real object, the same checks written against the actual data — as a module
imported by the build, or run through `vite-node` — would be shorter, typed, and
able to assert things the regexes can't.

### 4.7 Remaining card duplication

`ParticipantCard` and `OrganizerCard` now share `Avatar` and `PersonLinks`, but
still repeat the shell verbatim: `<article class="card overflow-hidden">` →
`p-6 sm:p-7` → the `flex flex-col items-center gap-5 sm:flex-row sm:items-start`
row → the name `<h3>` → the affiliation `<p>` → the gold divider `<span>`
(`ParticipantCard.svelte:19-41` vs `OrganizerCard.svelte:10-28`). About 15
lines. A `PersonCardShell.svelte` taking `name`, `image`, `affiliation`,
`loading` and a `children` snippet would leave each card holding only what is
actually different (papers list + collapsible bio vs. role + always-on bio).

Lower value than the items above — flagging it as a judgement call rather than a
recommendation, since a snippet-based shell is not obviously simpler than 15
duplicated lines.

---

## 5. Smaller items

- **The 404 page is a blank, English-only, JS-only shell.** `adapter-static`'s
  `fallback: '404.html'` emits a 3.8 KB script shell with no server-rendered
  content, so no-JS visitors and crawlers get an empty page, and because
  `[[lang]]/+layout.ts` never runs for it, a French visitor hitting a bad
  `/fr/…` URL sees the English `+error.svelte`. `build/fr/` contains no 404.
  Low priority (GitHub Pages serves one `/404.html` regardless), but worth
  knowing.

- **The countdown bakes a build-time value into the prerendered HTML** —
  `index.html` and `fr.html` currently ship `58` days. Every build produces a
  different home page (noisy deploys, cache churn), and no-JS visitors see a
  number that is stale by however long ago the site was deployed. Rendering a
  neutral placeholder server-side and filling it in `onMount` fixes both.

- **`sitemap.xml` gives every URL the build date** as `<lastmod>`
  (`sitemap.xml/+server.ts:29`), telling crawlers all 64 URLs changed on every
  deploy — which devalues the signal. `programmeLastUpdated` already exists as a
  real per-page date; papers could carry one too, and pages without one are
  better off omitting `<lastmod>`.

- **Participants sort by given name with an unspecified locale**
  (`participants/index.ts:8-10`): `localeCompare(…, undefined, …)` depends on the
  runtime default, and "Aminata Kane" files under _A_. For an academic roster,
  surname sort with an explicit locale would be both conventional and
  deterministic across build machines.

- **`Avatar.svelte:23` hardcodes `h-24 w-24 sm:h-28 sm:w-28`**, so it can't be
  reused at another scale (a programme speaker thumbnail, say). A `size` prop
  with the current value as the default costs nothing now.

- **The chair mechanism is wired but unpopulated.** `Session.chair` is declared
  and `SessionCard.svelte:43-44,99-104` renders it, but no session in
  `programme.ts` sets one — so 10 panels and keynotes currently render
  "Chair: To be determined". Content state rather than a defect; noting it
  because the fallback is easy to miss.

- **`data/cfp.ts` uses `\uXXXX` escapes** for accented characters while every
  other data file uses literal UTF-8, making it the one content file that is
  hard to proofread.

- **No unit tests.** The two post-build scripts cover integration well. The
  three modules with real logic and no data dependencies — `text.ts` (truncate
  boundaries, initials), `date.ts` (the UTC anchoring and the same-month range
  branch) and, after §3, the search index — are the ones where a handful of
  Vitest cases would pay for themselves.

---

## Suggested order

1. **§1.1 countdown label** and **§1.2 `<ol>` nesting** — both visible, both a
   few lines.
2. **§2 + §3 together** — moving abstracts out of the client bundle and
   precomputing the search index are the same refactor, and it's the biggest
   measurable win in the repo.
3. **§4.2 canonical derivation** and **§1.3 JSON-LD escaping** — small, and both
   close footguns rather than fixing current output.
4. **§4.3 / §4.4 language and locale helpers** — mechanical, and prerequisites
   for ever adding a third language.
5. **§4.1 layering** — do it as a moves-only commit once the above have settled,
   so the diff stays reviewable.
6. **§4.6 typed data checks**, then the §5 items as convenient.
