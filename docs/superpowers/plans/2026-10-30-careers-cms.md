# CMS careers and published placeholders

Integrate the existing careers review page with Payload; publish three explicitly labelled placeholder roles in local CMS for review. Preserve existing design, noindex draft-page treatment, disabled applications/resume uploads and every product publication state. Do not deploy or update BugHerd tasks.

Add Career positions collection with editor create/update, administrator delete and published-only anonymous reads, draft/version history, title/slug, department/location/employment type, summary, description, responsibilities, requirements, placeholder flag, display order and editor-only notes. Default new positions to placeholder. Use the same collection in local SQLite and Cloudflare D1 configs. Generate types and additive migration/snapshot.

Server-render published records into native details accordions with labelled job-description/scope/requirements sections. Display explicit placeholder warning per sample, keep the application preview disabled, and populate its disabled position dropdown from the same listing. No JobPosting structured data or active hiring claims.

Seed Sales Executive, Production Operator and Administrative Assistant using generated example content with no salary, dates or confirmed hiring claims. Keep slugs/provenance stable and preserve existing editorial changes when repeated. Back up before schema changes and verify product records against it.

Verify CMS access, draft privacy, live record edits reaching the listing, accordion details, repeatable import, disabled applications, production migrations on a fresh database, typecheck, regression tests and production build. Show localhost preview with CMS link.

## Local completion

Added `Career positions` to Payload Content in both local and Cloudflare configs, with draft/version history, editor/admin access and protected editorial notes. Generated TypeScript types and additive production migration `20261030_011934_careers`. Public listing is dynamic and reads only published records. Three generated example positions are published locally with `isPlaceholder: true`; their labels remain visible while collapsed. Native accordions expose job description, scope and requirements. The disabled application dropdown uses the same CMS records. No applications, resumes, active hiring claims or external publication were enabled.

A concurrent development schema push and seeder init initially collided on an existing index; the schema was inspected and the seed rerun without development schema pushing. `npm run cms:seed-careers` now explicitly uses production mode against the local SQLite configuration. It does not run migrations and refuses remote/non-SQLite configurations. Apply migrations before importing into a new database. Repeat execution preserves existing editorial changes and publication states.

Validation: all 64 regression tests pass, including career permissions, draft privacy, private notes, anonymous write rejection and fresh production migration replay/rerun. TypeScript, production build and lint pass (0 errors, 69 image warnings). Existing product, resource, media and enquiry rows match the private pre-change backup; foreign keys remain valid. All 19 uncertain products remain drafts. Browser verified expandable placeholder content, labels and disabled application controls. Local preview: http://127.0.0.1:4398/career; editor: http://127.0.0.1:4398/admin/collections/careers. No Cloudflare deployment, Git push or BugHerd status updates.

Evidence: `temp/careers-cms-tests.log`, `temp/careers-cms-build.log`, `temp/careers-cms-typecheck.log`, `temp/careers-cms-lint.log`, `temp/careers-cms-seed-repeat.log`, `temp/careers-cms-listing.png`. Private backup: `.data/backups/before-careers-cms-20261030.db`.

## Subsequent user instruction — remove notices

Removed public careers placeholder/review notices and cleaned the three seeded records' visible copy at the user's request. The client will be informed separately. Internal CMS flags, source keys and editorial notes remain, along with disabled applications and noindex. Seed JSON now matches the cleaned copy. Private backup: `.data/backups/before-career-notice-removal-20261030.db`. Six focused HTTP checks and TypeScript passed after the change. No deployment or task updates.

## Approved remote publication — 30 October

Included in the user's approved #31–#40 deployment. Careers schema, three cleaned published records and version history imported to existing D1 after backup and validation. Live page and API verified; application/resume controls remain disabled. Worker version `6eda5e89-d142-4799-aaad-dc199dfb9971`. Uncertain product drafts preserved. This supersedes earlier notes that remote migration/deployment was pending.
