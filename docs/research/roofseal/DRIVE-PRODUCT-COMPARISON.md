# Roofseal Drive materials and imported products comparison

Compared on 21 October 2026 against the running local Payload API: 39 published products and 42 published resources. The website import preserves the old site's catalogue, but does not yet reflect all client-requested removals, additions, variants and supporting materials.

**Approved follow-up applied on 21 October:** the three products below are now unpublished, the ceiling category/navigation and its dedicated resources are hidden, and both Sealframe attachment references use the 18-page Drive pack. Eighteen private review drafts were added: 15 missing entries/profile records plus three candidate aliases. Six existing records carry uncertainty notes without changes to technical claims. Current product totals are 36 published and 21 drafts. The remaining sections preserve the comparison baseline and approval questions; see `CMS-INTEGRATION.md` for the repeatable update procedure.

## Decisions supported by explicit client notes

The [26 August website update](https://docs.google.com/document/d/1XmzH0ngkvNHfxBzDYXOcwf9wWUsSMi_PoWBiDUPLEXU/edit) and [Website Changes document](https://docs.google.com/document/d/1sCHN07urPLZxKh70L4ClyF9OZaIJFVWBmZHDG8h3tPQ/edit), last modified 9 September, explicitly remove metal ceiling/louvres and PC solid/hollow sheets. They retain FRP roofing, PC roofing and ACP.

| Current CMS product | ID | Required reconciliation |
| --- | ---: | --- |
| Strip Ceiling (`strip-ceiling`) | 7 | Remove from public listings; remove Metal Ceiling & Louvres navigation and its category as appropriate. |
| Solid Polycarbonate Sheet (`solid-polycarbonate-sheet-colour-selection`) | 23 | Remove from public Skylights listings. |
| Multiwall Profiled Polycarbonate Sheet (`multiwall-profiled-polycarbonate-sheet-colour-selection`) | 13 | Remove from public Skylights listings. Its imported description explicitly identifies it as hollow/twinwall, matching the removal instruction. |

Keep FRP (ID 27), Polycarbonate Roofing Sheets (ID 32), and ACP (ID 33). The instruction to remove hollow/solid sheet does not mean removing all polycarbonate roofing.

These products remain published in the current CMS. Unpublishing must use the actual CMS unpublish operation; saving a draft revision alone preserves the public published version. Update the seed scope and navigation together, and plan redirects for retired URLs. Retain source provenance instead of deleting the only audit trail.

The earlier April sitemap and May SEO worksheet still include ceiling and five skylight products. The later explicit removal instructions supersede that earlier scope; retaining an old SEO target is not evidence that the product should remain publicly listed.

## Additions and variants requiring reconciliation

[ADD (1).pdf](https://drive.google.com/file/d/19Rn6fkA84XDuf7Csi99oi5eKv-dTDNmA/view), modified 3 September 2026, contains 21 numbered illustrations over three pages. These are not 21 automatically distinct new products: some are frame profiles, some match existing products, and two illustrations have no model label.

| Supplied label | Existing CMS coverage | Gap and recommended treatment |
| --- | --- | --- |
| SF1–SF10 | General Sealframe product, ID 36; the attached legacy PDF already covers profile drawings | Missing structured profile choices and corresponding product imagery. Model as variants or individual products only after deciding the intended catalogue structure. Do not describe all ten as entirely absent from the existing PDF. |
| KD FRAME | General Sealframe product only | No explicit KD Frame record or variant. Add verified descriptive/specification content; the additions sheet supplies a label and image, not a full technical specification. |
| SEALDOR STEEL DOOR – DL | Only generic Fire-Rated Doors, ID 34 | No named Sealdor double-leaf steel-door entry. Confirm product description, dimensions and whether it has a verified fire rating. Do not reuse the generic fire-door certification by assumption. |
| SEALDOR STEEL DOOR – SL | Only generic Fire-Rated Doors, ID 34 | No named Sealdor single-leaf steel-door entry; same verification requirements. |
| FACSIA BOARD (source spelling) | Other roofing profiles mention fascia applications | No dedicated Fascia Board entry. Confirm intended product/profile and spelling before creating it. |
| DEK PRO 740 HI RIB | Roofseal High Rib 30, ID 29, is an existing 740 mm profile | No exact model name. Potential rename or related model; do not duplicate or rename solely from the sheet. |
| SEALPRO II DRY FIX | SealPro Dry Fix, ID 6 | Series-II name/packaging differs. Confirm whether it supersedes the existing product or is an additional variant. |
| CT PROTEK | Bitumen Waterproofing Membrane, ID 31, links to a CT MASTAR PDF | No exact CT PROTEK entry. Confirm whether it replaces CT MASTAR/Bitufelt or is a different membrane. |
| HEX 5072 | Hexagonal Galvanised Wire Netting, ID 8 | Likely a code/size mapping for the existing product; verify exact code instead of creating a duplicate. |
| BRC 3315 | BRC3315 Galvanised Welded Mesh, ID 15 | Existing product match; reconcile the supplied image and label. |

## Product photos and naming differences

The [Product Photos folder](https://drive.google.com/drive/folders/1gzJQKnhVZIS1lXE9BoqyUKLCGU3knmPk) contains 17 image files, uploaded on 12 October 2026. Some retain original modification dates from 2020. Upload date alone does not prove that every image or product is new.

| Drive asset | Current coverage | Reconciliation |
| --- | --- | --- |
| SealDek 762 | Roofseal Deck762, ID 24 | Confirm display-name change; match the supplied image to the existing product. |
| SealKlip 725 | Roofseal Clip720, ID 30 | Important unresolved model difference: 725 and 720 must not be treated as equivalent dimensions without confirmation. |
| C-Truss | Steel Roof Trusses System, ID 37 | Add explicit component/variant presentation if required; C-Truss is not automatically the same product as C-Purlins, ID 5. |
| Lightweight Steel Batten | General truss-system record, ID 37 | No independently named batten record/variant. The older SEO worksheet mentions battens and C channel within the truss system, so this may be component detail rather than an entirely new system. |
| Custom Flashing Capping.jpg | Fix-Fas Flashing, ID 38 | Existing product; candidate client-supplied image. |
| Custom Metal Gutter.jpg | Fix-Fas Metal Gutter, ID 35 | Existing product; candidate client-supplied image. |
| Avantgarde no bg.png | Avantgarde Foil, ID 22 | Existing product. |
| BubbleFoil.jpg | Premium Bubble Foil, ID 19 | Existing product. |
| Glass wool.jpg | Glasswool IDs 17 and 25 | A single supplied image does not resolve the two same-named legacy product records. Confirm their intended distinction. |
| Gutter-UPVC.jpg / Gutter-UPVC Accessories.jpg | Everplast UPVC Gutter System, ID 3 | Existing system; accessories may need their own gallery or component choices. |
| Leno Foil.jpg | Leno Foil, ID 14 | Existing product. |
| Rockwool-Roll.jpg / Rockwool-slab.jpg | Rockwool Insulation, ID 16 | Roll/slab are not modeled as separate choices in the current record. |
| Skylights-FRP.jpg / Skylights-PC.jpg | FRP, ID 27 / Polycarbonate Roofing Sheets, ID 32 | Existing retained products; do not map PC roofing to the retired solid/hollow records. |
| WovenFoil.jpg | Woven Foil, ID 18 | Existing product. |

The initial import did not ingest Drive-origin files. Some supplied images may already appear through website/Figma copies; binary/perceptual equality of the 17 photographs has not been established, so they should not all be counted as missing images.

## Conflicting and incomplete specifications

The supplied [METAL ROOFING CATALOG.pdf](https://drive.google.com/file/d/1CmX-9JXC2qvcVHUqDNlaQ8Z6mQMtjIcQ/view) is 14 pages. Although uploaded in 2026, its final page states **VER: OCTOBER 2023**.

| Topic | Current CMS | Supplied document | Required decision |
| --- | --- | --- | --- |
| Deck762 PU thickness | ID 39: 18 mm, thermal resistance 1.06 m²K/W | PDF pages 6–7: 20 mm PU; thermal resistance 1.06 m²K/W at 20 mm | Confirm the current construction and rating with Roofseal. This is a source conflict, not proof that 20 mm is the latest value. |
| Concealed fixing roof model | Clip720 with 720 mm cover | 2023 catalogue: Clip Lock, with 700/720 mm cover alternatives; October photo filename: SealKlip 725 | Confirm current models, cover widths, naming and which PDF belongs to each. |
| Frame materials | ID 36 lists EG, GI and ZINCALUME | Sealframe catalogue PDF page 2 additionally lists Galvaneal (GA) | Verify availability and complete material options. |
| Technical tables | All 39 CMS `specifications` arrays are empty | Roofing catalogue has rib heights, widths, pitches, steel grades, tolerances, fastening and support tables | Information exists in PDFs but is not structured on product pages. Transcribe only validated values, preserving units, conditions and disclaimers. |

The broad material coating/warranty summaries in the roofing catalogue support the existing COLORBOND, ZINCALUME and PRIMAMAJU resource topics. The catalogue explicitly makes warranties conditional; it does not establish that website warranty terms remain current in 2026.

## Supporting resources not yet ingested from Drive

| Material | Current import | Gap |
| --- | --- | --- |
| [Sealframe Catalogue w Project Ref & Certs.pdf](https://drive.google.com/file/d/10pJnMy6QDuI991x6FqV4RIUsdhcymCpn/view) | Legacy `Sealframe-Catalogue-compressed.pdf`, 4 pages | Drive copy is 18 pages with the core frame content plus project references and certificates. Its project-reference cover states May 2026, and included certification pages have 2026 issue dates. Reconcile and attach this expanded version rather than assuming the old four-page PDF is complete. |
| [Metal Door Frame Project Ref.pdf](https://drive.google.com/file/d/18kd5xv8OkUmy-RySSYP2_SwiqxlX398d/view) | No corresponding Drive resource | Five-page reference pack, last modified 19 October 2026; available for product-related references/resources. |
| Combined roofing catalogue | Individual product PDFs imported from the website | No Drive combined-catalogue resource. Keep its October 2023 edition date visible if ingested. |
| Additions sheet | Not represented as a Drive resource or complete structured catalogue update | Use for the model/image reconciliation above; it is not a full specification sheet. |
| Production videos | Media currently supports images/PDFs; no product-video field | Frame videos and additional Truss/Gutter/Flashing video folders are present. Video storage, validation and frontend playback require an explicit integration change. The Replacement Video folder was empty when listed. |

The imported resource API has 42 records, including 25 catalogue resources, and no Drive-origin source URLs. File checks establish that the existing Sealframe attachment is 4 pages / 1,630,940 bytes, while the Drive version is 18 pages / 2,186,981 bytes with a different SHA-256 checksum.

## Source precedence and next actions

1. Apply the explicit client removal scope to products, category navigation and the import snapshot. Coordinate redirects with the SEO migration.
2. Review the additions sheet and October photos with Roofseal to approve exact product names, variant structure and model equivalences. Prioritize Sealdor SL/DL, KD frames, fascia board, batten and the DEK PRO/SealKlip name conflicts.
3. Reconcile the expanded Sealframe attachment and supporting resource packs. Do not infer product fire ratings from an unrelated generic door record or from frame certificates.
4. Resolve the PU thickness and roof-profile conflicts before changing technical claims. The older combined catalogue should not automatically override newer approved specifications.
5. Map approved photographs to CMS records, then populate verified specifications/variants while keeping the approved frontend design.

The [CBF](https://drive.google.com/file/d/19ep3HCc4XYcA4TSo3aKmdct504hgvj9O/view) supports the two core businesses but is not a detailed product master. The [SEO worksheet](https://docs.google.com/spreadsheets/d/1dbPGiiaxyUAK-15TK5iIe778-elQ5tLAGW_8BGiMLG8/edit) is an older keyword/URL reference; it includes template/example rows and access-account sections, which are excluded from this comparison and must not be copied into public content. Neither file establishes approval for replacing a product model or changing a technical specification.

This comparison does not change product publication state or overwrite CMS content. Local PDF copies, page renders/OCR and bounded API evidence are under ignored `temp/drive-comparison-2026-10-21/`. The 497 MB Figma backup, editable Illustrator duplicate, commercial order form and unrelated account-access rows were not used as technical product authorities.
