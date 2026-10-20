"use client";

import { useState } from "react";
import Link from "next/link";
import { asset } from "../shared/assets";
import { Breadcrumbs, DiagonalButton, Icon } from "../shared/ui";
import { useQuote } from "../shared/site-shell";
import styles from "./product.module.css";

const recommendations = [
  {
    variable: "imgFeatureCardBackground",
    title: "Roofseal Deck762 with PU Foam/PU Metal Roofing Sheet",
  },
  { variable: "imgFeatureCardBackground1", title: "Roofseal High Rib 30" },
  { variable: "imgFeatureCardBackground2", title: "Roofseal High Rib 30" },
  { variable: "imgFeatureCardBackground3", title: "Roofseal Clip720" },
];

export function ProductPage() {
  const [selected, setSelected] = useState(0);
  const { addQuote, quoted, notify } = useQuote();
  const images = [
    asset("28318:4413", "imgProductImage"),
    asset("28318:4413", "imgProductImage1"),
  ];
  return (
    <main>
      <Breadcrumbs
        items={[
          { label: "Products", href: "/metal-roofing-division" },
          { label: "Roof Covering", href: "/roof-covering" },
          { label: "Metal Roof System", href: "/metal-roof-system" },
          { label: "Roofseal Deck762" },
        ]}
      />
      <section className={styles.detail}>
        <div className={`${styles.detailGrid} narrow`}>
          <div className={styles.gallery}>
            <Link href="/metal-roofing-division" className={styles.back}>
              <Icon name="chevron-left" />
              Back
            </Link>
            <div className={styles.largeImage}>
              <img
                src={images[selected]}
                alt={
                  selected === 0
                    ? "Roofseal Deck762 blue metal roofing sheet"
                    : "Roofseal Deck762 color and profile options"
                }
              />
            </div>
            <div className={styles.thumbnails}>
              {images.map((src, i) => (
                <button
                  key={src}
                  aria-label={`View ${i === 0 ? "roofing sheet" : "color and profile options"}`}
                  aria-pressed={selected === i}
                  onClick={() => setSelected(i)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </div>
          <div className={styles.info}>
            <h1>Roofseal Deck762</h1>
            <div className={styles.description}>
              <h2>Product Description</h2>
              <ul>
                <li>
                  Produced using cold roll-forming process ensures high degree
                  of consistency and dimensional precision.
                </li>
                <li>
                  Suitable for use as roofing, cladding, fascia or hoarding.
                </li>
                <li>
                  Excellent strength weight ratio, durable and cost-effective.
                </li>
                <li>Effective cover at 762mm and Minimum roof pitch of 3°.</li>
                <li>
                  Widely used for commercial and industrial applications like
                  factories, shop lots, condominium and apartments.
                </li>
              </ul>
            </div>
            <div className={styles.actions}>
              <DiagonalButton onClick={addQuote}>
                {quoted ? "Added to Quote" : "Add to Quote"}
              </DiagonalButton>
              <button
                className={styles.catalogue}
                onClick={() =>
                  notify(
                    "The product catalogue file was not supplied with this prototype. Contact enquiry@roofseal.com.my for a copy.",
                  )
                }
              >
                Download Catalogue <Icon name="download" />
              </button>
            </div>
            <div className={styles.metadata}>
              <p>
                <strong>Category:</strong>{" "}
                <Link href="/roof-covering">Roof Covering</Link>
                <span>,</span>
                <Link href="/metal-roof-system">Metal Roof System</Link>
              </p>
              <p>
                <strong>SKU:</strong>
                <span>Deck762</span>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.recommendations}>
        <img
          className={styles.topCut}
          src={asset("28318:4405", "imgSectionBackground1")}
          alt=""
        />
        <div className="narrow">
          <h2>You Might Also Like</h2>
          <div className={styles.cards}>
            {recommendations.map((item) => (
              <button
                key={item.variable}
                className={styles.card}
                onClick={() =>
                  notify(
                    `${item.title}: a separate product detail screen was not supplied. Contact Roofseal for specifications.`,
                  )
                }
              >
                <img
                  src={asset("28318:4405", item.variable)}
                  alt={item.title}
                />
                <div>
                  <p>Metal Roof System</p>
                  <h3>{item.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
        <img
          className={styles.bottomCut}
          src={asset("28318:4405", "imgSectionBackground")}
          alt=""
        />
      </section>
    </main>
  );
}
