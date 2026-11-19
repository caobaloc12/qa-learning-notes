# QA Wiki

Bilingual (English / Vietnamese) notes and guides for QA engineering, built with [VitePress](https://vitepress.dev).

## Quick start

```bash
npm install
npm run docs:dev
```

The dev server prints a local URL with hot reload.

## Build and preview

```bash
npm run docs:build
npm run docs:preview
```

The static output lands in `docs/.vitepress/dist`.

## Structure

```
docs/
├── .vitepress/
│   ├── config.mts          # site config, locales, theme
│   ├── nav.ts              # single structure manifest → sidebar for both locales
│   └── theme/custom.css    # teal palette, fonts, badges, sample card
├── index.md                # English home
├── guide/                  # English guides
└── vi/                     # Vietnamese locale (same slugs)
scripts/check-parity.mjs    # EN ↔ VI coverage check
legacy-static/              # previous hand-written HTML site, kept for reference
```

## Adding a page

1. Add the entry to `docGroups` in `docs/.vitepress/nav.ts` with EN and VI labels.
2. Create `docs/<slug>.md` and `docs/vi/<slug>.md` with the same slug.
3. Run `npm run check:parity` to confirm both locales exist.
4. Run `npm run docs:build` to verify links and output.

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel: **Add New → Project**, import the repository. The VitePress preset detects the rest;
   `vercel.json` already sets the build command and output directory.
3. Every push to `main` deploys; pull requests get preview URLs.
