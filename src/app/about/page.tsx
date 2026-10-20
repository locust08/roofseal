import type { Metadata } from "next";
import { AboutPage } from "@/components/sites/roofseal/about/AboutPage";
export const metadata: Metadata = { title: "About Us | Roofseal" };
export default function Page() {
  return <AboutPage />;
}
