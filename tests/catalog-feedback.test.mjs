import assert from 'node:assert/strict';
import {test} from 'node:test';
const base=process.env.CMS_TEST_BASE || 'http://127.0.0.1:4398';
const page=async(path)=>{const r=await fetch(base+path);assert.equal(r.status,200,path);return (await r.text()).split('<main')[1]?.split('</main>')[0] || '';};

test('the four category pages include their original supporting content and contact route',async()=>{
 for(const [slug,phrases] of [
  ['glass-wool-insulation-supplier-malaysia',['Thermal Comfort','Ecowool Classic Blanket','Ecowool Brownie Blanket']],
  ['rockwool-insulation-supplier-malaysia',['Superior fire resistance','Cool ‘n’ Comfort Roll Series','Cool ‘n’ Comfort Slab Series']],
  ['aluminium-foil-insulation-malaysia',['IMPORTANCE OF','Moisture Barrier (WVTR)','Bomba Certified (For FR Series)']],
  ['rain-gutter-systems-malaysia',['METAL RAIN GUTTER','UPVC RAIN GUTTER','customized sizes, lengths and colours']]
 ]){const html=await page('/categories/'+slug);for(const phrase of phrases)assert.ok(html.includes(phrase),slug+': '+phrase);assert.ok(html.includes('href="/contact-us"'));}
});
test('Insulation shows category cards without the stray parent product, retaining child products',async()=>{
 const parent=await page('/categories/insulation');
 assert.ok(!parent.includes('href="/products/glasswool-insulation"'));
 const child=await page('/categories/glass-wool-insulation-supplier-malaysia');
 assert.ok(child.includes('href="/products/glasswool-insulation-2"'));
 assert.equal((await fetch(base+'/products/glasswool-insulation')).status,200);
});
test('both newly reapproved skylights are published with their original media',async()=>{
 const list=await page('/categories/skylights');
 for(const slug of ['solid-polycarbonate-sheet-colour-selection','multiwall-profiled-polycarbonate-sheet-colour-selection']){
  assert.ok(list.includes('href="/products/'+slug+'"'),slug);
  const p=(await (await fetch(base+'/api/products?where[slug][equals]='+slug+'&depth=1')).json()).docs[0];
  assert.ok(p);assert.equal(p._status,'published');assert.ok(p.cardImage?.url);
  await page('/products/'+slug);
 }
});
test('Sealframe and polycarbonate include the supplied More Information text',async()=>{
 const seal=await page('/products/sealframe-customisable-metal-door-frames');
 assert.ok(seal.includes('Perfect Metal Door Frame for Residential and Businesses in Malaysia'));
 assert.ok(seal.includes('More Information'));
 const poly=await page('/products/polycarbonate-roofing-sheets');
 assert.ok(poly.includes('Explore Roofseal’s Polycarbonate Sheets'));
 assert.ok(poly.includes('rigorously tested products at competitive prices'));
});
