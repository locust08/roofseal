import { asset } from "../shared/assets";
import { Banner, Breadcrumbs, Cta } from "../shared/ui";
import { CategoryGrid, ProductGrid } from "./catalog-grids";
import styles from "./catalog.module.css";
export function DivisionContent() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Products", href: "/metal-roofing-division" },
          { label: "Metal Roofing Division" },
        ]}
      />
      <Banner title="Metal Roofing Division" node="28352:1837" />
      <section className={styles.body}>
        <div className={styles.intro}>
          <h2>
            <em>Complete Metal Roofing Systems</em> Built for Malaysia
          </h2>
          <p>
            With more than three decades of industry experience, Roofseal
            manufactures and supplies a comprehensive range of sheet metal
            roofing systems and related building solutions for residential,
            commercial, industrial, private, and government projects across
            Malaysia.
          </p>
          <p>
            From metal roof coverings and insulation to gutters, skylights and
            structural components, our Metal Roofing Division brings together
            the essential products required to create practical, durable and
            reliable roofing systems suited to Malaysia’s climate and
            construction requirements.
          </p>
        </div>
        <hr className={styles.divider} />
        <CategoryGrid />
      </section>
      <Cta />
    </>
  );
}
export function CoveringContent() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Products", href: "/metal-roofing-division" },
          { label: "Metal Roofing Division", href: "/metal-roofing-division" },
          { label: "Roof Covering" },
        ]}
      />
      <Banner title="Roof Covering" node="28352:2029" />
      <section className={`${styles.body} ${styles.covering}`}>
        <div className={styles.intro}>
          <h2>
            Forms Of <em>Roof Covering</em> &amp; <em>Roof Systems</em>
          </h2>
          <p>
            Roof covering is the outermost layer that shields the building from
            the elements. It includes materials like shingles or sheet metal.
            Roof systems encompass all the components of a roof, including
            structural, insulation, and drainage system. They work together to
            provide protection, energy efficiency, and structural integrity.
            Investing in quality roof coverings and robust roof systems ensures
            a stable and secure living environment. Metal roofs provide energy
            savings, beauty, and protection for your home that can last a
            lifetime. Metal roofs are available in a wide variety of designs and
            colors to complement any style.
          </p>
        </div>
        <hr className={styles.divider} />
        <CategoryGrid covering />
      </section>
      <RoofingFaq />
      <Cta />
    </>
  );
}
function RoofingFaq() {
  const missing =
    "The prototype does not include the expanded content for this item. Contact Roofseal at enquiry@roofseal.com.my for more information.";
  return (
    <section className={styles.faq}>
      <img
        className={styles.cut}
        src={asset("28352:1975", "imgSectionBackground")}
        alt=""
      />
      <div className={styles.columns}>
        <div>
          <h3>
            Why <em>Metal Roofing</em>?
          </h3>
          <details open>
            <summary>Expected life</summary>
            <p>
              A properly installed metal roof should last as long as the house,
              sealing out water and surviving high winds. Metal is resistant to
              fire, mildew, insects, and rot. Warranties are available.
            </p>
          </details>
          <details>
            <summary>Speed &amp; ease of roofing installation</summary>
            <p>{missing}</p>
          </details>
          <details>
            <summary>Minimal roof pitch</summary>
            <p>{missing}</p>
          </details>
        </div>
        <div>
          <h3>
            Why <em>Shingles Roofing</em>?
          </h3>
          <details>
            <summary>Value</summary>
            <p>{missing}</p>
          </details>
          <details>
            <summary>Variety of style</summary>
            <p>{missing}</p>
          </details>
        </div>
      </div>
    </section>
  );
}
export function SystemContent() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Products", href: "/metal-roofing-division" },
          { label: "Metal Roofing Division", href: "/metal-roofing-division" },
          { label: "Roof Covering", href: "/roof-covering" },
          { label: "Metal Roof System" },
        ]}
      />
      <Banner title="Metal Roof System" node="28383:5381" />
      <section className={`${styles.body} ${styles.system}`}>
        <div className={styles.intro}>
          <h2>
            Best <em>Zinc Roofing</em> &amp; <em>Metal Roofing Sheets</em>
            <br />
            Supplier in Malaysia
          </h2>
          <p>
            Metal deck roof sheet are tough, durable, and lightweight, and they
            can last for a long time especially with Malaysia’s climate. As a
            leading metal roofing sheet supplier, we offer high-quality products
            designed to withstand harsh wind and heavy rain, ensuring reliable
            protection for your home or building. These zinc roofing and metal
            roofing sheets provide long-lasting performance with minimal
            maintenance, making them a practical and efficient roofing solution.
            At our roofing sheet factory, we produce metal roofing sheets that
            not only excel in durability but also enhance thermal comfort when
            paired with good insulation, keeping buildings cool throughout the
            day. In addition, these sheets can be cut to any specific size
            needed; thus, they provide flexibility in any kind of construction.
            Another advantage of these metal deck roofing sheets is their
            environmentally friendly nature, as they can be recycled after
            serving for decades and reduce waste, promoting sustainability.
            Ready to upgrade your property with the best metal roofing and zinc
            roofing from a trusted metal roofing sheet supplier in Malaysia?{" "}
            <a href="mailto:enquiry@roofseal.com.my">
              <strong className={styles.contact}>Contact us</strong>
            </a>{" "}
            today to explore our options and get expert installation for a
            durable and eco-friendly roofing solution!
          </p>
        </div>
        <hr className={styles.divider} />
        <ProductGrid />
      </section>
      <RoofingInformation />
      <Cta />
    </>
  );
}
function RoofingInformation() {
  return (
    <section className={styles.info}>
      <img
        className={styles.cut}
        src={asset("28401:5604", "imgSectionBackground")}
        alt=""
      />
      <div className={styles.columns}>
        <div>
          <h3>
            More on <em>Metal Roofing Sheets</em>
          </h3>
          <p>
            Metal roofing sheets, when paired with good insulations, can keep a
            building feeling cool for the whole day. Besides, they can be cut
            into sizes based on preferences. Zinc roofing or sheet metal are
            environmentally friendly and can be recycled after a few decades of
            using them.
          </p>
        </div>
        <div>
          <h3>
            Different types of <em>Metal Roofing Sheets</em>
          </h3>
          <ul>
            <li>
              DECK Profile: This metal roofing sheet profile is the basic
              essential profile that is widely used.
            </li>
            <li>
              CLIP Profile: This metal roofing sheet profile is used for its
              clip-on convenience and safety for low-pitched roofs.
            </li>
            <li>
              EURO Profile: This metal roofing sheet profile gives subtle
              elegance as the best replacement for traditional clay tiles.
            </li>
            <li>
              SPAN Profile: This metal roofing sheet profile is trapezoidal
              ribbed for modern corrugated stylishness.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
