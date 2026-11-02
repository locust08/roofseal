import Link from "next/link";
import { getResources } from "@/lib/cms-content";
import { blogCategories, resourceHref, type BlogCategory } from "@/lib/resource-links";
import { mediaUrl } from "@/cms/view-models";
import drafts from "../../../../../data/roofseal-blog-drafts.json";
import { Banner, Breadcrumbs, Cta } from "../shared/ui";
import { asset } from "../shared/assets";
import styles from "./resources.module.css";

function cardExcerpt(value: string) {
  return value.length <= 180 ? value : `${value.slice(0, 177).replace(/\s+\S*$/, "")}…`;
}

export async function BlogListing({ category }: { category?: BlogCategory }) {
  const posts = await getResources("article", category);
  const title = blogCategories.find((item) => item.value === category)?.label || "Blogs";
  // Preview only repository-generated copy. No private CMS drafts are read here.
  const reviewCopies = process.env.NODE_ENV === "development" ? drafts.filter((draft) => (!category || draft.category === category) && !posts.some((post) => post.slug === draft.slug)) : [];
  return <main>
    <Breadcrumbs items={[{ label: "Resources", href: "/resources" }, ...(category ? [{ label: "Blogs", href: "/blogs" }] : []), { label: title }]} />
    <Banner title={title} node="28352:1837" />
    <section className={styles.body}>
      <div className={styles.intro}><h2>{category ? title : "Ideas, Updates & Events"}</h2><p>Explore roofing articles, company news and event information from Roofseal.</p></div>
      <div className={`wide ${styles.blogLayout}`}>
        <aside className={styles.sidebar}><h2>Categories</h2><nav aria-label="Blog categories">
          <Link href="/blogs" aria-current={!category ? "page" : undefined}>All Posts</Link>
          {blogCategories.map((item) => <Link key={item.value} href={item.href} aria-current={category === item.value ? "page" : undefined}>{item.label}</Link>)}
        </nav></aside>
        <div>
          {!!reviewCopies.length && <p className={styles.previewIntro}>Draft posts are shown here for client review on localhost. They are not published announcements.</p>}
          <div className={styles.posts}>
            {posts.map((post) => <Link key={post.id} href={resourceHref(post)} className={styles.card}>
              <img src={mediaUrl(post.coverImage, "card") || asset("28352:1837", "imgSectionBackground")} alt={post.title} />
              <div className={styles.cardBody}><p className={styles.eyebrow}>{blogCategories.find((item) => item.value === post.postCategory)?.label || "Articles"}</p><h3>{post.title}</h3>{post.excerpt && <p>{cardExcerpt(post.excerpt)}</p>}</div>
            </Link>)}
            {reviewCopies.map((draft) => <Link key={draft.slug} href={`/draft-content/${draft.slug}`} className={styles.card}>
              <img src={draft.coverImage} alt="" />
              <div className={styles.cardBody}><span className={styles.badge}>Draft for client review</span><p className={styles.eyebrow}>{blogCategories.find((item) => item.value === draft.category)?.label}</p><h3>{draft.title}</h3><p>{draft.excerpt}</p></div>
            </Link>)}
          </div>
          {!posts.length && !reviewCopies.length && <p className={styles.empty}>{category === "event" ? "Confirmed event announcements will appear here when available." : "Updates will appear here once published."}</p>}
        </div>
      </div>
    </section><Cta />
  </main>;
}
