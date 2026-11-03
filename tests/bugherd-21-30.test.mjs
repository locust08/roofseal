import assert from 'node:assert/strict';
import { test } from 'node:test';
const base = process.env.CMS_TEST_BASE || 'http://127.0.0.1:4398';
async function page(path) { const response = await fetch(base + path); assert.equal(response.status, 200, path); return response.text(); }
test('resource hubs and separate blog categories expose working sidebar filters', async () => {
  for (const path of ['/catalogues', '/materials', '/blogs', '/articles', '/news', '/events']) {
    const html = await page(path); assert.ok(html.includes('<h1'), path);
    if (!['/catalogues', '/materials'].includes(path)) {
      assert.ok(html.includes('aria-label="Blog categories"'), path);
      for (const href of ['/blogs/articles', '/blogs/news', '/blogs/events']) assert.ok(html.includes('href="' + href + '"'), path);
    }
  }
});
test('footer social destinations and policy routes use the supplied links', async () => {
  const html = await page('/');
  for (const href of ['https://www.facebook.com/roofsealmalaysia/', 'https://www.linkedin.com/company/roofseal-resources-m-sdn-bhd/home/', '/terms-and-conditions', '/privacy-policy']) assert.ok(html.includes('href="' + href + '"'), href);
});
test('generated post drafts remain private in the CMS API', async () => {
  const response = await fetch(base + '/api/resources?where[slug][in]=planning-your-roofing-enquiry,inside-roofseals-product-divisions,preparing-for-a-roofing-consultation&limit=100');
  assert.equal(response.status, 200); assert.equal((await response.json()).totalDocs, 0);
});
test('local review pages expose only the generated review copy, not arbitrary CMS drafts', async () => {
  const html = await page('/draft-content/planning-your-roofing-enquiry');
  assert.ok(html.includes('Draft for client review'));
  assert.ok(html.includes('Planning Your Roofing Enquiry'));
  assert.equal((await fetch(base + '/draft-content/sealframe-sf1')).status, 404);
  assert.equal((await fetch(base + '/blogs/planning-your-roofing-enquiry')).status, 404);
});
test('fire-door supporting content and supplied ESG commitments are present', async () => {
  const fire = await page('/categories/fire-rated-doors-supplier-malaysia');
  for (const text of ['ACCESSORIES OF', 'APPLICATIONS OF', 'Panic Device', 'Electronic card lock', 'Shopping Complex', 'Door selector (For double leaves)']) assert.ok(fire.includes(text), text);
  const about = await page('/about');
  for (const text of ['Safe and healthy working environment', 'Training and skills improvement', 'Ethical business practices', 'Continuous improvement and operational excellence']) assert.ok(about.includes(text), text);
});
test('both policy pages are bilingual review drafts and excluded from indexing', async () => {
  for (const path of ['/terms-and-conditions', '/privacy-policy']) {
    const html = await page(path);
    assert.ok(html.includes('Draft for client review'));
    assert.ok(html.includes('lang="ms"'));
    assert.match(html, /name="robots" content="[^"]*noindex/);
  }
});
