import { notFound } from "next/navigation";
import {
  catalogProducts,
  productBySlug,
} from "@/components/sites/roofseal/catalog/catalog-data";
import { CatalogProductPage } from "@/components/sites/roofseal/catalog/catalog-product";
import { RelatedCatalog } from "@/components/sites/roofseal/catalog/expanded-catalog";
import { Cta } from "@/components/sites/roofseal/shared/ui";
export function generateStaticParams() {
  return catalogProducts
    .filter((product) => product.slug !== "roofseal-deck762")
    .map((product) => ({ slug: product.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return { title: productBySlug((await params).slug)?.name || "Product" };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = productBySlug((await params).slug);
  if (!product) notFound();
  return (
    <>
      <CatalogProductPage product={product} />
      <RelatedCatalog
        categorySlug={product.categories[0]}
        excludeSlug={product.slug}
      />
      <Cta />
    </>
  );
}
