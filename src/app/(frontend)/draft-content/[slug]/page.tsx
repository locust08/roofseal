import type { Metadata } from "next";
import { notFound } from "next/navigation";
import drafts from "../../../../../data/roofseal-blog-drafts.json";
import { BlogArticle } from "@/components/sites/roofseal/resources/BlogArticle";
import type { BlogCategory } from "@/lib/resource-links";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Draft content review", robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Preview only explicitly generated repository copy, never private CMS records.
  if (process.env.NODE_ENV !== "development") notFound();
  const slug = (await params).slug;
  const content = drafts.find((post) => post.slug === slug);
  if (!content) notFound();
  return <BlogArticle title={content.title} excerpt={content.excerpt} category={content.category as BlogCategory} cover={content.coverImage} draft>
    {content.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
  </BlogArticle>;
}
