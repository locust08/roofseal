"use client";
import Link from "next/link";
import { Breadcrumbs, DiagonalButton, Icon } from "../shared/ui";
import { useQuoteList } from "../shared/quote-store";
import { categoryBySlug, type CatalogProduct } from "./catalog-data";
import { EmptyProductImage } from "./expanded-catalog";
import styles from "../product/product.module.css";
import extra from "./expanded-catalog.module.css";

export function CatalogProductPage({ product }: { product: CatalogProduct }) {
  const quote = useQuoteList(),
    category = categoryBySlug(product.categories[0]);
  const added = quote.items.some((item) => item.slug === product.slug);
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Products", href: "/metal-roofing-division" },
          ...(category
            ? [{ label: category.name, href: `/${category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />
      <section className={styles.detail}>
        <div className={`${styles.detailGrid} narrow`}>
          <div className={styles.gallery}>
            <Link
              href={`/${category?.slug || "metal-roofing-division"}`}
              className={styles.back}
            >
              <Icon name="chevron-left" /> Back
            </Link>
            <div className={styles.largeImage}>
              <EmptyProductImage name={product.name} />
            </div>
          </div>
          <div className={styles.info}>
            <h1 className={extra.productTitle}>{product.name}</h1>
            <div className={`${styles.description} ${extra.description}`}>
              <h2>Product Description</h2>
              {product.descriptionItems.length ? (
                <ul>
                  {product.descriptionItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{product.description}</p>
              )}
            </div>
            <div className={styles.actions}>
              <DiagonalButton
                onClick={() => quote.add(product.slug, product.name)}
              >
                {added ? "Added to Quote" : "Add to Quote"}
              </DiagonalButton>
              {added && (
                <Link href="/quote">
                  View Quote List <Icon name="arrow-right" />
                </Link>
              )}
            </div>
            <div className={styles.metadata}>
              <p>
                Category:{" "}
                {category && (
                  <Link href={`/${category.slug}`}>{category.name}</Link>
                )}
              </p>
            </div>
            {product.content.length > 0 && (
              <div className={`${styles.description} ${extra.description}`}>
                <h2>Product Information</h2>
                {product.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
