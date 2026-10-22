import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import type { Payload } from "payload";

let payload: Payload;
let submit: typeof import("../src/enquiries/submission").submitEnquiry;
let productId: number;
let draftId: number;
const origin = "https://roofseal.test";
const env = { NODE_ENV: "test", NEXT_PUBLIC_SERVER_URL: origin, ENQUIRY_IP_HEADER: "x-real-ip", PAYLOAD_SECRET: "test-only-secret" };
const body = (extra = {}) => ({ reference: randomUUID(), kind: "contact", name: "Test Customer", email: "customer@example.test", phone: "+60123456789", company: "Test company", message: "Please contact me about roofing.", consent: true, productIds: [], website: "", ...extra });
const request = (data: unknown, ip: string = randomUUID(), requestOrigin = origin) => new Request(`${origin}/api/submit-enquiry`, { method: "POST", headers: { "Content-Type": "application/json", Origin: requestOrigin, "x-real-ip": ip }, body: JSON.stringify(data) });

before(async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "roofseal-enquiries-"));
  process.env.DATABASE_URL = `file:${dir}/test.db`;
  process.env.CMS_MEDIA_DIR = `${dir}/media`;
  Object.assign(process.env, { NODE_ENV: "development" });
  const { getPayload } = await import("payload");
  const { default: config } = await import("../payload.config");
  payload = await getPayload({ config });
  ({ submitEnquiry: submit } = await import("../src/enquiries/submission"));
  const category = await payload.create({ collection: "categories", data: { name: "Test category", slug: "test-category", division: "metal" } });
  for (const status of ["published", "draft"] as const) {
    const product = await payload.create({ collection: "products", data: { title: "Verified product name", slug: `test-${status}`, description: "Fixture", categories: [category.id], _status: status } });
    if (status === "published") productId = product.id;
    else draftId = product.id;
  }
});
after(async () => {
  if (payload) {
    payload.db.drizzle.$client.close();
    await payload.destroy();
  }
});

test("a contact is saved privately with pending delivery before success", async () => {
  const data = body();
  const response = await submit(request(data), payload, env);
  assert.equal(response.status, 201);
  assert.equal((await response.json()).reference, data.reference);
  const record = (await payload.find({ collection: "enquiries", where: { reference: { equals: data.reference } } })).docs[0];
  assert.equal(record.email, "customer@example.test");
  assert.equal(record.emailDelivery?.status, "pending");
  assert.equal(record.sheetDelivery?.status, "pending");
  assert.ok(record.consentAt);
  await assert.rejects(payload.find({ collection: "enquiries", overrideAccess: false }));
  await assert.rejects(payload.create({ collection: "enquiries", overrideAccess: false, data: record }));
});

test("quotes snapshot server product names and reject unpublished or missing IDs", async () => {
  const data = body({ kind: "quote", productIds: [productId], products: [{ title: "Forged product" }] });
  assert.equal((await submit(request(data), payload, env)).status, 201);
  const record = (await payload.find({ collection: "enquiries", where: { reference: { equals: data.reference } } })).docs[0];
  assert.equal(record.products?.[0].title, "Verified product name");
  assert.equal(record.products?.[0].productId, productId);
  for (const productIds of [[], [draftId], [9999999]]) {
    assert.equal((await submit(request(body({ kind: "quote", productIds })), payload, env)).status, 400);
  }
});

test("repeated and concurrent requests create one enquiry; changed payload conflicts", async () => {
  const data = body();
  const results = await Promise.all([submit(request(data), payload, env), submit(request(data), payload, env)]);
  assert.ok(results.every((r) => [200, 201].includes(r.status)));
  assert.equal((await payload.count({ collection: "enquiries", where: { reference: { equals: data.reference } } })).totalDocs, 1);
  assert.equal((await submit(request({ ...data, message: "Changed content" }), payload, env)).status, 409);
  const retryIp = randomUUID();
  for (let i = 0; i < 6; i++) assert.equal((await submit(request(data, retryIp), payload, env)).status, 200, "saved submissions remain safely retryable after the rate cap");
});

test("invalid input, cross-origin posts and bots cannot persist enquiries", async () => {
  const initial = (await payload.count({ collection: "enquiries" })).totalDocs;
  for (const fields of [{ email: "bad" }, { consent: false }, { name: "" }, { message: "x".repeat(5001) }, { reference: "guessable" }, { productIds: ["1"] }]) {
    assert.equal((await submit(request(body(fields)), payload, env)).status, 400);
  }
  assert.equal((await submit(request(body(), "other", "https://evil.test"), payload, env)).status, 403);
  assert.equal((await submit(request(body({ website: "spam" })), payload, env)).status, 400);
  const oversized = new Request(`${origin}/api/submit-enquiry`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: "x".repeat(17000) });
  assert.equal((await submit(oversized, payload, env)).status, 413);
  assert.equal((await payload.count({ collection: "enquiries" })).totalDocs, initial);
});

test("durable rate limits cap concurrent submissions and ignore untrusted forwarded headers", async () => {
  const ip = randomUUID();
  const responses = await Promise.all(Array.from({ length: 8 }, () => submit(request(body(), ip), payload, env)));
  assert.equal(responses.filter((r) => r.status === 201).length, 5);
  assert.equal(responses.filter((r) => r.status === 429).length, 3);
  assert.ok(responses.find((r) => r.status === 429)?.headers.get("Retry-After"));
  const sharedEnv = { ...env, ENQUIRY_IP_HEADER: "" };
  const shared = await Promise.all(Array.from({ length: 6 }, () => submit(request(body()), payload, sharedEnv)));
  assert.equal(shared.filter((r) => r.status === 201).length, 5);
  assert.equal(shared.filter((r) => r.status === 429).length, 1);
});
