import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ResourceListing } from "@/components/sites/roofseal/resources/ResourceListing";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Resources" };
export default async function Page({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  if (type === "gallery") notFound();
  const destinations: Record<string, string> = { catalogue: "/catalogues", material: "/materials-from-bluescope-malaysia", article: "/blogs" };
  if (type && Object.hasOwn(destinations, type)) redirect(destinations[type]);
  return <ResourceListing title="Resources" path="/resources" description="Browse Roofseal catalogues, material guides and roofing information." />;
}
