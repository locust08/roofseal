import type { Metadata } from "next";
import { BlogListing } from "@/components/sites/roofseal/resources/BlogListing";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "News" };
export default function Page() { return <BlogListing category="news" />; }
