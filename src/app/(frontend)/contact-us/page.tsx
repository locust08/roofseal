import type { Metadata } from "next";
import { EnquiryPage } from "@/components/sites/roofseal/enquiry/EnquiryPage";
export const metadata: Metadata = { title: "Contact Us", description: "Contact Roofseal for roofing, insulation, doors and frames enquiries." };
export default function ContactPage() { return <EnquiryPage kind="contact" />; }
