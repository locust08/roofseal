import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { before, after, test } from "node:test";
import type { Payload } from "payload";
import type { Enquiry } from "../src/payload-types";
import { createDeliveryAdapters, processDeliveries, DeliveryError } from "../src/enquiries/delivery";

let payload: Payload;
before(async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "roofseal-delivery-"));
  process.env.DATABASE_URL = `file:${dir}/test.db`;
  process.env.CMS_MEDIA_DIR = `${dir}/media`;
  Object.assign(process.env, { NODE_ENV: "development" });
  const { getPayload } = await import("payload");
  const { default: config } = await import("../payload.config");
  payload = await getPayload({ config });
});
after(async () => { if (payload) { payload.db.drizzle.$client.close(); await payload.destroy(); } });
async function fixture() {
  return payload.create({ collection: "enquiries", data: { reference: randomUUID(), requestHash: "fixture", status: "new", kind: "quote", name: "=Customer", email: "customer@example.test", phone: "+60123456789", message: "Please quote <script>alert(1)</script>", consentAt: new Date().toISOString(), consentText: "Respond to enquiry", products: [{ productId: 7, title: "Deck 762", slug: "deck-762" }], emailDelivery: { status: "pending", attempts: 0 }, sheetDelivery: { status: "pending", attempts: 0 } } });
}

test("disabled providers leave a saved enquiry pending without outbound calls", async () => {
  const doc = await fixture();
  const adapters = createDeliveryAdapters({}, { fetch: async () => { throw new Error("Must not send"); } });
  await processDeliveries(payload, adapters);
  const saved = await payload.findByID({ collection: "enquiries", id: doc.id });
  assert.equal(saved.emailDelivery?.status, "pending");
  assert.equal(saved.sheetDelivery?.status, "pending");
});

test("independent delivery, safe retries and concurrent workers never resend success", async () => {
  const doc = await fixture();
  let emails = 0, sheets = 0;
  const accepted = new Set<string>();
  const adapters = {
    email: async (record: Enquiry) => { assert.ok(!accepted.has(record.reference), "concurrent workers must not send a reference twice"); accepted.add(record.reference); emails++; return "email-accepted"; },
    sheet: async () => { sheets++; throw new DeliveryError("provider_rejected_429", false); },
  };
  await Promise.all([processDeliveries(payload, adapters), processDeliveries(payload, adapters)]);
  let saved = await payload.findByID({ collection: "enquiries", id: doc.id });
  assert.equal(saved.emailDelivery?.status, "sent");
  assert.equal(saved.sheetDelivery?.status, "failed");
  assert.equal(saved.emailDelivery?.attempts, 1);
  // Ignore fixtures from the previous test by asserting each reference separately.
  assert.equal(saved.emailDelivery?.providerId, "email-accepted");
  const beforeEmail = emails, beforeSheet = sheets;
  await processDeliveries(payload, adapters);
  assert.equal(emails, beforeEmail);
  assert.equal(sheets, beforeSheet, "retry backoff must be respected");
  await payload.update({ collection: "enquiries", id: doc.id, data: { sheetDelivery: { ...saved.sheetDelivery, nextAttemptAt: new Date(0).toISOString() } } });
  await processDeliveries(payload, { ...adapters, sheet: async () => "Enquiries!A3:K3" });
  saved = await payload.findByID({ collection: "enquiries", id: doc.id });
  assert.equal(saved.sheetDelivery?.status, "sent");
  assert.equal(saved.sheetDelivery?.attempts, 2);
  assert.equal(emails, beforeEmail);
});

test("rejected deliveries stop automatically after five attempts", async () => {
  const doc = await fixture();
  let calls = 0;
  const adapters = { email: async (record: Enquiry) => { if (record.id === doc.id) calls++; throw new DeliveryError("provider_rejected_403", false); } };
  for (let attempt = 0; attempt < 6; attempt++) {
    await processDeliveries(payload, adapters);
    const record = await payload.findByID({ collection: "enquiries", id: doc.id });
    await payload.update({ collection: "enquiries", id: doc.id, data: { emailDelivery: { ...record.emailDelivery, nextAttemptAt: new Date(0).toISOString() } } });
  }
  assert.equal(calls, 5);
  const saved = await payload.findByID({ collection: "enquiries", id: doc.id });
  assert.equal(saved.emailDelivery.attempts, 5);
  assert.equal(saved.emailDelivery.status, "failed");
  // Isolate subsequent tests from this deliberately undeliverable fixture.
  await payload.update({ collection: "enquiries", id: doc.id, data: { sheetDelivery: { status: "sent", attempts: 0 } } });
});

test("ambiguous timeouts and interrupted claims require review instead of duplicate sends", async () => {
  const doc = await fixture();
  await processDeliveries(payload, { sheet: async () => { throw new Error("May have appended, credentials must never be logged"); } });
  let saved = await payload.findByID({ collection: "enquiries", id: doc.id });
  assert.equal(saved.sheetDelivery?.status, "review");
  assert.equal(saved.sheetDelivery?.lastError, "delivery_outcome_unknown");
  await payload.update({ collection: "enquiries", id: doc.id, data: { emailDelivery: { status: "sending", attempts: 1, lastAttemptAt: new Date(Date.now() - 3600000).toISOString() } } });
  let sends = 0;
  await processDeliveries(payload, { email: async () => { sends++; return "should-not-send"; }, sheet: async () => { sends++; return "should-not-send"; } });
  saved = await payload.findByID({ collection: "enquiries", id: doc.id });
  assert.equal(saved.emailDelivery?.status, "review");
  assert.equal(saved.emailDelivery?.lastError, "worker_interrupted_check_provider");
  assert.equal(saved.sheetDelivery?.attempts, 1);
  assert.equal(sends, 0);
});

test("adapters use fixed recipients, stable idempotency, RAW sheet values and safe errors", async () => {
  const doc = await fixture();
  const requests: { url: string; headers: Headers; body: Record<string, unknown> }[] = [];
  const env = { ENQUIRY_EMAIL_ENABLED: "true", RESEND_API_KEY: "secret", ENQUIRY_EMAIL_FROM: "Roofseal <sender@example.test>", ENQUIRY_EMAIL_TO: "inbox@example.test", ENQUIRY_SHEETS_ENABLED: "true", GOOGLE_SHEETS_ID: "sheet-id", GOOGLE_SHEETS_RANGE: "Enquiries!A:K", GOOGLE_SERVICE_ACCOUNT_EMAIL: "service@example.test", GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: "test-key" };
  const adapters = createDeliveryAdapters(env, {
    googleAccessToken: async () => "token",
    fetch: async (input, init) => {
      const url = String(input);
      requests.push({ url, headers: new Headers(init?.headers), body: JSON.parse(String(init?.body)) });
      return Response.json(url.includes("resend") ? { id: "email-id" } : { updates: { updatedRange: "Enquiries!A2:K2" } });
    },
  });
  assert.equal(await adapters.email!(doc), "email-id");
  assert.equal(await adapters.sheet!(doc), "Enquiries!A2:K2");
  const email = requests[0];
  assert.deepEqual(email.body.to, ["inbox@example.test"]);
  assert.equal(email.body.reply_to, "customer@example.test");
  assert.equal(email.headers.get("Idempotency-Key"), `roofseal-enquiry/${doc.reference}`);
  assert.equal(email.body.html, undefined);
  assert.match(String(email.body.text), /Deck 762/);
  assert.ok(requests[1].url.includes("valueInputOption=RAW"));
  const values = requests[1].body.values as string[][];
  assert.equal(values[0][0], doc.reference);
  assert.equal(values[0][3], "=Customer", "RAW preserves text without executing formulas");
  const broken = createDeliveryAdapters(env, { googleAccessToken: async () => "token", fetch: async () => new Response("sensitive provider details", { status: 503 }) });
  await assert.rejects(broken.sheet!(doc), (error: unknown) => error instanceof DeliveryError && error.uncertain && !error.message.includes("sensitive"));
});
