import assert from 'node:assert/strict';
import { test } from 'node:test';
const base = process.env.CMS_TEST_BASE || 'http://127.0.0.1:4398';
async function page(path) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  return (await response.text()).split('<footer')[0];
}
test('Why Roofseal exposes all nine benefits and local icons', async () => {
  const html = await page('/why-roofseal');
  assert.equal((html.match(/data-benefit=/g) || []).length, 9);
  assert.ok(html.includes('Established Manufacturing Capabilities'));
  assert.ok(html.includes('Built for the Construction Industry'));
  assert.ok(html.includes('/sites/roofseal/why/why-roofseal-banner.jpg'));
});
test('Doors and Frames links to both CMS categories while Metal Roofing keeps its five categories', async () => {
  const html = await page('/doors-frames-division');
  for (const slug of ['metal-door-frames', 'fire-rated-doors-supplier-malaysia']) {
    assert.ok(html.includes('href="/categories/' + slug + '"'));
    await page('/categories/' + slug);
  }
  const metal = await page('/metal-roofing-division');
  assert.equal((metal.match(/class="category-card"/g) || []).length, 5);
});
