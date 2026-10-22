# Enquiry and quote submissions

Implements the [Notion briefing](https://app.notion.com/p/3fb4fcc4f701806abb2ce580dc132465): database storage first, Google Sheet and inbox on deployment. CRM is conditional on the client adopting one.

## Local operation

Contact Us buttons open an enquiry drawer. The quote drawer retains its product list and now has contact fields beneath it. Both POST to `/api/submit-enquiry`. The displayed email address remains a mail link. Newsletter signup remains a separate preview feature.

Name, email, phone, message and explicit consent are required; company is optional. Quotes require 1–25 distinct published product IDs. The server snapshots actual product names/slugs and rejects removed/draft products. Quantity is optional in the brief and is not added here.

Success means the enquiry and delivery queue **were saved to SQLite**, not that an email was delivered. The visitor receives only a UUID reference. Retrying unchanged data reuses the same UUID; changed data with an existing UUID returns 409. Failures preserve the form and quote selection. Successful quote submission clears the selection.

Only administrators can read `/admin/collections/enquiries`. Editors and anonymous visitors cannot read personal data. Direct public collection writes are disabled. Admins may update handling status (`new`, `in-progress`, `closed`) and internal notes; snapshots/delivery fields are read-only.

The API requires same-origin JSON, caps streamed bodies at 16 KiB, validates fields and uses a hidden honeypot. An atomic SQLite UPSERT allows five new submissions per address per fixed 15-minute window across processes. Only the configured `ENQUIRY_IP_HEADER` is trusted. The deployment proxy must strip/overwrite that header with a single visitor address. If unset, visitors share the limit. Rate buckets store HMACs, not raw IPs, and the worker removes buckets older than seven days. Saved submissions remain retryable after the limit. Configure edge request limits before launch.

## Email setup

Uses the [Resend API](https://resend.com/docs/api-reference/emails/send-email). Set server-only secrets from `.env.example`:

- `ENQUIRY_EMAIL_ENABLED=true`
- `RESEND_API_KEY`
- `ENQUIRY_EMAIL_FROM`: verified sender/domain
- `ENQUIRY_EMAIL_TO`: fixed inbox or comma-separated inboxes

The visitor is Reply-To only. Notifications are plain text and include the reference/products. Stable idempotency keys are used; Resend [retains keys for 24 hours](https://resend.com/docs/dashboard/emails/idempotency-keys). Enquiry email is separate from Payload password-reset email, which still needs its own adapter.

## Google Sheet setup

Uses Google's official authentication library with a [service account](https://developers.google.com/identity/protocols/oauth2/service-account).

1. Enable Google Sheets API and provision a dedicated service account.
2. Have the client select/create the destination spreadsheet and share it with the service account as Editor. No domain-wide delegation is needed.
3. Create an `Enquiries` tab with A1:K1 headers in this order: **Reference, Received at (UTC), Type, Name, Email, Phone, Company, Message, Products, Consent at (UTC), Consent text**.
4. Set `ENQUIRY_SHEETS_ENABLED=true`, `GOOGLE_SHEETS_ID` (ID, not URL), `GOOGLE_SHEETS_RANGE=Enquiries!A:K`, `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`. Literal `\n` sequences in the server-only PEM secret are supported.
5. Keep the tab as a continuous table. The [append API](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append) uses `RAW`, preserving phone numbers and preventing text beginning `=` from executing as a formula.

Both integrations default to disabled. Actual Sheet, recipient inbox, credentials and verified sender must be supplied for deployment. No live Sheet or email was created/sent by local verification. Never put integration secrets in `NEXT_PUBLIC_*` variables or commit them.

## Worker and recovery

Run `npm run enquiries:deliver` from the deployed directory with the same database/secrets. Configure the hosting scheduler to run it every minute. No scheduler is installed by this task and there is no public dispatch endpoint. A run handles up to 20 eligible records per configured channel. Atomic claims protect against overlapping workers. Output contains configuration booleans/counts only.

Delivery/recovery commands explicitly initialize Payload in production mode so they never push development schema changes. Schema updates are a separate migration/setup operation.

Email and Sheet delivery states are independent:

- `pending`: saved, awaiting a configured worker.
- `sending`: claimed by one worker.
- `sent`: provider accepted the email or confirmed the Sheet range; inbox delivery is not guaranteed.
- `failed`: explicit rejection or Google authorization failure before append. Exponential backoff permits up to five attempts, then requires intervention.
- `review`: ambiguous timeout/server error/confirmation, or interrupted worker. Never retried automatically. Claims older than 15 minutes become review.

Missing configuration leaves records pending. Exit code 1 reports new failures/reviews during a run. Monitor scheduler failures plus the admin queue for review, exhausted failures and persistent pending records; a later zero exit does not clear old failures. Agree a retention period with the client and protect database/backups.

For recovery, stop competing workers and check the provider/Sheet for the reference first:

```sh
# Confirmed already sent/appended:
npm run enquiries:recover -- --reference UUID --channel sheet --action sent --provider-id 'Enquiries!A2:K2' --confirm-provider-checked

# Confirmed absent; requeue only this channel:
npm run enquiries:recover -- --reference UUID --channel email --action retry --confirm-provider-checked
```

For email, mark sent with its provider message ID. Retry resets that channel's attempts after operator verification. Never blindly retry an ambiguous append; Google Sheets does not deduplicate by reference automatically.

## Database and deployment

Local `cms:setup` adds tables through the existing development workflow and retains products/media/users. Pre-change SQLite backup: `.data/backups/enquiry-backend-before.db` (private).

Checked-in Payload migrations support a **fresh production database**: CMS baseline followed by enquiry tables. With fresh empty `DATABASE_URL`, persistent uploads and production secrets:

```sh
NODE_ENV=production npm run cms:migrate
NODE_ENV=production npm run cms:setup
NODE_ENV=production npm run cms:import
NODE_ENV=production npm run cms:reconcile-drive
npm run build
npm start
```

Download original media and verified Drive assets before imports as described in `CMS-INTEGRATION.md`. Configure the exact HTTPS origin in `NEXT_PUBLIC_SERVER_URL`. Validate the deployed proxy header, saving, admin privacy and provider destinations with an approved test enquiry before scheduling delivery.

Do not run initial CREATE migrations blindly against an existing development-pushed database or accept a destructive reset prompt. Transferring the populated local database requires schema validation/baselining first. Fresh production imports preserve source retirement statuses/Drive reconciliation but do not transfer later manual edits or local enquiries. Take a consistent database backup and include uploads when moving an existing instance.

## Verification

`npm test` covers isolated persistence, privacy, product snapshots, concurrent idempotency/rate limits, input/body/origin validation, independent delivery, claims/backoff, uncertain outcomes, disabled providers, adapter requests and production migration reruns. Provider network calls are simulated; no live messages or Sheet writes are part of tests.

Type generation is explicit (`npm run cms:types`) after collection changes. Background generation is disabled to prevent unawaited CLI children from rewriting source during tests/builds. The Node 26/tsx runner uses `--test-force-exit` after completed assertions/teardown because its compiler service can retain a child-process handle. Isolated SQLite fixtures close their own clients. Test failures still produce a nonzero exit.

Current dependency audit: 14 high, 7 moderate, zero critical, across existing Payload/Sass/build-tool chains. Google authentication is not listed as vulnerable. Review supported upstream fixes before public deployment.

Final local verification on 21 October 2026: all 33 tests passed, lint/typecheck/production build passed (63 existing image warnings), and database integrity/foreign-key checks passed. Desktop/mobile forms, error retention, pending keyboard focus and a saved-but-lost response retry were verified in the browser. The latter returned 201 then 200 for one UUID. QA records were privately backed up then removed, leaving no dummy enquiries for future delivery.
