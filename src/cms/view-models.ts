import type { Category, Media, Product } from "../payload-types";

export type CategoryView = { id: number; name: string; slug: string; href: string; image: string; parentId?: number; division: "metal" | "doors"; heading: string; description: string };
export type ProductCardView = { id: number; title: string; slug: string; href: string; image: string; category: string };
export type ProductView = ProductCardView & { description: string; features: string[]; sku?: string; gallery: { url: string; alt: string }[]; catalogue?: string; categories: { label: string; href: string }[]; specifications: { label: string; value: string }[] };
export type QuoteItem = Pick<ProductCardView, "id" | "title" | "slug" | "image">;

export function categoryHref(slug: string): string {
  const existing: Record<string, string> = { "roof-covering": "/roof-covering", "metal-deck-roofing-sheets": "/metal-roof-system" };
  return existing[slug] || `/categories/${encodeURIComponent(slug)}`;
}

export function mediaUrl(media: number | Media | null | undefined, size?: "card" | "large"): string {
  if (!media || typeof media === "number") return "";
  const url = size ? media.sizes?.[size]?.url || media.url : media.url;
  if (!url) return "";
  // Upload URLs belong to this application, including when its hostname changes.
  return new URL(url, "http://roofseal.local").pathname;
}

export function categoryView(category: Category): CategoryView {
  return { id: category.id, name: category.name, slug: category.slug, href: categoryHref(category.slug), image: mediaUrl(category.image),
    parentId: typeof category.parent === "number" ? category.parent : category.parent?.id,
    division: category.division, heading: category.heading || category.name, description: category.description || "" };
}

export function productCard(product: Product): ProductCardView {
  const category = product.categories.find((c): c is Category => typeof c !== "number");
  return { id: product.id, title: product.title, slug: product.slug, href: `/products/${encodeURIComponent(product.slug)}`,
    image: mediaUrl(product.cardImage) || mediaUrl(product.gallery?.[0]), category: category?.name || "Products" };
}

export function productView(product: Product): ProductView {
  const categories = product.categories.filter((c): c is Category => typeof c !== "number");
  const parents = categories.flatMap((c) => typeof c.parent === "object" && c.parent ? [c.parent] : []);
  const breadcrumbs = [...new Map([...parents, ...categories].map((c) => [c.id, c])).values()];
  return { ...productCard(product), description: product.description || "", features: product.features?.map((f) => f.text) || [], sku: product.sku || undefined,
    gallery: (product.gallery || []).filter((m): m is Media => typeof m !== "number").map((m) => ({ url: mediaUrl(m), alt: m.alt })),
    catalogue: mediaUrl(product.catalogue) || undefined, categories: breadcrumbs.map((c) => ({ label: c.name, href: categoryHref(c.slug) })),
    specifications: product.specifications?.map(({ label, value }) => ({ label, value })) || [] };
}

export function parseQuoteItems(value: string | null): QuoteItem[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is QuoteItem => !!item && typeof item === "object" && Number.isInteger(item.id) && typeof item.title === "string" && typeof item.slug === "string" && /^[a-z0-9-]+$/.test(item.slug) && typeof item.image === "string" && /^\/(?:api\/media\/file|sites\/roofseal)\//.test(item.image))
      .filter((item, index, all) => all.findIndex((other) => other.id === item.id) === index).slice(0, 100);
  } catch { return []; }
}
