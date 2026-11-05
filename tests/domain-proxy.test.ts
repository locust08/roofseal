import assert from "node:assert/strict";
import { test } from "node:test";
import { proxyRequest } from "../infrastructure/roofseal-proxy/worker";
import { enquiryClientAddress } from "../src/enquiries/client-address";

const site = "https://roofseal.sites.locus-t.com";
const upstream = "https://roofseal.easondev.workers.dev";
const env = { ROOFSEAL_PROXY_SECRET: "test-only-proxy-secret" };

test("proxy preserves submission body and origin and authenticates the visitor address", async () => {
  const incoming = new Request(`${site}/api/submit-enquiry?check=1`, {
    method: "POST", body: '{"message":"Roofing enquiry"}',
    headers: { origin: site, "content-type": "application/json", "cf-connecting-ip": "203.0.113.7", "x-roofseal-client-ip": "forged", "x-forwarded-host": "evil.test" },
  });
  const response = await proxyRequest(incoming, env, async (input) => {
    const request = input as Request;
    assert.equal(request.url, `${upstream}/api/submit-enquiry?check=1`);
    assert.equal(request.method, "POST");
    assert.equal(await request.text(), '{"message":"Roofing enquiry"}');
    assert.equal(request.headers.get("origin"), site);
    assert.equal(request.headers.get("x-forwarded-host"), "roofseal.sites.locus-t.com");
    assert.equal(request.redirect, "manual");
    assert.equal(enquiryClientAddress(request, { ...env, ENQUIRY_IP_HEADER: "cf-connecting-ip" }), "203.0.113.7");
    request.headers.set("x-roofseal-client-ip", "203.0.113.99");
    request.headers.set("cf-connecting-ip", "fallback");
    assert.equal(enquiryClientAddress(request, { ...env, ENQUIRY_IP_HEADER: "cf-connecting-ip" }), "fallback");
    return new Response("saved", { status: 201, headers: { "cache-control": "no-store", "set-cookie": "payload-token=test; Path=/; HttpOnly; Secure" } });
  });
  assert.equal(response.status, 201);
  assert.equal(await response.text(), "saved");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.match(response.headers.get("set-cookie") || "", /HttpOnly; Secure/);
});

test("proxy rewrites only redirects to its fixed upstream and rejects unexpected hosts", async () => {
  for (const [target, expected] of [[`${upstream}/blogs/articles?a=1`, `${site}/blogs/articles?a=1`], ["https://example.com/file.pdf", "https://example.com/file.pdf"]]) {
    const response = await proxyRequest(new Request(`${site}/blogs`), env, async () => new Response(null, { status: 308, headers: { location: target } }));
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), expected);
  }
  let fetched = false;
  const blocked = await proxyRequest(new Request("https://evil.test/"), env, async () => { fetched = true; return new Response(); });
  assert.equal(blocked.status, 404);
  assert.equal(fetched, false);
  assert.equal((await proxyRequest(new Request(`${site}/`), {}, async () => new Response())).status, 503);
});

test("proxy signatures expire and untrusted visitor headers do not bypass rate limits", async () => {
  await proxyRequest(new Request(`${site}/`, { headers: { "cf-connecting-ip": "203.0.113.7" } }), env, async input => {
    const request = input as Request;
    const now = Date.now();
    assert.equal(enquiryClientAddress(request, env, now + 301_000), "shared");
    assert.equal(enquiryClientAddress(request, env, now - 301_000), "shared");
    request.headers.set("x-roofseal-proxy-signature", "invalid");
    assert.equal(enquiryClientAddress(request, env), "shared");
    return new Response();
  });
});
