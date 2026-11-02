import assert from "node:assert/strict";
import { getPayload } from "payload";
import config from "../../payload.config";
import positions from "../../data/roofseal-career-placeholders.json";

if (process.env.CLOUDFLARE_DEPLOY === "true" || (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:"))) {
  throw new Error("Seed career placeholders only in the local SQLite CMS.");
}
const payload = await getPayload({ config });
try {
  const before = (await payload.find({ collection: "products", limit: 100, depth: 0, overrideAccess: true })).docs;
  for (const position of positions) {
    const sourceKey = `placeholder:careers/${position.slug}`;
    const existing = (await payload.find({ collection: "careers", where: { slug: { equals: position.slug } }, limit: 1, overrideAccess: true })).docs[0];
    if (existing) {
      assert.equal(existing.sourceKey, sourceKey, "Refuse to overwrite an unrelated career position.");
      console.log(`Preserved existing CMS position: ${position.slug}`);
      continue;
    }
    await payload.create({ collection: "careers", overrideAccess: true, data: {
      ...position, isPlaceholder: true, _status: "published", sourceKey,
      editorialNotes: "Generated placeholder explicitly requested by the user on 30 October 2026. Published for layout review only. No active vacancy, salary, benefits, employment type or hiring terms have been approved. Applications and resume uploads remain disabled.",
    } });
    console.log(`Published labelled placeholder: ${position.slug}`);
  }
  const after = (await payload.find({ collection: "products", limit: 100, depth: 0, overrideAccess: true })).docs;
  assert.deepEqual(after, before, "Career import must preserve all product data.");
} finally { await payload.destroy(); }
