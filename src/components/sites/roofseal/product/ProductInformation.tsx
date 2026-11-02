import Link from "next/link";
import type { ProductApplication } from "@/cms/product-application";
import styles from "./product-information.module.css";

/** Copy supplied in BugHerd #19/#20; existing CMS specifications/PDFs stay authoritative. */
const information: Record<string, { sourceUrl: string; title: string; paragraphs: string[]; contactAfter: string }> = {
  "sealframe-customisable-metal-door-frames": {
    sourceUrl: "https://www.roofseal.com.my/product/sealframe-customisable-metal-door-frames/",
    title: "Perfect Metal Door Frame for Residential and Businesses in Malaysia",
    paragraphs: ["Looking for a durable and stylish door frame for your property? Roofseal offers premium metal door frames for residential and businesses, made from high-quality coated steel using Australian technology, including Electro Galvanised (EG) and BlueScope ZINCALUME®. Designed to withstand Malaysia’s humid weather, these frames resist rust, warping, and termites. With over thirty years of experience, Roofseal ensures both safety and style for your home by providing customisation options, fire-resistant features, and hassle-free installation. If you’re seeking a reliable metal door in Malaysia, Roofseal is your go-to destination for premium products."],
    contactAfter: " today to explore your options and get a free consultation!",
  },
  "polycarbonate-roofing-sheets": {
    sourceUrl: "https://www.roofseal.com.my/product/polycarbonate-roofing-sheets/",
    title: "Explore Roofseal’s Polycarbonate Sheets – Your Ideal Choice for Roofing",
    paragraphs: ["Roofseal’s polycarbonate sheets are the ideal roofing solution for homeowners and businesses in Malaysia. Our polycarbonate sheets offer a perfect combination of durability, UV protection, and stylish designs. Roofseal is trusted for using high-grade materials that ensure long-lasting performance in Malaysia’s challenging weather conditions.", "What sets Roofseal apart, however, is our rigorously tested products at competitive prices, along with excellent customer service supported by a workforce of over 30 years of experience and qualified professionals. From a lightweight, easy-to-carry sheet for installation to customized advice, Roofseal is there for you."],
    contactAfter: " and give your roof a new look today with our polycarbonate sheets.",
  },
};

export function ProductInformation({ slug, application }: { slug: string; application?: ProductApplication | null }) {
  if (application) return <section className={`narrow ${styles.information}`} aria-label="More Information">
    <div className={styles.label}>More Information</div>
    <div className={styles.body}>
      <h2>Application</h2>
      <img className={styles.applicationImage} src={application.image} alt={application.imageAlt} width={application.imageWidth} height={application.imageHeight} />
      <div className={styles.tableScroll} role="region" aria-label="Fastener application table" tabIndex={0}>
        <table className={styles.applicationTable}>
          <caption className={styles.tableCaption}>Fastener application and model selection</caption>
          <thead><tr>{application.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody>{application.rows.map((row, index) => <tr key={index}>
            {row.map((cell, column) => {
              if (column !== 0 || application.columns[0] !== "Application") return <td key={column}>{cell}</td>;
              if (index > 0 && application.rows[index - 1][0] === cell) return null;
              let rowSpan = 1;
              while (application.rows[index + rowSpan]?.[0] === cell) rowSpan++;
              return <th key={column} scope="rowgroup" rowSpan={rowSpan}>{cell}</th>;
            })}
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  </section>;
  const content = information[slug];
  if (!content) return null;
  return <section className={`narrow ${styles.information}`} aria-label="More Information">
    <div className={styles.label}>More Information</div>
    <div className={styles.body}>
      <h2>{content.title}</h2>
      {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <p><Link href="/contact-us">Contact us</Link>{content.contactAfter}</p>
    </div>
  </section>;
}
