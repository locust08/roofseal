import type { Metadata } from "next";
import { LegalPage } from "@/components/sites/roofseal/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — Draft for Client Review",
  description: "Draft Roofseal website terms and conditions for client review.",
  robots: { index: false, follow: false },
};

export default function TermsAndConditionsPage() {
  return <LegalPage document="terms" />;
}
