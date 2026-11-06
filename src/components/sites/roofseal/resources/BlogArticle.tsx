import { BlurHeading } from "@/components/sites/roofseal/shared/BlurHeading";
import Link from "next/link";
import type { ReactNode } from "react";
import { Banner, Breadcrumbs, Cta } from "../shared/ui";
import { blogCategories, type BlogCategory } from "@/lib/resource-links";
import styles from "./resources.module.css";
export function BlogArticle({ title, excerpt, category, cover, children, draft = false }: { title: string; excerpt?: string | null; category: BlogCategory; cover?: string; children: ReactNode; draft?: boolean }) {
  const section = blogCategories.find((item) => item.value === category)!;
  return <main><Breadcrumbs items={[{ label: "Blogs", href: "/blogs" }, { label: section.label, href: section.href }, { label: title }]} />
    <Banner title={section.label} headingLevel="h2" />
    <article className={styles.article}>
      <Link href={section.href}>‹ Back to {section.label}</Link>
      {draft && <p className={styles.previewIntro}><strong>Draft for client review.</strong> This generated copy has not been approved for publication.</p>}
      <p className={styles.eyebrow}>{section.label}</p><BlurHeading as="h1">{title}</BlurHeading>{excerpt && <p>{excerpt}</p>}
      {cover && <img className={styles.cover} src={cover} alt="" />}
      {children}<p><Link href="/contact-us">Contact Roofseal</Link> to discuss your project.</p>
    </article><Cta />
  </main>;
}
