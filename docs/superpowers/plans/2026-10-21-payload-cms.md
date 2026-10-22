# Roofseal Products and Resources CMS Implementation Plan

> For agentic workers: implement this plan inline using executing-plans and test-driven-development guidance. The user explicitly authorized implementation, downloads, import, and frontend connection on 21 October 2026.

**Goal:** Make the existing Roofseal product catalogue and Resources editable in a working Payload CMS, populated with the extracted original-site content and locally downloaded media.

**Architecture:** Embed Payload 3.91 in this Next.js app with separate frontend/admin root layouts. Use persistent SQLite and Payload upload storage locally. Server-render published CMS content into the existing components; retain public URLs, CSS, and source design assets where necessary for visual parity. Do not deploy or provision external infrastructure in this task.

**Tech stack:** Next.js 16.4.2, React 19.2.4, Payload/@payloadcms packages pinned to 3.91.0, SQLite, Sharp, Node test runner, tsx.

**Spec:** This document records the user-approved scope from the conversation and is the implementation brief.

## Global constraints

- Products and Resources are the editable business scope. Users, Media, and Categories support it; no general page builder.
- Preserve existing frontend layout, typography, spacing, navigation structure, and six existing URLs.
- Import 39 source product records and 18 categories. Retain source URLs/IDs and review notes; do not merge same-named Glasswool records automatically.
- Download 76 original product-gallery image URLs, the 25 verified PDF URLs, and resource/gallery imagery. Deduplicate by source URL and verify downloaded file contents.
- Import catalogue resources, the indexed blog article, materials content/table, and resource-gallery records. Keep explicit source attribution/provenance in the admin.
- Public content reads must exclude drafts. Anonymous writes are forbidden; users/roles are managed by administrators.
- Repeated imports must not create duplicate records or overwrite subsequent editorial changes.
- No public deployment, external form submissions, or external account provisioning.

## Review focus

- A visitor must never receive a draft through page routes or public API queries.
- Product/category URLs and image aspect ratios must remain usable on desktop and mobile, including long product names.
- Media/PDF imports must not silently accept an HTML error page as an asset.
- Import retries must preserve editor changes and reuse existing media relationships.
- The admin must not inherit the website shell, and catalogue writes must not grant an editor user-management access.

## Task 1: Working CMS and access boundaries

Files: `payload.config.ts`, `src/cms/collections.ts`, `src/app/(payload)/`, `src/app/(frontend)/`, `next.config.ts`, `tsconfig.json`, `.env.example`, `tests/cms.test.mjs`.

- [x] Write HTTP integration tests for public published reads, anonymous write rejection, admin layout separation, and draft visibility. Run against the original app and observe failure.
- [x] Add Payload config, Users/Media/Categories/Products/Resources collections, local persistent storage, and isolated admin/API routes.
- [x] Generate Payload types/import map, initialize a private local admin account, and verify authentication.

## Task 2: Verified downloads and repeatable import

Files: `data/roofseal-source/`, `scripts/cms/prepare-source.py`, `scripts/cms/download-media.ts`, `scripts/cms/import.ts`, `scripts/cms/setup.ts`, `tests/cms-import.test.ts`.

Interfaces: normalized source records reference media by original URL; downloader produces an on-disk manifest; importer resolves source keys to Payload IDs.

- [x] Test stable filenames, invalid file rejection, and preservation of duplicate source identities before implementing those helpers.
- [x] Normalize the already extracted content into checked-in JSON without temporary raw HTML paths.
- [x] Download and verify images/PDFs; create upload records with source URLs and optimized image sizes.
- [x] Import categories, products, PDFs, article, materials and galleries with relationships; preserve existing records on rerun.
- [x] Verify counts, media relationships, repeat-import idempotency, and no missing files.

## Task 3: Frontend content connection

Files: `src/lib/cms-content.ts`, `src/cms/view-models.ts`, existing catalog/product/shared components, `src/app/(frontend)/products/[slug]/`, `categories/[slug]/`, `resources/`.

Interfaces: server content functions return serializable category/product/resource view models; client components accept props and use stable CMS product identities for quote state.

- [x] Connect existing product lists, category cards, detail/gallery/specification text, related products and catalogue downloads.
- [x] Reuse the current category/product templates for other imported records; preserve Deck762 and existing category URLs.
- [x] Connect Resources navigation to listing/detail/download views using existing visual patterns.
- [x] Keep the quote drawer design and support multiple CMS-backed products with persistent add/remove state.
- [x] Use published server reads without stale static snapshots; verify admin changes appear on the public page.

## Task 4: Verification and handoff

Files: `ROOFSEAL.md`, `docs/research/roofseal/CMS-INTEGRATION.md`, integration tests and ignored local QA evidence.

- [x] Run the full CMS test suite, lint, typecheck and production build; document environmental limitations accurately.
- [x] Browser-test `/admin`, product edits/publishing, Resources downloads, category navigation, quote persistence, missing slugs and mobile rendering.
- [x] Capture matched desktop/mobile views and compare to the current implementation; repair integration-induced design changes.
- [x] Review the final diff and report imported counts, local admin access, run/backup instructions, and production hosting requirements.

## Progress

- Baseline: clean checkout at 063e7b2; previous audit verified lint/typecheck and Webpack build. No automated tests existed.
- Implementation branch: `codex/payload-cms`; use the authorized existing workspace, preserving ignored extraction/QA artifacts.

- CMS initialized; schema/types/import map generated; private local admin in ignored `.data/admin-access.txt`.
- Downloads: 218/218 verified files, including 29 PDFs (four additional PDFs came from galleries), zero failures.
- Import: 18 categories,39 products,42 resources,218 media. Repeat import created zero records and preserved content.
- Existing routes moved into frontend group; Payload has separate admin/API layout. Product/category/Resources views connected; multi-product quote drawer implemented.
- Framework upgraded to Next.js/eslint-config-next 16.4.2 after npm reported critical advisories; non-breaking audit fixes removed critical findings. Development dependencies were restored after the runtime audit pruned them.
- Initial HTTP tests correctly failed on missing CMS (404); integrated API public read and anonymous-write tests passed. Production admin login and product fields were subsequently verified in the browser.
- Final independent review dispatched to cms_review.

- Final verification: npm run check passed (63 image-optimization warnings, no lint errors); 16 tests passed; HTTP suite passed again on the final build. All 99 imported product/category/resource pages and all 218 original media URLs returned 200 with nonempty bodies.
- Browser QA: matched 1280px/390px captures for six existing routes and Resources, no overflow/broken images; long product names, quote add/remove/reload, admin login and fields checked. Preview preserves the active origin; full navigation on exit clears the preview notice.
- Focused independent review confirmed importer recovery and category discovery fixes, with no remaining important findings.
- Local production server left running on 127.0.0.1:3000. No deployment or commit/push performed. Production persistence, email configuration and remaining transitive dependency advisories are documented in CMS-INTEGRATION.md.
