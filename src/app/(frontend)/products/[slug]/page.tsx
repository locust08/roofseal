import type { Metadata } from "next";
import { ProductPage } from "@/components/sites/roofseal/product/ProductPage";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/cms-content";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return { title: product?.record.seo?.title || product?.view.title || "Product not found", description: product?.record.seo?.description || undefined };
}
export default async function Page({ params }: Props) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  return <ProductPage key={product.view.id} product={product.view} related={product.related} />;
}
