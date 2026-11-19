---
layout: home

hero:
  name: QA Wiki
  text: Notes and guides for QA engineering
  tagline: Bilingual English and Vietnamese. A static, searchable docs site built with VitePress.
  actions:
    - theme: brand
      text: Writing QA test reports
      link: /guide/qa-test-report
    - theme: alt
      text: UI vs API test reports
      link: /guide/ui-vs-api-test-reports

features:
  - title: Decision-ready reports
    details: Principles, anatomy, statuses, defect entries and templates that let a release manager act.
  - title: UI and API layers
    details: One reporting standard, two evidence languages — coverage matrices, defect examples and exit criteria.
  - title: Built to grow
    details: Markdown sources, a manifest-driven sidebar, local search and bilingual locales — ready for hundreds of pages.
---

## How this wiki is built

- Content is Markdown, one file per page and language, under `docs/`.
- The sidebar comes from one manifest in `docs/.vitepress/nav.ts`, localized per language.
- Search runs locally; no external service is involved.
- The build is fully static: deploy `docs/.vitepress/dist` anywhere.
