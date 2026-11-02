# Why Roofseal and Doors & Frames implementation

Goal: implement the supplied Figma frames 30007:1823 and 30007:1958 using the provided Drive assets and existing shared components. User confirmed the latter is Doors & Frames; keep Metal Roofing unchanged.

- [x] Add Why Roofseal at `/why-roofseal`, with the nine supplied benefits and icons, matching the 1240px three-column grid and responsive stacking.
- [x] Add Doors & Frames at `/doors-frames-division`, with the supplied banner and two Figma category cards linking to existing CMS category routes.
- [x] Connect header, footer Why link, and homepage division links. Reuse shared breadcrumbs, banner, CTA, and shell.
- [x] User approved replacing the copied Metal Roofing introduction with approved Doors & Frames content. No CMS record changes, deployment, or BugHerd status changes.
- [x] Verify both routes, their assets and category destinations; lint (0 errors, 66 image warnings), typecheck, build, and visually check desktop/mobile. Why benefits also checked at 846px.

## Source record

- Figma: `Yh1c680cmZAJuhQxPF7QSu`, Why frame `30007:1823`; Doors frame `30007:1958` (mislabelled Metal Roofing in the file). Original Metal Roofing frame/page retained.
- Drive: provided Website Development folder `1j6VcKk7ygRtuJ0Y0xbD73Kcwkf9PIFtX`, Roofseal Dev Image subfolders Why Us, Pages Banners, Doors & Frames. Nine original 50px icons and two original 1920×540 banners downloaded locally.
- Doors banner: supplied file “Dekstop Banner - Fire Rated Door-1.jpg”, ID `102iEjLGBud3dtUVoI70_nHbpML1mSIwm`, visually matched to the factory banner in Figma.
- Door photos: original Drive JPGs retained locally. Displayed card PNGs exported from the supplied Figma components preserve their gradient and diagonal corner. These are component assets, not page screenshots.
- Doors introduction adapted from the existing approved homepage division and company copy after explicit user approval. No new specifications or certification claims added.
- Preview only: no deployment, Git push, or BugHerd status update.

Validation: full regression suite 45/45 passed; typecheck passed; production build passed; `git diff --check` passed. Desktop cards measured 580×640 and benefit columns 400px with 50px icons. Mobile pages had no horizontal overflow and all images loaded. Product-menu navigation to the new division verified in the browser.
