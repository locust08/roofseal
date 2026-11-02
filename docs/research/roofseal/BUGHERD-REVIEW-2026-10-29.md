# Roofseal BugHerd feedback review

Reviewed 29 October 2026. Project: [Roofseal](https://www.bugherd.com/projects/548179/kanban). All 34 visible tasks are in Feedback; task numbers run from 1 to 35 with no visible #23. Every task's details, public comments, attachments and target were read. No task has a follow-up public comment.

The feedback is largely actionable. The principal conflict is #18: its screenshot includes two products previously approved for removal. Other clarification concerns are the News/Blogs split, careers content and application handling, the exact Intergo quote reference, the promised updated Figma file, and operational facts for contact/privacy pages. This review changes neither site code nor BugHerd tasks.

## Decisions and clarifications

| Tasks | Verified context | Clarification or next decision |
| --- | --- | --- |
| [#18](https://www.bugherd.com/projects/548179/tasks/18) | Skylights currently contains ACP, Polycarbonate Roofing Sheets and FRP. The task's attachment also shows Solid Polycarbonate Sheet and Multiwall Profiled Polycarbonate Sheet. Those are the two skylight products explicitly approved for unpublishing in the earlier Drive reconciliation. | Does this feedback intentionally reverse the approved removals? Keep them unpublished unless that reversal is explicit. This is a conflict, not an import failure. |
| [#26](https://www.bugherd.com/projects/548179/tasks/26), [#27](https://www.bugherd.com/projects/548179/tasks/27) | Resources uses query filters. Both footer News & Events and Blogs point to the same article filter. | Confirm whether these need separate content categories, and which existing/new items belong to each. The new page/dropdown structure itself is clear. |
| [#32](https://www.bugherd.com/projects/548179/tasks/32) | Career is currently an email link, not a jobs page. The task supplies the requested sections but no approved vacancies, job descriptions, benefits copy or application destination. | Supply actual vacancies and benefits, the recipient/owner of applications and the intended CV storage/retention arrangement. Do not invent active jobs. Resume upload requires backend validation and private storage/delivery as well as frontend work. |
| [#35](https://www.bugherd.com/projects/548179/tasks/35) | The attachment identifies ten product hotspots and Learn More controls. The live building currently exposes generic marker buttons; selected product controls are placeholders. The task says an updated Figma file will be passed again, but includes no new file link. | Confirm the latest Figma file/version and destination mapping for the ten hotspots. The screenshot is enough to establish the intended concept, but not every exact product-versus-category destination. |
| [#2](https://www.bugherd.com/projects/548179/tasks/2) | The attached quote-field list is complete and readable. The site currently uses a drawer. The task refers to an Intergo Furniture layout without a URL. A public search found the legacy Intergo site, not an unambiguous quotation-layout reference. | Provide the exact Intergo quote page or a screenshot if matching that particular layout matters. This does not block defining the form fields or creating /quote-list. |
| [#22](https://www.bugherd.com/projects/548179/tasks/22) | The legal buttons currently show prototype notices. The task explicitly permits initial draft content for client review. | Drafting can proceed. Before publishing final policy text, confirm the business/privacy contact and actual enquiry, application, email/Sheets, analytics and retention practices. Client review is still required; do not describe unconfigured services as active. |
| [#1](https://www.bugherd.com/projects/548179/tasks/1) | The attachment defines the contact fields and enquiry-type options; Company Name is required. Current form marks Company optional and lacks enquiry type. The live footer lists Sunday 8.30am–12.30pm and weekdays ending 5pm; the original site's footer lists Saturday and weekdays ending 5.30pm. | Confirm approved opening hours before carrying them into the new contact page. The requested /contact-us route, contact details, form and map are otherwise clear. |

These are source/business questions, not requests to choose implementation details. The attachments already resolve the full homepage/About copy (#5/#7), mobile Core Values arrangement (#8), form fields (#1/#2), and Social/Governance copy (#24/#25).

## Task by task verification

“Clear” means sufficient direction to implement, not already fixed.

| Task | Finding | Disposition |
| --- | --- | --- |
| [#1](https://www.bugherd.com/projects/548179/tasks/1) | Contact Us opens a drawer. Current form lacks enquiry type and treats company as optional. Attached fields and consent copy are explicit. | Clear page/form change; confirm opening hours. |
| [#2](https://www.bugherd.com/projects/548179/tasks/2) | Quote List opens a drawer, including when populated. State/location, project type, project location and estimated requirements are absent. Attached required/optional fields are explicit. | Clear route/form change; exact Intergo layout reference needed for faithful matching. |
| [#3](https://www.bugherd.com/projects/548179/tasks/3) | At 1135px width the Roofseal brand description overflows the bottom of the card. | Reproduced. Fit content or make overflow accessible; the suggested scrolling treatment is an implementation option. |
| [#4](https://www.bugherd.com/projects/548179/tasks/4) | Portfolio links to the homepage anchor. The project spreadsheet contains 12 Metal Roof and 4 Metal Door & Frame entries. The live selected Metal Roof tab displays Adelia, Idaman Abadi and Pavilion, which the spreadsheet classifies as Door & Frame. | Clear: create two category pages/dropdown and correct categorization. No need to request the spreadsheet again. |
| [#5](https://www.bugherd.com/projects/548179/tasks/5) | Homepage has two introductory paragraphs and Learn More; attachment contains substantially more copy and Learn About Us. | Clear. Full copy is already attached. |
| [#6](https://www.bugherd.com/projects/548179/tasks/6) | About collage has a visible responsive crop/stretch problem at the reported tablet width. CSS uses a large absolutely positioned image crop. | Clear responsive correction. |
| [#7](https://www.bugherd.com/projects/548179/tasks/7) | About Read More adds only one short repetitive paragraph; attachment contains the complete long copy. | Clear. Do not request copy already in the attachment. |
| [#8](https://www.bugherd.com/projects/548179/tasks/8) | Core Values mobile composition differs from the supplied reference, including background and card arrangement. | Clear reference-led responsive correction. |
| [#9](https://www.bugherd.com/projects/548179/tasks/9) | At 644px, the team overlay is off to the right rather than centered as requested. | Clear responsive correction. |
| [#10](https://www.bugherd.com/projects/548179/tasks/10) | Insulation has introductory copy and cards, but lacks the lower explanatory section shown in the attachment and original page. | Clear content restoration. |
| [#11](https://www.bugherd.com/projects/548179/tasks/11) | Glasswool category ends after the product card and CTA; the requested additional lower content is absent. | Clear content restoration from the supplied original-page reference. |
| [#12](https://www.bugherd.com/projects/548179/tasks/12) | Rockwool category similarly lacks the referenced lower content. | Clear content restoration. |
| [#13](https://www.bugherd.com/projects/548179/tasks/13) | Aluminium Foil category similarly lacks the referenced lower content. | Clear content restoration. |
| [#14](https://www.bugherd.com/projects/548179/tasks/14) | An extra standalone Glasswool Insulation product card appears below the four Insulation category cards. | Clear: remove this unintended parent-page placement; retain the product and its child category. No authorization to unpublish the product. |
| [#15](https://www.bugherd.com/projects/548179/tasks/15) | Insulation categories render three across, with the fourth wrapping, at desktop width. | Clear four-column desktop change. |
| [#16](https://www.bugherd.com/projects/548179/tasks/16) | Gutter & Roof Component uses the same three-column category layout. | Clear four-column desktop change. |
| [#17](https://www.bugherd.com/projects/548179/tasks/17) | Gutter System has intro/products but lacks the referenced lower content. | Clear content restoration. |
| [#18](https://www.bugherd.com/projects/548179/tasks/18) | Three retained skylight products are present; the two absent items in the screenshot match previously retired products. | Clarify conflict before republishing. |
| [#19](https://www.bugherd.com/projects/548179/tasks/19) | Sealframe product bullets and catalogue exist; the lower More Information section in the attachment is absent. | Clear content restoration. Preserve the newer approved Drive PDF; do not revert its catalogue as part of copying old-site text. |
| [#20](https://www.bugherd.com/projects/548179/tasks/20) | Polycarbonate product bullets exist; the attached lower More Information section is absent. | Clear content restoration for the retained PC roofing product. |
| [#21](https://www.bugherd.com/projects/548179/tasks/21) | Fire-Rated Door category lacks the additional referenced lower content. | Clear content restoration. |
| [#22](https://www.bugherd.com/projects/548179/tasks/22) | Legal footer buttons are prototype notices. | Draft pages can proceed; operational facts and client review needed before final publication. |
| [#24](https://www.bugherd.com/projects/548179/tasks/24) | Social panel contains its title only. Four requested bullets are supplied. | Clear. Correct the obvious truncated word “improvemen” to “improvement.” |
| [#25](https://www.bugherd.com/projects/548179/tasks/25) | Governance panel contains its title only. Four requested bullets are supplied. | Clear. |
| [#26](https://www.bugherd.com/projects/548179/tasks/26) | Resource types are filters on one Resources page. | Clear separate-page structure; clarify News/Blogs classification jointly with #27. |
| [#27](https://www.bugherd.com/projects/548179/tasks/27) | Header Resources is a plain link with an arrow, without the requested submenu. Footer News and Blogs share one destination. | Clear dropdown; clarify content separation. |
| [#28](https://www.bugherd.com/projects/548179/tasks/28) | Facebook control is a placeholder button; supplied destination is explicit. | Clear link change. |
| [#29](https://www.bugherd.com/projects/548179/tasks/29) | LinkedIn control is a placeholder button; supplied destination is explicit. | Clear link change. |
| [#30](https://www.bugherd.com/projects/548179/tasks/30) | BlueScope currently uses an article-style /resources/bluescope-materials page. Much of the original copy and coating/warranty table is already present; the page lacks the requested banner and vertical tabs. | Clear restructure to /bluescope-materials and redirect the old URL. “Different content” is not a reason to discard existing matching copy. |
| [#31](https://www.bugherd.com/projects/548179/tasks/31) | Gallery filter/page remains visible and lists imported galleries. | Clear removal of the public Gallery page/navigation. Preserve media needed by other pages. Apply this explicit removal when interpreting #26. |
| [#32](https://www.bugherd.com/projects/548179/tasks/32) | Career is mailto, with no jobs/application page. | Structure is clear; approved vacancies, benefits and application handling are missing. |
| [#33](https://www.bugherd.com/projects/548179/tasks/33) | Catalogue filter has four columns and a generic Resources heading/description, without its own banner. | Clear five-column desktop catalogue page and dedicated heading/intro/banner. Coordinate with #26. |
| [#34](https://www.bugherd.com/projects/548179/tasks/34) | Homepage manufacturing-facility slot is an image. Supplied Drive file is accessible metadata-wise: Roofseal Video(1).mp4, about 19MB. | Clear video replacement. Playback/transcoding is not yet verified; use accessible controls and sensible muted playback defaults. |
| [#35](https://www.bugherd.com/projects/548179/tasks/35) | Building has ten generic markers and placeholder product controls; supplied image labels the intended ten categories/products. | Await/confirm updated Figma and exact destinations. |

## Verification steps and evidence

1. Homepage and navigation — changes outstanding: Contact and Quote are drawers; Portfolio and Resources are plain links; manufacturing slot is an image.
2. Contact and quote — changes outstanding: both drawers reproduced; populated quote form inspected without submitting. Temporary quote selection removed.
3. Brand cards — overflow reproduced at 1135 × 786.
4. About page — incomplete expanded copy and empty Social/Governance panels confirmed; responsive captures taken at 1028, 846 and 644px.
5. Category pages — eight named category pages inspected for the lower content, duplicate placement, retained Skylights products and desktop card wrapping.
6. Product pages — Sealframe and PC roofing inspected; existing descriptions do not replace the missing lower sections.
7. Resources — overview, Catalogues, Galleries and BlueScope inspected; page-structure requests remain outstanding.
8. Sources — all BugHerd attachments/comments checked; original website references consulted; project spreadsheet and video metadata accessible; no newly supplied Figma link in #35.

Current screenshots and DOM captures: `temp/bugherd-review-2026-10-29/`. Full task snapshot: `temp/bugherd-2026-10-29-tasks.json`. Screenshots were saved from the current in-app browser; representative captures were opened and inspected. Other content checks use the current DOM and task references. Viewport overrides were reset.

![Current Contact Us drawer](/Users/digitalbee/Documents/ChatGPT/Roofseal/temp/bugherd-review-2026-10-29/02-contact.jpg)

![Reproduced brand-card overflow](/Users/digitalbee/Documents/ChatGPT/Roofseal/temp/bugherd-review-2026-10-29/04-brands-1135.jpg)

## Source links and limits

- [BugHerd project](https://www.bugherd.com/projects/548179/kanban) and individual task links above.
- [Project categorization spreadsheet](https://docs.google.com/spreadsheets/d/1qn3tkGQwErIWHmTTkby8RxppGfXdB-it7nKB4rqjKBg/edit?gid=1556770785).
- [Replacement video](https://drive.google.com/file/d/1UhsCWWCapeSkFYtTSKii4UTnoZMeJtwt/view).
- [Original Insulation section](https://www.roofseal.com.my/product-category/insulation/), [original Sealframe More Information](https://www.roofseal.com.my/product/sealframe-customisable-metal-door-frames/), [original PC roofing More Information](https://www.roofseal.com.my/product/polycarbonate-roofing-sheets/), [original BlueScope materials](https://www.roofseal.com.my/materials-from-bluescope-malaysia/).
- [Prior approved Drive reconciliation](./DRIVE-PRODUCT-COMPARISON.md) documents the two retired Skylights products.
- Responsive behavior was checked in the current browser at the reported widths; this is not a claim of identical behavior on the reporter's Windows/Android Chrome versions.
- No form was submitted, no policy was approved, no job listing was invented, and no BugHerd comment/status was changed.



## Follow-up: #11–#20 local implementation

The user explicitly approved restoring both Solid Polycarbonate Sheet and Multiwall Profiled Polycarbonate Sheet for #18 on 29 October, superseding the earlier Drive removal instruction for those two records only. Both are now published locally with original IDs/media/specifications and an editorial approval note; other pending drafts remain private. #11–#20 are implemented and verified on localhost, pending visual confirmation. The newer Sealframe Drive PDF remains unchanged. Cloudflare and BugHerd statuses have not been changed for this batch.
