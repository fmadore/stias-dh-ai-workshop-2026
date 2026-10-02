# Repository Review — September 2026

A third pass after `code-review-2026-07.md` and `code-review-2026-07-25.md`,
run three days after the workshop closed. It starts from the current tree and
looks for refactoring, efficiency and good-practice gaps. Part 1 lists what this
pass changed; Part 2 lists what it recommends and leaves to the maintainers.

**Baseline before any change:** `format:check`, `lint` and `check` were clean
(0 errors and 0 warnings across 4,868 files), and all 24 unit tests passed. The
build and all four post-build guards passed.

**How the changes were checked:** every prerendered file (145 HTML pages, the
sitemap, both `.ics` exports and the CFP downloads) was compared with a snapshot
of the build from before the changes. Hashed asset names, hydration markers and
the inline hydration data were ignored. The only rendered difference is the
intended one in §1.2. JSON-LD blocks were compared as parsed objects: they are
identical apart from those descriptions. The Playwright suite passed (70 passed;
1 skipped, the opt-in `LIVE_MAPS` test). A separate browser probe followed
programme → paper → author → home through client-side navigation in both
locales, so every new server load was fetched as `__data.json`. It found no
console errors.

---

## Part 1 — Changed in this pass

### 1.1 The abstracts and bios no longer ship to pages that do not show them

`$lib/data/presentations` and `$lib/data/people` build into one client chunk.
It is 123 KB raw and 37.6 KB gzip, and it holds every abstract and every bio.
It was being preloaded on pages that use almost none of it:

| Page                  | Used the chunk for                    |
| --------------------- | ------------------------------------- |
| Home (both locales)   | three `.length` counts in `AtAGlance` |
| Programme             | names, titles and bylines             |
| Each paper page (×50) | the sibling papers' titles            |

These values are now resolved at prerender, in a new server-only module
(`$lib/server/views.ts`). Each route gets them through a `+page.server.ts`
load. Because the module lives under `$lib/server`, SvelteKit refuses a client
import of it at build time, so the registries cannot slip back into these
bundles unnoticed.

| Page (JS it references, gzip) | Before    | After    |              |
| ----------------------------- | --------- | -------- | ------------ |
| Home                          | 108.8 KiB | 71.6 KiB | −37.2 (−34%) |
| Programme                     | 109.1 KiB | 72.2 KiB | −36.9 (−34%) |
| Paper page                    | 103.7 KiB | 62.0 KiB | −41.7 (−40%) |

The programme's HTML grows by 2.6 KB gzip, because the resolved session data is
now inlined for hydration. The papers and participants directories still load
the chunk. They need it: their search runs over bios and abstracts (see §2.2).

### 1.2 Page data carried content the pages never rendered

- **Paper pages** serialised the abstract three times: the markdown source, the
  rendered HTML, and the plain text. They also serialised every author's full
  bio, because `getPresentationAuthors` returns the source records spread out.
  They now send the rendered abstract, its plain text for the JSON-LD, and the
  `PersonRef`s the byline needs. `__data.json` fell from 9.5 KB to 6.1 KB.
- **Person pages** serialised every co-authored paper's full abstract to print
  its title. `__data.json` fell from 3.7 KB to 1.4 KB.
- **Person pages put the whole bio in `<meta name="description">`**, and again
  in `og:description`, `twitter:description` and the JSON-LD. The longest
  bio runs to about 1,800 characters. It is now `truncate(bio)`, the ~160-character
  treatment paper pages already used. This is the only rendered change in the
  pass.

### 1.3 Session numbering, labels and times lived in five places

"Panel 3" was counted separately in the programme page (per-day offsets),
`ScheduleDay`, `getPlacements`, the person page's server load and the
calendar script. Session-type labels were written three times: a record in
`SessionCard`, a `switch` in `placement.ts`, and a nested ternary on the person
page. The "Mon 21" formatter was written three times as well.

- `utils/schedule.ts` is new and has no Paraglide, `$lib` or Svelte imports, so
  the Node calendar script can use it. It holds `panelNumbers()`,
  `sessionTimes()` and `sessionAnchor()`.
- `placement.ts` exports `sessionLabel()`. `getPlacements()` and `date.ts` now
  take an optional locale. Server loads run before the layout load sets the
  Paraglide global, so they pass the locale from the route parameter instead.
  The person page now uses the same `getPlacements` as the paper cards and
  drops its own 25-line copy.
- `generate-programme-ics.ts` now uses `panelNumbers`, `sessionAnchor` and
  `localizedAbsoluteUrl`. Both `.ics` files are byte-identical to before.
- The programme page's "last updated" line and its day pills now use
  `formatDate` and `formatShortDay`.

### 1.4 SEO hardening (open since the July review)

- **JSON-LD is now escaped.** `JSON.stringify` does not escape `<`, so a closing
  script tag in any title, abstract or bio would have ended the block early.
  `<` is now written as `<`. No current content contains `<`, so the
  output is unchanged.
- **The canonical URL comes from `page.url`, not from `page.route.id`.** On a
  dynamic route the id is the pattern (`/papers/[slug]`). Correct output used to
  depend on every dynamic page remembering to pass `canonicalPath`. The prop
  still works as an override, and neither detail page needs it now.

### 1.5 Smaller cleanups

- `clockMilestones()` in `venue-clock.ts` replaces three identical copies of
  "mask past/next until the clock is live" (Footer, KeyDatesTimeline,
  CFPSection).
- Removed redundant locale casts. Paraglide already types `getLocale()`,
  `locales` and `baseLocale` as `'en' | 'fr'`. The layout load now checks the
  route parameter with `isLocale()` instead of casting it.
- `langEntries()` is derived from Paraglide's `locales`. The two detail routes
  use it instead of their own hard-coded `['', 'fr']`.
- `ThematicAxis.icon` is now a union of the three icon names. A typo in the data
  is a type error, not a card with no icon, and both `{#if IconComponent}`
  guards are gone.
- `ParticipantGrid`'s own `Grouping` type duplicated `DirectoryGrouping`. It now
  uses `DirectoryGrouping`.
- Removed the unused `menu_open` and `menu_close` messages (both locales still
  have the same keys: 188 each).
- `check-data.ts` and `generate-programme-ics.ts` share one
  `scripts/lib/load-modules.ts`. The calendar script's copy used to skip the
  missing-default-export check.
- Removed the `enAlt`/`frAlt` aliases from the sitemap.

### 1.6 Checked and ruled out

The optional `[[lang]]` segment has no param matcher, so a URL like
`/no-such-page` or `/de/programme` looked as if it might match a route. In a
browser against the built site, all five probes (`/no-such-page`,
`/de/programme`, `/fr/no-such-page`, `/programme/xyz`, `/papers/not-a-paper`)
return 404 and show the error page in the right language. No change was needed.

---

## Part 2 — Recommended

In rough priority order. Items 2.1, 2.2, 2.3 and 2.5 were done in a follow-up
pass on 28 September (Part 3). The rest are still open.

### 2.1 Post-event: retire the public Teams link — done (§3.1)

The workshop ended on 24 September. The public meeting URL, including its `?p=`
passcode, is still in the static HTML of 6 pages, in all 13 events of each
`.ics` file, and in the Event JSON-LD. `JoinOnline` hides it after the event
only once JavaScript runs; the prerendered HTML keeps it on purpose. An open,
passcode-bearing link to a meeting series that has ended can be misused. The
code already has a single switch for this: set `onlineAccess.joinUrl` to `''`
and the link disappears everywhere. After that, the site could get a light
"archive" framing ("held 21–24 September 2026"). `eventStatus` can stay
`EventScheduled`, which is correct for an event that took place as planned.

### 2.2 Directory search still loads every bio and abstract up front — done (§3.2)

`/papers` and `/participants` load the 37.6 KB gzip chunk on first paint, only
because the search box can match inside abstracts and bios. Two independent
improvements:

- **Load the full text lazily.** Filter on names, affiliations and titles
  straight away. `import()` the bio and abstract index the first time the
  search field gets focus. Most visitors never search, and they would stop
  paying for it.
- **Stop rebuilding the index on every keystroke** (July review, §3, still
  open). `filterPeople` and `filterPresentations` re-join and NFD-normalise
  every bio and abstract on each input event. Build the normalised haystack
  once per item (a module-level `Map`) and the filter becomes one `includes`.

### 2.3 One CSS pattern, written seven times — done (§3.3)

The resting-underline link is copied in scoped styles: `.session-link` and
`.session-paper-link` (SessionCard), `.paper-title-link` (PaperCard),
`.stat-link` (AtAGlance) and `.author-name` (paper page). Each copy repeats the
same 65% light / 60% dark colour mix, the same offset, the same hover and focus
states, and the same `:global(.dark)` twins; only the thickness varies. The
plain hover-only `.person-link` / `.participant-link` block is also copied three
times. A single class in `app.css`, with the thickness as a custom property,
would remove on the order of 100 lines.

It must stay **unlayered**, like `.tabular-nums`. Several of these rules rely on
scoped styles beating `@layer utilities`: for example, `.author-name` has to
outrank `text-strong`. That cascade behaviour is why this was not done blind.
It needs a visual pass in both themes.

### 2.4 `Avatar` and `AvatarSmall` are one component

The two files differ only in size classes, radius, text size and `alt`
behaviour. A `size: 'sm' | 'lg'` prop would merge them (July review, §5).

### 2.5 Three different workshop hours — done (§3.4)

- The Event JSON-LD says 08:30–17:00 (`event-schema.ts`).
- `workshopStart()` and `workshopEnd()` say 09:00–18:00 (`milestones.ts`).
- The programme itself runs from 08:30 (registration) to 17:00 (the last
  session).

Now that the event is over, this only affects structured data. The fix is to
derive the start and end from the first and last sessions in `programme.ts`,
or to keep one constant. Which is right is the owners' call.

### 2.6 Pure date formatting for the scripts

`generate-cfp-downloads.ts` has its own copies of `formatDate` and
`formatDateRange`. It also has `localize()`, and the calendar script has
`pick()`; both do what `t()` does. `date.ts` now takes an explicit locale, but it
still imports the Paraglide runtime through `$lib`. Moving the formatters into a
Paraglide-free module, as `schedule.ts` and `logistics.ts` do, would let both
scripts share them.

### 2.7 Deterministic sorting and output

- `participants/index.ts` sorts with `localeCompare(…, undefined, …)`, and
  `ParticipantGrid` sorts its group headings with no locale at all. (The papers
  list now sorts with `'en'` on the server, §3.2.) The result depends on the build machine's
  default locale. Pass `'en'` (or the page locale for the headings).
  Participants still sort by given name. For an academic roster, surname order
  is the convention (July review, §5).
- The footer's `© {new Date().getFullYear()}` changes the output of every page
  on 1 January with no content change. Use the event year instead.

### 2.8 `check-data` could hold two more invariants

- A file's basename must equal its `id` for presentations and participants. The
  id is the URL, and `smoke-test.mjs` already assumes filename = slug. All 58
  files currently match.
- `bioLanguage` should only be set when `bio.en === bio.fr`, since it has no
  effect otherwise.

### 2.9 Documentation hygiene

`docs/implementation-plan.md` (694 lines) and `docs/impeccable-roadmap.md`
describe phases that have finished. Moving them to `docs/archive/` would keep
`docs/` for material that is still current. The README could also mention
`$lib/server/views.ts` as the place for anything a page needs from the
registries.

---

## Part 3 — Follow-up, 28 September

Four of the recommendations above, done at the owners' request.

**How it was checked:** the same method as Part 1, against a snapshot of the
build before this pass.

- **Rendered markup.** Class names were ignored this time, since §3.3 renames
  them. Only the home, papers, programme and venue pages changed (in both
  locales), plus the two `.ics` files, each for a reason given below.
- **Link styles.** Computed styles were compared for 11 kinds of link, in the
  resting, hover and keyboard-focus states, in both themes (§3.3).
- **Tests.** The Playwright suite passed: 71 tests, with 1 skipped (the opt-in
  `LIVE_MAPS` test). That includes a new test (§3.2), which was confirmed to
  fail against the previous build.

### 3.1 The Teams link is retired

`onlineAccess.joinUrl` is now empty. Nothing in the build contains
`teams.microsoft.com` any more:

- The home page band, the programme callout and the venue page link are gone,
  in both locales.
- Both `.ics` files no longer carry the join line or the `CONFERENCE` property.
- The Event JSON-LD keeps its `VirtualLocation`, because the workshop was
  hybrid, but it now points at the site instead of the meeting.

Emptying the URL alone was not enough. `JoinOnline` used to fall back to "The
joining link will be published here shortly", which would have been false
after the event. It now renders only when a link is set, and the unused
`online_pending` message is removed.

### 3.2 Directory search fetches bios and abstracts only when someone searches

`/papers` and `/participants` now get their lists from `+page.server.ts` loads,
as the other routes already did:

- **Papers** come without abstracts. Each card gets a 480-character excerpt;
  the most any card was measured to show in its three clamped lines is 308
  characters (one column, 767px wide, either locale).
- **Participants** come without bios.
- **The affiliation map** receives its people already resolved.

Bios and abstracts are now in a separate module, `utils/full-text.ts`. It is
fetched with `import()` the first time the search field gets focus, or when a
query arrives in the URL. Until it arrives, or if it never does (offline), a
query still matches names, affiliations, countries and titles.

Each record's own searchable text is also normalised once and cached, instead
of being rebuilt on every keystroke (July review, §3).

| Page         | JS before (gzip) | JS after (gzip) | HTML before (gzip) | HTML after (gzip) |
| ------------ | ---------------- | --------------- | ------------------ | ----------------- |
| Papers       | 107.7 KiB        | 70.9 KiB        | 32.7 KB            | 22.3 KB           |
| Participants | 117.1 KiB        | 78.8 KiB        | 12.7 KB            | 16.5 KB           |

The full text is one 37.0 KB gzip chunk, fetched once, on the first search.

- **Unchanged:** all 25 paper cards render in the same order with the same
  bylines. The clamp shows exactly what it did.
- **One behaviour change:** screen readers used to hear each card's whole
  abstract, because `line-clamp` hides overflow only visually. They now hear
  up to 480 characters. The title links to the full text.
- **New test:** "search reaches abstracts and bios, fetched only once someone
  searches". It fails against the previous build ("bios and abstracts fetched
  before anyone searched").

### 3.3 Link styling merged

Two unlayered classes in `app.css` replace the scoped copies:

- **`.link-underline`** (with `.link-group`, for the paper page's author link,
  where the hover belongs to the anchor but only the name is underlined).
- **`.link-quiet`**, for links that change colour but carry no underline.

Line thickness and offset are set per use with `--link-underline-weight` and
`--link-underline-offset`. The programme's paper titles now take their resting
colour from the `text-strong` utility instead of a scoped rule. The scoped rule
would have tied with the shared hover rule on specificity and, loading later,
won.

The computed-style comparison (11 kinds of link × resting, hover and keyboard
focus × light and dark) matches the previous build except for two things:

- **Organiser, Point Sud and participant names** on the directory cards now
  also change colour on keyboard focus, as every other link on the site
  already did. They used to change on hover only.
- **The programme's external venue links** no longer list a transition for
  underline colour. They have no underline, so it never did anything.

### 3.4 One set of workshop hours: 09:00–18:00

Each day's first and last session differ, so `siteConfig.hours` now holds the
one span that stands for all four days: 09:00–18:00. It drives
`workshopStart()` and `workshopEnd()`, which already used those times, and the
Event JSON-LD, which said 08:30–17:00. The site's clock behaves exactly as
before.
