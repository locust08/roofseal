"use client";
import { useState } from "react";
import { asset } from "../shared/assets";
import { Breadcrumbs, Icon } from "../shared/ui";
import styles from "./about.module.css";
const a = (node: string, name: string) => asset(`28318:${node}`, name);
const values = [
  ["Quality & Reliability", "imgColor4"],
  ["Customer Commitment", "imgColor5"],
  ["Innovation & Practical Solutions", "imgColor"],
  ["Integrity & Professionalism", "imgColor1"],
  ["Continuous Improvement", "imgColor2"],
  ["Safety & Responsibility", "imgColor3"],
];
const milestones = [
  [
    "1990",
    "Established as a metal roofing subcontractor in Malaysia",
    "imgImage214",
  ],
  [
    "2000",
    "Expanded into trading & stockist of metal roofing, insulation and roof related products",
    "imgImage215",
  ],
  [
    "2005",
    "Expanded into manufacturing of lightweight steel roof trusses, customizable gutter, flashing, capping & other roof accessories",
    "imgImage216",
  ],
];
const environmental = [
  "Promote energy-efficient roofing and insulation systems that help reduce heat transfer and energy consumption",
  "Encourage the use of durable and recyclable metal roofing materials for long-term sustainability",
  "Continuously improve manufacturing efficiency to minimise material wastage and environmental impact",
];
export function AboutPage() {
  const [expanded, setExpanded] = useState(true);
  const [offset, setOffset] = useState(0);
  const [esg, setEsg] = useState<number | null>(null);
  return (
    <main className={styles.about}>
      <Breadcrumbs items={[{ label: "About Us" }]} />
      <section className={styles.intro}>
        <img
          className={styles.introBackground}
          src={a("3860", "imgSectionBackground")}
          alt=""
        />
        <div className={`wide ${styles.introGrid}`}>
          <div className={styles.introCopy}>
            <h1>
              A <em>Trusted Manufacturer of Metal Roofing</em>,
              <em> Doors &amp; Frames</em> In Malaysia
            </h1>
            <p>
              Since its establishment in 1990, Roofseal Malaysia has grown from
              a metal roofing subcontractor into an established manufacturer and
              supplier serving Malaysia’s construction industry. Today, Roofseal
              operates through two core business divisions, the Metal Roofing
              Division and the Doors &amp; Frames Division, providing
              comprehensive building solutions for commercial, residential,
              industrial, private, and government projects across Malaysia.
            </p>
            <p>
              Our Metal Roofing Division specialises in sheet metal roofing
              systems, including metal deck roof and zinc roof solutions
              manufactured using quality coated steel with Australian technology
              supplied by <strong>NS BlueScope Malaysia</strong>. Backed by more
              than three decades of industry experience, quality materials, and
              a skilled workforce, Roofseal has built a strong reputation as one
              of <strong>Malaysia’s leading metal roof suppliers</strong>.
            </p>
            {expanded && (
              <div id="about-full-content">
                <p>
                  Our completed projects span Malaysia�s private and government
                  sectors. We supply roofing profiles, accessories, rainwater
                  goods, insulation and structural products to create complete
                  metal roofing systems.
                </p>
                <p>
                  Our CNC-equipped metal door frame production lines manufacture
                  customised profiles for different wall thicknesses and
                  architectural requirements.
                </p>
                <p>
                  In Malaysia�s tropical climate, roof and building insulation
                  help maintain comfortable indoor temperatures. Our practical
                  knowledge supports customised watertight roof finishes that
                  preserve a building�s appearance.
                </p>
                <p>
                  Experienced professionals support our manufacturing
                  facilities, showroom and sales office, maintaining product
                  quality and providing practical solutions for our clients. We
                  continue to develop our roofing services for local and
                  international markets.
                </p>
                <p>
                  Contact Roofseal for metal roofing, metal door frames,
                  waterproofing membranes and related building requirements.
                </p>
              </div>
            )}
            <button
              className={styles.readMore}
              aria-expanded={expanded}
              aria-controls="about-full-content"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Read Less" : "Read More"}{" "}
              <Icon name="chevron-down" />
            </button>
          </div>
          <div className={styles.collage}>
            <div className={styles.collageTop}>
              <img
                src={a("3860", "imgSectionBackground4")}
                alt="Roofseal manufacturing facility"
              />
            </div>
            <div className={styles.collageBottom}>
              <img
                src={a("3860", "imgSectionBackground3")}
                alt="Roofseal metal roofing manufacturing"
              />
            </div>
            <div className={styles.collageRight}>
              <img
                src={a("3860", "imgSectionBackground1")}
                alt="Roofseal industrial roofing"
              />
            </div>
            <img
              className={styles.decor}
              src={a("3860", "imgGroup1171274887")}
              alt=""
            />
            <img
              className={styles.decorSmall}
              src={a("3860", "imgGroup1171274886")}
              alt=""
            />
          </div>
        </div>
      </section>
      <section className={styles.values}>
        <img
          className={styles.valuesBackground}
          src={a("3878", "imgSectionBackground")}
          alt=""
        />
        <img
          className={styles.valuesDiagonal}
          src={a("3878", "imgSectionBackground1")}
          alt=""
        />
        <div className={`wide ${styles.valuesGrid}`}>
          <div className={styles.core}>
            <h2>
              <em>Core Values</em>
            </h2>
            <div className={styles.valueGrid}>
              {values.map(([label, img]) => (
                <article key={label}>
                  <div className={styles.valueIcon}>
                    <span style={{ maskImage: `url(${a("3878", img)})` }} />
                  </div>
                  <h3>{label}</h3>
                </article>
              ))}
            </div>
          </div>
          <div className={styles.statements}>
            {[
              [
                "Our Vision",
                "imgColor6",
                "To become a trusted and leading roofing solutions provider locally and internationally through innovation, quality workmanship, and continuous improvement.",
              ],
              [
                "Our Mission",
                "imgColor7",
                "To provide high-quality and reliable roofing solutions that meet industry standards while delivering value-added products and services to our clients.",
              ],
            ].map(([title, img, copy]) => (
              <article key={title}>
                <header>
                  <div className={styles.valueIcon}>
                    <span style={{ maskImage: `url(${a("3878", img)})` }} />
                  </div>
                  <h2>{title}</h2>
                </header>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.team}>
        <img
          className={styles.teamBase}
          src={a("3787", "imgSectionBackground")}
          alt=""
        />
        <img
          className={styles.teamLayer}
          src={a("3787", "imgSectionBackground1")}
          alt=""
        />
        <img
          className={styles.teamPhoto}
          src={a("3787", "imgSectionBackground2")}
          alt="Roofseal team"
        />
        <div className={styles.teamCopy}>
          <h2>
            <em>Experienced Roofing Specialists </em>Behind Every Solution
          </h2>
          <p>
            Our team brings practical industry knowledge, technical experience,
            and strong product understanding to support every roofing,
            insulation, and metal frame requirement.
          </p>
        </div>
        <img
          className={styles.bottomCut}
          src={a("3787", "imgSectionBackground3")}
          alt=""
        />
      </section>
      <section className={styles.certificates}>
        <div className={`narrow ${styles.certGrid}`}>
          <div>
            <h2>
              <em>Quality Standards</em>
              <br />
              You Can Rely On
            </h2>
            <p>
              Roofseal is committed to maintaining reliable product quality,
              proper manufacturing practices, and trusted material standards to
              support construction projects across Malaysia.
            </p>
            <div className={styles.logos}>
              {["imgImage264", "imgImage263", "imgImage262"].map((img, i) => (
                <div key={img} className={styles[`logo${i}`]}>
                  <img
                    src={a("3774", img)}
                    alt={
                      [
                        "Quality certification",
                        "BlueScope certification",
                        "Industry certification",
                      ][i]
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.certificateImages}>
            {["imgImage252", "imgImage268"].map((img, i) => (
              <div key={img}>
                <img
                  className={
                    i ? styles.certificateSecond : styles.certificateFirst
                  }
                  src={a("3774", img)}
                  alt="Roofseal quality certificate"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.milestones}>
        <img
          className={styles.topCut}
          src={a("3735", "imgSectionBackground")}
          alt=""
        />
        <div className="narrow">
          <div className={styles.centerHeading}>
            <h2>
              Over 30 Years of Roofing <em>Experience</em>
            </h2>
            <p>
              Since 1990, Roofseal has grown from a metal roofing subcontractor
              into a trusted manufacturer and supplier of complete roofing
              system solutions in Malaysia.
            </p>
          </div>
          <div className={styles.timeline}>
            <div className={styles.timelineLine} />
            <button
              className={`${styles.timelineArrow} ${styles.previous}`}
              onClick={() => setOffset((offset + 2) % 3)}
              aria-label="Previous milestones"
            >
              <Icon name="chevron-left" />
            </button>
            <button
              className={`${styles.timelineArrow} ${styles.next}`}
              onClick={() => setOffset((offset + 1) % 3)}
              aria-label="Next milestones"
            >
              <Icon name="chevron-right" />
            </button>
            <div className={styles.milestoneCards}>
              {[0, 1, 2].map((n) => {
                const [year, copy, img] = milestones[(n + offset) % 3];
                return (
                  <article key={year}>
                    <span className={styles.calendar}>
                      <Icon name="calendar" />
                    </span>
                    <h2>
                      <em>{year}</em>
                    </h2>
                    <img src={a("3735", img)} alt={`Roofseal in ${year}`} />
                    <p>{copy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
        <img
          className={styles.bottomCut}
          src={a("3735", "imgSectionBackground1")}
          alt=""
        />
      </section>
      <section className={styles.esg}>
        <div className={styles.esgHeading}>
          <h2>
            <em>ESG</em> Commitment
          </h2>
          <p>
            Roofseal is committed to integrating sustainable practices into our
            operations and product solutions through Environmental, Social, and
            Governance (ESG) principles.
          </p>
        </div>
        <div
          className={`wide ${styles.esgPanels}`}
          onMouseLeave={() => setEsg(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setEsg(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setEsg(null);
          }}
        >
          {["Environmental", "Social", "Governance"].map((title, i) => (
            <button
              key={title}
              onClick={() => setEsg((active) => (active === i ? null : i))}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible")) setEsg(i);
              }}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setEsg(i);
              }}
              className={`${styles.esgPanel} ${esg === i ? styles.esgActive : ""}`}
              aria-expanded={esg === i}
            >
              <img src={a("3966", `imgSectionBackground${i + 1}`)} alt="" />
              <span className={styles.esgShade} />
              <span className={styles.esgCopy}>
                <h3>{title}</h3>
                {i === 0 && (
                  <ul>
                    {environmental.map((copy) => (
                      <li key={copy}>{copy}</li>
                    ))}
                  </ul>
                )}
              </span>
            </button>
          ))}
          <img
            className={styles.panelTop}
            src={a("3966", "imgSectionBackground4")}
            alt=""
          />
          <img
            className={styles.panelBottom}
            src={a("3966", "imgSectionBackground5")}
            alt=""
          />
        </div>
        <img
          className={styles.bottomCut}
          src={a("3966", "imgSectionBackground")}
          alt=""
        />
      </section>
    </main>
  );
}
