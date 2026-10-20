# Six-page Figma mismatch review

Reviewed 20 October 2026 against the saved Figma renders and high-fidelity node extractions. All six routes were opened at 1920 px content width and at 375 px mobile content width.

## Corrections

- Shared footer: replaced the header SVG with Figma's footer-specific SVG, restoring the white back corner on Submit across all six pages. Red face and original cut geometry are preserved.
- Division, Roof Covering, and Metal Roof System: restored the Products breadcrumb.
- Roof Covering and Metal Roof System: restored the white Back link with red chevron, at the source position 50 px from the banner top/left, with navigation to the parent category.
- Category cards: restored left alignment on button-based cards, including Insulation, Gutter, Skylight, Structural, and Shingles.
- Catalog banners: corrected gradient stops to the source's 35% and 70% black opacity.
- Metal Roof System: first product row measures 566.5 px per card; second row measures 536.5 px, with the original 40 px row gap.
- Roof Covering FAQ: aligned the circle-arrow icons to the top of the label rows.
- Product detail: corrected gallery and thumbnail-strip width from 611 to 609 px.
- About: replaced the substitute calendar symbol with the correct 20 px Font Awesome Solid calendar and restored the timeline chevron. Refined intro copy position, core-value card height, certificate group width, and ESG group offset at source desktop width.
- Home: restored chevrons in the building popup and project carousel. Corrected hero credential centers and separator positions at source desktop width.

## Verification

- npm run check passed: lint (0 errors; existing image optimization warnings), TypeScript, production build.
- All six desktop and mobile routes have no horizontal overflow or broken images in the recorded browser checks. About's settled capture was additionally checked with 0 pending images.
- Desktop screenshots: audit-final-{home,about,division,covering,system,product}.png. Comparison montages: audit-compare-*.png. Footer proof: audit-white-corner-footer.png.
- Detailed dimensions and route results: audit-final-desktop.json and audit-final-mobile.json.

## Fidelity limits

This review corrects identified mismatches; it does not establish pixel equality for every rendered pixel. Full mobile/tablet Figma frames remain unavailable, so those layouts are responsive adaptations. Previously recorded unsupported content and prototype destinations remain listed in QA-REPORT.md. The homepage uses Figma's provided card image exports; the source-level shader runtime remains unavailable as previously documented.
