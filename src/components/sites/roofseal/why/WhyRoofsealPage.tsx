import { BlurHeading } from "@/components/sites/roofseal/shared/BlurHeading";
import { Banner, Breadcrumbs, Cta } from "../shared/ui";
import styles from "./why.module.css";

const benefits = [
  ["Over Three Decades of Experience", "Established in 1990, Roofseal brings extensive experience in manufacturing and supplying building products across Malaysia.", "over-three-decades-of-experience"],
  ["Established Manufacturing Capabilities", "Our facilities are supported by modern equipment and experienced professionals to maintain consistent product quality.", "established-manufacturing-capabilities"],
  ["Two Core Product Divisions", "Our Metal Roofing and Doors & Frames divisions provide a wider range of products for different building requirements.", "two-core-product-divisions"],
  ["Quality Materials", "We use quality materials, including coated steel supplied by NS BlueScope Malaysia, for consistent product performance.", "quality-materials"],
  ["Customisable Products", "Our products can be customised in various profiles, dimensions, materials, and specifications to suit project requirements.", "customisable-products"],
  ["Comprehensive Product Range", "From metal roofing and insulation to metal door frames and fire-rated doors, we offer products under one trusted name.", "comprehensive-product-range"],
  ["Practical Industry Knowledge", "Our experience helps us understand project requirements and provide practical product recommendations for different applications.", "practical-industry-knowledge"],
  ["Experience Across Malaysia", "We work closely with clients, consultants, and contractors to understand requirements and support each project effectively.", "experience-across-malaysia"],
  ["Built for the Construction Industry", "Our products have supported commercial, residential, industrial, private, and government projects across Malaysia.", "built-for-the-construction-industry"],
] as const;

export function WhyRoofsealPage() {
  return <main>
    <Breadcrumbs items={[{ label: "Why Roofseal" }]} />
    <Banner title="Why Roofseal" imageSrc="/sites/roofseal/banners/dekstop-banner-why-roofseal.webp" preShaded />
    <section className={styles.body}>
      <div className={styles.intro} data-fade>
        <BlurHeading>Built on <em>Experience</em>. Driven by <em>Manufacturing</em></BlurHeading>
        <p>Since 1990, Roofseal Malaysia has grown from a metal roofing subcontractor into an established manufacturer and supplier of metal roofing, insulation, metal door frames, and fire-rated doors. With more than three decades of industry experience, we combine manufacturing expertise, quality materials, practical product knowledge, and a skilled workforce to serve the evolving needs of Malaysia’s construction industry.</p>
      </div>
      <div className={styles.grid}>
        {benefits.map(([title, copy, icon]) => <article key={icon} data-benefit={icon} className={styles.card}>
          <div className={styles.icon}><img src={`/sites/roofseal/why/${icon}.png`} alt="" width={50} height={50} /></div>
          <h3>{title}</h3><p>{copy}</p>
        </article>)}
      </div>
    </section>
    <Cta />
  </main>;
}
