import type { Metadata } from "next";
import { ResourceListing } from "@/components/sites/roofseal/resources/ResourceListing";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Catalogues" };
export default function Page() { return <ResourceListing type="catalogue" title="Catalogues" path="/catalogues" description="Browse Roofseal product catalogues and technical documents. Open a catalogue for the available download." />; }
