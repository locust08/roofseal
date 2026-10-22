import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { categoryView, productCard, productView } from "@/cms/view-models";
import type { Where } from "payload";
import { draftMode, headers } from "next/headers";

export const getCms = () => getPayload({ config });

async function previewUser() {
  if (!(await draftMode()).isEnabled) return undefined;
  const { user } = await (await getCms()).auth({ headers: await headers() });
  return user && ["admin", "editor"].includes(user.role) ? user : undefined;
}

export const getCategories = cache(async () => {
  const payload = await getCms();
  const result = await payload.find({ collection: "categories", overrideAccess: false, where: { _status: { equals: "published" } }, limit: 100, sort: "displayOrder", depth: 1 });
  return result.docs;
});

export async function getCategory(slug: string) {
  const categories = await getCategories();
  const record = categories.find((c) => c.slug === slug);
  return record ? { record, view: categoryView(record) } : null;
}

export async function getProductCards(categoryId?: number) {
  const payload = await getCms();
  const where: Where = { _status: { equals: "published" } };
  if (categoryId) where.categories = { in: [categoryId] };
  const result = await payload.find({ collection: "products", overrideAccess: false, where, limit: 100, sort: "displayOrder", depth: 1 });
  return result.docs.map(productCard);
}

export async function getProduct(slug: string) {
  const payload = await getCms();
  const user = await previewUser();
  const result = await payload.find({ collection: "products", overrideAccess: false, user, draft: !!user, where: { and: [{ slug: { equals: slug } }, ...(user ? [] : [{ _status: { equals: "published" } }])] }, limit: 1, depth: 2 });
  const record = result.docs[0];
  if (!record) return null;
  const ids = (record.relatedProducts || []).map((p) => typeof p === "number" ? p : p.id);
  const related = ids.length ? (await payload.find({ collection: "products", overrideAccess: false, where: { and: [{ id: { in: ids } }, { _status: { equals: "published" } }] }, limit: 4, sort: "displayOrder", depth: 1 })).docs.map(productCard) : [];
  return { record, view: productView(record), related };
}

export async function getResources(type?: string) {
  const payload = await getCms();
  const where: Where = { _status: { equals: "published" } };
  if (type && ["catalogue", "material", "article", "gallery"].includes(type)) where.type = { equals: type };
  return (await payload.find({ collection: "resources", overrideAccess: false, where, limit: 100, sort: "title", depth: 1 })).docs;
}

export async function getResource(slug: string) {
  const payload = await getCms();
  const user = await previewUser();
  return (await payload.find({ collection: "resources", overrideAccess: false, user, draft: !!user, where: { and: [{ slug: { equals: slug } }, ...(user ? [] : [{ _status: { equals: "published" } }])] }, limit: 1, depth: 1 })).docs[0] || null;
}
