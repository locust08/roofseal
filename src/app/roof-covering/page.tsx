import type { Metadata } from "next";
import { CoveringContent } from "@/components/sites/roofseal/catalog/catalog-pages";
export const metadata: Metadata = { title: "Roof Covering | Roofseal" };
export default function RoofCoveringPage() {
  return <CoveringContent />;
}
