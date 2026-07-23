# Digital Humanities and AI in African Studies

Website for the DFG Programme Point Sud workshop **"Digital Humanities and Artificial Intelligence in African Studies: Towards Sustainable and Equitable Practices"**, held at the Stellenbosch Institute for Advanced Study (STIAS), South Africa, from 21 to 24 September 2026.

**Live site:** [fmadore.github.io/stias-dh-ai-workshop-2026](https://fmadore.github.io/stias-dh-ai-workshop-2026)

The website is available in English and French.

## Stack

- [SvelteKit 2](https://svelte.dev/docs/kit) with Svelte 5, prerendered to a fully static site (`@sveltejs/adapter-static`) and deployed to GitHub Pages
- [Tailwind CSS 4](https://tailwindcss.com) with a custom design-token theme in `src/app.css`
- [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for EN/FR i18n (messages in `messages/{en,fr}.json`, compiled by the `prepare` script)

## Development

Requires Node 24 (see `.nvmrc`).

```bash
npm install        # also compiles i18n messages via the `prepare` script
npm run dev        # dev server at http://localhost:5173
npm run build      # static build into build/ + data & smoke checks
npm run preview    # serve the production build locally
npm run check      # svelte-check (types + templates)
npm run lint       # eslint
npm run format     # prettier --write
```

`npm run build` also runs `scripts/check-data.mjs` (referential integrity of
the content data — author ids, programme references, image paths) and
`scripts/smoke-test.mjs` (French pages really prerendered in French, sitemap
complete). Both fail the build on problems and run in CI.

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

## Deployment

Pushes to `main` build and deploy via GitHub Actions
(`.github/workflows/deploy.yml`). PRs run the same format/lint/type/build
checks without deploying.
