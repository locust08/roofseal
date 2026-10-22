# Products and Resources CMS

The existing Roofseal frontend now reads Products, Categories and Resources from Payload 3.91.0. The site runs on Next.js 16.4.2 / React 19.2.4. The frontend CSS and six original URLs are retained. Payload has its own root layout at `/admin` and REST API at `/api`.

## Local setup

Use Node.js 24 or newer and install development dependencies as well as runtime dependencies:

```sh
npm ci
npm run cms:setup
npm run cms:download
npm run cms:import
npm run dev
```

`cms:setup` creates `.env.local` with a random Payload secret and strong local administrator password. It initializes SQLite and writes the private local login details to `.data/admin-access.txt`. It preserves existing administrator accounts. Do not commit or publish either private file.

Open `http://localhost:3000/admin`. The initial local administrator email is `admin@roofseal.local`; its generated password is in the private file above. Change the account details for your actual deployment. No password reset email adapter is configured locally.

## Imported content

The checked-in snapshot is under `data/roofseal-source/`. It was prepared from the original site's public sitemaps and pages on 21 October 2026.

| Collection | Imported records |
| --- | ---: |
| Products | 39 |
| Categories | 18 |
| Resources | 42 |
| Media | 218 |

Resources contains 25 catalogue records, 15 original galleries, one materials article/table, and one blog article. Four galleries contain additional PDF files, bringing downloaded PDFs to 29. Media also includes original product photos, category/page/resource imagery and the existing presentation images needed to retain the supplied frontend design.

Downloads are deduplicated by original URL and checked by file signature; images are decoded with Sharp. Local download checksums and MIME types are recorded in `.data/download-manifest.json`. Payload serves imported media from `.data/media/`, including generated image variants.

`npm run cms:import` is repeatable: it looks up existing records by their original source URLs and creates only missing records. It deliberately does not overwrite editor changes. Persisted completion markers allow an interrupted import to resume category-parent and related-product linking. Import totals are written to `.data/import-report.json`. Source records and originals are retained separately from the editable database.

The optional `scripts/cms/prepare-source.py` script re-normalizes the ignored audit snapshot if that original snapshot is available. Fresh checkouts use the already checked-in JSON; they do not need the audit's temporary HTML files.

## Editing

### Approved Drive reconciliation

The client-approved Drive update is recorded in `data/roofseal-drive-updates.json` and applied with `npm run cms:reconcile-drive`. The local CMS now contains **57 product records: 36 published and 21 drafts**. The drafts comprise the three retired website products and 18 new review records (15 missing entries/profile records plus three uncertain candidate aliases). The ceiling category and its two dedicated resources are also unpublished; 17 categories and 40 resources remain public. Media totals 221 records, including the expanded Sealframe PDF, the additions sheet and the supplied steel batten photograph.

Drafts cover SF1–SF10, KD Frame, Sealdor DL/SL, Fascia Board and Lightweight Steel Batten. DEK PRO 740 HI RIB, CT PROTEK and SealPro II Dry Fix are explicitly marked candidate aliases requiring confirmation. Source documents are linked through provenance and catalogue fields. Pending model imagery displays a neutral placeholder in authenticated preview; existing product imagery/layout is retained.

Six existing products carry editorial notes about possible name/model changes or the 18 mm versus 20 mm PU specification conflict. No unverified specification, SKU or fire-rating claim was introduced. The Sealframe product and existing catalogue resource both use the verified 18-page Drive pack; their original four-page upload remains stored for provenance.

For another checkout, download the three assets listed in the manifest through the authenticated Google Drive connector to their `.data/drive-materials/` paths, then run `npm run cms:reconcile-drive` after the ordinary setup/import. The Sealframe SHA-256 is pinned in the manifest. The reconciliation checks all source files first, saves a private pre-change content backup under `.data/backups/`, deduplicates new records by source URL/slug, and marks applied operations in editorial notes. A repeat run made no changes. Subsequent manual edits are preserved; removing the marker is not a normal editorial operation.

The base import snapshot and its normalization script preserve retirement statuses on fresh imports. Existing records are still not overwritten by the base importer. Keep the reconciliation manifest, source statuses and navigation aligned when approving future scope changes.

The full test command runs files sequentially because HTTP tests share one local administrator account. Parallel logins can race while Payload persists that user's session list; serial execution avoids invalidating a test's active session. Production authentication protections were not weakened.

Verification after this update: `npm run check` passed (existing image-optimization warnings only); all 21 tests passed, including private drafts, unpublishing, attachment checksum and import retirement persistence. A public sweep returned 200 for all 93 active product/category/resource pages and all 221 media URLs. Desktop product appearance and mobile Skylights layout were checked; captures are under ignored `temp/drive-update-qa/`.

### Content fields

- Products: edit names, category relationships, description bullets or paragraph description, gallery, card image, catalogue PDF, specifications, related products and SEO fields.
- Categories: edit card image, hierarchy, introductory copy, display order and roofing FAQs. Existing division/category page layouts remain fixed.
- Resources: choose Catalogue, Materials, Blog / News or Image Gallery. Edit rich text, cover/gallery images, downloads, related products and material table rows.
- Media: upload images/PDFs and provide alt text. Source URL/checksum fields record provenance; they are not required for new manually uploaded files.
- Users: administrators manage accounts/roles. Editors manage catalogue and resource content, but cannot manage other users or elevate their role.

Content has draft/published states. Public requests read only published records. Product and resource Preview actions require an authenticated editor and use Next.js Draft Mode; anonymous preview requests are rejected. Exit preview using the notice at the top of the website. Published page reads are dynamic, so new content is not held in a stale build-time snapshot.

## Frontend routes

The original `/`, `/about`, `/metal-roofing-division`, `/roof-covering`, `/metal-roof-system`, and `/products/roofseal-deck762` URLs remain valid. Product detail is now a reusable `/products/[slug]` template; additional categories use `/categories/[slug]`. Resources uses `/resources`, optional `?type=catalogue|material|article|gallery`, and `/resources/[slug]`.

Product galleries, cards, recommendations and downloads use CMS records. The duplicated High Rib 30 card was corrected to the source product Euro762. The roofing FAQ placeholders were replaced with the extracted answers. The quote drawer supports multiple CMS product IDs and retains selections in localStorage. Contact and quote forms now submit to a private database-backed queue. See [ENQUIRY-BACKEND.md](ENQUIRY-BACKEND.md) for Google Sheet/email delivery and deployment configuration.

## Source review notes

- Two original pages are named Glasswool Insulation. They remain separate by original ID/URL and carry a review note.
- Nine products did not expose a direct catalogue PDF. Their pages do not display a misleading download button.
- The original site exposed no populated SKU fields. Deck762 retains the SKU already shown in the supplied frontend; other records do not invent SKUs or prices.
- Material coating and warranty claims are retained from the original site and should be checked by Roofseal before editorial changes.
- Technical PDF tables have not been automatically turned into new engineering specifications.
- Nested source lists are normalized without repeating child benefits inside their parent bullet.

## Verification

```sh
npm run lint
npm run typecheck
npm run build
npm start
# In another terminal, against the running local app:
npm test
```

The 16 tests exercise public reads, anonymous-write rejection, admin layout separation, catalogue downloads, draft visibility, authenticated preview rendering, publish/edit visibility, preservation of the published version during draft edits, and editor role boundaries, plus media validation and quote persistence. The import-recovery test uses a separate temporary SQLite database. HTTP tests create and remove uniquely named local verification records. They use the private local administrator environment values; do not aim these tests at a production database.

A final HTTP sweep confirmed that all 99 imported product/category/resource pages and all 218 original media URLs return 200 with nonempty bodies. Authenticated preview and exit were also confirmed in the browser.

Browser checks covered the six existing pages and Resources at 1280px and 390px: no horizontal overflow or broken images were observed. Admin login, editable product fields, multi-product quote persistence/removal and the corrected Euro762 card were checked. Local QA captures and logs are under ignored `temp/cms-qa/` and `temp/cms-*.log`. Lint retains 63 image-optimization warnings and no errors; the existing image-based design is preserved.

The dependency audit has no critical findings after updating Next.js. It still reports transitive advisories (11 high, 7 moderate), including braces through Sass/shadcn, DOMPurify through Monaco, and esbuild through the SQLite migration toolchain. Review supported upstream patches and their reachability before production deployment; forced downgrades to incompatible Payload versions were not applied.

## Persistence and production

SQLite is stored at `.data/roofseal.db`; uploads are under `.data/media`. Keep both on persistent storage. For a local backup, stop the app and copy `.data` and `.env.local` to a private backup location. Do not copy only an active SQLite database while its WAL is being written.

This task does not provision hosting or deploy the app. A persistent Node server can run the current configuration with the imported database and media mounted. Ephemeral filesystem hosting needs a production database/storage adapter. Cloudflare deployment requires the Workers/OpenNext, D1 and R2 adapters/bindings, platform secrets and deployment validation. Configure the real public origin and an email adapter before issuing client accounts or relying on password-reset emails.
