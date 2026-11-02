# Roofseal Cloudflare deployment

The existing `roofseal` Worker in Eason CF Main serves https://roofseal.easondev.workers.dev. No custom domain was changed.

## Runtime and persistence

- Next.js 16.4.2 / Payload 3.91.0 run through OpenNext Cloudflare 1.20.13.
- D1 binding `D1`: `roofseal-preview-cms` (`41c9f80b-f6b0-49c3-a0d4-92f20ea8ef4c`).
- Private R2 binding `R2`: `roofseal-preview-media`. Payload serves files through its existing `/api/media/file/...` routes.
- Initial import: 57 products (36 published, 21 drafts), 42 resources (40 published), 18 categories, 221 media records and 470 files including resized images and PDFs. IDs, relationships, provenance and editorial review notes are preserved.
- The initial administrator is the existing private local account. Credentials remain in `.data/admin-access.txt`; never commit or copy them into deployment documentation. Browser sessions were excluded from the import.
- Payload auth uses the exact existing 600,000-round PBKDF2-SHA256 format through `@noble/hashes` when exceeding Workers’ native iteration cap. A build-time source transform scopes this compatibility layer to Payload auth; local SQLite authentication is unchanged. Password hashes, salts and timing-safe comparison are preserved.
- Runtime `PAYLOAD_SECRET` is configured as a Worker secret. Do not change it casually: it signs sessions and encrypted values.
- `payload.config.ts` remains the local SQLite/Sharp configuration. `payload.cloudflare.config.ts` uses D1/R2, selected by `tsconfig.cloudflare.json` during Cloudflare builds.
- The worker serves imported image variants. New uploads are stored in R2; native Sharp transformations are unavailable on Workers, so new images use original-file fallbacks. Resize images before upload when necessary.

## Build and publish

```sh
npm ci
npm run lint
npm run typecheck
npm run cf:build
npm run cf:deploy
```

Authenticate Wrangler to the existing account first. The build requires a temporary local `PAYLOAD_SECRET` (the existing `.env.local` setup provides it); runtime credentials come from Worker secrets. The build/deploy scripts sanitize OpenNext's generated environment module and scan deployment output to prevent embedding local credentials. Do not publish with a raw `wrangler deploy` command that bypasses that check.

BugHerd loads after hydration on public pages with project key `5vkosux5eqxxs3z2ogxsjw`. The CMS admin does not load BugHerd.

## Enquiries and delivery

`POST /api/submit-enquiry` saves enquiries privately in D1. Rate limiting uses Cloudflare's overwritten `CF-Connecting-IP` header. Atomic reservations and delivery claims share a SQL bridge with local SQLite.

Email and Google Sheets delivery are **disabled** until valid provider credentials and recipients are supplied. Successful submissions are retained with pending delivery statuses. Configure the server-only variables described in `ENQUIRY-BACKEND.md` as Worker secrets; the public site URL is already configured. Existing delivery scripts use the local SQLite configuration and must not be mistaken for a remote D1 worker. A Cloudflare scheduled delivery entry point remains necessary before enabling automated provider delivery.

## Data operations

The one-time transfer script `scripts/cms/cloudflare-transfer.py` refuses a nonempty D1 database. It creates a consistent private backup, removes local sessions/UI state, adds the R2 `_objectkey` column, validates foreign keys and uploads referenced files with retries. It must not be rerun to refresh a live database. Initial export and report are under ignored `.data/cloudflare-transfer/`.

For future schema changes, create and review a D1-compatible migration and back up the remote database first. Production schema pushing is disabled. Deployment rollback restores worker code only; it does not restore D1/R2 content.

## Verification

The Cloudflare build, lint (existing image warnings only), TypeScript and 11 focused enquiry tests and two password-hash compatibility tests passed, including real local D1 concurrency checks. Live checks passed for administrator login; all 57 authenticated products and 36 public products; 40 public resources; draft-route privacy; PDF downloads; private D1 enquiry creation, product-name snapshots and idempotent retry; and new R2 image upload/read. Disposable verification records were removed. Public product imagery and the BugHerd script were verified in the browser.

Verified Worker version: `8d031527-5439-4890-b929-0de095417eec` (23 October 2026).

## Dependency audit

The installed CMS dependency chain reports npm audit findings, including DOMPurify through the administrator's Monaco editor. The configured registry's current release did not resolve the advisory range, so no ineffective override was retained. Dependency upgrades should be tested separately; this deployment does not claim a clean npm audit.

## 29 October — approved BugHerd #1–#10 release

Deployed worker version `c6619f47-c41f-4a8b-9976-84a04ca8bdda` after user approval. Includes the dedicated Contact Us and Quote List routes plus #3–#10 frontend fixes. Cloudflare build and credential scan passed. Applied the additive `20261029_100000_enquiry_details` migration to D1 after saving a private backup under ignored `.data/cloudflare-backups/`. All five new nullable columns verified; existing catalogue and enquiry counts unchanged. Live contact and quote creation, new field persistence, product snapshots, private access and idempotent retries passed. Disposable QA records were removed. Email and Sheets delivery remain disabled pending provider setup. BugHerd #1–#10 moved to `ready for review` at the user's request (bulk request 312129).

## 29 October — approved current fixes and BugHerd #11–#20 release

Deployed existing `roofseal` worker version `792e5c68-2e90-460d-bccf-6313f5a00c1e` to the same workers.dev URL. Includes #11–#20 category/product content and layouts, Why Roofseal and Doors & Frames pages, 1.2-second fades, and the five restored CMS-backed fastener application tables and original diagrams. Metal Roofing Division is retained.

The first Cloudflare packaging attempt reused modules resolved against the local SQLite Payload configuration. The Webpack filesystem cache version now includes the selected local/Cloudflare runtime. A fresh Cloudflare build and credential scan then passed; no dependency substitutions were needed.

Saved a private remote D1 SQL export and SQLite validation copy under ignored `.data/cloudflare-backups/before-bugherd-11-20-20261029.*`. Validated the release SQL on the copied database before applying it. Added `application_information` and its product-version counterpart; populated only the five application records; restored only the two skylights explicitly approved for #18; appended seven version-history revisions with their original features/relationships. Other product content and all uncertain drafts are preserved. Remote publication totals are 38 published and 19 drafts. Existing R2 media and enquiry delivery settings remain unchanged.

Verification: seven focused live release tests passed. A further 176 read-only checks passed: 57 product routes (38 public, 19 private), 114 linked assets, and five main/new routes. The public API exposes 38 products and no drafts. Browser checks confirmed the live four-column insulation cards, loaded fastener application content and 1.2-second fades. BugHerd tasks #11–#20 were moved to `ready for review` and read back in that state; bulk request `312167`. No other task statuses were changed. Source changes remain uncommitted; deployment does not imply a Git push.

## 30 October — approved BugHerd #21–#30 release

Deployed existing `roofseal` worker version `72289da1-3402-4ccc-bde1-f9dd5d3b0657` at the same workers.dev URL. Includes Fire-Rated Door supporting content, bilingual draft policy pages, Social/Governance ESG content, resource/blog routes, the approved five-item Resources menu, social links and the BlueScope material tabs.

Saved the private D1 export and validation copy under ignored `.data/cloudflare-backups/before-bugherd-21-30-20261030.*`. Applied the additive blog-category migration after validating it against the backup. Imported only three generated review posts as private drafts, their three cover-media records and nine image files into existing D1/R2. Every product row, feature, specification, relationship and product version matches the pre-release backup. Products remain 38 published / 19 drafts; resources are 40 published / 5 drafts. Generated posts require editorial approval, and policy pages remain visibly labelled as review drafts with noindex.

Verification: all 57 local regression tests and the Cloudflare build/credential scan passed. Live verification passed 72 route checks, including all 57 product routes and private review-copy routes. Public APIs expose 38 products, 40 resources and zero drafts; the legacy BlueScope URL redirects correctly. Browser verification confirmed material-tab interaction and the approved five-item mobile Resources menu. BugHerd #21, #22 and #24–#30 moved to `ready for review` and read back successfully (bulk request `312812`). Inaccessible #23 was excluded; other task statuses were preserved. No Git commit/push was performed.

## 30 October — approved BugHerd #31–#40 and careers release

Deployed the existing `roofseal` worker version `6eda5e89-d142-4799-aaad-dc199dfb9971` to the same workers.dev URL. Includes gallery-page removal, CMS-backed careers, five-column catalogues, the muted manufacturing video, all 11 linked building hotspots, five-item Resources navigation, full React Bits 3D card motion, corrected front/rear image brightness, responsive hero spacing and the sticky translucent header. Existing Why Roofseal and Doors & Frames pages are retained.

The first D1 export returned Cloudflare authentication error 10000. D1 list/query access worked under the existing account, and the export retry succeeded without changing credentials. Saved the private remote export and SQLite validation copy under ignored `.data/cloudflare-backups/before-bugherd-31-40-20261030.*`. Validated the careers migration and import against that backup before applying them. Added only career/version tables, a lock-document relationship column, three approved published position records and their version history. Public career review notices remain removed per user instruction; internal provenance and notes are preserved. All application fields, resume upload and submission remain disabled. The careers page remains noindex.

All existing data tables were preserved during migration validation. Live D1 readback confirmed every product row, feature, specification, relationship and version, plus existing resource/media content, matches the pre-release backup. Product totals remain 38 published / 19 drafts. Resources remain 40 published / 5 drafts. Three career positions are published; editorial notes remain private.

Fresh validation: 64/64 regression tests and the Cloudflare build/credential scan passed. Live verification passed 91 route checks, covering all 57 product routes, all 15 removed gallery-detail routes, the removed gallery query, new/main routes and private generated-copy routes. Public APIs expose no product/resource/career drafts. The video returns valid MP4 with HTTP 200 (Cloudflare serves the full file for the tested Range request); browser metadata loaded successfully with muted=true and autoplay=false. Browser confirmed real 3D exit/depth motion, bright front / shaded rear image, five catalogue columns at 1280px, three CMS career positions, no career review notices and every application control disabled.

BugHerd #31–#40 moved to `ready for review` and were read back in that status (bulk request `312885`). Other task statuses, including inaccessible #23, are unchanged. No Git commit/push was performed. Evidence: `temp/release-31-40-{build,tests,deploy,migration}.log`, `temp/release-31-40-live-checks.json`, `temp/release-31-40-live-home.png`, and `.data/cloudflare-backups/roofseal-31-40-after-state.json`.

## 30 October — approved BugHerd #41–#42 release

Deployed existing `roofseal` worker version `84254468-d965-4ffe-b29a-36c0118cecb6` at the same workers.dev URL. Includes the simple in-flow mobile product dropdown, consistent right-aligned mobile chevrons, viewport-bounded navigation scrolling/closing behavior and removal of the roof-installation background layer identified in #42's attachment. Desktop mega-menu and visible team photography remain intact.

Code-only release: no database migration, import or content mutation. D1 publication snapshots before/after match for every product and career record: 38 products published / all 19 uncertain products draft, and three published career positions. Career applications and resume uploads remain disabled. Snapshots are under ignored `.data/cloudflare-backups/roofseal-41-42-{before,after}-state.json`.

Fresh Cloudflare build and credential scan passed; all 13 focused regression checks passed. Live verification passed 61 route checks, including all 57 product routes with 19 private drafts. Public product/resource/career APIs expose zero drafts. Browser at 759px confirmed a simple dropdown with nine division/category links, hidden desktop mega-menu, no horizontal overflow and all three chevrons at the same right coordinate. The unwanted About layer is absent and the team photo remains. Browser confirmed all seven career application controls disabled. Temporary viewport override reset afterward.

BugHerd #41 and #42 moved to `ready for review` and were read back successfully (bulk request `312902`); all other task statuses are unchanged. No Git commit/push. Evidence: `temp/release-41-42-{build,tests,deploy}.log`, `temp/release-41-42-live-checks.json`, `temp/release-41-42-live-menu.png`.
