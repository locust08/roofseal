import Link from "next/link";
import { asset } from "../shared/assets";
import productStyles from "../product/product.module.css";
import { Breadcrumbs, Cta, Icon } from "../shared/ui";
import {
  catalogCategories,
  categoryBySlug,
  divisionFor,
  parentCategory,
  type CatalogCategory,
} from "./catalog-data";
import styles from "./catalog.module.css";
import extra from "./expanded-catalog.module.css";

export function EmptyProductImage({ name }: { name: string }) {
  return (
    <div
      className={extra.blankImage}
      role="img"
      aria-label={`${name}: image pending`}
    />
  );
}
export function CatalogBanner({
  title,
  back,
}: {
  title: string;
  back: string;
}) {
  return (
    <section className={`page-banner ${extra.pageBanner}`}>
      <div className="banner-shade" />
      <Link className="banner-back wide" href={back}>
        <Icon name="chevron-left" /> Back
      </Link>
      <h1 className="wide">{title}</h1>
      <div className="banner-cut" />
    </section>
  );
}
export function ExpandedProductGrid({
  category,
}: {
  category: CatalogCategory;
}) {
  return (
    <div className={`${styles.products} ${extra.productGrid}`}>
      {category.products.map((product) => (
        <Link
          className={`${styles.product} ${extra.productCard}`}
          key={product.slug}
          href={`/products/${product.slug}`}
        >
          <EmptyProductImage name={product.name} />
          <div className={styles.productCopy}>
            <span>{category.name}</span>
            <h3>{product.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function ExpandedCategoryCards({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  return (
    <div className={styles.categories}>
      {categories.map((category) => (
        <Link
          key={category.slug}
          className={`category-card ${extra.categoryLink}`}
          href={`/${category.slug}`}
        >
          <span aria-hidden="true" className={extra.categoryBlank} />
          <h3>{category.name}</h3>
          <span className="arrow-circle">
            <Icon name="arrow-right" />
          </span>
        </Link>
      ))}
    </div>
  );
}
export function ExpandedCatalogPage({
  category,
}: {
  category: CatalogCategory;
}) {
  const division = divisionFor(category),
    parent = parentCategory(category);
  return (
    <>
      <Breadcrumbs
        items={[
          { label: division.name, href: `/${division.slug}` },
          ...(parent ? [{ label: parent.name, href: `/${parent.slug}` }] : []),
          { label: category.name },
        ]}
      />
      <CatalogBanner
        title={category.name}
        back={`/${parent?.slug || division.slug}`}
      />
      <section
        className={`${styles.body} ${category.children.length ? styles.covering : styles.system}`}
      >
        <div className={styles.intro}>
          <h2>{category.heading || category.name}</h2>
          {category.intro.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <hr className={styles.divider} />
        {category.children.length ? (
          <ExpandedCategoryCards categories={category.children} />
        ) : (
          <ExpandedProductGrid category={category} />
        )}
      </section>
      {category.content && (
        <section className={styles.info}>
          <div className={`${extra.copy} ${extra.content}`}>
            {category.content}
          </div>
        </section>
      )}
      <Cta />
    </>
  );
}
export function DoorsDivisionPage() {
  const categories = catalogCategories.filter((category) =>
    ["metal-door-frames", "fire-rated-door"].includes(category.slug),
  );
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Products", href: "/metal-roofing-division" },
          { label: "Doors & Frames Division" },
        ]}
      />
      <CatalogBanner title="Doors & Frames Division" back="/" />
      <section className={`${styles.body} ${styles.covering}`}>
        <div className={styles.intro}>
          <h2>Doors &amp; Frames</h2>
          {categories.map((category) => (
            <p key={category.slug}>{category.intro[0]}</p>
          ))}
        </div>
        <hr className={styles.divider} />
        <ExpandedCategoryCards categories={categories} />
      </section>
      <Cta />
    </>
  );
}
export function RelatedCatalog({
  categorySlug,
  excludeSlug,
}: {
  categorySlug: string;
  excludeSlug?: string;
}) {
  const category = categoryBySlug(categorySlug);
  const products =
    category?.products
      .filter((product) => product.slug !== excludeSlug)
      .slice(0, 4) || [];
  return category && products.length > 0 ? (
    <section className={productStyles.recommendations}>
      <img
        className={productStyles.topCut}
        src={asset("28318:4405", "imgSectionBackground1")}
        alt=""
      />
      <div className="narrow">
        <h2>You Might Also Like</h2>
        <div className={productStyles.cards}>
          {products.map((product) => (
            <Link
              className={productStyles.card}
              key={product.slug}
              href={`/products/${product.slug}`}
            >
              <EmptyProductImage name={product.name} />
              <div>
                <p>{category.name}</p>
                <h3>{product.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <img
        className={productStyles.bottomCut}
        src={asset("28318:4405", "imgSectionBackground")}
        alt=""
      />
    </section>
  ) : null;
}
