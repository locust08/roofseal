# Roofseal local website

Products and Resources are integrated with Payload CMS. Run `npm ci`, `npm run cms:setup`, `npm run cms:download`, `npm run cms:import`, then `npm run dev`. Open `/admin`; private local administrator details are generated in `.data/admin-access.txt`. See [CMS integration](docs/research/roofseal/CMS-INTEGRATION.md) for editing, verification, source counts and persistence requirements. The implementation below describes the original six-screen design baseline; the CMS adds reusable product/category routes and a Resources library.

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

Quote selections persist in browser localStorage; submitted contact and quote enquiries are saved privately in Payload. See [Enquiry backend](docs/research/roofseal/ENQUIRY-BACKEND.md) for delivery setup. Newsletter signup does not transmit data. Catalogue PDFs, product/category details and Resources now use imported CMS content. Newsletter endpoints and alternate project-category data remain outside this integration.

## Design evidence

`docs/research/roofseal/` contains the approved specification, implementation plan, original node extraction, prototype reactions, component briefs, asset mapping, and QA results. `docs/design-references/roofseal/` contains source renders and local screenshots. Locally downloaded assets live under `public/sites/roofseal/shared/`; no temporary Figma URLs are used by the app.

The source contains complete desktop frames only. Tablet and phone layouts are adaptations, checked at 1440px, 768px, and 390px. Home's decorative shader appearance uses an exact Figma-rendered background image because the connector did not expose the referenced shader runtime resource. Original shader source remains in the research extraction. Text and controls are rendered as HTML; reference screenshots are never used as complete webpage backgrounds.

The asset downloader uses curl and rejects empty results. One transparent Boolean-operation export was replaced with the exact rendered source-node export. Keep the source artifacts if refreshing downloads after temporary Figma URLs expire.

Fonts: Plus Jakarta Sans via Next.js; Font Awesome Free icon webfonts under their upstream SIL OFL license. Original project imagery and brand assets are from the supplied Figma design.
