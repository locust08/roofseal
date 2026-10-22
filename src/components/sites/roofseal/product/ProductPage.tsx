"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProductView, ProductCardView } from "@/cms/view-models";
import { asset } from "../shared/assets";
import { Breadcrumbs, DiagonalButton, Icon } from "../shared/ui";
import { useQuote } from "../shared/site-shell";
import styles from "./product.module.css";

export function ProductPage({ product, related }: { product: ProductView; related: ProductCardView[] }) {
  const [selected, setSelected] = useState(0);
  const { addQuote, items } = useQuote();
  const images = product.gallery.length ? product.gallery : product.image ? [{ url: product.image, alt: product.title }] : [];
  const quoted = items.some((item) => item.id === product.id);
  return (
    <main>
      <Breadcrumbs items={[{ label: "Products", href: "/metal-roofing-division" }, ...product.categories, { label: product.title }]} />
      <section className={styles.detail}>
        <div className={`${styles.detailGrid} narrow`}>
          <div className={styles.gallery}>
            <Link href={product.categories.at(-1)?.href || "/metal-roofing-division"} className={styles.back}>
              <Icon name="chevron-left" /> Back
            </Link>
            <div className={styles.largeImage}>
              {images.length ? <img src={images[selected]?.url || images[0].url} alt={images[selected]?.alt || product.title} /> : <div className={styles.pendingImage}>Product image awaiting approval</div>}
            </div>
            <div className={styles.thumbnails}>
              {images.map((image, i) => <button key={`${image.url}-${i}`} aria-label={`View ${image.alt || `image ${i + 1}`}`} aria-pressed={selected === i} onClick={() => setSelected(i)}>
                <img src={image.url} alt="" />
              </button>)}
            </div>
          </div>
          <div className={styles.info}>
            <h1>{product.title}</h1>
            <div className={styles.description}>
              <h2>Product Description</h2>
              {product.features.length ? <ul>{product.features.map((feature, i) => <li key={i}>{feature}</li>)}</ul> : <p>{product.description}</p>}
              {product.specifications.length > 0 && <dl>{product.specifications.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>}
            </div>
            <div className={styles.actions}>
              <DiagonalButton onClick={() => addQuote(product)}>{quoted ? "Added to Quote" : "Add to Quote"}</DiagonalButton>
              {product.catalogue && <a className={styles.catalogue} href={product.catalogue} target="_blank" rel="noreferrer">Download Catalogue <Icon name="download" /></a>}
            </div>
            <div className={styles.metadata}>
              <p><strong>Category:</strong>{product.categories.map((category) => <Link key={category.href} href={category.href}>{category.label}</Link>)}</p>
              {product.sku && <p><strong>SKU:</strong><span>{product.sku}</span></p>}
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && <section className={styles.recommendations}>
        <img className={styles.topCut} src={asset("28318:4405", "imgSectionBackground1")} alt="" />
        <div className="narrow">
          <h2>You Might Also Like</h2>
          <div className={styles.cards}>{related.map((item) => <Link key={item.id} className={styles.card} href={item.href}>
            <img src={item.image} alt={item.title} /><div><p>{item.category}</p><h3>{item.title}</h3></div>
          </Link>)}</div>
        </div>
        <img className={styles.bottomCut} src={asset("28318:4405", "imgSectionBackground")} alt="" />
      </section>}
    </main>
  );
}
