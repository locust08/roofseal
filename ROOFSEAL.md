# Roofseal local website

Six Next.js routes rebuilt from the approved Roofseal (Dev) Figma design:

| Page | Route |
| --- | --- |
| Home | `/` |
| About | `/about` |
| Metal Roofing Division | `/metal-roofing-division` |
| Roof Covering | `/roof-covering` |
| Metal Roof System | `/metal-roof-system` |
| Roofseal Deck762 | `/products/roofseal-deck762` |

Use Node.js 24 or newer. Run `npm ci`, then `npm run dev`. Run `npm run check` to lint, typecheck, and build. `npm run build` followed by `npm start` serves the production build. The upstream template MIT license is retained in LICENSE.

## What works

Responsive navigation and product mega-menu, the six-page navigation path, source hover states, building hotspot information, project and milestone controls, ESG panels, FAQ toggles, product gallery, local persisted quote list with removal, contact links, and newsletter validation with explicit local preview feedback.

Quote data stays in browser localStorage. Newsletter signup does not transmit data. Production catalogue files, newsletter endpoints, unsupported content pages, and alternate project-category data were not supplied; these controls explain the missing preview content. The six supplied pages are implemented; unseen pages are not invented.

## Design evidence

`docs/research/roofseal/` contains the approved specification, implementation plan, original node extraction, prototype reactions, component briefs, asset mapping, and QA results. `docs/design-references/roofseal/` contains source renders and local screenshots. Locally downloaded assets live under `public/sites/roofseal/shared/`; no temporary Figma URLs are used by the app.

The source contains complete desktop frames only. Tablet and phone layouts are adaptations, checked at 1440px, 768px, and 390px. Home's decorative shader appearance uses an exact Figma-rendered background image because the connector did not expose the referenced shader runtime resource. Original shader source remains in the research extraction. Text and controls are rendered as HTML; reference screenshots are never used as complete webpage backgrounds.

The asset downloader uses curl and rejects empty results. One transparent Boolean-operation export was replaced with the exact rendered source-node export. Keep the source artifacts if refreshing downloads after temporary Figma URLs expire.

Fonts: Plus Jakarta Sans via Next.js; Font Awesome Free icon webfonts under their upstream SIL OFL license. Original project imagery and brand assets are from the supplied Figma design.
