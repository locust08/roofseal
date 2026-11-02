import type { Metadata } from "next";
import { ResourceListing } from "@/components/sites/roofseal/resources/ResourceListing";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Materials" };
export default function Page() { return <ResourceListing type="material" title="Materials" path="/materials" description="Explore roofing materials, coatings and colour information to support your product enquiry." />; }
