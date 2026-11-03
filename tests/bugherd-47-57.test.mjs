import assert from 'node:assert/strict';
import {test} from 'node:test';
const base=process.env.CMS_TEST_BASE||'http://127.0.0.1:4398';
test('old materials URLs redirect permanently to the canonical BlueScope page',async()=>{
 for(const path of ['/materials','/bluescope-materials']){
  const r=await fetch(base+path,{redirect:'manual'});assert.equal(r.status,308,path);
  assert.equal(new URL(r.headers.get('location'),base).pathname,'/materials-from-bluescope-malaysia');
 }
 const r=await fetch(base+'/materials-from-bluescope-malaysia');assert.equal(r.status,200);
 const html=await r.text();for(const text of ['COLORBOND','PRIMAMAJU','ZACS'])assert.ok(html.includes(text),text);
 const canonical=html.match(/rel="canonical" href="([^"]+)"/);assert.ok(canonical);assert.equal(new URL(canonical[1],base).pathname,'/materials-from-bluescope-malaysia');
});
test('catalogue navigation row is removed and shared Materials links use the canonical destination',async()=>{
 const html=await(await fetch(base+'/catalogues')).text();assert.ok(!html.includes('aria-label="Resource sections"'));
 assert.ok(html.includes('href="/materials-from-bluescope-malaysia"'));
 assert.ok(!html.includes('href="/materials"'));assert.ok(!html.includes('href="/bluescope-materials"'));
});
test('Insulation uses all four provided category photos and retains the published category destinations',async()=>{
 const html=await(await fetch(base+'/categories/insulation')).text();
 for(const image of ['glasswool','rockwool','radiant-barrier-aluminium-foil','roofing-mesh']){
  const path='/sites/roofseal/category-images/'+image+'.webp';assert.ok(html.includes(path),image);assert.equal((await fetch(base+path)).status,200);
 }
 for(const slug of ['glass-wool-insulation-supplier-malaysia','rockwool-insulation-supplier-malaysia','aluminium-foil-insulation-malaysia','roofing-mesh'])assert.ok(html.includes('href="/categories/'+slug+'"'),slug);
});
