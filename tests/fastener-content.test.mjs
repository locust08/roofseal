import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
const seeds = JSON.parse(await readFile(new URL('../data/roofseal-fastener-applications.json', import.meta.url), 'utf8'));
const base = process.env.CMS_TEST_BASE || 'http://127.0.0.1:4398';
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
test('all five fastener pages render CMS application tables with original model mappings and working diagrams', async () => {
  for (const seed of seeds) {
    const response = await fetch(base + '/products/' + seed.slug);
    assert.equal(response.status, 200);
    const html = (await response.text()).split('<main')[1].split('</main>')[0];
    assert.ok(html.includes('aria-label="More Information"'), seed.slug);
    assert.ok(html.includes('<table'), seed.slug);
    for (const text of [...seed.applicationInformation.columns, ...seed.applicationInformation.rows.flat()]) assert.ok(html.includes(escape(text)), seed.slug + ': ' + text);
    assert.ok(html.includes(seed.applicationInformation.image));
    const image = await fetch(base + seed.applicationInformation.image);
    assert.equal(image.status, 200);
    assert.match(image.headers.get('content-type') || '', /image\/jpeg/);
    const api = await fetch(base + '/api/products?where[slug][equals]=' + seed.slug + '&depth=0');
    const product = (await api.json()).docs[0];
    assert.deepEqual(product.applicationInformation, seed.applicationInformation);
    assert.equal(product._status, 'published');
  }
});
