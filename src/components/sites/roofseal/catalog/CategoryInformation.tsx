import Link from "next/link";
import { categorySupportingContent } from "./supporting-content";
import styles from "./category-information.module.css";

export function CategoryInformation({ slug }: { slug: string }) {
  const content = categorySupportingContent[slug];
  if (!content) return null;
  return <section className={styles.information} aria-label="Additional product information">
    <div className={`narrow ${styles.columns}`}>
      {content.columns.map((column) => <div key={`${column.heading}-${column.emphasis}`}>
        <h2>{column.heading} <span>{column.emphasis}</span>{column.suffix}</h2>
        {column.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {column.bullets && <ul>{column.bullets.map((bullet) => <li key={bullet.text}>{bullet.label && <strong>{bullet.label}: </strong>}{bullet.text}</li>)}</ul>}
        {column.contact && <p><Link href="/contact-us">Contact us</Link> now for more info!</p>}
      </div>)}
    </div>
  </section>;
}
