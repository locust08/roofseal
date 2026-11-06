# BugHerd #22 — legal page drafts

## Designer revision — 6 November 2026

The designer requested removing the second language if it was not on the original website. The original homepage/footer has no policy links, and targeted searches found no indexed Roofseal policy pages. The bilingual text was generated for #22 from the implementation and general privacy-notice guidance; it was never extracted from Roofseal's existing website. The local review pages now contain English only, without a language selector or Malay draft notice. The English policy text remains generated review copy, with its draft status and noindex metadata retained. This is a presentation revision, not client approval of the policy wording. The original provenance and drafting history follow below.

Generated English and Bahasa Malaysia drafts for client review on localhost only. These are not approved Roofseal policies or a statement of legal compliance. Both routes carry visible draft notices and `robots: noindex, nofollow`; there is no approved effective date. Nothing was deployed, sent to BugHerd or written to CMS data.

Routes: `/terms-and-conditions` and `/privacy-policy`. They reuse the shared Breadcrumbs, Banner (existing asset 28352:1837) and Cta with a scoped reading layout.

## Evidence and provenance

- Existing `EnquiryForm.tsx` and `src/enquiries/submission.ts`: name, company, email, phone, message, contact/quote-specific project fields, product selections, stored consent wording/time and submission reference. The keyed rate-limit hash uses a trusted IP header when configured, otherwise a shared fallback. No claim that a hash makes all information anonymous.
- Existing `site-shell.tsx`: quote selections persist in browser localStorage (`roofseal-quote`). Existing `EnquiryPage.tsx`: verified company name and enquiry@roofseal.com.my contact, Google Maps embed. Existing Cloudflare setup and BugHerd integration inform provider mentions.
- `src/enquiries/delivery.ts` gates email and Sheets delivery behind environment flags and credentials. Parent task confirmed these integrations are disabled pending setup. Do not turn them on as part of this work.
- Official Malaysian Personal Data Protection Department [privacy notice quick guide](https://www.pdp.gov.my/ppdpv1/wp-content/uploads/2025/01/A-Quick-Guide-to-PRIVACY-NOTICE.pdf) and [FAQ](https://www.pdp.gov.my/en/faq/) consulted 29 October 2026. FAQ supports access, correction and withdrawal requests and notices in English and the national language. Original draft text is tailored to inspected code; no blanket claim of PDPA compliance.

## Client review before publication

1. Confirm the responsible legal entity, address, privacy contact and whether any DPO appointment/contact is applicable. No DPO identity was invented.
2. Approve both language versions, consistency and any wider offline/customer processing scope.
3. Confirm actual access controls, recipient classes, hosting/provider processing locations, international transfers, feedback-tool data/cookies, retention and deletion schedule, request/identity-check process and any applicable statutory exceptions. The draft openly leaves retention unconfirmed rather than inventing a period.
4. Confirm any analytics, marketing or other collection before adding claims. Recheck email and Sheets status and update the notice before enabling them.
5. Approve commercial terms independently (quotation acceptance, pricing, delivery, payment, returns, warranties and any liability/governing-law clauses). The website draft creates no invented sales policy.
6. Obtain appropriate client/legal review, approve a publication/effective date, and deliberately remove draft notices and noindex metadata only when approved for release.
