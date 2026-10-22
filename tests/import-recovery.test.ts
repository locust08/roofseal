import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

test("an interrupted import repairs relationships while repeat imports preserve editorial changes", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "roofseal-import-test-"));
  const category = (slug: string, parentSourceUrl?: string) => ({ sourceUrl: `https://fixture.local/${slug}`, name: slug, slug, title: slug, description: "Fixture", parentSourceUrl, displayOrder: 1, faqs: [] });
  const product = (slug: string) => ({ sourceUrl: `https://fixture.local/${slug}`, sourceId: slug, title: slug, slug, description: "Fixture", descriptionItems: [], categories: [{ url: "https://fixture.local/child" }], images: [], catalogueUrls: [], presentationGallery: [], displayOrder: 1 });
  await Promise.all([
    writeFile(path.join(dir, "categories.json"), JSON.stringify([category("parent"), category("child", "https://fixture.local/parent")])),
    writeFile(path.join(dir, "products.json"), JSON.stringify([product("first"), { ...product("second"), _status: "draft" }])),
    writeFile(path.join(dir, "resources.json"), "[]"), writeFile(path.join(dir, "media.json"), "[]"),
  ]);
  const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: "development", DATABASE_URL: `file:${dir}/test.db`, CMS_MEDIA_DIR: `${dir}/uploads`, CMS_SOURCE_DIR: dir, CMS_DOWNLOAD_MANIFEST: `${dir}/media.json`, CMS_IMPORT_REPORT: `${dir}/report.json` };
  const run = (script: string) => execFileSync(process.execPath, ["--import", "tsx", script], { env, stdio: "pipe", timeout: 120000 });
  run("scripts/cms/import.ts");
  // Simulate stopping after record creation but before relationship completion.
  const mutate = path.join(process.cwd(), "temp", `cms-recovery-${Date.now()}.ts`);
  await writeFile(mutate, `import { getPayload } from 'payload'; import config from '../payload.config';
const p = await getPayload({config});
await p.update({collection:'categories',where:{slug:{equals:'child'}},data:{parent:null,importRelationshipsComplete:false},overrideAccess:true});
await p.update({collection:'products',where:{slug:{equals:'first'}},data:{title:'Editorial title',relatedProducts:[],importRelationshipsComplete:false},overrideAccess:true});
await p.destroy(); process.exit(0);`);
  run(mutate);
  run("scripts/cms/import.ts");
  const verify = path.join(process.cwd(), "temp", `cms-recovery-verify-${Date.now()}.ts`);
  await writeFile(verify, `import assert from 'node:assert/strict'; import { getPayload } from 'payload'; import config from '../payload.config';
const p=await getPayload({config});
const c=(await p.find({collection:'categories',where:{slug:{equals:'child'}},depth:0})).docs[0];
const x=(await p.find({collection:'products',where:{slug:{equals:'first'}},depth:0})).docs[0];
assert.ok(c.parent); assert.equal(c.importRelationshipsComplete,true); assert.equal(x.title,'Editorial title'); assert.equal(x.relatedProducts?.length,1); assert.equal(x.importRelationshipsComplete,true);
const retired=(await p.find({collection:'products',where:{slug:{equals:'second'}},depth:0})).docs[0]; assert.equal(retired._status,'draft','seed retirement survives import and retry');
await p.destroy(); process.exit(0);`);
  run(verify);
  run("scripts/cms/import.ts");
  run(verify);
  const report = JSON.parse(await readFile(`${dir}/report.json`, "utf8"));
  assert.deepEqual(report.created, { media: 0, categories: 0, products: 0, resources: 0 });
});
