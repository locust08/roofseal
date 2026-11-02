import assert from 'node:assert/strict';
import {test} from 'node:test';
const base=process.env.CMS_TEST_BASE||'http://127.0.0.1:4398';
test('published CMS placeholders render expandable job content without enabling applications',async()=>{
 const r=await fetch(base+'/api/careers?limit=100&sort=displayOrder');assert.equal(r.status,200);const {docs}=await r.json();
 const examples=docs.filter(p=>p.sourceKey?.startsWith('placeholder:careers/'));assert.equal(examples.length,3);
 const page=await fetch(base+'/career');assert.equal(page.status,200);const html=await page.text();
 for(const p of examples){assert.equal(p._status,'published');assert.equal(p.isPlaceholder,true);assert.equal(p.editorialNotes,undefined);assert.ok(html.includes(p.title));assert.ok(html.includes('id="position-'+p.slug+'"'));}
 for(const text of ['Job Description','Job Scope','Requirements'])assert.ok(html.includes(text),text);
 assert.match(html,/<details[^>]*id="position-placeholder-sales-executive"/);assert.match(html,/<fieldset disabled="">/);assert.ok(html.includes('Applications Closed'));
 for(const text of ['Draft for client review','Placeholder — not a live vacancy','website review only','layout review only','(Placeholder)'])assert.ok(!html.includes(text),text);
 assert.ok(!html.includes('"@type":"JobPosting"'));assert.match(html,/name="robots" content="[^"]*noindex/);
});
test('public career API exposes no drafts and rejects anonymous writes',async()=>{
 const drafts=await fetch(base+'/api/careers?where[_status][equals]=draft');assert.equal((await drafts.json()).totalDocs,0);
 const create=await fetch(base+'/api/careers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:'Unauthorized fixture',slug:'unauthorized-career-fixture'})});assert.ok([401,403].includes(create.status));
 const check=await fetch(base+'/api/careers?where[slug][equals]=unauthorized-career-fixture');assert.equal((await check.json()).totalDocs,0);
});
