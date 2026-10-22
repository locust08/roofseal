import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { getPayload } from "payload";
import config from "../../payload.config";
import { verifyMedia } from "./media-files";

type Plan = {
  version: string; sourceNotes: string;
  retiredProducts: string[]; retiredCategories: string[]; retiredResources: string[];
  assets: { key: string; sourceUrl: string; path: string; alt: string; sha256?: string }[];
  drafts: { slug: string; title: string; category: string; description: string; notes: string; sourceUrl: string; catalogue?: string; image?: string; candidate?: boolean }[];
  flags: { slug: string; note: string }[];
};
const plan: Plan = JSON.parse(await readFile("data/roofseal-drive-updates.json", "utf8"));
const payload = await getPayload({ config });
const marker = `[Drive update ${plan.version}]`;
const append = (existing: string | null | undefined, note: string) => [existing, `${marker} ${note}`].filter(Boolean).join("\n\n");
const report = { createdMedia: 0, createdDrafts: 0, unpublishedProducts: 0, unpublishedCategories: 0, unpublishedResources: 0, replacedAttachments: 0, flaggedProducts: 0 };

// Validate every local source before modifying any catalogue record.
const assets = await Promise.all(plan.assets.map(async (asset) => {
  const bytes = await readFile(asset.path);
  verifyMedia(bytes, asset.path);
  const checksum = createHash("sha256").update(bytes).digest("hex");
  if (asset.sha256 && checksum !== asset.sha256) throw new Error(`Source checksum differs: ${asset.key}`);
  return { ...asset, checksum };
}));
await mkdir(".data/backups", { recursive: true });
const before: Record<string, unknown> = {};
for (const collection of ["products", "categories", "resources"] as const) {
  before[collection] = (await payload.find({ collection, limit: 300, depth: 0, overrideAccess: true })).docs;
}
try {
  await writeFile(`.data/backups/drive-${plan.version}-before.json`, JSON.stringify(before, null, 2), { flag: "wx", mode: 0o600 });
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
}

const mediaIds = new Map<string, number>();
for (const asset of assets) {
  const existing = (await payload.find({ collection: "media", where: { sourceUrl: { equals: asset.sourceUrl } }, limit: 1, overrideAccess: true })).docs[0];
  if (existing && existing.checksum !== asset.checksum) throw new Error(`Existing Drive media differs: ${asset.key}`);
  const media = existing || await payload.create({ collection: "media", overrideAccess: true, filePath: asset.path, data: { alt: asset.alt, sourceUrl: asset.sourceUrl, checksum: asset.checksum } });
  mediaIds.set(asset.key, media.id);
  if (!existing) report.createdMedia++;
}

// Markers make retries safe and preserve later editorial decisions on reruns.
for (const [collection, slugs] of [["products", plan.retiredProducts], ["categories", plan.retiredCategories], ["resources", plan.retiredResources]] as const) {
  for (const slug of slugs) {
    const doc = (await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
    if (!doc) throw new Error(`Missing retirement target: ${collection}/${slug}`);
    if (doc.editorialNotes?.includes(marker)) continue;
    await payload.update({ collection, id: doc.id, draft: false, overrideAccess: true, data: { _status: "draft", editorialNotes: append(doc.editorialNotes, `Unpublished per client removal instructions: ${plan.sourceNotes}. Retain this record for provenance; do not republish without client approval.`) } });
    if (collection === "products") report.unpublishedProducts++;
    if (collection === "categories") report.unpublishedCategories++;
    if (collection === "resources") report.unpublishedResources++;
  }
}

const sealframe = (await payload.find({ collection: "products", where: { slug: { equals: "sealframe-customisable-metal-door-frames" } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
const resource = (await payload.find({ collection: "resources", where: { slug: { equals: "catalogue-sealframe-catalogue-compressed" } }, limit: 1, depth: 0, overrideAccess: true })).docs[0];
if (!sealframe || !resource) throw new Error("Sealframe product/catalogue resource missing");
const attachmentNote = "Replaced the four-page legacy catalogue with the verified 18-page client-supplied Sealframe pack containing project references and certificates. Original media retained. Review certificate scope and validity before making product-specific claims. Source: " + assets.find(a => a.key === "sealframe")!.sourceUrl;
if (!sealframe.editorialNotes?.includes(marker)) {
  await payload.update({ collection: "products", id: sealframe.id, overrideAccess: true, data: { catalogue: mediaIds.get("sealframe"), editorialNotes: append(sealframe.editorialNotes, attachmentNote) } });
  report.replacedAttachments++;
}
if (!resource.editorialNotes?.includes(marker)) {
  await payload.update({ collection: "resources", id: resource.id, overrideAccess: true, data: { file: mediaIds.get("sealframe"), editorialNotes: append(resource.editorialNotes, attachmentNote) } });
  report.replacedAttachments++;
}

for (const item of plan.drafts) {
  const existing = (await payload.find({ collection: "products", where: { or: [{ sourceUrl: { equals: item.sourceUrl } }, { slug: { equals: item.slug } }] }, limit: 1, overrideAccess: true })).docs[0];
  if (existing) continue;
  const category = (await payload.find({ collection: "categories", where: { slug: { equals: item.category } }, limit: 1, overrideAccess: true })).docs[0];
  if (!category) throw new Error(`Missing category for draft ${item.slug}`);
  await payload.create({ collection: "products", draft: true, overrideAccess: true, data: {
    title: item.title, slug: item.slug, sourceId: `drive:${plan.version}:${item.slug}`, sourceUrl: item.sourceUrl,
    categories: [category.id], description: item.description, displayOrder: 200,
    catalogue: item.catalogue ? mediaIds.get(item.catalogue) : undefined,
    cardImage: item.image ? mediaIds.get(item.image) : undefined, gallery: item.image ? [mediaIds.get(item.image)!] : [],
    editorialNotes: append(undefined, item.notes + (item.candidate ? " Candidate alias only; do not publish alongside an equivalent existing product." : "")),
    importRelationshipsComplete: true, _status: "draft",
  } });
  report.createdDrafts++;
}
for (const item of plan.flags) {
  const doc = (await payload.find({ collection: "products", where: { slug: { equals: item.slug } }, depth: 0, limit: 1, overrideAccess: true })).docs[0];
  if (!doc) throw new Error(`Missing review target ${item.slug}`);
  if (doc.editorialNotes?.includes(marker)) continue;
  await payload.update({ collection: "products", id: doc.id, overrideAccess: true, data: { editorialNotes: append(doc.editorialNotes, item.note) } });
  report.flaggedProducts++;
}
const totals = {
  products: (await payload.count({ collection: "products", overrideAccess: true })).totalDocs,
  publishedProducts: (await payload.count({ collection: "products", overrideAccess: true, where: { _status: { equals: "published" } } })).totalDocs,
};
await writeFile(`.data/drive-update-${plan.version}-report.json`, JSON.stringify({ report, totals, completedAt: new Date().toISOString() }, null, 2));
console.log(JSON.stringify({ report, totals }, null, 2));
await payload.destroy();
process.exit(0);
