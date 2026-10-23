"use client";
import Link from "next/link";
import { asset } from "../shared/assets";
import { CategoryCard } from "../shared/ui";
import { catalogProducts } from "./catalog-data";
import styles from "./catalog.module.css";
export function CategoryGrid({ covering = false }: { covering?: boolean }) {
  const titles = covering
    ? ["Metal Roof System", "Shingles Roof System"]
    : [
        "Roof Covering",
        "Insulation",
        "Gutter & Roof Component",
        "Skylight",
        "Structural",
      ];
  const node = covering ? "28352:1920" : "28318:4046";
  return (
    <div className={styles.categories}>
      {titles.map((title, i) => (
        <CategoryCard
          key={title}
          image={asset(node, `imgComponent${i + 1}`)}
          title={title}
          href={
            covering
              ? ["/metal-roof-system", "/shingles-roof-system"][i]
              : [
                  "/roof-covering",
                  "/insulation",
                  "/gutter-roof-component",
                  "/skylights",
                  "/structural",
                ][i]
          }
        />
      ))}
    </div>
  );
}
export function ProductGrid() {
  const products = catalogProducts.filter((product) =>
    product.categories.includes("metal-roof-system"),
  );
  return (
    <div className={styles.products}>
      {products.map((product, i) => {
        const title = product.name;
        const content = (
          <>
            <img
              src={asset("28318:4214", `imgFeatureCardBackground${i || ""}`)}
              alt={title}
            />
            <div className={styles.productCopy}>
              <span>Metal Roof System</span>
              <h3>{title}</h3>
            </div>
          </>
        );
        return (
          <Link
            className={styles.product}
            key={product.slug}
            href={`/products/${product.slug}`}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}
