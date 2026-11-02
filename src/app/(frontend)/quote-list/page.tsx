import type { Metadata } from "next";
import { EnquiryPage } from "@/components/sites/roofseal/enquiry/EnquiryPage";
export const metadata: Metadata = { title: "Quote List", description: "Review your Roofseal product shortlist and request a quotation for your project." };
export default function QuotePage() { return <EnquiryPage kind="quote" />; }
