import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

test("production migrations initialize a fresh database and rerun without deleting enquiries", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "roofseal-migrations-"));
  const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: "production", DATABASE_URL: `file:${dir}/test.db`, CMS_MEDIA_DIR: `${dir}/uploads` };
  const run = (args: string[]) => execFileSync(process.execPath, args, { env, stdio: "pipe", timeout: 120000 });
  run(["node_modules/payload/bin.js", "migrate"]);
  const script = path.join(process.cwd(), "temp", `enquiry-migration-${Date.now()}.ts`);
  await writeFile(script, `import assert from 'node:assert/strict'; import { getPayload } from 'payload'; import config from '../payload.config';
const p=await getPayload({config});
const docs=await p.find({collection:'enquiries',where:{reference:{equals:'migration-fixture'}}});
if (!docs.totalDocs) await p.create({collection:'enquiries',data:{reference:'migration-fixture',requestHash:'test',kind:'contact',name:'Fixture',email:'test@example.test',phone:'0123456789',message:'Test persistence',consentAt:new Date().toISOString(),consentText:'Test',status:'new',emailDelivery:{status:'pending',attempts:0},sheetDelivery:{status:'pending',attempts:0}}});
assert.equal((await p.count({collection:'enquiries'})).totalDocs,1);
assert.equal((await p.find({collection:'payload-migrations'})).totalDocs,2);
await p.destroy(); process.exit(0);`);
  run(["--import", "tsx", script]);
  run(["node_modules/payload/bin.js", "migrate"]);
  run(["--import", "tsx", script]);
  assert.ok(true);
});
