import type { Metadata } from "next";
import { BlogListing } from "@/components/sites/roofseal/resources/BlogListing";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Articles" };
export default function Page() { return <BlogListing category="article" />; }
