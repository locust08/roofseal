import assert from "node:assert/strict";
import path from "node:path";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { getPayload } from "payload";
import config from "../../payload.config";
import drafts from "../../data/roofseal-blog-drafts.json";
import type { Resource } from "../../src/payload-types";
import type { BlogCategory } from "../../src/lib/resource-links";

if (process.env.CLOUDFLARE_DEPLOY === "true" || (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:"))) throw new Error("Seed review drafts only in the local SQLite CMS.");
function richText(sections: typeof drafts[number]["sections"]): NonNullable<Resource["content"]> {
  const blocks = sections.flatMap((section) => [{ tag: "h2", text: section.heading }, ...section.paragraphs.map((text) => ({ tag: "p", text }))]);
  return { root: { type: "root", format: "", direction: "ltr", indent: 0, version: 1, children: blocks.map((block) => ({
    type: block.tag === "h2" ? "heading" : "paragraph", tag: block.tag === "h2" ? "h2" : undefined,
    format: "", direction: "ltr", indent: 0, version: 1,
    children: [{ type: "text", text: block.text, format: 0, detail: 0, mode: "normal", style: "", version: 1 }],
  })) } };
}
const payload = await getPayload({ config });
try {
  const before = (await payload.find({ collection: "products", limit: 100, depth: 0, overrideAccess: true })).docs;
  for (const draft of drafts) {
    const sourceUrl = `generated:bugherd-26/${draft.slug}`;
    const existing = (await payload.find({ collection: "resources", where: { slug: { equals: draft.slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
    if (existing) {
      assert.equal(existing.sourceUrl, sourceUrl, "Do not overwrite an unrelated resource.");
      assert.equal(existing._status, "draft", "Generated copy needs client approval before publication.");
      console.log(`Preserved existing review draft: ${draft.slug}`); continue;
    }
    const filePath = path.join(process.cwd(), "public", draft.coverImage);
    const checksum = createHash("sha256").update(await readFile(filePath)).digest("hex");
    let media = (await payload.find({ collection: "media", where: { checksum: { equals: checksum } }, limit: 1, overrideAccess: true })).docs[0];
    if (!media) media = await payload.create({ collection: "media", overrideAccess: true, filePath, data: { alt: "Roofseal building products and manufacturing", checksum, sourceUrl: `local:${draft.coverImage}` } });
    await payload.create({ collection: "resources", overrideAccess: true, draft: true, data: {
      title: draft.title, slug: draft.slug, type: "article", postCategory: draft.category as BlogCategory,
      excerpt: draft.excerpt, content: richText(draft.sections), coverImage: media.id, sourceUrl,
      editorialNotes: "Generated for BugHerd #26 client review. Keep as draft until copy is approved. No dated announcement, event, venue or registration details are confirmed. Local preview uses the matching repository-generated copy; CMS edits require authenticated draft preview.",
      _status: "draft",
    } });
    console.log(`Created private review draft: ${draft.slug}`);
  }
  const after = (await payload.find({ collection: "products", limit: 100, depth: 0, overrideAccess: true })).docs;
  assert.deepEqual(after.map((p) => [p.id, p._status]).sort(), before.map((p) => [p.id, p._status]).sort());
  console.log("All product publication states preserved.");
} finally { await payload.destroy(); }
