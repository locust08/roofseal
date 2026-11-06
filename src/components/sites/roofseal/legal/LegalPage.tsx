import { BlurHeading } from "@/components/sites/roofseal/shared/BlurHeading";
import Link from "next/link";
import { Banner, Breadcrumbs, Cta } from "../shared/ui";
import { legalCopy, type LegalDocument } from "./legal-copy";
import styles from "./legal.module.css";

export function LegalPage({ document }: { document: LegalDocument }) {
  const copy = legalCopy[document];
  return <main>
    <Breadcrumbs items={[{ label: copy.title }]} />
    <Banner title={copy.title} node="28352:1837" />
    <article className={styles.body}>
      <aside className={styles.notice} aria-label="Draft status">
        <strong>Draft for client review</strong>
        <p>Generated draft copy for review by Roofseal. These terms and privacy statements have not been approved for publication.</p>
      </aside>
      {copy.languages.map((language) => <section className={styles.language} id={language.id} key={language.id} lang={language.lang} aria-labelledby={`${language.id}-heading`}>
        <BlurHeading id={`${language.id}-heading`}>{language.title}</BlurHeading>
        <p className={styles.intro}>{language.intro}</p>
        {language.sections.map((section, index) => <section className={styles.section} key={section.title}>
          <h3>{index + 1}. {section.title}</h3>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>)}
        <div className={styles.contact}>
          <h3>Contact Roofseal</h3>
          <a href="mailto:enquiry@roofseal.com.my">enquiry@roofseal.com.my</a>
          <Link href={document === "privacy" ? "/terms-and-conditions" : "/privacy-policy"}>
            {document === "privacy" ? "Read our Terms & Conditions" : "Read our Privacy Policy"}
          </Link>
        </div>
      </section>)}
    </article>
    <Cta />
  </main>;
}
