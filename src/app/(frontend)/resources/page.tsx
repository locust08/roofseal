import type { Metadata } from "next";
import Link from "next/link";
import { getResources } from "@/lib/cms-content";
import { mediaUrl } from "@/cms/view-models";
import { Breadcrumbs, Cta, Icon } from "@/components/sites/roofseal/shared/ui";
import catalog from "@/components/sites/roofseal/catalog/catalog.module.css";
import styles from "./resources.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Resources", description: "Roofseal product catalogues, roofing materials, galleries and articles." };
export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const resources = await getResources(type);
  return <main>
    <Breadcrumbs items={[{ label: "Resources" }]} />
    <section className={catalog.body}>
      <div className={catalog.intro}><h1>Resources</h1><p>Explore Roofseal product catalogues, materials and roofing information.</p></div>
      <nav className={styles.filters} aria-label="Resource type">
        {[["", "All"], ["catalogue", "Catalogues"], ["material", "Materials"], ["article", "Blogs"], ["gallery", "Galleries"]].map(([value, label]) => <Link key={value} href={value ? `/resources?type=${value}` : "/resources"} aria-current={(type || "") === value ? "page" : undefined}>{label}</Link>)}
      </nav>
      <div className={catalog.products}>{resources.map((resource) => <Link className={catalog.product} href={`/resources/${resource.slug}`} key={resource.id}>
        {mediaUrl(resource.coverImage, "card") ? <img src={mediaUrl(resource.coverImage, "card")} alt={resource.title} /> : <div className={styles.fileIcon}><Icon name="download" /></div>}
        <div className={catalog.productCopy}><span>{resource.type === "article" ? "Blog" : resource.type}</span><h3>{resource.title}</h3></div>
      </Link>)}</div>
      {resources.length === 0 && <p className={styles.empty}>No published resources in this category.</p>}
    </section>
    <Cta />
  </main>;
}
