import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/sites/roofseal/shared/RichText";
import { getResource } from "@/lib/cms-content";
import { mediaUrl } from "@/cms/view-models";
import { BlogArticle } from "@/components/sites/roofseal/resources/BlogArticle";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getResource((await params).slug);
  return { title: post?.title || "Post not found", description: post?.excerpt || undefined };
}
export default async function Page({ params }: Props) {
  const post = await getResource((await params).slug);
  if (!post || post.type !== "article") notFound();
  return <BlogArticle title={post.title} excerpt={post.excerpt} category={post.postCategory || "article"} cover={mediaUrl(post.coverImage, "large")} draft={post._status !== "published"}>
    {post.content && <RichText data={post.content} />}
  </BlogArticle>;
}
