import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getPayload } from "payload";
import config from "../../payload.config";
import seeds from "../../data/roofseal-fastener-applications.json";
import { parseProductApplication } from "../../src/cms/product-application";

// Local-only content reconciliation. No publication or technical-summary changes.
if (process.env.CLOUDFLARE_DEPLOY === "true") throw new Error("Run this reconciliation against the local CMS only.");
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) throw new Error("A local SQLite file is required for this reconciliation.");
const payload = await getPayload({ config });
try {
  const before = (await payload.find({ collection: "products", limit: 100, depth: 0, overrideAccess: true })).docs;
  const originals = before.filter((doc) => seeds.some((seed) => seed.slug === doc.slug));
  assert.equal(originals.length, 5, "All five original fastener records must exist.");
  assert.ok(originals.every((doc) => doc._status === "published"), "Only the five already-published fasteners may be updated.");
  // Validate every row and file before the first write.
  for (const seed of seeds) {
    assert.ok(parseProductApplication(seed.applicationInformation), seed.slug);
    const image = await readFile(path.join(process.cwd(), "public", seed.applicationInformation.image));
    assert.equal(image.subarray(0, 2).toString("hex"), "ffd8", "Expected an original JPEG, not an error response.");
    assert.equal(createHash("sha256").update(image).digest("hex"), seed.illustrationSha256);
    const existing = originals.find((doc) => doc.slug === seed.slug)?.applicationInformation;
    if (existing) assert.deepEqual(existing, seed.applicationInformation, "Preserve CMS editorial changes; review differences before rerunning.");
  }
  await mkdir(".data/backups", { recursive: true });
  await writeFile(".data/backups/before-fastener-applications-20261029.json", JSON.stringify(originals, null, 2), { flag: "wx", mode: 0o600 }).catch((error: NodeJS.ErrnoException) => { if (error.code !== "EEXIST") throw error; });
  for (const seed of seeds) {
    const original = originals.find((doc) => doc.slug === seed.slug)!;
    if (original.applicationInformation) { console.log(`Already restored: ${seed.slug}`); continue; }
    await payload.update({ collection: "products", id: original.id, draft: false, overrideAccess: true, data: { applicationInformation: seed.applicationInformation } });
    console.log(`Restored application content: ${seed.slug}`);
  }
  const after = (await payload.find({ collection: "products", limit: 100, depth: 0, overrideAccess: true })).docs;
  assert.deepEqual(after.map((doc) => [doc.id, doc._status]).sort(), before.map((doc) => [doc.id, doc._status]).sort(), "All product publication states must remain unchanged.");
  console.log("All publication states preserved; uncertain products remain drafts.");
} finally { await payload.destroy(); }
