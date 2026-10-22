import { notFound } from "next/navigation";
import { getCategories, getCategory, getProductCards } from "@/lib/cms-content";
import { categoryView } from "@/cms/view-models";
import type { Category } from "@/payload-types";
import { asset } from "../shared/assets";
import { Banner, Breadcrumbs, Cta } from "../shared/ui";
import { CategoryGrid, ProductGrid } from "./catalog-grids";
import styles from "./catalog.module.css";
export async function DivisionContent() {
  const all = (await getCategories()).map(categoryView);
  const order = ["roof-covering", "insulation", "gutter-roof-component", "skylights", "structural"];
  const categories = order.flatMap((slug) => all.filter((c) => c.slug === slug));
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
        <CategoryGrid categories={categories} />
      </section>
      <Cta />
    </>
  );
}
export async function CoveringContent() {
  const category = await getCategory("roof-covering");
  if (!category) notFound();
  const children = (await getCategories()).filter((c) => (typeof c.parent === "number" ? c.parent : c.parent?.id) === category.record.id).map(categoryView);
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
          <p>{category.view.description}</p>
        </div>
        <hr className={styles.divider} />
        <CategoryGrid categories={children} />
      </section>
      <RoofingFaq faqs={category.record.faqs || []} />
      <Cta />
    </>
  );
}
function RoofingFaq({ faqs }: { faqs: NonNullable<Category["faqs"]> }) {
  return <section className={styles.faq}>
    <img className={styles.cut} src={asset("28352:1975", "imgSectionBackground")} alt="" />
    <div className={styles.columns}>
      {(["metal", "shingles"] as const).map((group) => <div key={group}>
        <h3>Why <em>{group === "metal" ? "Metal Roofing" : "Shingles Roofing"}</em>?</h3>
        {faqs.filter((faq) => faq.group === group).map((faq, i) => <details key={faq.id || faq.question} open={group === "metal" && i === 0}>
          <summary>{faq.question}</summary><p>{faq.answer}</p>
        </details>)}
      </div>)}
    </div>
  </section>;
}
export async function SystemContent() {
  const category = await getCategory("metal-deck-roofing-sheets");
  if (!category) notFound();
  const products = await getProductCards(category.record.id);
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
          <p>{category.view.description}</p>
        </div>
        <hr className={styles.divider} />
        <ProductGrid products={products} />
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
