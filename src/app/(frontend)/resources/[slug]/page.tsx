import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getResource } from "@/lib/cms-content";
import { mediaUrl } from "@/cms/view-models";
import { Breadcrumbs, Cta, Icon } from "@/components/sites/roofseal/shared/ui";
import type { Media } from "@/payload-types";
import styles from "../resources.module.css";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resource = await getResource((await params).slug);
  return { title: resource?.seo?.title || resource?.title || "Resource not found", description: resource?.seo?.description || resource?.excerpt || undefined };
}
export default async function ResourcePage({ params }: Props) {
  const resource = await getResource((await params).slug);
  if (!resource) notFound();
  const files = [resource.file, ...(resource.attachments || [])].filter((m): m is Media => !!m && typeof m !== "number");
  const images = (resource.images || []).filter((m): m is Media => typeof m !== "number" && !!m.mimeType?.startsWith("image/"));
  return <main>
    <Breadcrumbs items={[{ label: "Resources", href: "/resources" }, { label: resource.title }]} />
    <article className={`${styles.prose} narrow`}>
      <Link href="/resources" className={styles.back}><Icon name="chevron-left" /> Back</Link>
      <h1>{resource.title}</h1>
      {resource.excerpt && <p>{resource.excerpt}</p>}
      {files.map((file) => <a className={styles.download} href={mediaUrl(file)} target="_blank" rel="noreferrer" key={file.id}><Icon name="download" /> {files.length === 1 ? "Download Catalogue" : file.alt}</a>)}
      {resource.content && <RichText data={resource.content} />}
      {!!resource.materials?.length && <div className={styles.tableScroll}><table>
        <thead><tr><th>Material</th><th>Coating mass</th><th>Warranty against perforation by corrosion</th></tr></thead>
        <tbody>{resource.materials.map((material) => <tr key={material.id || material.name}><th>{material.name}</th><td>{material.coatingMass}</td><td>{material.warranty}</td></tr>)}</tbody>
      </table></div>}
      {images.length > 0 && <div className={styles.gallery}>{images.map((image) => <a href={mediaUrl(image)} target="_blank" rel="noreferrer" key={image.id}><img src={mediaUrl(image, "large")} alt={image.alt} /></a>)}</div>}
    </article>
    <Cta />
  </main>;
}
