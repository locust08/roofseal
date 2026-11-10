import { BlurHeading } from "@/components/sites/roofseal/shared/BlurHeading";
import Link from "next/link";
import { getResources } from "@/lib/cms-content";
import { resourceHref, resourceNavigation } from "@/lib/resource-links";
import { mediaUrl } from "@/cms/view-models";
import { Banner, Breadcrumbs, Cta, Icon } from "../shared/ui";
import catalog from "../catalog/catalog.module.css";
import styles from "./resources.module.css";

export async function ResourceListing({ type, title, description, path }: { type?: string; title: string; description: string; path: string }) {
  const resources = await getResources(type);
  return <main>
    <Breadcrumbs items={[...(path === "/resources" ? [] : [{ label: "Resources", href: "/resources" }]), { label: title }]} />
    <Banner title={title} node="28352:1837" />
    <section className={styles.body}>
      <div className={styles.intro}><BlurHeading>{title === "Resources" ? "Roofseal Resources" : `Explore Our ${title}`}</BlurHeading><p>{description}</p></div>
      {type !== "catalogue" && <nav className={styles.navigation} aria-label="Resource sections">{resourceNavigation.map((item) => <Link key={item.href} href={item.href} aria-current={item.href === path ? "page" : undefined}>{item.label}</Link>)}</nav>}
      <div className={`${catalog.products} ${type === "catalogue" ? styles.catalogueGrid : ""}`}>{resources.map((resource) => <Link data-fade className={catalog.product} href={resourceHref(resource)} target={resource.type === "catalogue" ? "_blank" : undefined} rel={resource.type === "catalogue" ? "noopener noreferrer" : undefined} prefetch={resource.type === "catalogue" ? false : undefined} key={resource.id}>
        {mediaUrl(resource.coverImage, "card") ? <img src={mediaUrl(resource.coverImage, "card")} alt={resource.title} /> : <div className={styles.fileIcon}><Icon name={resource.type === "article" ? "comments" : "download"} /></div>}
        <div className={catalog.productCopy}><span>{resource.type === "article" ? "Article" : resource.type}</span><h3>{resource.title}</h3></div>
      </Link>)}</div>
      {!resources.length && <p className={styles.empty}>New resources will appear here when available.</p>}
    </section><Cta />
  </main>;
}
