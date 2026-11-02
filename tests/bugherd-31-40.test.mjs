import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import {buildingMarkers} from '../src/components/sites/roofseal/home/building-hotspots.ts';
const base=process.env.CMS_TEST_BASE||'http://127.0.0.1:4398';
async function page(path,status=200){const r=await fetch(base+path);assert.equal(r.status,status,path);return r.text();}
test('gallery query and old gallery details are removed while useful resource routes remain',async()=>{
 await page('/resources?type=gallery',404);
 for(const slug of ['gallery-glasswool','gallery-projects','gallery-metal-door-frames'])await page('/resources/'+slug,404);
 const html=await page('/resources');assert.ok(!html.includes('href="/resources/gallery-'));
 await page('/catalogues');await page('/materials');
});
test('careers omits review notices and keeps application controls disabled',async()=>{
 const html=await page('/career');assert.ok(!html.includes('Draft for client review'));assert.ok(!html.includes('Placeholder — not a live vacancy')); assert.ok(html.includes('Sales Executive')); 
 assert.match(html,/<fieldset disabled="">/);assert.match(html,/<input[^>]*type="file"[^>]*required=""/);
 assert.ok(html.includes('Applications Closed'));assert.match(html,/name="robots" content="[^"]*noindex/);
 assert.ok((await page('/')).includes('href="/career"'));
});
test('all eleven approved building markers have published destinations and no placeholder popup',async()=>{
 assert.equal(buildingMarkers.length,11);assert.equal(new Set(buildingMarkers.map(m=>m.label)).size,11);
 const html=await page('/');for(const m of buildingMarkers)assert.ok(html.includes('aria-label="View '+m.label+'"'),m.label);
 assert.ok(!html.includes('Explore product marker'));assert.ok(!html.includes('Product details for this marker are not included'));
 for(const m of buildingMarkers){const path='category'in m?({'metal-deck-roofing-sheets':'/metal-roof-system'}[m.category]||'/categories/'+m.category):'/products/'+m.product;await page(path);}
});
test('manufacturing video is local, muted, opt-in playback with valid MP4 bytes and range support',async()=>{
 const html=await page('/');assert.match(html,/<video[^>]*controls=""[^>]*muted=""[^>]*preload="metadata"/);assert.ok(!html.match(/<video[^>]*autoPlay/i));
 const path='/sites/roofseal/video/roofseal-manufacturing.mp4';const r=await fetch(base+path,{headers:{Range:'bytes=0-31'}});
 assert.equal(r.status,206);assert.equal(r.headers.get('content-type'),'video/mp4');assert.ok(Buffer.from(await r.arrayBuffer()).includes(Buffer.from('ftyp')));
 const contents=await readFile('public'+path);assert.ok(contents.length>1000000);
});
