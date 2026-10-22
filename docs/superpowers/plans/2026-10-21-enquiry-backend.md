# Enquiry and quote submission backend

User-authorized scope: implement the Notion brief's database-backed contact/quote enquiries, preserve the existing visual design, and prepare Google Sheet and email delivery for deployment. No live messages, external Sheet writes, deployment, or credential provisioning are part of local verification.

## Design and acceptance

- A same-origin JSON POST validates contact details, explicit enquiry consent and published product IDs. The server snapshots product names; client-provided names or delivery states are never trusted.
- Persist enquiries and both delivery states together in Payload/SQLite before acknowledging success. Admins alone can read personal information. Public collection writes remain forbidden.
- Client UUID plus a normalized payload hash makes retries safe, including concurrent requests. Enforce body limits, a honeypot and a durable per-proxy-address rate limit; only an explicitly configured trusted proxy header identifies addresses.
- Preserve the quote drawer and its visual language. Add the required contact fields beneath its product list and reuse that form in a contact enquiry drawer. Successful submission clears the quote list; failures preserve input and selection.
- A scheduled CLI worker claims pending deliveries atomically and sends to Resend and Google Sheets independently. Missing configuration leaves work pending. Uncertain outcomes and interrupted claims require administrator review instead of blind duplicate delivery. Provider errors never expose customer data or credentials to visitors/logs.
- Google Sheets uses service-account authorization and RAW append values. Resend uses fixed configured recipients, plain text, Reply-To and an idempotency key. Both adapters are disabled by default.

## Implementation sequence

1. Write failing tests for persistence, idempotency, validation, product snapshots, private access and abuse limits against an isolated database.
2. Add collections, submission service/route and generated Payload types. Run those tests.
3. Write delivery failure/concurrency tests, then add the adapters, worker and safe review/retry procedure.
4. Connect the existing quote drawer and contact CTAs; check browser success, failure, keyboard focus and mobile layout.
5. Document environment variables, schema deployment, Sheet columns, scheduler and recovery. Run lint/typecheck/build and the complete tests.

## Progress

- Planning: complete. Existing local CMS changes remain in this checkout; no stash, reset or branch switch.
- Integration selection: Resend HTTPS email and Google Sheets service account. Deployment operators supply credentials/destination; outbound delivery stays disabled locally.
- Persistence, validation, abuse controls, product snapshots, private collection access and durable delivery worker: implemented.
- Review: fixed draft/reference loss and obsolete callbacks; pending forms now keep focus within the drawer and prevent list/navigation changes.
- Browser: desktop quote/contact success, invalid-input retention, mobile form/submit controls and Escape exit verified. A local proxy saved an enquiry then dropped its response; closing/reopening and retrying produced HTTP 201 then 200 for the same UUID, with one saved record. Proxy evidence and screenshots are in ignored `temp/enquiry-qa/` and `temp/enquiry-proxy-results.jsonl`.
- Operational verification: disabled-provider worker returned both configuration flags false and zero sends/failures/reviews. SQLite integrity check passed, no foreign-key issues; 57 products (36 published) and 221 media remain intact. Four local QA enquiry records were backed up privately then removed.
- Ruling: public submissions use `/api/submit-enquiry`, leaving `/api/enquiries` to Payload's private collection API. An initial static route at the collection path shadowed GET; the full HTTP test detected it.
- Ruling: explicit type generation and Node's exit-after-completed-tests option keep the test compiler's background service from retaining finished fixture processes; no assertions are skipped.
- Complete: final `npm run check` passed with 63 existing image warnings and zero errors. Full `npm test` passed 33/33 with zero skipped tests (`temp/enquiry-tests-final-pass.log`), including the public submission/private CMS API regression. Final database integrity is OK, 57 products/36 published remain, and the enquiry queue is empty after test cleanup. The production build is running locally on port 3000; no commit, push or deployment was performed.
