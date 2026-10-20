"use client";
import Link from "next/link";
import { asset } from "../shared/assets";
import { CategoryCard, Icon } from "../shared/ui";
import { useQuote } from "../shared/site-shell";
import styles from "./catalog.module.css";
export function CategoryGrid({ covering = false }: { covering?: boolean }) {
  const { notify } = useQuote();
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
      {titles.map((title, i) =>
        i === 0 ? (
          <CategoryCard
            key={title}
            image={asset(node, `imgComponent${i + 1}`)}
            title={title}
            href={covering ? "/metal-roof-system" : "/roof-covering"}
          />
        ) : (
          <button
            className="category-card"
            key={title}
            onClick={() =>
              notify(
                `${title} detail pages were not supplied with this prototype.`,
              )
            }
          >
            <img src={asset(node, `imgComponent${i + 1}`)} alt={title} />
            <h3>{title}</h3>
            <span className="arrow-circle" aria-hidden="true">
              <Icon name="arrow-right" />
            </span>
          </button>
        ),
      )}
    </div>
  );
}
export function ProductGrid() {
  const { notify } = useQuote();
  const names = [
    "Roofseal Deck762",
    "Roofseal Deck762 with PU Foam/PU Metal Roofing Sheet",
    "Roofseal High Rib 30",
    "Roofseal High Rib 30",
    "Roofseal Clip720",
    "Roofseal Span",
    "Roofseal Clad",
  ];
  return (
    <div className={styles.products}>
      {names.map((title, i) => {
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
        return i === 0 ? (
          <Link
            className={styles.product}
            key={i}
            href="/products/roofseal-deck762"
          >
            {content}
          </Link>
        ) : (
          <button
            key={i}
            className={styles.product}
            onClick={() =>
              notify(
                `${title} detail pages were not supplied with this prototype.`,
              )
            }
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
