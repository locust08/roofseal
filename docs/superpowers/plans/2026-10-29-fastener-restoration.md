# Fastener application content restoration

Restore five source-backed application tables and diagrams within the existing More Information design. Keep all publication states, descriptions, galleries and catalogues unchanged. Local preview only.

- Back up the local database and download the five original JPEG diagrams.
- Add a validated optional CMS JSON field for application columns, rows, diagram metadata and provenance. Add the production migration and generated types.
- Import the five records using a repeatable local script that updates only this field and review provenance, and verifies all product publication states.
- Render semantic tables and naturally sized diagrams using the existing More Information component and responsive styles. Preserve every original column/model mapping.
- Verify against the original HTML rows, image files, CMS persistence, draft privacy, production migrations and desktop/mobile localhost views. Run the full regression suite, lint, typecheck and build. Do not deploy or update BugHerd.

Completed locally. The field contains source URL, validated local diagram path/alt/dimensions, columns and complete row mappings. Insulation row groups render with the source row spans. The repeatable import refuses to overwrite edited application data, validates JPEG signatures/checksums before writing, and confirms all publication states afterward. SQLite backup: `.data/backups/before-fastener-content-20261029.db`.

Verification: 48/48 tests passed, including application validation, CMS persistence, all five rendered tables/images, and production migration replay. Typecheck and production build passed; lint has 0 errors and 67 image warnings. All five mobile blocks fit a 390px viewport with loaded images and no page overflow. Existing product fields, feature rows, catalogue/gallery/category/related relationships and publication states were compared with the backup and preserved. Re-running the import made no changes. No deployment, Git push, or BugHerd status change.

Local previews:
- `/products/clip-fixing-ds-525-ph`
- `/products/crest-fixing-light-gauge-ds-650-ss-hwr`
- `/products/metal-cladding-light-gauge-connection-fixing-ds-516-ho`
- `/products/crest-fixing-purlins-ds-650-hwr`
- `/products/side-lap-fixing-stitching-516-16t-bk-hwr`
