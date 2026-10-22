import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SiteShell } from "@/components/sites/roofseal/shared/site-shell";
import "../globals.css";
import "../roofseal.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Roofseal — The Building Solution",
    template: "%s | Roofseal",
  },
  description: "Metal roofing, doors and frames manufacturer in Malaysia.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const preview = (await draftMode()).isEnabled;
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- A full navigation clears the cached layout after Draft Mode changes. */}
        {preview && <aside className="cms-preview">Draft preview — visible only to signed-in editors. <a href="/api/exit-preview">Exit preview</a></aside>}
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
