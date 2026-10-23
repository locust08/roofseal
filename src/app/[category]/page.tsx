import { notFound } from "next/navigation";
import {
  catalogCategories,
  categoryBySlug,
} from "@/components/sites/roofseal/catalog/catalog-data";
import {
  DoorsDivisionPage,
  ExpandedCatalogPage,
} from "@/components/sites/roofseal/catalog/expanded-catalog";
const existing = ["roof-covering", "metal-roof-system"];
export function generateStaticParams() {
  return [
    ...catalogCategories
      .filter((category) => !existing.includes(category.slug))
      .map((category) => ({ category: category.slug })),
    { category: "doors-frames-division" },
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return {
    title:
      category === "doors-frames-division"
        ? "Doors & Frames Division"
        : categoryBySlug(category)?.name || "Products",
  };
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  if (slug === "doors-frames-division") return <DoorsDivisionPage />;
  const category = categoryBySlug(slug);
  if (!category) notFound();
  return <ExpandedCatalogPage category={category} />;
}
