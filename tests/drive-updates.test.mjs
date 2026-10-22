import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse } from 'dotenv';

const base = process.env.CMS_TEST_BASE || 'http://127.0.0.1:3000';
const retired = ['strip-ceiling', 'solid-polycarbonate-sheet-colour-selection', 'multiwall-profiled-polycarbonate-sheet-colour-selection'];
const draftSlugs = [...Array.from({ length: 10 }, (_, i) => `sealframe-sf${i + 1}`), 'sealframe-kd-frame', 'sealdor-steel-door-dl', 'sealdor-steel-door-sl', 'fascia-board', 'lightweight-steel-batten', 'dek-pro-740-hi-rib', 'ct-protek', 'sealpro-ii-dry-fix'];
async function auth() {
  const env = parse(await readFile('.env.local'));
  const r = await fetch(`${base}/api/users/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: env.CMS_ADMIN_EMAIL, password: env.CMS_ADMIN_PASSWORD }) });
  assert.equal(r.status, 200);
  return { Authorization: `JWT ${(await r.json()).token}` };
}
test('removed products are unpublished and absent from public routes and navigation', async () => {
  const products = await (await fetch(`${base}/api/products?limit=100`)).json();
  assert.equal(products.docs.filter(p => !p.slug.startsWith('cms-verification-')).length, 36);
  for (const slug of retired) {
    assert.ok(!products.docs.some(p => p.slug === slug));
    assert.equal((await fetch(`${base}/products/${slug}`)).status, 404);
  }
  const html = await (await fetch(`${base}/`)).text();
  assert.ok(!html.includes('href="/categories/aluminium-metal-ceiling"'));
});
test('missing Drive products and candidate aliases remain private flagged drafts', async () => {
  const headers = await auth();
  const all = await (await fetch(`${base}/api/products?limit=100&draft=true`, { headers })).json();
  for (const slug of draftSlugs) {
    const product = all.docs.find(p => p.slug === slug);
    assert.ok(product, `missing draft ${slug}`);
    assert.equal(product._status, 'draft');
    assert.match(product.editorialNotes, /confirmation|review/i);
    assert.equal((await fetch(`${base}/products/${slug}`)).status, 404);
  }
  for (const slug of retired) assert.equal(all.docs.find(p => p.slug === slug)?._status, 'draft');
});
test('Sealframe product and resource use the expanded verified Drive PDF', async () => {
  const p = (await (await fetch(`${base}/api/products?where[slug][equals]=sealframe-customisable-metal-door-frames&depth=1`)).json()).docs[0];
  const r = (await (await fetch(`${base}/api/resources?where[slug][equals]=catalogue-sealframe-catalogue-compressed&depth=1`)).json()).docs[0];
  assert.match(p.catalogue.sourceUrl, /10pJnMy6QDuI991x6FqV4RIUsdhcymCpn/);
  assert.equal(r.file.id, p.catalogue.id);
  const file = await fetch(base + new URL(p.catalogue.url, base).pathname);
  assert.equal(file.status, 200);
  assert.equal(createHash('sha256').update(Buffer.from(await file.arrayBuffer())).digest('hex'), '0367077897bd2bc68ab3651ddaa17ac1e28a672ec5ecb53bab6dfc5d7e2d72cc');
});
test('uncertain technical claims stay unchanged and carry editorial review notes', async () => {
  const headers = await auth();
  const all = (await (await fetch(`${base}/api/products?limit=100`, { headers })).json()).docs;
  const pu = all.find(p => p.slug === 'roofseal-deck762-with-pu-foammetal');
  assert.ok(pu.features.some(f => f.text.includes('18mm')));
  assert.match(pu.editorialNotes, /18\s?mm[\s\S]*20\s?mm/);
  assert.match(all.find(p => p.slug === 'roofseal-clip720').editorialNotes, /725/);
});

test('an authenticated draft preview handles pending imagery without a broken image', async () => {
  const headers = await auth();
  const response = await fetch(`${base}/api/preview?collection=products&slug=sealframe-sf1`, { headers, redirect: 'manual' });
  assert.equal(response.status, 307);
  const cookie = response.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
  const page = await fetch(`${base}/products/sealframe-sf1`, { headers: { ...headers, Cookie: cookie } });
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.ok(html.includes('Product image awaiting approval'));
  assert.ok(!html.includes('src=""'));
});
