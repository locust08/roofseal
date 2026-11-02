import { Banner, Breadcrumbs, CategoryCard, Cta } from "../shared/ui";
import styles from "../catalog/catalog.module.css";
import divisionStyles from "./divisions.module.css";

export function DoorsFramesPage() {
  return <main>
    <Breadcrumbs items={[{ label: "Products", href: "/metal-roofing-division" }, { label: "Doors & Frames Division" }]} />
    <Banner title="Doors & Frames Division" imageSrc="/sites/roofseal/divisions/doors-frames-banner.jpg" preShaded />
    <section className={styles.body}>
      <div className={styles.intro} data-fade>
        <h2><em>Metal Door Frames &amp; Fire-Rated Doors</em> Built for Malaysia</h2>
        <p>With more than three decades of industry experience, Roofseal manufactures and supplies metal door frames and fire-rated doors for residential, commercial, and industrial applications across Malaysia.</p>
        <p>Discover our Doors &amp; Frames Division’s range of metal door frames and fire-rated doors, manufactured for reliable performance, customisable requirements, and a wide range of building applications.</p>
      </div>
      <hr className={styles.divider} />
      <div className={divisionStyles.categories}>
        <CategoryCard title="Metal Door Frame" image="/sites/roofseal/divisions/metal-door-frame-card.png" href="/categories/metal-door-frames" />
        <CategoryCard title="Fire Rated Door" image="/sites/roofseal/divisions/fire-rated-door-card.png" href="/categories/fire-rated-doors-supplier-malaysia" />
      </div>
    </section>
    <Cta />
  </main>;
}
