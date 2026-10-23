# Expanded catalog implementation

Content extracted from the public Roofseal catalog on 23 October 2026. The snapshot keeps source URLs for each category and product. Re-extract with `python scripts/extract-catalog.py` (requests and beautifulsoup4 required). No source instructions or scripts are executed.

## Layout and routing

- Reuses category/listing spacing and product detail design with intentional blank image slots for future CMS media.
- Dynamic category routes use async Next.js 16 params. Existing Roof Covering and Metal Roof System routes retain their authored layouts.
- Doors & Frames uses the division structure with two category cards. The new division banner is neutral until appropriate media is supplied.
- All products share the detail layout and multi-product quote store. Existing Deck762 now uses the same blank-image detail template.
- Roofing category buttons, listing cards, recommendations and quote navigation lead to working local destinations.
- Roof Covering FAQ answers now use live content instead of prototype-missing notices.

## Category source map

| Local route | Source | Products | Subcategories |
|---|---|---|---|
| /roof-covering | https://www.roofseal.com.my/product-category/roof-covering/ | 0 | 2 |
| /metal-roof-system | https://www.roofseal.com.my/product-category/roof-covering/metal-deck-roofing-sheets/ | 7 | 0 |
| /shingles-roof-system | https://www.roofseal.com.my/product-category/roof-covering/roof-shingles-system-malaysia/ | 1 | 0 |
| /insulation | https://www.roofseal.com.my/product-category/insulation/ | 0 | 4 |
| /glasswool | https://www.roofseal.com.my/product-category/insulation/glass-wool-insulation-supplier-malaysia/ | 1 | 0 |
| /rockwool | https://www.roofseal.com.my/product-category/insulation/rockwool-insulation-supplier-malaysia/ | 1 | 0 |
| /aluminium-foil | https://www.roofseal.com.my/product-category/insulation/aluminium-foil-insulation-malaysia/ | 5 | 0 |
| /roofing-mesh | https://www.roofseal.com.my/product-category/insulation/roofing-mesh/ | 2 | 0 |
| /gutter-roof-component | https://www.roofseal.com.my/product-category/gutter-roof-component/ | 0 | 4 |
| /gutter-system | https://www.roofseal.com.my/product-category/gutter-roof-component/rain-gutter-systems-malaysia/ | 2 | 0 |
| /flashing-capping | https://www.roofseal.com.my/product-category/gutter-roof-component/capping-flashing/ | 2 | 0 |
| /waterproofing | https://www.roofseal.com.my/product-category/gutter-roof-component/waterproofing/ | 2 | 0 |
| /fasteners | https://www.roofseal.com.my/product-category/gutter-roof-component/fasteners/ | 6 | 0 |
| /structural | https://www.roofseal.com.my/product-category/structural/ | 2 | 0 |
| /skylights | https://www.roofseal.com.my/product-category/skylights/ | 5 | 0 |
| /metal-door-frames | https://www.roofseal.com.my/product-category/metal-door-frames/ | 1 | 0 |
| /fire-rated-door | https://www.roofseal.com.my/product-category/fire-rated-doors-supplier-malaysia/ | 1 | 0 |

Additional division route: `/doors-frames-division`.

## Product source map

| Local route | Source |
|---|---|
| /products/roofseal-deck762 | https://www.roofseal.com.my/product/roofseal-deck762/ |
| /products/roofseal-deck762-with-pu-foammetal | https://www.roofseal.com.my/product/roofseal-deck762-with-pu-foammetal/ |
| /products/roofseal-euro762 | https://www.roofseal.com.my/product/roofseal-euro762/ |
| /products/roofseal-high-rib-30 | https://www.roofseal.com.my/product/roofseal-high-rib-30/ |
| /products/roofseal-clip720 | https://www.roofseal.com.my/product/roofseal-clip720/ |
| /products/roofseal-span | https://www.roofseal.com.my/product/roofseal-span/ |
| /products/roofseal-clad | https://www.roofseal.com.my/product/roofseal-clad/ |
| /products/iko-cambridge | https://www.roofseal.com.my/product/iko-cambridge/ |
| /products/glasswool-insulation-2 | https://www.roofseal.com.my/product/glasswool-insulation-2/ |
| /products/rockwool-insulation | https://www.roofseal.com.my/product/rockwool-insulation/ |
| /products/woven-series | https://www.roofseal.com.my/product/woven-series/ |
| /products/leno-series | https://www.roofseal.com.my/product/leno-series/ |
| /products/premium-bubble-series | https://www.roofseal.com.my/product/premium-bubble-series/ |
| /products/avantgarde | https://www.roofseal.com.my/product/avantgarde/ |
| /products/fire-retardant-series | https://www.roofseal.com.my/product/fire-retardant-series/ |
| /products/brc3315-galvanised-welded-mesh | https://www.roofseal.com.my/product/brc3315-galvanised-welded-mesh/ |
| /products/hexagonal-galvanised-wire-netting | https://www.roofseal.com.my/product/hexagonal-galvanised-wire-netting/ |
| /products/metal-gutter-system | https://www.roofseal.com.my/product/metal-gutter-system/ |
| /products/everplast-upvc-gutter-system | https://www.roofseal.com.my/product/everplast-upvc-gutter-system/ |
| /products/flashing-capping-system | https://www.roofseal.com.my/product/flashing-capping-system/ |
| /products/roofseal-bitufelt | https://www.roofseal.com.my/product/roofseal-bitufelt/ |
| /products/sealpro-dry-fix | https://www.roofseal.com.my/product/sealpro-dry-fix/ |
| /products/crest-fixing-purlins-ds-650-hwr | https://www.roofseal.com.my/product/crest-fixing-purlins-ds-650-hwr/ |
| /products/crest-fixing-light-gauge-ds-650-ss-hwr | https://www.roofseal.com.my/product/crest-fixing-light-gauge-ds-650-ss-hwr/ |
| /products/metal-cladding-light-gauge-connection-fixing-ds-516-ho | https://www.roofseal.com.my/product/metal-cladding-light-gauge-connection-fixing-ds-516-ho/ |
| /products/side-lap-fixing-stitching-516-16t-bk-hwr | https://www.roofseal.com.my/product/side-lap-fixing-stitching-516-16t-bk-hwr/ |
| /products/clip-fixing-ds-525-ph | https://www.roofseal.com.my/product/clip-fixing-ds-525-ph/ |
| /products/metal-gutter-fixing-ds-310-ph | https://www.roofseal.com.my/product/metal-gutter-fixing-ds-310-ph/ |
| /products/lightweight-steel-truss-system-malaysia | https://www.roofseal.com.my/product/lightweight-steel-truss-system-malaysia/ |
| /products/c-purlins | https://www.roofseal.com.my/product/c-purlins/ |
| /products/polycarbonate-roofing-sheets | https://www.roofseal.com.my/product/polycarbonate-roofing-sheets/ |
| /products/fibreglass-reinforced-polyester-frp-roofing-sheet | https://www.roofseal.com.my/product/fibreglass-reinforced-polyester-frp-roofing-sheet/ |
| /products/multiwall-profiled-polycarbonate-sheet-colour-selection | https://www.roofseal.com.my/product/multiwall-profiled-polycarbonate-sheet-colour-selection/ |
| /products/solid-polycarbonate-sheet-colour-selection | https://www.roofseal.com.my/product/solid-polycarbonate-sheet-colour-selection/ |
| /products/aluminium-composite-panel-acp | https://www.roofseal.com.my/product/aluminium-composite-panel-acp/ |
| /products/sealframe-customisable-metal-door-frames | https://www.roofseal.com.my/product/sealframe-customisable-metal-door-frames/ |
| /products/fire-rated-doors | https://www.roofseal.com.my/product/fire-rated-doors/ |

## Editorial and integration limits

- Public source content is English. No approved Malay SEO copy was supplied.
- Product images intentionally remain blank. Category cards without existing Figma imagery use neutral media areas.
- CMS connection and image upload remain unconfigured; structured JSON is editable content, not a connected CMS.
- No Batten-specific source product was found; structural hotspot destinations therefore use the Structural listing.
- Product descriptions and textual information are imported; source specification images are omitted with the other pending media.

## Verification

- `npx tsc --noEmit`: passed.
- Scoped ESLint: no errors; existing img optimization warnings only.
- Full build and rendered interaction verification are integrated by the parent task.

## Integrated verification

Approved expansion verified locally: npm run check passed (lint0 errors, TypeScript, production build with generated category/product pages). Browser checks covered hero swap, silent video playback (paused=false, time advancing, controls=false), all ESG cards initially collapsed, category-to-product navigation, multiple quote products and quantity persistence after reload. Eight representative mobile routes had no horizontal overflow or broken images. Quote List measured205x50 and Submit165x50; count badge is separate from button label.

Video: extracted Figma manufacturing clip d9af56fe4f9d843e9f0f9565ce1663ea3c6612ce,1920x1080,37.13seconds, muted autoplay inline loop. Blank image slots, final fourth-brand logo, Social/Governance copy, CMS connection and inquiry delivery endpoint remain pending external inputs. No inquiry delivery is claimed or attempted.
