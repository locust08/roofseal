import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/cms-content";
import { BluescopeMaterialsPage } from "@/components/sites/roofseal/materials/BluescopeMaterialsPage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const resource = await getResource("bluescope-materials");
  return {
    title: resource?.seo?.title || resource?.title || "BlueScope Materials",
    description: resource?.seo?.description || resource?.excerpt || undefined,
    alternates: { canonical: "/materials-from-bluescope-malaysia" },
  };
}

export default async function Page() {
  const resource = await getResource("bluescope-materials");
  if (!resource) notFound();
  return <BluescopeMaterialsPage resource={resource} />;
}
