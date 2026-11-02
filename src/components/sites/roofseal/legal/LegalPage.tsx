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
        <strong>Draft for client review / Draf untuk semakan pelanggan</strong>
        <p>Generated draft copy for review by Roofseal. These terms and privacy statements have not been approved for publication.</p>
        <p lang="ms">Teks draf yang dijana untuk semakan Roofseal. Terma dan pernyataan privasi ini belum diluluskan untuk penerbitan.</p>
      </aside>
      <nav className={styles.languages} aria-label="Document language">
        <a href="#english" lang="en">English</a>
        <a href="#bahasa-malaysia" lang="ms">Bahasa Malaysia</a>
      </nav>
      {copy.languages.map((language) => <section className={styles.language} id={language.id} key={language.id} lang={language.lang} aria-labelledby={`${language.id}-heading`}>
        <h2 id={`${language.id}-heading`}>{language.title}</h2>
        <p className={styles.intro}>{language.intro}</p>
        {language.sections.map((section, index) => <section className={styles.section} key={section.title}>
          <h3>{index + 1}. {section.title}</h3>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>)}
        <div className={styles.contact}>
          <h3>{language.lang === "en" ? "Contact Roofseal" : "Hubungi Roofseal"}</h3>
          <a href="mailto:enquiry@roofseal.com.my">enquiry@roofseal.com.my</a>
          <Link href={document === "privacy" ? "/terms-and-conditions" : "/privacy-policy"}>
            {document === "privacy" ? (language.lang === "en" ? "Read our Terms & Conditions" : "Baca Terma & Syarat") : (language.lang === "en" ? "Read our Privacy Policy" : "Baca Dasar Privasi")}
          </Link>
        </div>
      </section>)}
    </article>
    <Cta />
  </main>;
}
