import { readFile, writeFile } from "node:fs/promises";
import { getPayload } from "payload";
import config from "../../payload.config";
import type { Resource } from "../../src/payload-types";
import type { Download } from "./download-media";

type Image = { url: string; alt?: string };
type SourceCategory = { _status?: "draft" | "published"; sourceUrl: string; name: string; slug: string; parentSourceUrl?: string; title: string; description: string; presentationImage?: string; displayOrder: number; seoTitle: string; seoDescription: string; faqs: { question: string; answer: string; group: "metal" | "shingles" }[] };
type SourceProduct = { _status?: "draft" | "published"; sourceUrl: string; sourceId: string; slug: string; title: string; sku?: string; description: string; descriptionItems: string[]; categories: { url: string }[]; images: Image[]; catalogueUrls: string[]; presentationImage?: string; presentationGallery: string[]; displayOrder: number; seoTitle: string; seoDescription: string; editorialNotes: string };
type SourceResource = { _status?: "draft" | "published"; sourceUrl: string; title: string; slug: string; type: "catalogue" | "material" | "article" | "gallery"; excerpt?: string; file?: string; coverImage?: string; images: string[]; products?: string[]; blocks: { tag: string; text: string }[]; materials?: { name: string; coatingMass: string; warranty: string }[]; seoTitle?: string; seoDescription?: string; editorialNotes?: string };

const read = async <T,>(filename: string): Promise<T> => JSON.parse(await readFile(filename, "utf8"));
const downloads = await read<Download[]>(process.env.CMS_DOWNLOAD_MANIFEST || ".data/download-manifest.json");
const sourceDirectory = process.env.CMS_SOURCE_DIR || "data/roofseal-source";
const categories = await read<SourceCategory[]>(`${sourceDirectory}/categories.json`);
const products = await read<SourceProduct[]>(`${sourceDirectory}/products.json`);
const resources = await read<SourceResource[]>(`${sourceDirectory}/resources.json`);
const payload = await getPayload({ config });
const mediaIds = new Map<string, number>();
const categoryIds = new Map<string, number>();
const productIds = new Map<string, number>();
const newCategories = new Set<string>();
const newProducts = new Set<string>();
const created = { media: 0, categories: 0, products: 0, resources: 0 };

// Imports are trusted local operations. Public routes always enforce access control.
for (const file of downloads) {
  const existing = await payload.find({ collection: "media", where: { sourceUrl: { equals: file.url } }, limit: 1, overrideAccess: true });
  if (existing.docs[0]) {
    mediaIds.set(file.url, existing.docs[0].id);
    continue;
  }
  const record = await payload.create({ collection: "media", filePath: file.path, overrideAccess: true, data: { alt: file.alt, sourceUrl: file.url, checksum: file.checksum } });
  mediaIds.set(file.url, record.id);
  created.media++;
  if (created.media % 20 === 0) console.log(`Imported ${created.media}/${downloads.length} uploads`);
}
function mediaId(url?: string | null) {
  if (!url) return undefined;
  const id = mediaIds.get(url);
  if (!id) throw new Error(`Media has not been downloaded/imported: ${url}`);
  return id;
}

for (const item of categories) {
  const existing = await payload.find({ collection: "categories", where: { sourceUrl: { equals: item.sourceUrl } }, limit: 1, overrideAccess: true });
  if (existing.docs[0]) {
    categoryIds.set(item.sourceUrl, existing.docs[0].id);
    if (!existing.docs[0].importRelationshipsComplete) newCategories.add(item.sourceUrl);
    continue;
  }
  const productImage = products.find((p) => p.categories.some((c) => c.url === item.sourceUrl))?.images[0]?.url;
  const record = await payload.create({ collection: "categories", overrideAccess: true, data: {
    name: item.name, slug: item.slug, sourceUrl: item.sourceUrl, heading: item.title,
    description: item.description, division: /metal-door|fire-rated/.test(item.slug) ? "doors" : "metal",
    displayOrder: item.displayOrder, image: mediaId(item.presentationImage || productImage),
    faqs: item.faqs.map(({ question, answer, group }) => ({ question, answer, group })),
    seo: { title: item.seoTitle, description: item.seoDescription }, _status: item._status || "published",
  } });
  categoryIds.set(item.sourceUrl, record.id); newCategories.add(item.sourceUrl); created.categories++;
}
for (const item of categories) {
  if (newCategories.has(item.sourceUrl)) {
    await payload.update({ collection: "categories", id: categoryIds.get(item.sourceUrl)!, overrideAccess: true, data: { parent: item.parentSourceUrl ? categoryIds.get(item.parentSourceUrl) : undefined, importRelationshipsComplete: true } });
  }
}

for (const item of products) {
  const existing = await payload.find({ collection: "products", where: { sourceUrl: { equals: item.sourceUrl } }, limit: 1, overrideAccess: true });
  if (existing.docs[0]) {
    productIds.set(item.sourceUrl, existing.docs[0].id);
    if (!existing.docs[0].importRelationshipsComplete) newProducts.add(item.sourceUrl);
    continue;
  }
  const categoryRelations = item.categories.map((c) => categoryIds.get(c.url));
  if (categoryRelations.some((id) => id === undefined)) throw new Error(`Unknown category for ${item.title}`);
  const record = await payload.create({ collection: "products", overrideAccess: true, data: {
    title: item.title, slug: item.slug, sourceUrl: item.sourceUrl, sourceId: item.sourceId, sku: item.sku,
    description: item.description, features: item.descriptionItems.map((text) => ({ text })),
    categories: categoryRelations as number[], displayOrder: item.displayOrder,
    cardImage: mediaId(item.presentationImage || item.images[0]?.url),
    gallery: (item.presentationGallery.length ? item.presentationGallery : item.images.map((i) => i.url)).map((url) => mediaId(url)!),
    catalogue: mediaId(item.catalogueUrls[0]), editorialNotes: item.editorialNotes,
    seo: { title: item.seoTitle, description: item.seoDescription }, _status: item._status || "published",
  } });
  productIds.set(item.sourceUrl, record.id); newProducts.add(item.sourceUrl); created.products++;
}
for (const item of products) {
  if (!newProducts.has(item.sourceUrl)) continue;
  const related = products.filter((p) => p.sourceUrl !== item.sourceUrl && p.categories.some((c) => item.categories.some((own) => own.url === c.url)))
    .sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 4).map((p) => productIds.get(p.sourceUrl)!);
  await payload.update({ collection: "products", id: productIds.get(item.sourceUrl)!, overrideAccess: true, data: { relatedProducts: related, importRelationshipsComplete: true } });
}

function richText(blocks: SourceResource["blocks"]): NonNullable<Resource["content"]> {
  return { root: { type: "root", format: "", direction: "ltr", indent: 0, version: 1, children: blocks.map((b) => ({
    type: /^h[2-4]$/.test(b.tag) ? "heading" : "paragraph", tag: /^h[2-4]$/.test(b.tag) ? b.tag : undefined,
    format: "", direction: "ltr", indent: 0, version: 1,
    children: [{ type: "text", text: b.text, format: 0, detail: 0, mode: "normal", style: "", version: 1 }],
  })) } };
}

for (const item of resources) {
  const existing = await payload.find({ collection: "resources", where: { sourceUrl: { equals: item.sourceUrl } }, limit: 1, overrideAccess: true });
  if (existing.docs.length) continue;
  const images = item.images.filter((url) => !url.toLowerCase().endsWith(".pdf"));
  const attachments = item.images.filter((url) => url.toLowerCase().endsWith(".pdf"));
  const cover = item.coverImage?.toLowerCase().endsWith(".pdf") ? images[0] : item.coverImage;
  await payload.create({ collection: "resources", overrideAccess: true, data: {
    title: item.title, slug: item.slug, type: item.type, sourceUrl: item.sourceUrl, excerpt: item.excerpt,
    content: richText(item.blocks), materials: item.materials, editorialNotes: item.editorialNotes,
    file: mediaId(item.file), coverImage: mediaId(cover), images: images.map((url) => mediaId(url)!),
    attachments: attachments.map((url) => mediaId(url)!),
    products: (item.products || []).map((url) => productIds.get(url)!),
    seo: { title: item.seoTitle, description: item.seoDescription }, _status: item._status || "published",
  } });
  created.resources++;
}
const totals: Record<string, number> = {};
for (const collection of ["media", "categories", "products", "resources"] as const) {
  totals[collection] = (await payload.count({ collection, overrideAccess: true })).totalDocs;
}
await writeFile(process.env.CMS_IMPORT_REPORT || ".data/import-report.json", JSON.stringify({ created, totals, completedAt: new Date().toISOString() }, null, 2));
console.log(JSON.stringify({ created, totals }, null, 2));
await payload.destroy();
process.exit(0);
