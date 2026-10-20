# Roofseal six-page implementation specification

## Agreed outcome

Build all six website screens from Roofseal (Dev), Prototype V3, as a runnable local Next.js application in `C:\Users\User\Documents\ChatGPT\Roofseal`. Match the supplied Figma design, including small spacing, typography, image crops, diagonal edges, logos, and component states. Use the existing design without redesigning it. The user confirmed the destination and all six pages.

## Source and route mapping

File key: `npDCdzEumvOMTs2jxqYfYl`. Page: `28318:2944`.

| Figma screen | Node | Local route | Source size |
| --- | --- | --- | --- |
| index | 28318:2945 | / | 1920 × 6792 |
| About | 28318:3731 | /about | 1920 × 6154 |
| Metal Roofing Division | 28318:4036 | /metal-roofing-division | 1920 × 3991 |
| Roof Covering | 28352:1909 | /roof-covering | 1920 × 3890 |
| Metal Roof System | 28318:4202 | /metal-roof-system | 1920 × 4342 |
| Products Inner | 28318:4404 | /products/roofseal-deck762 | 1920 × 2719 |

The originally linked node `28318:4175` is the Menu instance inside Metal Roofing Division. Figma editor and prototype URLs are source references, not application pathnames. The local route names above are implementation choices.

## Page composition

Home: shared menu; blue hero with Building Lasting Value, division cards, and three credentials; manufacturer introduction with industrial imagery; interactive cutaway building and product markers; two division cards against blue background; four brand cards; projects with two category tabs and carousel arrows; shared roofing CTA; dark footer.

About: shared menu and breadcrumbs; manufacturer introduction with image collage; core values and vision/mission; team photograph with overlay; quality standards and certificates; milestone timeline; ESG panels; dark footer.

Metal Roofing Division: shared menu and breadcrumbs; blue metal roofing banner; centered two-paragraph introduction; five category cards in a three-card row and centered two-card row; shared CTA; dark footer; WhatsApp control.

Roof Covering: shared menu and breadcrumbs; tiled-roof banner; centered introduction; Metal Roof System and Shingles Roof System cards; two FAQ columns; shared CTA; dark footer; WhatsApp control.

Metal Roof System: shared menu and breadcrumbs; green metal-roof banner; introduction; seven product cards in a four-card row and three-card row; two text/FAQ columns; shared CTA; dark footer; WhatsApp control.

Product detail: shared menu and breadcrumbs; back control; large Roofseal Deck762 image with thumbnails; product title, description, specification bullets, quote and brochure actions; recommendation row of four cards; dark footer; WhatsApp control.

## Shared visual foundation

- Font: Plus Jakarta Sans. Extracted roles: body 16px/24px weight 400; menu 16px weight 700; H1 60px/72px weight 800 with -1.8px tracking; H2 40px/48px weight 800 with -1.2px tracking; H3 30px/36px weight 800 with -0.9px tracking. Preserve differing page-specific roles from subsequent detailed extraction.
- Primary red `#EE1D24`; headings `#1F1F1F`; body `#303030`; white `#FFFFFF`; light body `#F8F8F8`; dark background `#181818`; line `#B7C3C0`.
- Header is 90px tall at source size with 50px horizontal and 15px vertical padding, a 311 × 60 logo, translucent white background, 15px backdrop blur, and bottom border. Preserve design layout and alignments.
- Preserve source logos, roofing photography, product images, certificate images, brand imagery, decorative vectors, diagonals, and icon treatment. Download and reference permanent local asset paths. Never use full-screen reference images as the website implementation.
- CTA and footer are shared components. CTA uses the roofing background and multiple decorative layers. Footer includes newsletter input, link columns, contact information, hours, legal links, and attribution text.

## Verified prototype behavior

`prototype-reactions.json` contains the captured source reactions. They were read without modifying the source design.

- Logo clicks navigate to Home; About links navigate to About.
- Our Products uses a click-triggered overlay targeting the Metal Roofing mega-menu (`28383:5333`). Inspect both division variants before implementation.
- Home roofing division card navigates to Metal Roofing Division. Category card navigates to Roof Covering. Preserve the remaining verified navigation chains from the source reactions.
- Diagonal buttons use Smart Animate with ease-out and approximately 300ms duration. Division cards use ease-out and approximately 100ms. Primary button hover uses linear and approximately 300ms. Some arrow/card variants change immediately.
- For each hover variant, obtain its exact target properties before implementation; timing alone is insufficient.
- Implement visible controls as semantic links, buttons, inputs, accordions, or tabs. Where the source has no configured action, record that fact before assigning demo behavior. Do not invent production destinations.
- Newsletter, quote list, and brochure controls need local demonstration behavior or real supplied destinations. No external submissions or backend integration are included by default.

## Responsive interpretation

The six confirmed screen frames are desktop designs. A separate node named responsive view is 1135px wide; inspect it before adapting the affected section. No complete mobile screen was identified in the page-level inventory.

At 1920px, compare to exact source geometry. At 1440px, 768px, and 390px, adapt layout using fluid containers, wrapping grids, stacked content, and a compact navigation menu. Do not shrink the entire desktop page into unreadably small text. Label responsive choices without matching source frames as adaptations; mobile pixel parity cannot be claimed without mobile references.

## Implementation boundaries

Use the requested AI Website Cloner upstream template, preserving its LICENSE. Target Next.js 16, React 19, TypeScript, and Tailwind CSS 4. Preserve the existing local Git repository and research files. No user-authored application routes exist yet.

Use shared components for menu/mega-menu, breadcrumbs, buttons, cards, CTA, footer, and floating contact control. Keep page-specific sections isolated. Keep content and product records explicit and typed. Download local assets under a collision-resistant Roofseal namespace and document source-node mappings.

Do not add authentication, database, real order processing, newsletter integration, public deployment, or unrelated pages. Missing source destinations remain documented rather than silently inventing content.

## Verification and completion criteria

1. Initialize the template safely; run locked dependency installation, `npm run check`, and the base build.
2. Write a section/component specification before builder delegation. Use high-fidelity Figma design-context responses for implementation; inspect sparse responses by child node.
3. Check all static assets for local existence, correct source slot, correct callsite, and rendered proportions.
4. Verify TypeScript and production build; open every local route and check navigation, overlay dismissal, hover states, FAQ behavior, image selection, and quote demo state where implemented.
5. Capture local screenshots and compare against each source screen at source width. Inspect desktop, tablet, and mobile rendering and horizontal overflow.
6. Fix observed in-scope discrepancies. Report remaining mismatches honestly; do not claim pixel-perfect completion without visual evidence.

## Current evidence

All six reference screenshots are saved under `docs/design-references/roofseal/`, including `overview.png`. The design metadata, Metal Roofing Division section code/styles, and prototype reactions are saved under `docs/research/roofseal/`. The `.fig` archive is readable and includes canvas data and embedded source images. Application scaffolding and implementation have not begun.
