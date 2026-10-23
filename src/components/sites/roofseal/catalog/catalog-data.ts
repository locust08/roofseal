import data from "./live-catalog.json";

export type CatalogCategory = {
  slug: string;
  name: string;
  source: string;
  heading: string;
  intro: string[];
  content: string;
  children: { slug: string; name: string; source: string }[];
  products: { slug: string; name: string; source: string }[];
};
export const catalogCategories: CatalogCategory[] = data.categories;
export const catalogProducts = data.products;
export type CatalogProduct = (typeof catalogProducts)[number];
export const categoryBySlug = (slug: string) =>
  catalogCategories.find((category) => category.slug === slug);
export const productBySlug = (slug: string) =>
  catalogProducts.find((product) => product.slug === slug);
export function parentCategory(category: CatalogCategory) {
  return catalogCategories.find((parent) =>
    parent.children.some((child) => child.slug === category.slug),
  );
}
export function divisionFor(category: CatalogCategory) {
  return ["metal-door-frames", "fire-rated-door"].includes(category.slug)
    ? { name: "Doors & Frames Division", slug: "doors-frames-division" }
    : { name: "Metal Roofing Division", slug: "metal-roofing-division" };
}
