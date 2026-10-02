# Digital Humanities and AI in African Studies

Website for the DFG Programme Point Sud workshop **"Digital Humanities and Artificial Intelligence in African Studies: Towards Sustainable and Equitable Practices"**, held at the Stellenbosch Institute for Advanced Study (STIAS), South Africa, from 21 to 24 September 2026.

**Live site:** [fmadore.github.io/stias-dh-ai-workshop-2026](https://fmadore.github.io/stias-dh-ai-workshop-2026)

The website is available in English and French. It now preserves the workshop
programme, abstracts, people and practical information as a scholarly record.
Maintenance fixes and documented content corrections remain welcome; new
recordings, galleries or attendance claims are outside its agreed scope.

## Stack

- [SvelteKit 2](https://svelte.dev/docs/kit) with Svelte 5, prerendered to a fully static site (`@sveltejs/adapter-static`) and deployed to GitHub Pages
- [Tailwind CSS 4](https://tailwindcss.com) with a custom design-token theme in `src/app.css`
- [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for EN/FR i18n (messages in `messages/{en,fr}.json`, compiled by the `prepare` script)

## Development

Requires Node 24 (see `.nvmrc`).

```bash
npm ci             # installs locked dependencies; the `prepare` script then compiles the i18n messages and runs `svelte-kit sync`, which generates `.svelte-kit/tsconfig.json` (the `$lib` alias and `$types`) that editors, `npm run check` and `npm run test:unit` all read
npm run dev        # dev server at http://localhost:5173
npm run build      # static build into build/ + data & smoke checks
npm run preview    # serve the production build locally
npm run check      # svelte-check + script, test and configuration TypeScript checks
npm run check:scripts # script/test/config TypeScript checks only (after npm ci)
npm run lint       # eslint
npm run format     # prettier --write
```

`npm run build` also runs `scripts/check-data.ts` (referential integrity of
the content data — author ids, programme references, image paths and valid
schedule dates/times) and
`scripts/smoke-test.mjs` (French pages really prerendered in French, sitemap
complete). Generated internal links and their HTML fragments are checked by `scripts/check-links.mjs`, and `scripts/check-bundle-size.mjs` enforces asset budgets. All four checks fail the build on problems and run in CI.

## Testing

```bash
npx playwright install chromium firefox webkit
npm run format:check
npm run lint
npm run check
npm run test:unit
npm run build
npm run test:e2e
```

The Chromium suite covers navigation, programme, content, maps, accessibility
and resilience. Firefox and WebKit run seven focused navigation, language,
storage and filter checks each. PDF export tests run in Chromium only.
Routine map tests use the real renderer with a local empty style, so they do
not require external tiles. Run `npm run test:e2e:live` after a build to test
the actual provider, or dispatch the separate **Live map provider integration**
workflow. That integration is intentionally outside deployment checks.

Playwright writes an HTML report to `playwright-report/` and diagnostics to
`test-results/`, both ignored. Open a report with `npx playwright show-report`.
CI retains reports, traces and screenshots from failures for 14 days.

The programme, hero and milestone lists share one venue clock, which refreshes at date boundaries and when a suspended page becomes visible. Static HTML publishes dates without relative live-status claims. Directory filters use `q`, `country`, `language` and (for participants) `group` query parameters; reload and locale switching preserve them.

## Data and rendering

Content registries live in `src/lib/data/`. Build-time server loaders reduce
them through `src/lib/server/views.ts` into the counts, listings, bylines and
programme casts needed by each page. Detail pages render Markdown at build
time; full biographies and abstracts are not sent to unrelated routes.
Directory search loads its full-text index only when a reader searches.
These are SvelteKit **build-time** server modules: the deployed site has no
running application server or database.

## Content editing

- **Participants** — one file per person in `src/lib/data/participants/`. Bios
  are bilingual (`bio: { en, fr }`); duplicate the source text in both fields
  if no translation exists yet.
- **Papers** — one file per presentation in `src/lib/data/presentations/`.
  The `authors` array (person ids) is the single source of truth for
  authorship; participant pages derive their paper links from it.
- **Programme** — `src/lib/data/programme.ts` references papers and people by id.
- **Sponsors/funders** — `src/lib/data/sponsors.ts` feeds the footer, the CFP
  PDF, and the Event JSON-LD.
- **Photos** — drop a `.jpg`/`.png` into `static/images/participants/` or
  `static/images/organizers/` and run `npm run images` to generate the
  256 px WebP used on the site.
- **Share cards** — `npm run og` re-renders `static/images/og-default.png`
  (the Open Graph card) and `.github/social-preview.png` (GitHub's social
  preview) from the site's own tokens, fonts, and message catalogue. Run it
  after changing the title, the dates, or the theme colours. The GitHub card
  has to be uploaded by hand under Settings → General → Social preview;
  there is no API for it.

## Deployment

Pushes to `main` build and deploy via GitHub Actions
(`.github/workflows/deploy.yml`). PRs run the same format/lint/type/build
checks and browser suites without deploying.

## Dependency maintenance

CI blocks moderate-or-higher production advisories with
`npm audit --omit=dev --audit-level=moderate`. It also records a full
`npm audit --audit-level=low` report as a visible maintenance check and keeps
the JSON artifact for 14 days. Review that report for tooling exposure as
well as browser exposure; a development-only advisory is not automatically
an exploitable vulnerability in the static deployment.

MapLibre is pinned to 6.6.0 and has its own Dependabot group. Later releases
need an explicit renderer/worker size review against the existing 260/130 KiB
gzip limits; do not raise those limits just to unblock routine dependency
updates. The `@sveltejs/kit`-scoped `cookie` override fixes the transitive
advisory while preserving the parser/serializer API. Remove the override
once a framework update supplies a patched compatible version itself.

Current product constraints are in [PRODUCT.md](PRODUCT.md), visual guidance
in [DESIGN.md](DESIGN.md), and historical plans and audits in
[docs/archive](docs/archive/README.md).

## Citation

Machine-readable metadata lives in [`CITATION.cff`](CITATION.cff); GitHub
renders it as a "Cite this repository" button in the sidebar.

## License

- **Code** — [MIT](LICENSE).
- **Content** — [CC BY 4.0](LICENSE-CONTENT), with exclusions: paper titles,
  abstracts, and biographies belong to their authors; participant photographs
  and funder logos are used by permission only.
