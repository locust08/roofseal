import type { Metadata } from "next";
import { productBySlug } from "@/components/sites/roofseal/catalog/catalog-data";
import { CatalogProductPage } from "@/components/sites/roofseal/catalog/catalog-product";
import { RelatedCatalog } from "@/components/sites/roofseal/catalog/expanded-catalog";
import { Cta } from "@/components/sites/roofseal/shared/ui";
export const metadata: Metadata = { title: "Roofseal Deck762" };
export default function Page() {
  const product = productBySlug("roofseal-deck762")!;
  return (
    <>
      <CatalogProductPage product={product} />
      <RelatedCatalog
        categorySlug="metal-roof-system"
        excludeSlug={product.slug}
      />
      <Cta />
    </>
  );
}
