# Roofseal implementation plan

Approved specification: IMPLEMENTATION-SPEC.md. User authorized implementation on 2026-10-20.

- [x] Initialize upstream template, preserve LICENSE and existing Git history, install locked dependencies, and pass baseline checks.
- [x] Extract every visible section and prototype state into research files; download assets and record their source-node mappings.
- [x] Create shared typography, colors, controls, navigation, mega-menu, breadcrumbs, CTA, footer, and local quote state.
- [x] Implement Home, About, three catalog screens, and product detail with responsive page-specific components.
- [x] Run lint, TypeScript, and production build; inspect all six routes and interactive flows in browser.
- [x] Compare source and implementation screenshots, repair discrepancies, and document remaining limits.

## Output isolation

The six route mapping is fixed in IMPLEMENTATION-SPEC.md. Shared source components live in src/components/sites/roofseal/shared; page components live in src/components/sites/roofseal/{home,about,catalog,product}. Downloaded exact assets live in public/sites/roofseal/shared with hashed source URLs to prevent filename collisions. docs/research/roofseal contains per-node extraction specifications and assets.json; docs/design-references/roofseal contains the six reference screenshots and QA images. Source screen names, not Figma editor URL pathnames, determine the approved local routes.

## Verification

Build/type checks establish renderability. Browser tests cover route links, product mega-menu, FAQ toggles, quote add/remove and persistence, gallery thumbnails, newsletter validation and explicit local feedback, and mobile horizontal overflow. Compare screenshots at 1920px source width, then 1440px, 768px, and 390px. Mobile layouts are adaptations because complete mobile source screens are absent.

## Execution ledger

- Bootstrap uses a temporary clone and copies its working files into the approved root, preserving the pre-existing Git repository and research.
- Scope stays at the six designed pages. Controls without source destinations display clear local feedback or use existing contact details; no form transmits data.
- Figma reactions were available directly, resolving the prototype sign-in blocker for extraction.

- Final verification: npm run check passed; six routes inspected at desktop/tablet/mobile sizes; independent navigation review fixes verified. See QA-REPORT.md for limitations and evidence.
