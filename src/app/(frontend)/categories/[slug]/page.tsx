import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryView } from "@/cms/view-models";
import { getCategories, getCategory, getProductCards } from "@/lib/cms-content";
import { Breadcrumbs, Banner, Cta } from "@/components/sites/roofseal/shared/ui";
import { CategoryGrid, ProductGrid } from "@/components/sites/roofseal/catalog/catalog-grids";
import styles from "@/components/sites/roofseal/catalog/catalog.module.css";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  return { title: category?.record.seo?.title || category?.view.name || "Category not found", description: category?.record.seo?.description || undefined };
}
export default async function CategoryPage({ params }: Props) {
  const category = await getCategory((await params).slug);
  if (!category) notFound();
  const children = (await getCategories()).map(categoryView).filter((c) => c.parentId === category.view.id);
  const products = await getProductCards(category.view.id);
  return <main>
    <Breadcrumbs items={[{ label: "Products", href: "/metal-roofing-division" }, { label: category.view.name }]} />
    <Banner title={category.view.name} node="28352:1837" />
    <section className={styles.body}>
      <div className={styles.intro}><h2>{category.view.heading}</h2><p>{category.view.description}</p></div>
      <hr className={styles.divider} />
      {children.length > 0 && <CategoryGrid categories={children} />}
      {products.length > 0 && <ProductGrid products={products} />}
    </section>
    <Cta />
  </main>;
}
