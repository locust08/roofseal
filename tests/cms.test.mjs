import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { parse } from 'dotenv';

const base = process.env.CMS_TEST_BASE || 'http://127.0.0.1:3000';

test('the catalogue API serves published imported products', async () => {
  const response = await fetch(`${base}/api/products?limit=100`);
  assert.equal(response.status, 200, 'Payload product API should be available');
  const body = await response.json();
  assert.ok(body.docs.length >= 36, 'all active source products should be imported');
  assert.ok(body.docs.some((product) => product.slug === 'roofseal-euro762'));
  assert.ok(body.docs.every((product) => product._status === 'published'));
});

test('anonymous visitors cannot create catalogue records', async () => {
  const response = await fetch(`${base}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Unauthorized', slug: 'unauthorized-test' }),
  });
  assert.ok([401, 403].includes(response.status), `unexpected status ${response.status}`);
});

test('the admin has its own layout instead of the website navigation', async () => {
  const response = await fetch(`${base}/admin`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(!html.includes('class="site-header'), 'website header must not wrap Payload');
  assert.match(html, /payload|login|Log In/i);
});

test('the Deck762 page uses an actual imported catalogue download', async () => {
  const response = await fetch(`${base}/products/roofseal-deck762`);
  assert.equal(response.status, 200);
  assert.ok(/href="\/api\/media\/file\/[^" ]+\.pdf"/.test(await response.text()), 'catalogue should link to the local CMS upload');
});

let loginPromise;
async function administrator() {
  loginPromise ||= (async () => {
    const env = parse(await readFile('.env.local'));
    const response = await fetch(`${base}/api/users/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: env.CMS_ADMIN_EMAIL, password: env.CMS_ADMIN_PASSWORD }) });
    assert.equal(response.status, 200, 'local administrator should authenticate');
    const { token } = await response.json();
    return { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' };
  })();
  return loginPromise;
}

test('drafts stay private until published and published edits reach the existing template', async () => {
  const headers = await administrator();
  const source = await (await fetch(`${base}/api/products?where[slug][equals]=roofseal-deck762&depth=0`)).json();
  const category = source.docs[0].categories[0];
  const slug = `cms-verification-${Date.now()}`;
  let id;
  try {
    const created = await fetch(`${base}/api/products?draft=true`, { method: 'POST', headers, body: JSON.stringify({ title: 'Private CMS verification product', slug, description: 'Verification content', categories: [category], _status: 'draft' }) });
    assert.equal(created.status, 201);
    id = (await created.json()).doc.id;
    const publicDrafts = await (await fetch(`${base}/api/products?draft=true&where[slug][equals]=${slug}`)).json();
    assert.equal(publicDrafts.docs.length, 0, 'draft query must not disclose an unpublished product');
    assert.equal((await fetch(`${base}/products/${slug}`)).status, 404);
    assert.equal((await fetch(`${base}/api/preview?collection=products&slug=${slug}`, { redirect: 'manual' })).status, 401);
    const preview = await fetch(`${base}/api/preview?collection=products&slug=${slug}`, { headers, redirect: 'manual' });
    assert.equal(preview.status, 307, 'signed-in editor can preview a draft');
    assert.equal(preview.headers.get('location'), `/products/${slug}`, 'preview must preserve the current host and authentication cookies');
    const previewCookie = preview.headers.getSetCookie().map((cookie) => cookie.split(';')[0]).join('; ');
    const draftPage = await fetch(`${base}/products/${slug}`, { headers: { ...headers, Cookie: previewCookie } });
    assert.equal(draftPage.status, 200);
    assert.ok((await draftPage.text()).includes('Private CMS verification product'), 'authenticated draft preview renders actual draft content');
    const published = await fetch(`${base}/api/products/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ title: 'Published CMS verification product', _status: 'published' }) });
    assert.equal(published.status, 200);
    const page = await fetch(`${base}/products/${slug}`);
    assert.equal(page.status, 200);
    assert.ok((await page.text()).includes('Published CMS verification product'));
    const changed = await fetch(`${base}/api/products/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ title: 'Edited CMS verification product', _status: 'published' }) });
    assert.equal(changed.status, 200);
    assert.ok((await (await fetch(`${base}/products/${slug}`)).text()).includes('Edited CMS verification product'), 'fresh published data must not be a build-time snapshot');
    const draftEdit = await fetch(`${base}/api/products/${id}?draft=true`, { method: 'PATCH', headers, body: JSON.stringify({ title: 'Unpublished revision of the product', _status: 'draft' }) });
    assert.equal(draftEdit.status, 200);
    const publicPage = await fetch(`${base}/products/${slug}`);
    const publicHTML = await publicPage.text();
    assert.equal(publicPage.status, 200);
    assert.ok(publicHTML.includes('Edited CMS verification product') && !publicHTML.includes('Unpublished revision of the product'), 'saving a new draft must preserve the public published version');
  } finally {
    if (id) assert.equal((await fetch(`${base}/api/products/${id}`, { method: 'DELETE', headers })).status, 200);
  }
});

test('editors cannot create administrators or elevate their own role', async () => {
  const admin = await administrator();
  const email = `editor-test-${Date.now()}@roofseal.local`;
  const password = `Local-verification-${Date.now()}!`;
  let id;
  try {
    const created = await fetch(`${base}/api/users`, { method: 'POST', headers: admin, body: JSON.stringify({ email, password, role: 'editor' }) });
    assert.equal(created.status, 201);
    id = (await created.json()).doc.id;
    const login = await (await fetch(`${base}/api/users/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })).json();
    const headers = { Authorization: `JWT ${login.token}`, 'Content-Type': 'application/json' };
    const unauthorized = await fetch(`${base}/api/users`, { method: 'POST', headers, body: JSON.stringify({ email: 'should-not-exist@roofseal.local', password, role: 'admin' }) });
    assert.equal(unauthorized.status, 403);
    const update = await fetch(`${base}/api/users/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ role: 'admin' }) });
    assert.equal(update.status, 200);
    assert.equal((await update.json()).doc.role, 'editor');
  } finally {
    if (id) assert.equal((await fetch(`${base}/api/users/${id}`, { method: 'DELETE', headers: admin })).status, 200);
  }
});

test('the existing roof system grid includes Euro762 and links to its imported detail', async () => {
  const page = await fetch(`${base}/metal-roof-system`);
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.ok(html.includes('href="/products/roofseal-euro762"'));
  assert.ok(html.includes('Roofseal Euro762'));
});

test('resource downloads are local files and source materials render as a comparison table', async () => {
  const response = await fetch(`${base}/api/resources?where[type][equals]=catalogue&limit=1&depth=1`);
  const { docs } = await response.json();
  const pathname = new URL(docs[0].file.url, base).pathname;
  const download = await fetch(`${base}${pathname}`);
  assert.equal(download.status, 200);
  assert.ok(download.headers.get('content-type')?.includes('application/pdf'));
  assert.equal(Buffer.from(await download.arrayBuffer()).subarray(0, 5).toString(), '%PDF-');
  const material = await fetch(`${base}/resources/bluescope-materials`);
  assert.equal(material.status, 200);
  const html = await material.text();
  assert.ok(html.includes('Coating mass') && html.includes('AZ150'));
});
