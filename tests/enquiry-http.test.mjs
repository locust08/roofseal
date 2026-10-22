import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { parse } from 'dotenv';

test('the registered enquiry endpoint saves a quote privately and retries without duplication', async () => {
  const base = process.env.CMS_TEST_BASE || 'http://127.0.0.1:3000';
  const env = parse(await readFile('.env.local'));
  const origin = new URL(env.NEXT_PUBLIC_SERVER_URL || base).origin;
  const login = await fetch(`${base}/api/users/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: env.CMS_ADMIN_EMAIL, password: env.CMS_ADMIN_PASSWORD }) });
  assert.equal(login.status, 200);
  const auth = { Authorization: `JWT ${(await login.json()).token}`, 'Content-Type': 'application/json' };
  const product = (await (await fetch(`${base}/api/products?limit=1`)).json()).docs[0];
  const data = { reference: randomUUID(), kind: 'quote', productIds: [product.id], name: 'HTTP enquiry verification', email: 'http-qa@example.test', phone: '0123456789', message: 'Local verification. Do not deliver.', consent: true };
  let id;
  try {
    const post = () => fetch(`${base}/api/submit-enquiry`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const created = await post();
    assert.equal(created.status, 201);
    assert.deepEqual(await created.json(), { reference: data.reference });
    assert.equal((await post()).status, 200);
    const records = await (await fetch(`${base}/api/enquiries?where[reference][equals]=${data.reference}`, { headers: auth })).json();
    assert.equal(records.totalDocs, 1);
    const doc = records.docs[0]; id = doc.id;
    assert.equal(doc.products[0].title, product.title);
    assert.equal(doc.emailDelivery.status, 'pending');
    assert.equal(doc.sheetDelivery.status, 'pending');
    assert.ok([401, 403].includes((await fetch(`${base}/api/enquiries/${id}`)).status));
    assert.ok([401, 403].includes((await fetch(`${base}/api/enquiries`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })).status));
  } finally {
    if (id) assert.equal((await fetch(`${base}/api/enquiries/${id}`, { method: 'DELETE', headers: auth })).status, 200);
  }
});
