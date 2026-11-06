import type { Metadata } from "next";
import { LegalPage } from "@/components/sites/roofseal/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Draft for Client Review",
  description: "Draft Roofseal website privacy policy in English for client review.",
  robots: { index: false, follow: false },
};

export default function PrivacyPolicyPage() {
  return <LegalPage document="privacy" />;
}
