import assert from 'node:assert/strict';
import {test} from 'node:test';
const base=process.env.CMS_TEST_BASE||'http://127.0.0.1:4398';
async function page(path){const r=await fetch(base+path,{signal:AbortSignal.timeout(45000)});assert.equal(r.status,200,path);return r.text();}
test('blog category URLs are nested, linked consistently, and preserve old URLs with redirects',async()=>{
 for(const slug of ['articles','news','events']){
  const r=await fetch(base+'/'+slug,{redirect:'manual'});assert.equal(r.status,308);assert.equal(new URL(r.headers.get('location'),base).pathname,'/blogs/'+slug);
  const html=await page('/blogs/'+slug);assert.ok(html.includes('aria-label="Blog categories"'));assert.ok(html.includes('href="/blogs/'+slug+'"'));assert.ok(html.includes('dekstop-banner-blogs-articles-news-events.webp'));
 }
 const article=await page('/blogs/the-ultimate-guide-to-choosing-the-right-roofing-material-for-your-home-or-business');
 assert.ok(article.includes('dekstop-banner-blogs-articles-news-events.webp'));assert.ok(article.includes('href="/blogs/articles"'));assert.equal((article.match(/<h1[ >]/g)||[]).length,1);
});
test('main and child pages use their matching supplied banners',async()=>{
 const pages=[['/roof-covering','dekstop-banner-roof-covering'],['/categories/insulation','dekstop-banner-insulation'],['/categories/gutter-roof-component','dekstop-banner-gutter-roof-component'],['/categories/structural','dekstop-banner-structural'],['/categories/skylights','dekstop-banner-skylight'],['/catalogues','dekstop-banner-catalogue'],['/materials-from-bluescope-malaysia','dekstop-banner-materials'],['/why-roofseal','dekstop-banner-why-roofseal'],['/contact-us','dekstop-banner-contact-us'],['/categories/glass-wool-insulation-supplier-malaysia','subcategory-banner-insulation'],['/categories/rockwool-insulation-supplier-malaysia','subcategory-banner-rockwool'],['/categories/aluminium-foil-insulation-malaysia','subcategory-banner-radiant-barrier-aluminium-foil'],['/categories/roofing-mesh','subcategory-banner-roofing-mesh'],['/categories/rain-gutter-systems-malaysia','subcategory-banner-gutter-system'],['/categories/capping-flashing','subcategory-banner-flashing-and-capping-system'],['/categories/waterproofing','subcategory-banner-waterproofing'],['/categories/fasteners','subcategory-banner-fasteners']];
 for(const[path,name]of pages){const html=await page(path);assert.ok(html.includes('/sites/roofseal/banners/'+name+'.webp'),path);const r=await fetch(base+'/sites/roofseal/banners/'+name+'.webp');assert.equal(r.status,200,name);}
 const contact=await page('/contact-us');assert.equal((contact.match(/<h1[ >]/g)||[]).length,1);assert.ok(contact.includes('Send Us an Enquiry'));
});
test('Gutter cards use all four supplied photographs and retain their category destinations',async()=>{
 const html=await page('/categories/gutter-roof-component');
 for(const[name,slug]of [['gutter-system','rain-gutter-systems-malaysia'],['flashing-and-capping-system','capping-flashing'],['waterproofing','waterproofing'],['fasteners','fasteners']]){
 assert.ok(html.includes('/sites/roofseal/category-images/'+name+'.webp'));assert.ok(html.includes('href="/categories/'+slug+'"'));
 }
});
