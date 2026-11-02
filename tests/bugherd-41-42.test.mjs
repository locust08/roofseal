import assert from 'node:assert/strict';
import {test} from 'node:test';
const base=process.env.CMS_TEST_BASE||'http://127.0.0.1:4398';
test('About removes the exact unwanted roof-installation layer while preserving team content',async()=>{
 const r=await fetch(base+'/about');assert.equal(r.status,200);const html=await r.text();
 assert.ok(!html.includes('0578d8294b8eda8c-a221a.png'));
 assert.ok(html.includes('09a3525fe03f55fa-4a56a.png'));
 assert.ok(html.includes('91d73f29ec0d1c0f-e7475.png'));
 assert.ok(html.includes('Behind Every Solution'));
});
