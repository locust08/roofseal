# Roofseal product content audit

**Restoration completed on 29 October 2026:** the five fastener application tables and original illustrations identified below are now restored through the CMS `applicationInformation` field and the existing More Information component. All 48 local tests and the production build pass. Subsequently deployed with explicit user approval to the existing Cloudflare worker, version `792e5c68-2e90-460d-bccf-6313f5a00c1e`; all five live application pages passed verification. Remote totals are 38 published and 19 private drafts. The remainder records the audit baseline and outstanding content decisions.

Audit date: 29 October 2026. Scope: local website and local Payload records, including all 38 published products and all 19 drafts. This is a content audit; no product records, publication status, frontend code, deployment, or BugHerd tasks were changed.

Five published fastener pages omit their original More Information tables and application illustrations. Eighteen additional Drive product drafts remain incomplete and intentionally private. Every published product retains its imported feature bullets and gallery count, and every linked product-page asset responded successfully.

## Evidence and limits

- Latest supplied Figma file: [Roofseal Dev 29 October 2026](https://www.figma.com/design/Yh1c680cmZAJuhQxPF7QSu/Roofseal--Dev--29-10-2026?m=dev). Product detail frame `28318:4404` was retrieved for this audit, including its screenshot and exact copy. It shows Deck762 as the reusable product-detail example, rather than a separate design for each product.
- The earlier retrieved Prototype V3 hierarchy and repository Figma exports were checked for product names and template sections. The earlier root listing contains Prototype V3 and a page named junks. A new hierarchy refresh was blocked by the Figma account tool limit after the product frame was retrieved. This audit therefore does not certify that every node in the file is unchanged or that the junks page contains no additional product material.
- Current local SQLite catalogue was opened read-only. All 57 product routes were requested. The 38 published pages were parsed and compared with all 202 stored feature bullets. All 109 distinct image, PDF, and shared asset URLs linked within those pages were checked for HTTP 200, nonempty data, and HTML error responses. This checks delivery, not every PDF's technical accuracy or every image's subject.
- Original product HTML snapshot: `temp/source-inventory-2026-10-21/`, captured 21 October 2026. The five omitted tables below are present there. The original site's Light Gauge page also exposes the table through the web source retrieved for this audit; the other four fresh requests failed or returned a verification screen, so their findings are specifically snapshot-backed.
- Approved Drive changes and later user decisions take precedence. Solid and Multiwall polycarbonate were restored by explicit approval for BugHerd 18. Strip Ceiling remains intentionally unpublished.
- Supporting evidence and repeatable read-only checks: `temp/product-audit-2026-10-29/`. No admin credentials were read or copied.

## Confirmed missing content

The import includes short descriptions and gallery images but omits the separate long-description tab for these five products. The generic product template currently renders the custom More Information section only for Sealframe and Polycarbonate Roofing Sheets.

| Product | Missing table content | Missing application illustration |
| --- | --- | --- |
| [Clip Fixing DS 525 PH](http://127.0.0.1:4398/products/clip-fixing-ds-525-ph) | M.S. purlin 1–6 mm versus light gauge 0.4–2 mm; DS 525 PH, DS 525 SS PH, DS 525 PHR and DS 525 SS PHR mappings | Fastener-Clip-Fixing.jpg |
| [Crest Fixing Light Gauge TD 650 / 665 HM](http://127.0.0.1:4398/products/crest-fixing-light-gauge-ds-650-ss-hwr) | Purlin/light-gauge applications and with/without-insulation DX/TD 650/665 HM CR/C3 model matrix | TD650.jpg |
| [Metal Cladding / Light Gauge DX 516 HO](http://127.0.0.1:4398/products/metal-cladding-light-gauge-connection-fixing-ds-516-ho) | Drilling capacity 1–6 mm; without-insulation DX 516 HO CR/C3 and with-insulation DX 520 HO CR/C3 | Fastener-Cladding-Valley-Fixing.jpg |
| [Crest Fixing Purlins DX 650 / 665 HM](http://127.0.0.1:4398/products/crest-fixing-purlins-ds-650-hwr) | Purlin/light-gauge applications and with/without-insulation DX/TD 650/665 HM CR/C3 model matrix | DX650.jpg |
| [Side Lap Fixing TD 520 HM](http://127.0.0.1:4398/products/side-lap-fixing-stitching-516-16t-bk-hwr) | Drilling capacity below 1 mm; TD 520 HM CR and TD 520 HM C3 | Fastener-Side-Lap-Fixing-Stitching.jpg |

[Original Light Gauge source](https://www.roofseal.com.my/product/crest-fixing-light-gauge-ds-650-ss-hwr/) confirms the application matrix. Preserve row/column relationships when restoring these tables; a flattened list of model codes would lose the selection guidance. The source matrices cover multiple models and must not be silently rewritten as specifications for just one model.

## Figma comparison

Deck762 contains the five description bullets shown in the retrieved Figma frame, both gallery images, Add to Quote, a working catalogue, category metadata, SKU Deck762, and four recommendations. No confirmed content section is missing from that example.

Figma contains copied labels: the Deck762 breadcrumb ends with FIORI AH-599, and two recommendation cards share the High Rib 30 title. The implemented page uses the correct product breadcrumb and distinct CMS recommendations (PU Deck762, Euro762, High Rib 30 and Clip720). These are source inconsistencies, not missing products. Euro762 exists publicly even though the roofing grid's exported labels repeat High Rib 30.

The reusable Figma template includes a catalogue link, SKU, a thumbnail gallery, and four recommendations. Outside Deck762, these depend on approved product data:

- Nine published products have no catalogue attachment. All nine also lacked a catalogue link in the imported original snapshot. These are potential content requests, not failed downloads or proven omitted files.
- Six published products have no related-product assignments, so their recommendation section is absent. This can be completed with editorial selections; a separate decision is needed on whether all products should always show four cards.
- Six published products have only one gallery image, matching the original snapshot. A second image could improve consistency with Figma, but no second image has been proved missing.
- Only Deck762 has an approved stored SKU; the other 37 SKU fields are empty. Do not invent SKUs from slugs or display names.
- All 38 specifications arrays are empty. Many dimensions, materials, capacities and ratings already appear in the 202 feature bullets and PDFs; this is a structured-data gap, not evidence that all specifications are absent from the public pages. Figma's Deck762 example itself uses bullets rather than a separate specification table.

## Published product checklist

Every row below passed route, stored-feature rendering, and gallery-count checks. PDF and related counts reflect current CMS content. A dash means absent, not a broken link. All structured specification arrays are empty. Additional technical source review remains necessary before changing any claims.

| ID | Product | Feature bullets | Gallery images | PDF | Related | SKU | Additional gap or review |
| --- | --- | ---: | ---: | --- | ---: | --- | --- |
| 1 | [IKO Cambridge](http://127.0.0.1:4398/products/iko-cambridge) | 4 | 1 | — | 0 | — | Catalogue not supplied in original import; Related selections absent |
| 2 | [Metal Gutter Fixing–DS 310 PH](http://127.0.0.1:4398/products/metal-gutter-fixing-ds-310-ph) | 4 | 1 | — | 4 | — | Catalogue not supplied in original import |
| 3 | [Everplast UPVC Gutter System](http://127.0.0.1:4398/products/everplast-upvc-gutter-system) | 6 | 3 | Yes | 1 | — | No additional confirmed omission |
| 4 | [Clip Fixing–DS 525 PH](http://127.0.0.1:4398/products/clip-fixing-ds-525-ph) | 4 | 1 | — | 4 | — | Missing More Information table and application illustration; Catalogue not supplied in original import |
| 5 | [C-Purlins or Steel Purlins](http://127.0.0.1:4398/products/c-purlins) | 3 | 3 | Yes | 1 | — | No additional confirmed omission |
| 6 | [SealPro Dry Fix](http://127.0.0.1:4398/products/sealpro-dry-fix) | 4 | 2 | Yes | 1 | — | Confirm SealPro II relationship before publishing candidate |
| 8 | [Hexagonal Galvanised Wire Netting](http://127.0.0.1:4398/products/hexagonal-galvanised-wire-netting) | 6 | 3 | Yes | 1 | — | No additional confirmed omission |
| 9 | [Crest Fixing (Light Gauge) – TD 650 / 665 HM](http://127.0.0.1:4398/products/crest-fixing-light-gauge-ds-650-ss-hwr) | 5 | 3 | Yes | 4 | — | Missing More Information table and application illustration |
| 10 | [Metal Cladding / Light Gauge Connection Fixing – DX 516 HO](http://127.0.0.1:4398/products/metal-cladding-light-gauge-connection-fixing-ds-516-ho) | 4 | 2 | Yes | 4 | — | Missing More Information table and application illustration |
| 11 | [Crest Fixing (Purlins) – DX 650 / 665 HM](http://127.0.0.1:4398/products/crest-fixing-purlins-ds-650-hwr) | 5 | 3 | Yes | 4 | — | Missing More Information table and application illustration |
| 12 | [Side Lap Fixing (Stitching) – TD 520 HM](http://127.0.0.1:4398/products/side-lap-fixing-stitching-516-16t-bk-hwr) | 4 | 1 | Yes | 4 | — | Missing More Information table and application illustration |
| 13 | [Multiwall Profiled Polycarbonate Sheet](http://127.0.0.1:4398/products/multiwall-profiled-polycarbonate-sheet-colour-selection) | 3 | 1 | — | 4 | — | Restored by explicit user approval for BugHerd 18; Catalogue not supplied in original import |
| 14 | [Leno Foil](http://127.0.0.1:4398/products/leno-series) | 4 | 2 | Yes | 4 | — | No additional confirmed omission |
| 15 | [BRC3315 Galvanised Welded Mesh](http://127.0.0.1:4398/products/brc3315-galvanised-welded-mesh) | 6 | 3 | Yes | 1 | — | No additional confirmed omission |
| 16 | [Rockwool Insulation](http://127.0.0.1:4398/products/rockwool-insulation) | 5 | 3 | Yes | 0 | — | Related selections absent |
| 17 | [Glasswool Insulation](http://127.0.0.1:4398/products/glasswool-insulation) | 5 | 2 | Yes | 0 | — | Legacy same-name Glasswool record; intentionally omitted from parent listing; Related selections absent |
| 18 | [Woven Foil](http://127.0.0.1:4398/products/woven-series) | 5 | 2 | Yes | 4 | — | No additional confirmed omission |
| 19 | [Premium Bubble Foil](http://127.0.0.1:4398/products/premium-bubble-series) | 4 | 2 | Yes | 4 | — | No additional confirmed omission |
| 20 | [Roofseal Euro762](http://127.0.0.1:4398/products/roofseal-euro762) | 5 | 2 | Yes | 4 | — | No additional confirmed omission |
| 21 | [Fire Retardant Foil Series](http://127.0.0.1:4398/products/fire-retardant-series) | 5 | 4 | — | 4 | — | Catalogue not supplied in original import |
| 22 | [Avantgarde Foil](http://127.0.0.1:4398/products/avantgarde) | 4 | 2 | Yes | 4 | — | No additional confirmed omission |
| 23 | [Solid Polycarbonate Sheet](http://127.0.0.1:4398/products/solid-polycarbonate-sheet-colour-selection) | 6 | 2 | — | 4 | — | Restored by explicit user approval for BugHerd 18; Catalogue not supplied in original import |
| 24 | [Roofseal Deck762](http://127.0.0.1:4398/products/roofseal-deck762) | 5 | 2 | Yes | 4 | Deck762 | SealDek 762 naming awaits approval; Figma example content complete |
| 25 | [Glasswool Insulation](http://127.0.0.1:4398/products/glasswool-insulation-2) | 5 | 2 | Yes | 0 | — | Clarify distinction from legacy Glasswool record; Related selections absent |
| 26 | [Roofseal Span](http://127.0.0.1:4398/products/roofseal-span) | 8 | 2 | Yes | 4 | — | No additional confirmed omission |
| 27 | [Fibreglass Reinforced Polyester (FRP) Roofing Sheet](http://127.0.0.1:4398/products/fibreglass-reinforced-polyester-frp-roofing-sheet) | 3 | 2 | — | 4 | — | Catalogue not supplied in original import |
| 28 | [Roofseal Clad](http://127.0.0.1:4398/products/roofseal-clad) | 7 | 2 | — | 4 | — | Catalogue not supplied in original import |
| 29 | [Roofseal High Rib 30](http://127.0.0.1:4398/products/roofseal-high-rib-30) | 6 | 2 | Yes | 4 | — | Confirm DEK PRO 740 HI RIB is distinct before publishing candidate |
| 30 | [Roofseal Clip720](http://127.0.0.1:4398/products/roofseal-clip720) | 5 | 2 | Yes | 4 | — | Clip720 / SealKlip 725 identity and cover-width conflict |
| 31 | [Roofseal Bitumen Waterproofing Membrane for Roof](http://127.0.0.1:4398/products/roofseal-bitufelt) | 7 | 1 | Yes | 1 | — | Confirm CT PROTEK relationship before publishing candidate |
| 32 | [Polycarbonate Roofing Sheets](http://127.0.0.1:4398/products/polycarbonate-roofing-sheets) | 5 | 2 | — | 4 | — | Catalogue not supplied in original import |
| 33 | [Aluminium Composite Panel (ACP) Sheet Awning Roof in Malaysia](http://127.0.0.1:4398/products/aluminium-composite-panel-acp) | 8 | 5 | Yes | 4 | — | No additional confirmed omission |
| 34 | [Fire-Rated Doors](http://127.0.0.1:4398/products/fire-rated-doors) | 5 | 2 | Yes | 0 | — | Related selections absent |
| 35 | [Fix-Fas™ Customisable Metal Rain Gutter System](http://127.0.0.1:4398/products/metal-gutter-system) | 7 | 2 | Yes | 2 | — | No additional confirmed omission |
| 36 | [Sealframe™ Customisable Metal Door Frames](http://127.0.0.1:4398/products/sealframe-customisable-metal-door-frames) | 9 | 2 | Yes | 0 | — | 18-page Drive PDF present; material options/profile structure require confirmation; Related selections absent |
| 37 | [Steel Roof Trusses System](http://127.0.0.1:4398/products/lightweight-steel-truss-system-malaysia) | 6 | 6 | Yes | 1 | — | No additional confirmed omission |
| 38 | [Fix-Fas™ Aluminium Flashing & Metal Roof Flashing](http://127.0.0.1:4398/products/flashing-capping-system) | 6 | 3 | Yes | 1 | — | No additional confirmed omission |
| 39 | [Roofseal Deck762 with PU Foam/PU Metal Roofing Sheet](http://127.0.0.1:4398/products/roofseal-deck762-with-pu-foammetal) | 9 | 3 | Yes | 4 | — | 18 mm / 20 mm PU source conflict; environmental copy also needs technical validation |

## Draft products and unresolved source decisions

All 19 draft product routes correctly return 404 anonymously. Strip Ceiling is intentionally retired and must not be counted as an unfinished addition. The remaining 18 records are review drafts created from Drive additions; they each contain a short provisional description but no approved feature bullets or structured specifications. Seventeen have no card or gallery image; Lightweight Steel Batten has one image. A draft linked to the additions PDF does not have a complete product specification sheet.

| Draft group | Count | Content still needed |
| --- | ---: | --- |
| Sealframe SF1–SF10 | 10 | Profile images/drawings; dimensions; materials; approved description; separate-product versus variant decision |
| Sealframe KD Frame | 1 | Approved model name, image, construction, dimensions and materials |
| Sealdor Steel Door DL and SL | 2 | Approved images, dimensions, hardware, leaf designations, category and verified fire-rating status; do not inherit generic door certification |
| Fascia Board | 1 | Confirm source spelling FACSIA; approved image, profile and specification |
| Lightweight Steel Batten | 1 | Description and specifications; standalone product versus truss component decision; image exists |
| DEK PRO 740 HI RIB | 1 | Confirm whether distinct from High Rib 30; approved name, image, dimensions and technical content |
| CT PROTEK | 1 | Confirm relation to CT MASTAR/Bitufelt; approved name, image and specification |
| SealPro II Dry Fix | 1 | Confirm replacement versus variant of SealPro Dry Fix; approved image and technical copy |
| Strip Ceiling | 1 | No action: intentionally unpublished by client instruction |

Do not publish these drafts solely to fill catalogue gaps. The existing review notes preserve the unresolved names and specifications.

## Recommended next work

1. Restore the five source-backed fastener tables and their five application illustrations. Add a CMS-backed More Information structure that preserves table columns and supports images, then render it within the existing product design. Current custom More Information copy for Sealframe and Polycarbonate is code-defined rather than CMS-authored.
2. Curate related products for the six pages with no assignments. Decide whether four recommendations are required everywhere or whether single-product categories may omit the section.
3. Request the nine absent catalogues and any desired extra gallery images; confirm whether the products actually have these materials.
4. Resolve the 18 draft records and the documented naming/specification conflicts with Roofseal before publication. Product certification, warranty and environmental claims remain source claims, not independently validated conclusions.
5. Populate SKUs and structured technical fields only from approved values. Preserve the already approved removals/restorations and existing URLs.
