import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

test("career publishing enforces editor/admin access, draft privacy and private editorial notes", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "roofseal-careers-"));
  const script = path.join(process.cwd(), "temp", `career-access-${Date.now()}.ts`);
  await writeFile(script, `import assert from 'node:assert/strict'; import {getPayload} from 'payload'; import config from '../payload.config';
const p=await getPayload({config});
try {
 const admin=await p.create({collection:'users',overrideAccess:true,data:{email:'career-test@example.test',password:'test-only-password-123',role:'admin'}});
 const editor={...admin,role:'editor' as const};
 const data={title:'Isolated career fixture',slug:'isolated-career-fixture',summary:'Fixture summary',description:'Fixture description',responsibilities:'First task\\nSecond task',requirements:'Fixture requirement',editorialNotes:'Internal fixture note'};
 await assert.rejects(p.create({collection:'careers',overrideAccess:false,data}));
 const record=await p.create({collection:'careers',overrideAccess:false,user:editor,data});
 assert.equal(record._status,'draft');assert.equal(record.isPlaceholder,true);
 assert.equal((await p.find({collection:'careers',overrideAccess:false})).totalDocs,0);
 await p.update({collection:'careers',id:record.id,overrideAccess:false,user:editor,data:{_status:'published'}});
 const publicRecords=await p.find({collection:'careers',overrideAccess:false});
 assert.equal(publicRecords.totalDocs,1);assert.equal(publicRecords.docs[0].editorialNotes,undefined);
 assert.equal((await p.findByID({collection:'careers',id:record.id,overrideAccess:false,user:editor})).editorialNotes,'Internal fixture note');
 await assert.rejects(p.update({collection:'careers',id:record.id,overrideAccess:false,data:{title:'Unauthorized change'}}));
 await assert.rejects(p.delete({collection:'careers',id:record.id,overrideAccess:false,user:editor}));
 await p.update({collection:'careers',id:record.id,overrideAccess:false,user:editor,data:{_status:'draft'}});
 assert.equal((await p.find({collection:'careers',overrideAccess:false})).totalDocs,0);
 await p.delete({collection:'careers',id:record.id,overrideAccess:false,user:admin});
} finally {await p.destroy();}
`);
  execFileSync(process.execPath, ["--import", "tsx", script], {
    env: { ...process.env, NODE_ENV: "test", DATABASE_URL: `file:${dir}/test.db`, CMS_MEDIA_DIR: `${dir}/uploads` },
    stdio: "pipe", timeout: 120000,
  });
  assert.ok(true);
});
